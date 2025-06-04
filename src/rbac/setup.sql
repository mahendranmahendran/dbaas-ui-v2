-- Initial ClickHouse RBAC Setup

-- Create roles
CREATE ROLE IF NOT EXISTS product_owner;
CREATE ROLE IF NOT EXISTS product_developer;
CREATE ROLE IF NOT EXISTS client_account_owner;
CREATE ROLE IF NOT EXISTS client_admin;
CREATE ROLE IF NOT EXISTS client_analyst;
CREATE ROLE IF NOT EXISTS client_user;

-- Grant permissions to product owner (full access)
GRANT ALL ON *.* TO product_owner;

-- Grant permissions to product developer (full access except user management)
GRANT ALL ON *.* TO product_developer;

-- Template for client roles (replace {database} with actual client database)
-- Client Account Owner
GRANT INSERT, UPDATE, SELECT, DELETE, CREATE, DROP, ALTER ON {database}.* TO client_account_owner;
GRANT SHOW TABLES, SHOW COLUMNS, SHOW DICTIONARIES ON {database}.* TO client_account_owner;

-- Client Admin
GRANT INSERT, UPDATE, SELECT, DELETE ON {database}.* TO client_admin;
GRANT SHOW TABLES, SHOW COLUMNS ON {database}.* TO client_admin;

-- Client Analyst
GRANT INSERT, UPDATE, SELECT, DELETE ON {database}.* TO client_analyst;
GRANT SHOW TABLES, SHOW COLUMNS ON {database}.* TO client_analyst;

-- Client User
GRANT SELECT ON {database}.* TO client_user;
GRANT SHOW TABLES, SHOW COLUMNS ON {database}.* TO client_user;

-- Row-level security policy template
ALTER TABLE {database}.*
ADD ROW POLICY tenant_isolation ON SELECT, INSERT, UPDATE, DELETE 
FOR ALL
USING tenant_id = '{tenant_id}';
