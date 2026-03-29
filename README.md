# Darpan

A beautiful, modern, and high-performance template built with **SvelteKit**, **Tailwind CSS v4**, and **[Better-Auth](https://better-auth.com/)**. Everything you need to launch your next big idea today.

This project is configured to connect to a **MySQL** database (ideal for cPanel hosting) using **Drizzle ORM**, and includes robust authentication features like email verification, password reset, and Role-Based Access Control (RBAC) specifically tailored for restricted staff access.

## ✨ Features

- **Role-Based Access Control (RBAC)**: Manage user roles (`staff`, `admin`, etc.) with built-in sessions.
- **Restricted Staff Registration**: Only pre-authorized staff members (verified against a database table) can register for accounts.
- **Email Verification**: Built-in Nodemailer utility with `better-auth` integration to mandate email verification before account creation.
- **Password Management**: Fully functional "Forget Password" and password reset flows.
- **Modern UI**: Styled with Tailwind CSS v4 for a premium and dynamic aesthetic.

## 🚀 Tech Stack & Dependencies

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with Node adapter.
- **Authentication**: `better-auth` and `@better-auth/cli` for secure, modern authentication.
- **Database ORM**: `drizzle-orm` and `drizzle-kit` for schema management and type-safe database access.
- **Database Driver**: `mysql2` designed to interact with your MySQL database server.
- **Styling**: Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/forms`).
- **Tooling**: Vite, TypeScript, ESLint, Prettier, `pnpm`.
- **Mailing**: `nodemailer` for authentication emails.

## 📂 Project Structure

```text
.
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── auth.ts      # Better-Auth configuration (Plugins, RBAC)
│   │   │   ├── db/          # Drizzle ORM schema and DB connection
│   │   │   └── email.ts     # Nodemailer configuration
│   │   └── assets/          # Shared components and client-side utilities
│   ├── routes/              # SvelteKit pages, layouts, and API routes
│   │   ├── about/           # About Us page
│   │   ├── dashboard/       # Protected dashboard area
│   │   ├── demo/            # Demo pages
│   │   ├── forgot-password/ # Password reset flow
│   │   ├── login/           # Login flow
│   │   ├── register/        # Registration flow (Restricted)
│   │   ├── +page.svelte     # Main application landing page
│   │   └── +layout.svelte   # Top-level layout
│   └── app.html             # Main HTML entry point
├── static/                  # Static assets (images, fonts, etc.)
├── .env                     # Environment variables (Database URL, Secrets)
├── .env.example             # Example environment variable file
├── drizzle.config.ts        # Configuration for Drizzle Kit commands
├── svelte.config.js         # Configuration for SvelteKit and adapter
├── vite.config.ts           # Vite development server configuration
└── package.json             # Project dependencies and scripts
```

## 🛠️ Getting Started

### 1. Prerequisites

- Node.js installed (v20+ recommended).
- Access to a MySQL database (e.g., via a cPanel hosting account).
- `pnpm` installed globally.

### 2. Environment Variables

Create a `.env` file in the root of your project based on `.env.example`. Make sure to configure your MySQL connection and Better-Auth secrets:

```env
# Database connection string (replace with your MySQL credentials)
DATABASE_URL="mysql://cpanel_user:password@cpanel_host_or_ip:3306/database_name"

# Better Auth required variables
BETTER_AUTH_SECRET="your-strong-random-secret"
BETTER_AUTH_URL="http://localhost:5173"

# Email Configuration
EMAIL_USER="your-email@example.com"
EMAIL_PASSWORD="your-email-password"
```

### 3. Installation

Install the project dependencies using `pnpm` (which is configured in this workspace):

```bash
pnpm install
```

### 4. Database Setup

Once your `.env` is configured with your database credentials, run the Drizzle migrations to generate the auth schema in your remote database:

```bash
# Push schema to MySQL database
pnpm db:push

# Generate new migrations if you update the schema
pnpm db:generate

# Optionally, open Drizzle Studio to inspect the DB directly
pnpm db:studio
```

To sync the `better-auth` schema with Drizzle, you can run:

```bash
pnpm auth:schema
```

### 5. Running the Application

To start the Vite development server:

```bash
pnpm dev
```

Visit `http://localhost:5173` to test the template, login, and restricted registration functionality!

## 🚢 Deployment

This project uses `@sveltejs/adapter-node` which is suitable for standard Node.js environments. For a cPanel environment, ensure your hosting plan supports Node.js applications (often managed via Passenger or similar tools).

To build the production version, run:

```bash
pnpm build
```

Then start the server using the generated entry point in the `build` folder.
