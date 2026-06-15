# Environment Variables

This project uses the following environment variables. All are optional and have sensible defaults.

## Public Variables (exposed to the browser)

| Variable                      | Default                      | Description                                      |
| ----------------------------- | ---------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_RPC_URL`         | `http://localhost:8899`      | Solana RPC endpoint used by the custom network.  |
| `NEXT_PUBLIC_WS_URL`          | `ws://localhost:8900`        | Solana WebSocket endpoint used by the custom network. |
| `NEXT_PUBLIC_DEFAULT_NETWORK` | `devnet`                     | Default cluster on first load. One of: `mainnet`, `devnet`, `testnet`, `localnet`, `custom`. |

## Usage

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_WS_URL=wss://api.mainnet-beta.solana.com
NEXT_PUBLIC_DEFAULT_NETWORK=mainnet
```

## Where they're used

- **`src/shared/constants.ts`** — reads all three variables and exports them with fallbacks. Also validates that `NEXT_PUBLIC_DEFAULT_NETWORK` is a valid cluster name.
- **`src/context/NetworkContext.tsx`** — `RPC_URL` and `WS_URL` are referenced for the `custom` network entry.
