![Open Newswire logo](./docs/logo.png)

Open Newswire is an open-source RSS and Atom feed aggregator that helps independent newsrooms discover freely-republishable news articles and sources. For more information, visit the [Open Newswire homepage](https://www.opennewswire.org).

This repository is licensed under the MIT License.

## Getting Started

### Installing Dependencies

Use npm to install dependencies.

```bash
npm i
```

### Start the Development Environment

First, ensure Docker is installed. Then, run:

```bash
docker compose up -d
```

from the project's root directory to start Docker containers with Postgres and the QStash development server (for handling job processing requests).

Then, start the development server by running:

```bash
npm run dev
```

### Access Open Newswire Locally

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

Open Newswire is built on top of the Next.js framework. To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

Open Newswire is deployed to the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Working with Prisma

This project uses Prisma to manage database models and migrations.

### Creating Migrations

To create a new database migration, run `npx prisma migrate dev --name <name>`, where `<name>` is a unique name identifying the contents of the migration.

### Syncing Local Development Database

Run `npx prisma db push` to override your local database with the latest schema. This is useful for prototyping.

### Marking Migrations as Applied

Sometimes it's useful to mark a migration as applied without actually applying it. To do this, run `npx prisma migrate resolve --applied <migration-name>`

## Upstash

Open Newswire uses QStash for scheduled jobs and worker queue messaging. Running `docker compose up` will ensure a QStash development server is started for local testing.