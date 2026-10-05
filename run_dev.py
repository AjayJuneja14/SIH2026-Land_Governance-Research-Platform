import subprocess
import sys
import time
import os

print("=" * 65)
print("  LANDGOV PUNE (SIH 2026 - Problem Statement SIH26019)")
print("  National Digital Platform for Research & Land Governance")
print("  Scope: Pune District, Maharashtra Deployment")
print("=" * 65)

print("\n[1/2] Launching FastAPI Backend on http://localhost:8000 ...")
backend_proc = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
    cwd=r"C:\SIH"
)

print("[2/2] Launching Next.js 14 Frontend on http://localhost:3000 ...")
frontend_proc = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd=r"C:\SIH\frontend",
    shell=True
)

print("\n" + "=" * 65)
print("  [ONLINE] Backend API:       http://localhost:8000")
print("  [ONLINE] Swagger Docs:      http://localhost:8000/docs")
print("  [ONLINE] Frontend Platform: http://localhost:3000")
print("  Geographic Hierarchy:      Country -> State -> District (Pune)")
print("  Press Ctrl+C to terminate both servers.")
print("=" * 65 + "\n")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("\nShutting down LandGov Pune services...")
    backend_proc.terminate()
    frontend_proc.terminate()
    print("All services stopped.")