# e2e-paddle

A checkout that takes real Paddle payments in a sandbox, used as an example of end-to-end testing a payment page you don't own with [e2e](https://www.npmjs.com/package/e2e).

## How it works

The checkout uses Paddle's overlay checkout, the flow Paddle recommends: Paddle's checkout opens in an iframe over our page, and the shopper pays there.

### Test cards

| Card number           | Result             |
| --------------------- | ------------------ |
| `4242 4242 4242 4242` | Paid               |
| `4000 0000 0000 0002` | Declined           |
| `4000 0038 0000 0446` | Asks for 3D Secure |

Use any name, any future expiry date, and CVC `100`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Paddle keys

Everything runs in a free Paddle sandbox. Sign up at [sandbox-vendors.paddle.com](https://sandbox-vendors.paddle.com/signup), then copy `.env.example` to `.env.local` and set:

- `PADDLE_API_KEY`: an API key (`pdl_sdbx_apikey_…`) from **Developer tools → Authentication → API keys**.
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`: a client-side token (`test_…`) from the same page.

Paddle only creates transactions once a default payment link is set: add one under **Checkout → Checkout settings**.

## End-to-end tests

The agent model goes through the Vercel AI Gateway, so set `AI_GATEWAY_API_KEY` (or link a Vercel project). Then, with the dev server running:

```bash
npm run test:e2e
```

To test a different URL, set `APP_URL`. Configuration lives in `e2e.config.ts`.

## Scripts

| Command            | Description          |
| ------------------ | -------------------- |
| `npm run dev`      | Start the dev server |
| `npm run build`    | Build for production |
| `npm run lint`     | Run ESLint           |
| `npm run format`   | Format with Prettier |
| `npm run test:e2e` | Run the e2e tests    |
