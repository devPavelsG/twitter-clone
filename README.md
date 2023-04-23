<h1 align="center">Twitter Clone</h1>

<p align="center">Welcome to my Twitter clone app! This app was built using Next.js, Typescript, Prisma, Clerk for authentication (which also syncs with the database), tRPC, Socket.io for global chat, Upstash for rate limiting, TailwindCSS, and other powerful technologies.</p>

<h3 align="center">You can find a live demo of the app <a href="https://twitter.pavelsgarklavs.dev/">here</a>.</h3>
<p align="center">Please note that due to the hosting platform (Vercel) limitations, the app's WebSocket functionality won't work in the live production environment. </p>

<p align="center">
  <img src="https://img.shields.io/github/license/devPavelsG/twitter-clone?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/github/issues/devPavelsG/twitter-clone?style=for-the-badge" alt="Issues"/>
  <img src="https://img.shields.io/github/stars/devPavelsG/twitter-clone?style=for-the-badge" alt="Stars"/>
  <img src="https://img.shields.io/github/forks/devPavelsG/twitter-clone?style=for-the-badge" alt="Forks"/>
</p>

## Features

- Authentication with Clerk (supports login with Github or Google)
- Posting tweets
- Liking tweets
- Following users
- Rate limiting
- Global chat with Socket.io

## Technologies Used

- Typescript
- React
- Next.js
- tRPC
- Prisma
- Socket.io
- Clerk
- Upstash
- TailwindCSS

and more...

## Getting Started

```bash
# Clone the repository
git clone https://github.com/devPavelsG/twitter-clone.git
cd twitter-clone

# Add environment variables
## Copy .env.example file and name it .env in the root directory
### Fill the following variables:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Install dependencies and run the app
npm install
npx prisma db push 

# Start the app
npm run dev
```

## License

This project is licensed under the [MIT License](LICENSE).