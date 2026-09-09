import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { io as connect } from 'socket.io-client';
import { server, io } from '../src/index';
import { CodeExecutor } from '../src/services/codeExecutor';
server.listen(0, '127.0.0.1');
const ready = once(server, 'listening');
const base = async () => { await ready; return `http://127.0.0.1:${(server.address() as any).port}`; };
after(() => io.close());
test('health, sessions and problem API', async () => {
  const url = await base();
  assert.equal((await fetch(url + '/health')).status, 200);
  assert.equal((await fetch(url + '/api/sessions/missing')).status, 404);
  const result = await (await fetch(url + '/api/problems')).json() as any;
  assert.ok(result.problems.length > 0);
});
test('room membership prevents code changes from an unjoined socket', async () => {
  const url = await base();
  const { sessionId } = await (await fetch(url + '/api/sessions/create', { method: 'POST' })).json() as any;
  const owner = connect(url, { transports: ['websocket'] });
  const outsider = connect(url, { transports: ['websocket'] });
  try {
    await Promise.all([once(owner, 'connect'), once(outsider, 'connect')]);
    const joined = once(owner, 'session-joined');
    owner.emit('join-session', { sessionId, username: 'Owner' }); await joined;
    outsider.emit('code-change', { sessionId, code: 'unauthorised' });
    // A same-connection join acknowledgement establishes ordering after the attempted mutation.
    const secondJoined = once(outsider, 'session-joined');
    outsider.emit('join-session', { sessionId, username: 'Guest' });
    const [state] = await secondJoined;
    assert.notEqual(state.code, 'unauthorised');
    const chat = once(owner, 'chat-message');
    outsider.emit('chat-message', { sessionId, username: 'Owner', message: 'Hello' });
    assert.equal((await chat)[0].username, 'Guest');
    const update = once(owner, 'code-update');
    outsider.emit('code-change', { sessionId, code: 'console.log(42)' });
    assert.equal((await update)[0].code, 'console.log(42)');
  } finally { owner.disconnect(); outsider.disconnect(); }
});
test('runner validates input and fails closed when disabled', async () => {
  assert.equal((await CodeExecutor.execute('', 'javascript')).success, false);
  assert.equal((await CodeExecutor.execute('1', 'unknown')).success, false);
  const before = process.env.ENABLE_CODE_EXECUTION;
  process.env.ENABLE_CODE_EXECUTION = 'false';
  assert.match((await CodeExecutor.execute('console.log(1)', 'javascript')).error!, /not configured/);
  if (before === undefined) delete process.env.ENABLE_CODE_EXECUTION; else process.env.ENABLE_CODE_EXECUTION = before;
});
test('isolated runner executes TypeScript and terminates infinite loops', { skip: process.env.ENABLE_CODE_EXECUTION !== 'true' }, async () => {
  const good = await CodeExecutor.execute('const n: number = 42; console.log(n)', 'typescript');
  assert.equal(good.success, true); assert.match(good.output!, /42/);
  const looping = await CodeExecutor.execute('while (true) {}', 'javascript');
  assert.equal(looping.success, false); assert.match(looping.error!, /5 seconds/);
});
