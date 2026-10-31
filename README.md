# TensorCraft

A voxel playground for AI builders. Bittensor Builders House 2026 submission, Alibaug.

Describe a tower, walk inside it, and build a world with AI agents. TensorCraft adapts the existing PromptCraft voxel sandbox with a Chutes Subnet 64 inference adapter, explicit provider provenance, and a standalone hosted demo.

## Play

WASD moves, Space jumps, mouse mines/places, G requests a build, Esc opens the menu. Try tower, bridge, cabin, or garden. `/gamemode creative` enables flying (F).

The Vercel deployment runs a single-player browser world with deterministic demo blueprints. Demo responses are labeled and consume no credits. Multiplayer, MCP agents, the nation simulation, and persistent shared worlds require the Node/Docker server.

## Bittensor integration

- `chutes.js` calls the Chutes chat-completions API with a server-held key.
- Chutes serves inference on Bittensor Subnet 64: https://www.chutes.ai/docs/guides/starter-guide
- Live responses include provider, subnet, model, request ID when supplied, latency, and an actual-response marker.
- Zero credits produce an explicit error. A demo is never relabeled as live inference.
- This application consumes a subnet service. It is not a registered subnet, miner, validator, or TAO rewards system. The in-game economy is mock currency, not TAO.
- A live authentication/inference probe returned HTTP 402 (zero balance). Successful live generation remains unverified until the account is funded.

## Run the full server

```sh
npm ci
cp .env.example .env
# Set CHUTES_API_KEY and GAME_PASSWORD
npm start
```

Open http://localhost:8787. Use MOCK=1 for offline development. Optional centralized providers remain available through PROVIDER=anthropic or PROVIDER=gemini and matching credentials/model. The interface labels the active provider.

```sh
npm test
docker build -t tensorcraft .
docker run --env-file .env -p 8787:8787 -v tensorcraft-data:/app/data tensorcraft
```

The full server persists usage and enforces a spending budget and concurrency limits. Chutes costs use conservative estimates, not billing receipts. Set CREATOR_REVIEW=0 for text-only Chutes models. Retain the data volume for world and budget persistence.

## Vercel

vercel.json deploys public/ and api/. The public demo requires no credentials. For protected live generation, configure CHUTES_API_KEY, GAME_PASSWORD, and HOSTED_LIVE_AI=1 in hosting secrets, then redeploy. The serverless route has no durable spending ledger: use provider-side quotas. Never publish the password. Use the Node server for persistent multiplayer and budget enforcement.

## Submission and provenance

Handbook: https://moonshotcommons.notion.site/bittensor-builders-house-handbook

The voxel engine, multiplayer, action language, and governance simulation predate this adaptation. See ATTRIBUTION.md. This submission adds the Chutes adapter, provenance, demo mode, deployment isolation, tests, branding, and presentation. It does not claim the entire engine was built during the event.

Keep credentials in ignored .env files or hosting secrets, never in slides, commits, or client JavaScript.
