# 🛍Fullstack Ecommerce Platform

This is a monorepo containing both Frontend and Backend repositories

## Demo
- <u>Admin Dashboard (Backend):</u> 
  - URL: https://v5khzx-3000.csb.app/admin
  - Credentials: 
    - **username**: "superadmin" 
    - **password**: "superadmin"
  
- <u>Frontend:</u>
  
  - URL: https://v5khzx-8000.csb.app
  - Credentials: 
    - **username**: "testuser@testuser.com"
    - **password**: "testuser"
  
- <u>GraphQL API:</u>
  - Server URL: https://v5khzx-3000.csb.app/shop-api?query=%7Bproducts%7Bitems%7Bname%7D%7D%7D

## Installation
- IMPORTANT: **Node version 16.20.0**
- IMPORTANT: **Pnpm package manager** needed
- Clone this repository
- In the command line:

```shell
# Change to /backend directory
# Install backend dependencies
pnpm install

# Change to /frontend directory
# Install frontend dependencies
pnpm install

# Change to root project directory
# Install root dependencies
pnpm install
```    
  
## Run Scripts

From **root** project directory:

```shell
# List all scripts available
npm run

# Run backend in dev mode
npm run run:dev:backend

# Run frontend in dev mode
npm run run:dev:frontend

```




## Frontend

- Based in [NextJS Ecommerce](https://nextjs.org/commerce) Template

- Typescript

- Server Side Rendering

- Performant by default

- SEO Ready

- Internationalization and Localization

- Responsive

- Dark Mode Support

- Tailwind CSS

- Features
  - [STRIPE](https://stripe.com/es) Checkout
  
  - Shopping Cart
  
  - Search Products
  
  - Customer Authentication
  
    

[More information](./frontend/README.md) ➡️




## Backend

- Based on the [Vendure Project](https://github.com/vendure-ecommerce/vendure): a modern, Open-Source Headless Commerce framework built with TypeScript & Nodejs

- GraphQL API

- Headless, composable, API-driven

- Created with the [NestJS Backend Framework](https://nestjs.com/)

- AdminUI: **Log in** to the Admin Dashboard
  - **username**: "superadmin"

  - **password**: "superadmin"

- Roles and Permissions

- Scalable

- Extensible

- Internationalization and Localization

- Payment integration with any platform

- Relational Database (PostgreSQL, SQLite)


[More information](./backend/README.md) ➡️
