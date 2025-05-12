# Essay Report Viewer

A web application for viewing essays, annotations, and user comments.

**Frontend:** Next.js + Shadcn
**Backend:** FastAPI + SQLite

---

## Features
- View essays with annotated feedback
- See detailed explanations and corrections for each annotation
- Add and view user comments
- Responsive, modern UI

---

## Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (For local dev) Node.js (v18+) and Python 3.11+ (optional, if not using Docker)

---

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd EssayReportViewer
```

### 2. Start with Docker
This will build and run both frontend and backend:
```bash
docker compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)

### 3. Stopping and Cleaning Up
To stop and remove all containers, networks, and volumes:
```bash
docker compose down --volumes --remove-orphans
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
- The frontend expects `REACT_APP_API_URL` (set in `docker-compose.yml`) to point to the backend.

---

## Database
- Uses SQLite (`essay_comments.db` in `backend/`).
- The database file is ignored by git.

---

## License
MIT