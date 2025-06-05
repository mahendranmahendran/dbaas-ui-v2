#!/usr/bin/env zsh

echo "Setting up development environment..."

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Start fresh containers
echo "Starting ClickHouse container..."
docker-compose up -d

# Wait for ClickHouse to be ready
echo "Waiting for ClickHouse to be ready..."
until curl --silent --output /dev/null http://localhost:8123/ping
do
  echo "Waiting for ClickHouse..."
  sleep 2
done

# Set up environment variables
export CLICKHOUSE_ADMIN_USER=admin
export CLICKHOUSE_ADMIN_PASSWORD=admin_password

# Run RBAC setup script
echo "Setting up RBAC roles and permissions..."
./scripts/setup-clickhouse-rbac.sh

# Create test database and table
echo "Creating test database and tables..."
curl -X POST "http://localhost:8123/?user=admin&password=admin_password" -d "
CREATE DATABASE IF NOT EXISTS test_client;

CREATE TABLE IF NOT EXISTS test_client.users (
    id UUID DEFAULT generateUUIDv4(),
    tenant_id String,
    username String,
    email String,
    created_at DateTime DEFAULT now(),
    updated_at DateTime DEFAULT now()
) ENGINE = MergeTree()
ORDER BY (tenant_id, created_at);

-- Insert test data
INSERT INTO test_client.users (tenant_id, username, email)
VALUES
    ('test_tenant', 'test_user1', 'user1@test.com'),
    ('test_tenant', 'test_user2', 'user2@test.com');
"

# Create .env.local for development
echo "Creating .env.local..."
cat > .env.local << EOL
VITE_CLICKHOUSE_HOST=http://localhost:8123
VITE_CLICKHOUSE_USER=admin
VITE_CLICKHOUSE_PASSWORD=admin_password
VITE_CLICKHOUSE_DATABASE=test_client
EOL

echo "Development environment setup complete!"
echo ""
echo "You can now:"
echo "1. Start the development server: npm run dev"
echo "2. Test with different user roles:"
echo "   - Product Owner: test_product_owner / test123"
echo "   - Product Developer: test_product_dev / test123"
echo "   - Client Admin: test_client_admin / test123"
echo "   - Client Analyst: test_client_analyst / test123"
echo "   - Client User: test_client_user / test123"
echo ""
echo "Visit http://localhost:5173 to access the application"
