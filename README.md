This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Database Setup

### Supabase Integration

This project now uses Supabase for database storage. To set up:

1. Run the environment setup script:
   ```
   ./scripts/setup-env.sh
   ```

2. The schema for Supabase can be found in the `supabase/migrations` directory.

3. The application uses a fallback mechanism:
   - First attempts to use Supabase for data storage
   - Falls back to in-memory storage if Supabase operations fail
   
This ensures the application can run even if there's an issue with the database connection.

### Supabase Tables

The demo schema includes the following tables:
- **DemoUser**: Stores user information including wallet addresses
- **DemoChannel**: Represents chat channels (can be token-gated)
- **DemoMembership**: Maps users to channels with roles
- **DemoMessage**: Stores messages sent in channels
