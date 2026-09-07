# FlyRank Task API

A simple Task CRUD API built with Node.js, Express, and PostgreSQL.

The project uses Docker and Docker Compose to run the API and PostgreSQL database together. The database uses a persistent Docker volume so task data survives container restarts.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL 16
- Docker
- Docker Compose
- node-postgres (`pg`)

## Features

- Create tasks
- Read all tasks
- Read a task by ID
- Update tasks
- Delete tasks
- PostgreSQL database storage
- Parameterized SQL queries
- Automatic database table creation
- Seed data on first run
- Persistent PostgreSQL storage with a Docker volume
- One-command startup with Docker Compose

## Getting Started

### Prerequisites

Make sure Docker and Docker Compose are installed.

Check Docker:

```bash
docker --version
docker compose version
```

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The `.env` file contains:

```
DATABASE_URL=postgres://postgres:dev@localhost:5432/tasks
PORT=3000
```

The `.env` file is ignored by Git and should not be committed.

### Run the Application

Start the complete stack with one command:

```bash
docker compose up
```

The API will be available at:

```
http://localhost:3000
```

To run the application in detached mode:

```bash
docker compose up -d
```

To stop the application:

```bash
docker compose down
```

## API Endpoints

| Method | Endpoint      | Description        | Success Status |
|--------|---------------|---------------------|-----------------|
| GET    | /health       | Check API health    | 200             |
| GET    | /tasks        | Get all tasks       | 200             |
| GET    | /tasks/:id    | Get a task by ID    | 200             |
| POST   | /tasks        | Create a new task   | 201             |
| PUT    | /tasks/:id    | Update a task       | 200             |
| DELETE | /tasks/:id    | Delete a task       | 204             |

### Error Responses

If a task ID does not exist:

```json
{
  "error": "Task not found"
}
```

If a task is created without a title:

```json
{
  "error": "Title is required"
}
```

## API Examples

### Health Check

```bash
curl -i http://localhost:3000/health
```

### Get All Tasks

```bash
curl -i http://localhost:3000/tasks
```

### Get a Task by ID

```bash
curl -i http://localhost:3000/tasks/1
```

### Create a Task

```bash
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker","done":false}'
```

### Update a Task

```bash
curl -i -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker Compose","done":true}'
```

### Delete a Task

```bash
curl -i -X DELETE http://localhost:3000/tasks/1
```

## Database

The application uses PostgreSQL 16 running inside Docker.

The `tasks` table contains:

| Column | Type    | Description         |
|--------|---------|----------------------|
| id     | SERIAL  | Primary key          |
| title  | TEXT    | Task title           |
| done   | BOOLEAN | Completion status    |

On startup, the application creates the `tasks` table if it does not already exist.

If the table is empty, three example tasks are inserted:

- Learn Docker
- Connect Postgres
- Ship the API

The application uses parameterized SQL queries to safely pass values to PostgreSQL.

## Data Persistence

PostgreSQL uses a named Docker volume:

```
taskdata
```

The volume is mounted at:

```
/var/lib/postgresql/data
```

Because the database uses a persistent volume, task data survives:

```bash
docker compose down
docker compose up
```

This allows data to remain available even after the containers are stopped and recreated.

## Docker Compose Architecture

The application consists of two services:

```
┌─────────────────────┐
│        API          │
│   Node.js/Express   │
│     Port 3000       │
└──────────┬──────────┘
           │
           │ DATABASE_URL
           │ postgres://...@db:5432/tasks
           ▼
┌─────────────────────┐
│     PostgreSQL      │
│       16            │
│     Port 5432       │
└──────────┬──────────┘
           │
           ▼
     Docker Volume
       taskdata
```

Inside the Docker Compose network, the API connects to PostgreSQL using the service name `db`, not `localhost`.

## Project Structure

```
.
├── server.js
├── db.js
├── package.json
├── package-lock.json
├── Dockerfile
├── compose.yaml
├── .env.example
├── .gitignore
└── README.md
```

## Running from a Fresh Clone

Clone the repository:

```bash
git clone https://github.com/AkashKodihithlu/Flyrank-2.git
cd Flyrank-2
```

Create the environment file:

```bash
cp .env.example .env
```

Start the complete application:

```bash
docker compose up
```

The API will then be available at:

```
http://localhost:3000
```

Test the API:

```bash
curl -i http://localhost:3000/tasks
```

No manual PostgreSQL installation or database setup is required.

## One-Command Startup

The complete application can be started with:

```bash
docker compose up
```

This starts:

- Node.js API
- PostgreSQL 16 database
- Persistent PostgreSQL volume

## Security Notes

- Database configuration is provided through environment variables.
- `.env` is ignored by Git and should not be committed.
- `.env.example` is provided as a template.
- SQL queries use parameterized placeholders to prevent unsafe query construction.

## Assignment Progress

- Stage 0: PostgreSQL in Docker + gitignore
- Stage 1: Connect via .env and create table
- Stage 2: Read from PostgreSQL
- Stage 3: Full CRUD on PostgreSQL
- Stage 4: Docker Compose whole stack
- Stage 5: GitHub publication and documentation

## License

This project was created as part of the FlyRank Backend Internship assignment.
