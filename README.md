# BrokeA Gamer / GameDealHunt

A React + Express app for browsing live game deals, free games, game details, wishlist alerts, and compatibility checks.

## Local Development

Open two terminals:

```bash
npm run dev:server
npm run dev:client
```

Then open:

```text
http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so the frontend no longer needs a hardcoded localhost API URL.

## Required Server Environment Variables

Create `server/.env` locally or set these in your hosting provider:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=replace-with-a-long-random-secret
PORT=5000
```

Optional:

```text
CLIENT_ORIGIN=https://your-frontend-domain.com
```

If Express serves the built frontend and API from the same domain, `CLIENT_ORIGIN` can be left blank.

## Production Build

From the project root:

```bash
npm run build
npm start
```

The root build script installs server dependencies, installs client dependencies, and builds the React app into `client/dist`.

The Express server then serves:

- API routes at `/api/...`
- React app routes from `client/dist`
- health check at `/api/health`

## Deploy As One Service

For platforms like Render, Railway, or Fly.io, deploy the repository root.

Use:

```text
Build Command: npm run build
Start Command: npm start
```

Set environment variables:

```text
NODE_ENV=production
DATABASE_URL=your-postgres-connection-string
JWT_SECRET=your-long-random-secret
```

Make sure the host allows outbound requests to:

```text
https://www.cheapshark.com
```

## Deploy Frontend And Backend Separately

If you deploy the frontend separately, set this in the frontend environment:

```text
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

Also set this on the backend:

```text
CLIENT_ORIGIN=https://your-frontend-domain.com
```

## Important Notes

CheapShark returns deal listings, not a perfect list of unique games. The same game can appear multiple times if different stores have deals for it.

The app has fallback deal data for development, but production should use live CheapShark access.
