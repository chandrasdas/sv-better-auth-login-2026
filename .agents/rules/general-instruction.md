---
trigger: always_on
---

# AI Coding Instructions

## Project Overview

You are working on **Darpan**, a modern, high-performance web application for school management.

- **Framework**: SvelteKit (with Node adapter), svelte 5 with rune syntax
- **Styling**: Tailwind CSS v4
- **Authentication**: Better-Auth (`better-auth`)
- **Database ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Database**: libsql (local)
- **Package Manager**: `pnpm`

Always use pnpm instead of npm for all package management and script running commands. Do not use npm.

SvelteKit Navigation Rule
Constraint: Prevent svelte/no-navigation-without-resolve errors. Never use hardcoded strings in href.
Requirement: Wrap all internal paths in the resolve function.
Import: import { resolve } from '$app/paths';
Syntax: <a href={resolve('/your-path')}>
