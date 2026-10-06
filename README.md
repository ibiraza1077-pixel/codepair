# CodePair

A portfolio project by Ibrahim, a final-year Computer Science student seeking graduate software engineering roles. This project explores real-time collaboration, TypeScript APIs and shared application state.

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
- Edit JavaScript, TypeScript, Python, Java and C++. JavaScript and TypeScript run locally in an isolated browser worker. Python execution needs the optional server runner.

Rooms live in one server process and disappear on restart. Room IDs act as sharing capabilities, not authenticated accounts. This implementation does not offer durable storage, operational transformation/CRDT conflict resolution, horizontal scaling or production abuse controls. Chat history is capped at 100 messages and new rooms are bounded.

## Optional isolated execution

The API's execution endpoint is disabled by default; it never evaluates submitted code in its own process. JavaScript and TypeScript use a separate browser sandbox on the free demo. On a dedicated execution host with Docker, prepare the images for optional Python execution:

```sh
docker pull node:22-alpine
docker pull python:3.12-alpine
```

Set `ENABLE_CODE_EXECUTION=true` in `server/.env` and `VITE_EXECUTION_ENABLED=true` in `client/.env`, then restart the server and client. The server runner uses a non-root, read-only container with no network, dropped capabilities, memory/CPU/process limits, a five-second wall-clock timeout and bounded output. At most two server runs execute concurrently. There are no host-directory mounts; images must be pulled ahead of time.

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

## Free demo hosting

The root `render.yaml` provisions the API as one **Free** Render web service. Keep the frontend on Vercel. After deploying the Blueprint, set the Vercel frontend's `VITE_API_URL` to the actual Render URL and redeploy it. `CLIENT_ORIGIN` must match the frontend's origin exactly.

The free demo supports rooms, collaborative editing, chat and JavaScript/TypeScript execution in the visitor's browser. Submitted code runs inside a worker created by an opaque-origin sandboxed frame. Its content security policy blocks network requests and external scripts; a five-second timeout removes the frame. It cannot import packages or access server files. Leave `VITE_EXECUTION_ENABLED=false` in Vercel because Python still needs the optional isolated Docker runner. Rooms are lost whenever the service restarts or sleeps. Render sleeps free services after 15 minutes without inbound traffic; the next visitor may wait about a minute. Free services share 750 instance hours per workspace per month. Keep billing at £0 by using Free, leaving payment details unset and accepting suspension if usage limits are reached. See [Render's free service limits](https://render.com/docs/free).

## Verification commands

```sh
npm --prefix server run build
npm --prefix server test
npm --prefix client run lint
npm --prefix client run build
```

Socket regression tests check joining, collaborative editing and rejection of an unjoined writer. Runner tests are skipped unless `ENABLE_CODE_EXECUTION=true`; CI prepares Docker and tests typed TypeScript output plus infinite-loop termination. Live deployment uptime is a separate check.
