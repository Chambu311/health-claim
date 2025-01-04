# Health Claim Project

A Next.js application for health claim research and analysis using Supabase and Perplexity AI.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (Node Package Manager)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL="your_supabase_url"
SUPABASE_ANON_KEY="your_supabase_anon_key"
PERPLEXITY_API_KEY="your_perplexity_api_key"
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd health-claim
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
health-claim/
├── app/
│   ├── dashboard/
│   │   ├── new/           # Create new claims
│   │   ├── research/      # Research specific claims
│   │   └── layout.tsx     # Dashboard layout
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── journal-tabs.tsx   # Journal navigation component
├── lib/
│   ├── modules/
│   │   ├── research.ts    # Research functionality
│   │   ├── perplexity.ts  # Perplexity AI integration
│   │   └── claims.ts      # Claims management
│   ├── actions.ts         # Server actions
│   └── types.ts          # TypeScript types
└── public/               # Static assets
```

## Features

- Dashboard for managing health claims
- Research functionality using Perplexity AI
- Supabase integration for data storage
- Real-time updates using Server Components

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Perplexity AI](https://www.perplexity.ai/)
- [TailwindCSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)

## Development

- Use `npm run dev` for development with hot-reload (using Turbopack)
- Use `npm run build` to create a production build
- Use `npm run start` to start the production server

## Important Notes

- Make sure to never commit your `.env` file
- The project uses Server Components by default
- Turbopack is enabled for faster development experience
- The application requires valid Supabase and Perplexity AI credentials to function properly

## Support

For support, please open an issue in the repository or contact the maintainers.

## License

This project is licensed under the MIT License - see the LICENSE file for details
