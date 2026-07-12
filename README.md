# AssetFlow

AssetFlow is an enterprise asset and resource management system designed for internal operations, maintenance planning, and resource visibility.

## Stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Local file storage

## Project Goals
- Provide a professional enterprise dashboard shell
- Support asset and resource management workflows
- Prepare a foundation for authentication, storage, and database integration

## Structure
- src/app: route groups and pages
- src/components: reusable UI and layout components
- src/lib: shared utilities
- prisma: database schema and migrations
- docs: architecture notes

## Getting Started
1. Install PostgreSQL and create a database named `assetflow`.
2. Update `.env` with your database connection string.
3. Run `npx prisma generate`.
4. Run `npm run dev`.

## Notes
This is the Hour 1 foundation scaffold only. Feature modules will be added in later iterations.
