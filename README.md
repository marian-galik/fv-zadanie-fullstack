# ImageNet Explorer

[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black?style=flat-square)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.5.0-2D3748?style=flat-square)](https://www.prisma.io/)

A fullstack application for exploring ImageNet data built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## 📋 Requirements

- Node.js 18+
- Docker and Docker Compose
- npm

## 🚀 Getting Started

### Environment Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd fv-zadanie-fullstack
```

2. Create environment variables:

```bash
cp .env.example .env
```

> **Note:** Update the values in `.env` if needed. The example contains sane defaults for local development.

### Database Setup

1. Start the PostgreSQL database using Docker:

```bash
docker-compose up -d
```

> This will start a PostgreSQL 16 instance with the configuration specified in your `.env` file.

### Application Setup

1. Install dependencies:

```bash
npm install
```

2. Set up the database schema:

```bash
npm run db:push
```

3. Seed the database with ImageNet data:

```bash
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🧰 Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run db:push` - Push schema changes to the database
- `npm run db:seed` - Seed the database with ImageNet data

## 📚 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Containerization**: Docker

## 📝 License

[MIT](LICENSE)
