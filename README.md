# MarketHub Backend

Node.js + Express + TypeScript + MongoDB backend for the MarketHub marketplace application.

## Environment Variables

Create a `.env` file with:

```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/markethub?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Scripts

- `npm run dev` — Start development server with hot reload
- `npm run build` — Compile TypeScript to `dist/`
- `npm start` — Run compiled production build
- `npm run seed` — Seed the database with demo users and items

## Demo Credentials

- **User:** user@markethub.com / User123!
- **Admin:** admin@markethub.com / Admin123!

## API Routes

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Items
- `GET /api/items` — List items (query: search, category, minPrice, maxPrice, sort, page, limit)
- `GET /api/items/:id` — Get single item
- `POST /api/items` (protected) — Create item
- `DELETE /api/items/:id` (protected) — Delete item
