# 🛍Fullstack Ecommerce Platform

This is a monorepo containing both Frontend and Backend repositories

## Demo
- <u>Admin Dashboard (Backend):</u> 
  - URL: https://jmynps-3000.csb.app/admin
  - Credentials: 
    - **username**: "superadmin" 
    - **password**: "superadmin"
  
- <u>Frontend:</u>
  
  - URL: https://jmynps-8000.csb.app
  - Credentials: 
    - **username**: "testuser@testuser.com"
    - **password**: "testuser"
  
- <u>GraphQL API:</u>
  - Server URL: https://jmynps-3000.csb.app/shop-api?query=%7Bproducts%7Bitems%7Bname%7D%7D%7D
  
    
  
## Run Scripts

From root project directory:

```shell
# Run backend in dev mode
yarn run dev:run:backend

# Run front in dev mode
yarn run dev:run:frontend

# List all posible scripts to run
yarn run
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
