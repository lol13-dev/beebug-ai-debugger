# How to Run Beebug

Beebug is a full-stack AI debugging assistant. To run it locally, you need to start both the Python backend API and the static frontend server.

## 0. Configure AI Backend (Local or Cloud)

Beebug can use either **Google Gemini** (Cloud) or **LM Studio** (100% Free Local AI).

**To use Gemini:**
1. Open `.env` and ensure `USE_LOCAL_AI=false`.
2. Add your Gemini API key: `GEMINI_API_KEY=your_key_here`.

**To use Local AI (Recommended for Intel Macs / Ventura):**
1. Download **LM Studio for Mac (Intel)** from [lmstudio.ai](https://lmstudio.ai).
2. Open LM Studio and search for a lightweight model optimized for Intel CPUs (e.g., `Qwen 2.5 1.5B Instruct` or `Llama 3.2 1B Instruct`). Download the `Q4_K_M` version.
3. Go to the `<->` (Local Server) tab in LM Studio, load the model at the top, and click **Start Server**.
4. Open `.env` and ensure `USE_LOCAL_AI=true` and `LOCAL_PORT=1234`.

## 1. Setup the Environment

Make sure you are in the root directory of the project (`BeeBug/`).

```bash
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install the required dependencies
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

*Note: The app is currently configured to use Google's Gemini AI. Make sure you have your `GEMINI_API_KEY` set inside the `.env` file.*

## 2. Start the Backend Server

The backend uses FastAPI and runs on port `8000`.

```bash
# From the project root, go to the backend folder
cd backend

# Start the server (make sure your virtual environment is active)
../.venv/bin/python -m uvicorn app:app --reload
```
*You should see a message saying: `Uvicorn running on http://127.0.0.1:8000`*

## 3. Start the Frontend Server

Open a **new, separate terminal window**, and navigate to the frontend folder.

```bash
# From the project root, go to the frontend folder
cd frontend

# Start a simple Python HTTP server on port 3001
python3 -m http.server 3001
```

## 4. Use the App!

1. Open your web browser and go to **[http://127.0.0.1:3001](http://127.0.0.1:3001)**
2. Type in any username and password to pass the mock login screen.
3. Paste an error message into the chat bar and click the Send button!

---

### Troubleshooting

- **Address already in use / Port occupied:** If you get an error that port `8000` or `3001` is already in use, you can kill the existing processes by running `pkill -f uvicorn` and `pkill -f http.server` in your terminal.
- **Connection Error in UI:** This means the frontend cannot reach the backend. Ensure your backend terminal is running and did not crash.