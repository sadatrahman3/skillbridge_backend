# SkillBridge Backend

Express.js + TypeScript + MongoDB backend API for the SkillBridge service marketplace.

## Live Demo

Deploy this backend to Render, Railway, or any Node.js hosting provider. Set the environment variables below and run `npm start`.

**Backend Repo:** https://github.com/sadatrahman3/skillbridge_backend

**Frontend Repo:** https://github.com/sadatrahman3/skillbridge_frontend

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication

## Requirements

- Node.js 18.x or 20.x LTS
- MongoDB Atlas cluster or local MongoDB instance

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Scripts

```bash
npm install
npm run dev    # Start development server with hot reload
npm run build  # Compile TypeScript to dist/
npm start      # Run compiled production build
npm run seed   # Seed database with demo users and listings
```

## Demo Credentials

After running `npm run seed`, use these accounts to log in:

- **User:** `user@skillbridge.com` / `User123!`
- **Admin:** `admin@skillbridge.com` / `Admin123!`

## API Routes

### Authentication
- `POST /api/auth/register` — Create a new account
- `POST /api/auth/login` — Sign in and receive JWT
- `GET /api/auth/me` — Get current authenticated user

### Items
- `GET /api/items` — List services (query: `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`)
- `GET /api/items/:id` — Get single service details
- `POST /api/items` — Create a new service (requires JWT)
- `DELETE /api/items/:id` — Delete a service (requires JWT, owner or admin)

## CORS

This backend allows cross-origin requests from any origin for development. For production, configure CORS in `src/app.ts` to restrict origins.

## License

MIT
