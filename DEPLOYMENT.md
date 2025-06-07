# AstroBSM-Oracle-IVANSTAMAS Deployment Instructions

## 1. GitHub Preparation
- Ensure your `.gitignore` is set (already created).
- Commit all code to your GitHub repository.

## 2. Render Deployment (Backend)
- Make sure your backend requirements are in `backend/requirements.txt`.
- Add a `render.yaml` in the root or backend directory for Render deployment.
- Example `render.yaml`:

```
services:
  - type: web
    name: astrobsm-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port 10000
    envVars:
      - key: DATABASE_URL
        value: <your_database_url>
    plan: free
    rootDir: backend
```

## 3. Render Deployment (Frontend)
- For React: Add a `render.yaml` or deploy via Render's dashboard.
- Example for React frontend:

```
services:
  - type: web
    name: astrobsm-frontend
    env: node
    buildCommand: cd frontend/react-app && npm install && npm run build
    startCommand: cd frontend/react-app && npm install && npm run start
    plan: free
    rootDir: frontend/react-app
```

## 4. Environment Variables
- Set all secrets (e.g., `DATABASE_URL`, `SECRET_KEY`) in Render's dashboard or in the `render.yaml`.

## 5. Database
- Use Render's managed PostgreSQL or your own database. Update `DATABASE_URL` accordingly.

## 6. Final Steps
- Push your code to GitHub.
- Connect your repo to Render and deploy both backend and frontend services.

---

For more details, see Render's docs: https://render.com/docs/deploy-fastapi, https://render.com/docs/deploy-create-react-app
