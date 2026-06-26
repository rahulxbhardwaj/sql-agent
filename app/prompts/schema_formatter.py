class SchemaFormatter:

    def format_schema(self , schema):
        """Format the schema into a string representation."""
        formatted_schema = ""
        for table, columns in schema.items():
            formatted_schema += f"Table: {table}\n"
            formatted_schema += "Columns:\n"
            for column in columns:
                formatted_schema += f" - {column}\n"
            formatted_schema += "\n"
        return formatted_schema
    