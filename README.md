# CodePair

A portfolio project by Ibrahim, a final-year Computer Science student seeking internship opportunities. This project explores real-time collaboration, TypeScript APIs and shared application state.

A TypeScript coding-practice application with shared Monaco editing, Socket.IO room updates, chat, a problem bank and hints. It demonstrates a React 19 client communicating with an Express API and an in-memory session store.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm --prefix server ci
npm --prefix client ci
cp server/.env.example server/.env
cp client/.env.example client/.env
npm --prefix server run dev
```

In a second terminal run `npm --prefix client run dev`, then open http://localhost:5173. The server defaults to port 5000. `VITE_API_URL` configures the client's HTTP and Socket.IO target; `CLIENT_ORIGIN` configures server CORS. For deployment, set both to the appropriate frontend/backend origins before building.

## Features and boundaries

- Create a room and share its ID; join with a display name.
- Synchronise code, language choice and selected problem between room participants.
- Exchange chat messages; membership is checked before room mutations and names come from the joined socket.
- Browse problems with examples and starter code; request predefined hints.
- Use a local interview timer. It is not synchronised between participants.
- Edit JavaScript, TypeScript, Python, Java and C++. Execution supports the first three only when the optional runner is configured.

Rooms live in one server process and disappear on restart. Room IDs act as sharing capabilities, not authenticated accounts. This implementation does not offer durable storage, operational transformation/CRDT conflict resolution, horizontal scaling or production abuse controls. Chat history is capped at 100 messages and new rooms are bounded.

## Optional isolated execution

Execution is disabled by default. The API never evaluates submitted code in its own process. On a dedicated execution host with Docker, prepare the images:

```sh
docker pull node:22-alpine
docker pull python:3.12-alpine
```

Set `ENABLE_CODE_EXECUTION=true` in `server/.env`, then restart. Each run uses a non-root, read-only container with no network, dropped capabilities, memory/CPU/process limits, a five-second wall-clock timeout and bounded output. At most two runs execute concurrently. TypeScript is transpiled before execution. There are no host-directory mounts; images must be pulled ahead of time.

Docker daemon access is powerful. Do not mount a host Docker socket into a public API deployment; use an isolated runner host and add authentication/rate limiting before public operation. These controls are not a claim that containers provide absolute isolation against hostile code.

## API and code layout

| Route | Purpose |
| --- | --- |
| `GET /health` | API health |
| `POST /api/sessions/create` | Create an in-memory room |
| `GET /api/sessions/:id` | Read a room |
| `GET /api/problems` | List problems |
| `GET /api/problems/:id` | Read a problem |
| `POST /api/execute` | Submit `{code, language}` to the optional runner |

`server/src/index.ts` handles HTTP and sockets; `server/src/services/codeExecutor.ts` controls containers; `server/src/data/problems.ts` holds exercises; `client/src/pages/` contains the home and session screens.

## Verification

```sh
npm --prefix server run build
npm --prefix server test
npm --prefix client run lint
npm --prefix client run build
```

Socket regression tests check joining, collaborative editing and rejection of an unjoined writer. Runner tests are skipped unless `ENABLE_CODE_EXECUTION=true`; CI prepares Docker and tests typed TypeScript output plus infinite-loop termination. Live deployment uptime is a separate check.
