import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f"Starting LandGov Pune FastAPI Backend on http://localhost:{port}")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=True)
