
import json
from redis.exceptions import RedisError


class SchemaReader:
    def __init__(self, db, redis_client):
        self.db = db
        self.redis = redis_client
        self.cache_key = "sql_agent:schema"
        self.cache_ttl = 30

    def get_tables(self):
        query = "SELECT name FROM sqlite_master WHERE type='table';"
        results = self.db.execute_query(query)
        return [row['name'] for row in results]

    def get_columns(self, table_name):
        # Safely quote SQLite table identifiers
        safe_name = table_name.replace('"', '""')
        query = f'PRAGMA table_info("{safe_name}");'

        results = self.db.execute_query(query)
        return [row['name'] for row in results]

    def _fetch_schema(self):
        schema = {}

        tables = self.get_tables()

        for table in tables:
            schema[table] = self.get_columns(table)

        return schema

    def get_schema(self):

        print("Redis object:", self.redis)
        print("Redis connected:", self.redis.ping())

        cached_schema = self.redis.get(self.cache_key)

        if cached_schema is not None:
            print("🔥 REDIS CACHE HIT")
            return json.loads(cached_schema)

        print("❌ REDIS CACHE MISS")

        schema = self._fetch_schema()

        self.redis.set(
            self.cache_key,
            json.dumps(schema),
            ex=self.cache_ttl
        )

        print("✅ Schema stored in Redis")
        return schema
