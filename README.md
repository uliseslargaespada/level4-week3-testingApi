# level4-week3-testingApi

This is the repository for the Level 4 Week 3 Testing API project. The project focuses on testing APIs using various tools and techniques to ensure their functionality, reliability, and performance. By building a template.

## Prisma Database Setup

### Why Use Dedicated Databases?

Prisma migrations require a dedicated database for both your application and shadow migrations. Using the default Postgres system template (`template1`) can cause migration failures, even if your app can connect and run queries.

### Recommended Configuration

Update your `.env` file to use dedicated databases:

```dotenv
DATABASE_URL="postgres://postgres:postgres@localhost:51214/your_app_db?sslmode=disable&connection_limit=1&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&single_use_connections=true&socket_timeout=0"
SHADOW_DATABASE_URL="postgres://postgres:postgres@localhost:51215/your_shadow_db?sslmode=disable&connection_limit=1&connect_timeout=0&max_idle_connection_lifetime=0&pool_timeout=0&single_use_connections=true&socket_timeout=0"
```

### Creating the Databases

Run these commands to create the databases:

```sh
psql -h localhost -p 51214 -U postgres -c "CREATE DATABASE your_app_db;"
psql -h localhost -p 51215 -U postgres -c "CREATE DATABASE your_shadow_db;"
```

### Summary

- **Do not use `template1`** as your application or shadow database.
- Use dedicated databases for reliable Prisma migrations and application functionality.