# TensorCraft

### Your words. Your world.

**Turn a sentence into a world you can play.** TensorCraft is a Minecraft-inspired voxel sandbox where AI turns natural-language instructions into editable structures. Describe a tower, watch it take shape, walk inside it, and keep creating.

Built for **Bittensor Builders House**, targeting **Track 3 — Build with Bittensor Subnets**.

[Play TensorCraft](https://tensorcraft-bittensor.vercel.app/play) · [Landing page](https://tensorcraft-bittensor.vercel.app) · [Pitch deck with embedded demo](presentation/TensorCraft-Bittensor-Pitch.pptx)

![TensorCraft Minecraft-inspired visual theme](public/img/minecraft-menu.png)

## The idea

Building a world should start with imagination. TensorCraft lets a player describe a structure and receive an editable first draft instead of placing every block manually.

The result is a playable environment. Explore the doorway, inspect the roof, replace a wall, or ask the AI for another change. The player keeps creative control while AI helps turn intent into construction operations.

Our first target users are repeat voxel creators: players and hobbyists who want to prototype structures and scenes, then refine them through play. The product hypothesis is that bringing generation, world context, and editing into the same environment will make creative iteration easier.

> “Build a stone tower with glowing windows.”
>
> “Add a wooden bridge from the entrance.”
>
> “Change the doorway and keep the rest.”

These are example requests, not guarantees of perfect model output. Build quality and editing accuracy are part of what we need to measure.

## How it works

```text
Player instruction + available world context
                    ↓
              AI inference
                    ↓
       Structured construction operations
                    ↓
       Response checks + engine execution
                    ↓
         Explore → edit → build again
```

The model produces a plan; the voxel engine interprets it. TensorCraft checks response structure and operation fields before execution. These checks help reject malformed plans, but do not prove that every spatial or creative requirement has been met. Automatic validation feedback and regeneration are planned improvements.

## Bittensor: from subnet capabilities to gameplay

TensorCraft's Bittensor direction is to turn subnet services into a creative product that people can use without learning model APIs or managing GPU infrastructure.

### Chutes / Subnet 64 — inference for construction plans

**Chutes is the implemented Bittensor integration.** It provides inference through models served by independent GPU operators on **Bittensor Subnet 64**.

TensorCraft's `chutes.js` adapter sends the player's request and context to the Chutes chat-completions API. It checks the returned action plan and attaches response metadata, including the provider, model, request ID when available, and latency.

The intended flow is:

**Player request → Chutes / SN64 → construction plan → playable voxel world.**

**Current status:** the adapter is implemented and tested with mocked responses. A live request returned HTTP 402 because the account had no credits. Successful funded Chutes generation is still pending. The current public demo uses centralized inference so visitors can try AI construction today.

[Chutes documentation](https://www.chutes.ai/docs/guides/starter-guide)

### 404-GEN / Subnet 17 — a planned asset-generation extension

**404-GEN brings another creative capability to the Bittensor ecosystem: 3D generation.** Our proposed extension is to use it for game assets and environment elements that could become part of interactive scenes or playable mini-games.

Chutes would support construction planning and contextual edits; 404-GEN could supply generated 3D assets. Combining them is a roadmap direction, not a completed multi-subnet integration.

**Current status:** TensorCraft does not yet call 404-GEN or import its generated assets. Before implementation, we need to verify API access, usage limits, output formats, and a suitable mesh-import or voxel-conversion workflow.

[404-GEN's official profile](https://huggingface.co/404-Gen)

### Integration status at a glance

| Component | Role | Status |
| --- | --- | --- |
| Voxel game and AI Builder | Turn prompts into editable, playable structures | Available in the hosted demo |
| Chutes / Bittensor SN64 | Supply inference for construction plans | Adapter implemented; funded live validation pending |
| 404-GEN / Bittensor SN17 | Generate assets and environment elements | Planned; not integrated |
| Validation-and-correction loop | Return failed checks to the model for revision | Planned |
| Subscriptions and build credits | Fund ongoing inference usage | Proposed; billing not implemented |

TensorCraft consumes subnet services. It does not operate a subnet, miner, or validator. In-game currency is mock currency, not TAO, and players do not earn subnet rewards.

## Why people would choose TensorCraft

The focus is the complete creation workflow: a request grounded in the current world, an executable plan, and a result the player can immediately explore and edit.

A general chat response still needs to be connected to a game. Manual construction gives precise control but requires building each detail. TensorCraft brings AI-assisted construction and direct editing together.

We plan to test that advantage through **time to an accepted build, follow-up edit accuracy, and repeat creator use**. We have not yet established a competitive performance advantage or validated demand.

## A business model connected to Bittensor

The proposed model keeps manual play free and charges for AI-assisted creation:

| Proposed offer | Hypothesis to test |
| --- | --- |
| Free | Manual gameplay and a tightly capped AI trial |
| Creator | $9/month for 100 bounded build credits |
| Top-ups | $5 for 50 additional credits |
| Later expansion | Metered creation tools for community world hosts |

**Creators pay TensorCraft → TensorCraft purchases Chutes inference → paid application usage creates subnet demand.**

TensorCraft would retain revenue after inference and other service costs. Build credits would be internal usage units, not tokens or investments. Pricing and allowances need real cost measurements before launch, including failed requests, retries, hosting, and payment fees.

Accounts, billing, durable credit accounting, and usage controls are future work. Our proposed pilot targets 20 invited creators and five paid conversions; those are targets, not existing traction.

## Builders House fit

**Primary: Track 3 — Build with Bittensor Subnets ($200 USDC).** TensorCraft focuses on an interactive product using subnet capabilities, with a clear experience beyond a basic model response.

- **Product experience:** describe, build, explore, and edit in the browser.
- **Creativity:** turn generated plans into structures people can play with.
- **Execution:** hosted prototype, structured operations, provider checks, and inference metadata.
- **Subnet use:** an implemented Chutes adapter, with funded end-to-end validation as the key remaining milestone.
- **Continued development:** measure build quality and costs, validate paid creator demand, and explore 404-GEN assets.

We are also presenting for **Best Overall Project ($250 USDC)** and **Community Choice ($150 USDC)**, subject to organizer rules.

## Try it

The [hosted game](https://tensorcraft-bittensor.vercel.app/play) currently allows AI builds **without a password**. Press **G** and describe your idea.

| Control | Action |
| --- | --- |
| WASD | Move |
| Space | Jump |
| Mouse | Mine and place blocks |
| G | Open the AI Builder |
| Esc | Open the menu |
| `/gamemode creative` | Enable creative mode; use F to fly |

The hosted edition is single-player and saves its world in the browser. Multiplayer, MCP agents, the nation simulation, and persistent shared worlds require the full Node server.

The [three-minute narrated video](https://tensorcraft-bittensor.vercel.app/demo/TensorCraft-3-Minute-Demo.mp4) replays actual centrally generated AI plans in the voxel engine using a controlled camera. It is not a live Chutes inference recording or a latency benchmark. The same video is embedded on slide 3 of the pitch deck. Install the [included pixel fonts](presentation/fonts) to preserve the deck's Minecraft typography.

## Run locally

```sh
npm ci
cp .env.example .env
# Configure the selected provider's key and GAME_PASSWORD in .env.
npm start
```

Open `http://localhost:8787`. Set `PROVIDER=chutes` and `CHUTES_API_KEY` for Chutes. Alternative providers are available through `PROVIDER=anthropic` or `PROVIDER=gemini` with their corresponding credentials. Use `MOCK=1` for offline development.

```sh
npm test
docker build -t tensorcraft .
docker run --env-file .env -p 8787:8787 -v tensorcraft-data:/app/data tensorcraft
```

The full server persists usage and enforces budget and concurrency limits. Chutes cost accounting uses estimates, not billing receipts. Set `CREATOR_REVIEW=0` for text-only models and retain the data volume for world and budget persistence.

### Deploy on Vercel

`vercel.json` deploys `public/` and `api/`.

- Set `HOSTED_LIVE_AI=1` to enable live generation; otherwise the route serves deterministic demo blueprints.
- For Chutes, set `PROVIDER=chutes` and `CHUTES_API_KEY`.
- For the current alternative provider, set `PROVIDER=anthropic`, `ANTHROPIC_API_KEY`, and `CLAUDE_MODEL`.
- The hosted demo is currently public. Set `HOSTED_REQUIRE_PASSWORD=1` and `GAME_PASSWORD` to restore password protection.
- The serverless route has no durable spending ledger. Use provider-side quotas, or the full Node server for persistent budget enforcement.

Keep credentials in ignored `.env` files or hosting secrets. Never place them in client code, commits, or presentation files.

## Next milestones

1. Fund Chutes and verify actual subnet inference through in-game execution.
2. Measure acceptance rate, edit accuracy, latency, and cost per useful build.
3. Improve validation and add bounded correction attempts.
4. Implement accounts, billing, quotas, and the paid creator pilot.
5. Evaluate 404-GEN access and an asset-import or voxel-conversion path.

## Submission and provenance

TensorCraft adapts the existing **PromptCraft** project. The voxel engine, multiplayer, construction action language, agent foundations, and governance simulation predate this adaptation.

This adaptation adds the Chutes integration, response provenance, demo/deployment work, integration tests, TensorCraft branding, and presentation materials. We do not claim the entire engine was built during the five-day program.

Minecraft-inspired; not affiliated with Mojang or Microsoft. Independent Bittensor ecosystem prototype; no official endorsement is implied.

---

**Describe an idea. Watch it become a world. Step inside.**
