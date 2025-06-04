#!/usr/bin/env zsh

# Check for required environment variables
if [[ -z "$CLICKHOUSE_ADMIN_USER" || -z "$CLICKHOUSE_ADMIN_PASSWORD" ]]; then
    echo "Error: CLICKHOUSE_ADMIN_USER and CLICKHOUSE_ADMIN_PASSWORD must be set"
    exit 1
fi

# Function to execute ClickHouse queries
function ch_query() {
    clickhouse-client -u "$CLICKHOUSE_ADMIN_USER" --password "$CLICKHOUSE_ADMIN_PASSWORD" -q "$1"
}

# Create roles
echo "Creating roles..."
ch_query "
CREATE ROLE IF NOT EXISTS product_owner;
CREATE ROLE IF NOT EXISTS product_developer;
CREATE ROLE IF NOT EXISTS client_account_owner;
CREATE ROLE IF NOT EXISTS client_admin;
CREATE ROLE IF NOT EXISTS client_analyst;
CREATE ROLE IF NOT EXISTS client_user;
"

# Grant permissions to product owner
echo "Setting up product owner permissions..."
ch_query "GRANT ALL ON *.* TO product_owner"

# Grant permissions to product developer
echo "Setting up product developer permissions..."
ch_query "
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP ON *.* TO product_developer;
GRANT SHOW DATABASES, SHOW TABLES, SHOW COLUMNS ON *.* TO product_developer;
"

# Function to setup client database and permissions
function setup_client() {
    local client_id=$1
    local db_name="client_${client_id}"
    
    echo "Setting up database for client: ${client_id}"
    
    # Create client database
    ch_query "CREATE DATABASE IF NOT EXISTS ${db_name}"
    
    # Grant permissions to client account owner
    ch_query "
    GRANT INSERT, UPDATE, SELECT, DELETE, CREATE, DROP, ALTER ON ${db_name}.* TO client_account_owner;
    GRANT SHOW TABLES, SHOW COLUMNS, SHOW DICTIONARIES ON ${db_name}.* TO client_account_owner;
    "
    
    # Grant permissions to client admin
    ch_query "
    GRANT INSERT, UPDATE, SELECT, DELETE ON ${db_name}.* TO client_admin;
    GRANT SHOW TABLES, SHOW COLUMNS ON ${db_name}.* TO client_admin;
    "
    
    # Grant permissions to client analyst
    ch_query "
    GRANT INSERT, UPDATE, SELECT, DELETE ON ${db_name}.* TO client_analyst;
    GRANT SHOW TABLES, SHOW COLUMNS ON ${db_name}.* TO client_analyst;
    "
    
    # Grant permissions to client user
    ch_query "
    GRANT SELECT ON ${db_name}.* TO client_user;
    GRANT SHOW TABLES, SHOW COLUMNS ON ${db_name}.* TO client_user;
    "
    
    # Set up row-level security policy
    ch_query "
    ALTER TABLE ${db_name}.*
    ADD ROW POLICY IF NOT EXISTS tenant_isolation
    ON SELECT, INSERT, UPDATE, DELETE
    FOR ALL
    USING tenant_id = '${client_id}'
    "
}

# Set up role hierarchy
echo "Setting up role hierarchy..."
ch_query "
GRANT product_developer TO product_owner;
GRANT client_account_owner TO product_owner;
GRANT client_admin TO client_account_owner;
GRANT client_analyst TO client_admin;
GRANT client_user TO client_analyst;
"

# Create test users
echo "Creating test users..."
ch_query "
CREATE USER IF NOT EXISTS test_product_owner IDENTIFIED BY 'test123';
CREATE USER IF NOT EXISTS test_product_dev IDENTIFIED BY 'test123';
CREATE USER IF NOT EXISTS test_client_owner IDENTIFIED BY 'test123';
CREATE USER IF NOT EXISTS test_client_admin IDENTIFIED BY 'test123';
CREATE USER IF NOT EXISTS test_client_analyst IDENTIFIED BY 'test123';
CREATE USER IF NOT EXISTS test_client_user IDENTIFIED BY 'test123';

GRANT product_owner TO test_product_owner;
GRANT product_developer TO test_product_dev;
GRANT client_account_owner TO test_client_owner;
GRANT client_admin TO test_client_admin;
GRANT client_analyst TO test_client_analyst;
GRANT client_user TO test_client_user;
"

# Setup test client database
setup_client "test_client"

echo "RBAC setup completed successfully!"
