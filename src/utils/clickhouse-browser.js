// Browser-compatible ClickHouse client
class ClickHouseClient {
  constructor(config) {
    this.host = config.host || 'http://localhost:8123';
    this.username = config.username;
    this.password = config.password;
    this.database = config.database;
  }

  async query(query) {
    const url = new URL(this.host);
    url.searchParams.append('user', this.username);
    url.searchParams.append('password', this.password);
    if (this.database) {
      url.searchParams.append('database', this.database);
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: query.query || query,
      });

      if (!response.ok) {
        throw new Error(`ClickHouse Error: ${response.statusText}`);
      }

      const text = await response.text();
      let data;
      
      try {
        // Try parsing as JSON array
        data = text.split('\n')
          .filter(Boolean)
          .map(line => {
            try {
              return JSON.parse(line);
            } catch {
              return line;
            }
          });
      } catch (e) {
        // If not JSON, return as plain text
        data = [{ result: text }];
      }
      
      return { data };
    } catch (error) {
      console.error('ClickHouse query error:', error);
      throw error;
    }
  }
}

export const createClickhouseConnection = (username, password, database = 'default') => {
  return new ClickHouseClient({
    host: import.meta.env.VITE_CLICKHOUSE_HOST || 'http://localhost:8123',
    username,
    password,
    database
  });
};
