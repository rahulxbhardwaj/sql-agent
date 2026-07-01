# Autonomous AI SQL Agent

An AI-powered SQL agent that converts natural language into SQL queries by understanding the database schema, exploring relevant data when needed, and executing queries to return accurate results.

## Features

- Natural language to SQL conversion
- Autonomous database exploration
- Schema-aware query generation
- SQL execution on SQLite databases
- Multi-step planning and reasoning
- Modular backend architecture
- CLI interface for testing and debugging

## Tech Stack

- Python
- SQLite
- LangGraph
- LangChain
- Local LLM (LM Studio + Qwen)

## Project Structure

```
app/
├── agents/
├── database/
├── graph/
├── llm/
├── prompts/
├── renderer/
└── config.py
```

## Current Status

Backend MVP is complete.

Implemented:
- Database manager
- Schema reader
- Planner agent
- Exploration agent
- SQL execution
- CLI renderer
- Prompt management

## Roadmap

- [x] Backend SQL Agent
- [ ] FastAPI backend
- [ ] Next.js frontend
- [ ] Chat interface
- [ ] Multi-database support
- [ ] Docker deployment

## Example

**Input**

```
Show the average order value for each category.
```

**Generated SQL**

```sql
SELECT category,
AVG(price * quantity) AS average_order_value
FROM orders
GROUP BY category;
```

## Running the Project

```bash
git clone <repository-url>
cd SQL-Agent

pip install -r requirements.txt

python main.py
```

## Future Improvements

- Query history
- SQL explanation
- Authentication
- Streaming responses
- PostgreSQL and MySQL support

## License

MIT License
