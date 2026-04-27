# BaseScore

BaseScore is an open-source, unofficial Base activity score and airdrop rank simulator.

Paste a Base wallet address or ENS name, get a clean 100-point activity score, review the wallet footprint, compare another wallet, and share the result on X.

> 100% unofficial and speculative. Base has no confirmed token, points program, or airdrop. DYOR. Not financial advice. Not affiliated with Base, Coinbase, or any listed protocol.

## Screenshot

Add your production screenshot here after deployment.

```txt
public/screenshot.png
```

## One-click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/a12321xyz/BaseScore)

## Features

- Next.js 15 App Router with TypeScript.
- Dark high-end crypto dashboard UI.
- Address or ENS input.
- `/analyze?address=0x...` shareable result route.
- 100-point weighted Base activity score based on 18 heuristical signals.
- Tier badge: Mythic, Gold, Silver, Uncommon, Eligible, No Signal.
- Criteria cards with earned or missed points.
- 52-week GitHub-style activity heatmap.
- Protocol fingerprint for known Base apps.
- Sybil risk meter with transparent signals.
- FDV and airdrop allocation simulator.
- Compare mode for a second wallet.
- Save up to 5 named wallets in browser localStorage.
- Static high-activity leaderboard preview.
- Share on X button.
- Dynamic OG image route.
- PWA manifest.
- No database, no auth, no wallet connection.

## Why This Checker Wins

- It explains the score instead of hiding the model.
- It never asks users to connect or sign.
- It is fast because analysis is capped and cached.
- It is transparent about unofficial, speculative scoring.
- It is designed for mobile sharing and clean social previews.
- It can later scale with a KV cache without rewriting the app.

## Data Sources

The default deployment uses only free public sources:

- Blockscout Base API for wallet activity: `https://base.blockscout.com/api`
- Base public RPC only as a balance fallback: `https://mainnet.base.org`
- Ethereum public RPC only for ENS resolution: `https://eth.llamarpc.com`

Free public APIs can rate-limit under traffic spikes. BaseScore reduces risk by using request caps, in-memory caching, CDN cache headers, partial scoring, and clear fallback messages.

## Scoring Model

BaseScore evaluates 18 signals out of 100 points:

1. Holds ETH on Base (5 pts).
2. Meaningful Base ETH balance (10 pts).
3. At least 10 Base transactions (5 pts).
4. At least 50 Base transactions (10 pts).
5. Active on at least 7 unique days (5 pts).
6. Active across at least 4 unique weeks (5 pts).
7. Active across at least 3 unique months (5 pts).
8. First Base transaction older than 90 days (5 pts).
9. Bridge-like activity detected (5 pts).
10. Meaningful native value moved (5 pts).
11. Meaningful gas spent (5 pts).
12. Interacted with at least 10 unique contracts (5 pts).
13. Touched at least 3 known Base protocols (5 pts).
14. DEX interaction detected (5 pts).
15. Lending or DeFi interaction detected (5 pts).
16. Token or stablecoin activity detected (5 pts).
17. NFT or creator activity detected (5 pts).
18. Low sybil-risk activity pattern (5 pts).

Tier mapping:

```txt
85-100 Mythic
65-84 Gold
40-64 Silver
20-39 Uncommon
5-19 Eligible
0-4 No Signal
```

## Local Development

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

All variables are optional for local development.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
BASE_RPC_URL=https://mainnet.base.org
ETH_RPC_URL=https://eth.llamarpc.com
BLOCKSCOUT_API_KEY=
```

For production, set:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Deploy To Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Set `NEXT_PUBLIC_APP_URL` to your production URL.
4. Deploy.

Build command:

```bash
npm run build
```

Output directory:

```txt
.next
```

## Optional Future Scaling

For 1,000 users, the default no-database version is enough if traffic is moderate.

If the app goes viral, add a free or low-cost KV cache such as Upstash Redis for:

- Global wallet result cache.
- Real leaderboard storage.
- IP rate limiting.
- Longer cache TTLs.

The code is structured so this can be added in `lib/cache.ts` without rebuilding the UI.

## X Share Template

```txt
My BaseScore is GOLD: 78/100 pts on the unofficial Base airdrop checker. Check yours: https://your-domain.com/analyze?address=0x...
```

## Security And Privacy

- No wallet connection.
- No signatures.
- No auth.
- No database.
- Saved wallets stay in browser localStorage.
- Analysis uses public blockchain data only.

## Contributing

PRs are welcome for:

- More known Base protocol addresses.
- Better scoring thresholds.
- Better heatmap visuals.
- Optional KV cache adapter.
- More accurate leaderboard implementation.

## License

MIT

Star this repo if you farmed Base before it was cool.
