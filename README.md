# Essay Report Viewer

A web application for viewing and managing essay reports and feedback.

**Frontend:** Next.js + Shadcn
**Backend:** FastAPI + SQLite

---

## Features
- View essays with annotated feedback
- See detailed explanations and corrections for each annotation
- Add and view user comments
- Responsive, modern UI
- API documentation

---

## Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (For local dev) Node.js (v18+) and Python 3.11+ (optional, if not using Docker)

---

## Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd essay-report-viewer
```

### 2. Start with Docker
This will build and run both frontend and backend:
```bash
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:3000/apidoc](http://localhost:3000/apidoc)
- Swagger UI: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- ReDoc: [http://localhost:8000/api/redoc](http://localhost:8000/api/redoc)

### 3. Stopping and Cleaning Up
To stop and remove all containers, networks, and volumes:
```bash
docker-compose down --volumes --remove-orphans
```

---

## Development

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Runs at [http://localhost:3000](http://localhost:3000)

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Runs at [http://localhost:8000](http://localhost:8000)

---

## Project Structure
```
EssayReportViewer/
├── backend/         # FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── frontend/        # Next.js frontend
│   ├── app/
│   ├── package.json
│   └── ...
└── docker-compose.yml
```

---

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL`: URL of the backend API (default: http://localhost:8000)
  - Set in `docker-compose.yml` for Docker setup
  - For local development, create a `.env.local` file in the frontend directory

### Backend
- No environment variables required for basic setup

---

## Database
- Uses SQLite (`essay_comments.db` in `backend/`).
- The database file is ignored by git.

---

## API Documentation

The application provides multiple ways to access the API documentation:

1. **Interactive API Documentation (Frontend)**
   - Visit http://localhost:3000/apidoc
   - Provides a beautiful, interactive documentation interface
   - Includes all API endpoints, request/response schemas, and examples

2. **Swagger UI (Backend)**
   - Visit http://localhost:8000/api/docs
   - Interactive API documentation with the ability to test endpoints directly

3. **ReDoc (Backend)**
   - Visit http://localhost:8000/api/redoc
   - Alternative documentation interface with a different layout

### API Endpoints

The API provides the following endpoints:

- `GET /api/essay` - Get essay data
- `GET /api/comments` - Get all comments
- `POST /api/comments` - Create a new comment

For detailed API documentation, please visit http://localhost:3000/apidoc

---

## License
MIT