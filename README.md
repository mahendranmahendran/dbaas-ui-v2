# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Testing ClickHouse RBAC

## Setup

1. Make sure ClickHouse is running:
```bash
docker run -d --name clickhouse-server -p 8123:8123 -p 9000:9000 clickhouse/clickhouse-server
```

2. Set environment variables:
```bash
export CLICKHOUSE_ADMIN_USER=default
export CLICKHOUSE_ADMIN_PASSWORD=
```

3. Run the setup script:
```bash
./scripts/setup-clickhouse-rbac.sh
```

## Test Users

The setup script creates the following test users:

- Product Owner: test_product_owner / test123
- Product Developer: test_product_dev / test123
- Client Account Owner: test_client_owner / test123
- Client Admin: test_client_admin / test123
- Client Analyst: test_client_analyst / test123
- Client User: test_client_user / test123

## Testing Access

1. Start the application:
```bash
npm run dev
```

2. Log in with different test users to verify access levels:

- Product Owner: Full access to all features
- Product Developer: Access to development features and monitoring
- Client Account Owner: Full access to their client database and user management
- Client Admin: Database management without billing access
- Client Analyst: Query access with data manipulation
- Client User: Read-only access to authorized data

Each role inherits permissions from roles below it in the hierarchy.
