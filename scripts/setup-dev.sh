#!/usr/bin/env zsh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${GREEN}Setting up development environment...${NC}"

# Start Docker containers
echo "${YELLOW}Starting ClickHouse container...${NC}"
docker-compose up -d

# Wait for ClickHouse to be ready
echo "${YELLOW}Waiting for ClickHouse to be ready...${NC}"
until docker exec dbaas-clickhouse clickhouse-client --user admin --password admin_password -q "SELECT 1"
do
    echo "Waiting for ClickHouse to start..."
    sleep 2
done

# Set environment variables for the setup script
export CLICKHOUSE_ADMIN_USER=admin
export CLICKHOUSE_ADMIN_PASSWORD=admin_password

# Run RBAC setup script
echo "${YELLOW}Setting up RBAC roles and permissions...${NC}"
./scripts/setup-clickhouse-rbac.sh

# Create test database and tables
echo "${YELLOW}Creating test database and tables...${NC}"
docker exec dbaas-clickhouse clickhouse-client --user admin --password admin_password -q "
CREATE DATABASE IF NOT EXISTS test_client;

CREATE TABLE IF NOT EXISTS test_client.sample_data (
    id UUID,
    tenant_id String,
    data String,
    created_at DateTime,
    updated_at DateTime
) ENGINE = MergeTree()
ORDER BY (tenant_id, created_at);

-- Insert some test data
INSERT INTO test_client.sample_data 
SELECT 
    generateUUIDv4() as id,
    'test_tenant' as tenant_id,
    concat('data_', toString(number)) as data,
    now() as created_at,
    now() as updated_at
FROM numbers(10);
"

# Create .env.local for development
echo "${YELLOW}Creating .env.local...${NC}"
cat > .env.local << EOL
VITE_CLICKHOUSE_HOST=http://localhost:8123
VITE_CLICKHOUSE_USER=admin
VITE_CLICKHOUSE_PASSWORD=admin_password
VITE_CLICKHOUSE_DATABASE=test_client
EOL

echo "${GREEN}Setup complete! You can now:${NC}"
echo "1. Start the development server: npm run dev"
echo "2. Test with different user roles:"
echo "   - Product Owner: test_product_owner / test123"
echo "   - Product Developer: test_product_dev / test123"
echo "   - Client Admin: test_client_admin / test123"
echo "   - Client Analyst: test_client_analyst / test123"
echo "   - Client User: test_client_user / test123"
echo
echo "Access the app at: http://localhost:5173"
