# Environment Variables

All variables are public (`NEXT_PUBLIC_*`) and therefore exposed to the browser. They are read once at build time by Next.js and exported through `src/shared/constants.ts`.

## Required variables

These have **no default**: if they are missing the app throws an error at boot.

| Variable                      | Description                                                                                          | Platform |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | -------- |
| `NEXT_PUBLIC_DYNAMIC_CLIENT_ID` | Your **Dynamic** Environment ID. Used by the Dynamic SDK for wallet creation and auth (`createDynamicClient`). | [app.dynamic.xyz](https://app.dynamic.xyz) · [docs.dynamic.xyz](https://docs.dynamic.xyz) |
| `NEXT_PUBLIC_FRONTEND_URL`    | Public URL of this frontend. Used for the Dynamic `universalLink` and the Phantom redirect deep link. On the browser it is `window.location.origin`-equivalent at build time. | — |

## Optional variables (with sensible defaults)

| Variable                    | Default                        | Description                                                                                  |
| --------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_RPC_URL`       | `http://localhost:8899`        | Solana HTTP RPC used by `@solana/kit` and injected as the RPC override for Dynamic networks. |
| `NEXT_PUBLIC_WS_URL`        | derived from `RPC_URL` (`http` → `ws`) | Solana WebSocket RPC used by the Solana client for subscriptions.                       |
| `NEXT_PUBLIC_SOLANA_GENESIS_HASH` | *(none)*                 | Genesis hash used by the `custom` (localhost) network entry to build the Dynamic `NetworkData`. |
| `NEXT_PUBLIC_COMMITMENT`    | `confirmed`                   | Solana commitment level: `processed`, `confirmed` or `finalized`.                             |
| `NEXT_PUBLIC_DEFAULT_NETWORK` | `devnet`                     | Default cluster on first load. One of: `mainnet`, `devnet`, `testnet`, `localnet`. Validated at boot. |
| `NEXT_PUBLIC_API_URL`       | `http://localhost:3000/api/v1.0` | Base URL of the Stayke backend REST API. In production it is passed to Dynamic as `apiBaseUrl` for server-side calls. |
| `NEXT_PUBLIC_JWT_DURATION`  | `86400`                       | JWT lifetime in seconds accepted by the backend session.                                      |

## Solana RPC providers

`NEXT_PUBLIC_RPC_URL` / `NEXT_PUBLIC_WS_URL` accept any Solana RPC endpoint. Recommended free providers:

- **Alchemy** — <https://www.alchemy.com> · chain connect: <https://www.alchemy.com/chain-connect/chain/solana>
- **Helius** — <https://www.helius.dev> (also Solana-focused developer tools)
- **QuickNode** — <https://www.quicknode.com>
- **Official Solana public RPCs** (rate-limited): <https://api.mainnet-beta.solana.com>, <https://api.devnet.solana.com>

> Across most providers the HTTP and WebSocket endpoints share the same base URL — set `NEXT_PUBLIC_WS_URL` to the same URL with the `wss://` scheme (e.g. `wss://solana-devnet.g.alchemy.com/v2/YOUR_KEY`).

## Setup

Copy `.env.example` to `.env.local` and fill the values:

```bash
cp .env.example .env.local
```

Example (Alchemy + mainnet):

```env
NEXT_PUBLIC_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_WS_URL=wss://solana-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_DEFAULT_NETWORK=mainnet
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_DYNAMIC_CLIENT_ID=your_dynamic_environment_id
```

## Where they're used

- **`src/shared/constants.ts`** — reads every variable, exports them with fallbacks, and validates that `NEXT_PUBLIC_DEFAULT_NETWORK` is a valid cluster name and that the required variables are present.
- **`src/context/EmbeddedProvider.tsx`** — creates the Dynamic client with `NEXT_PUBLIC_DYNAMIC_CLIENT_ID`, `NEXT_PUBLIC_FRONTEND_URL`, `NEXT_PUBLIC_API_URL` (production), `NEXT_PUBLIC_RPC_URL` and `NEXT_PUBLIC_SOLANA_GENESIS_HASH` (custom network).
- **`src/context/NetworkContext.tsx`** — builds the Solana client from `RPC_URL` + `WS_URL`.
- **`src/constants/constants.ts`** — exports `PROJECT_ID` from `NEXT_PUBLIC_PROJECT_ID` (reserved, not currently consumed).