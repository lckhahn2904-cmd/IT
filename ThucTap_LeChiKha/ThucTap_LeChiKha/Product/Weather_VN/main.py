from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import pickle
from fastapi.middleware.cors import CORSMiddleware

# ================== CONFIG ==================
MODEL_PATH = "lstm_model.h5"
SCALER_PATH = "scaler.pkl"

TIMESTEPS = 14
FEATURES = 8

# ================== LOAD MODEL ==================
try:
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("✅ LSTM model loaded successfully")
except Exception as e:
    raise RuntimeError(f"❌ Cannot load LSTM model: {e}")

# ================== LOAD SCALER ==================
try:
    with open(SCALER_PATH, "rb") as f:
        scaler = pickle.load(f)
    print("✅ Scaler loaded successfully")
except Exception as e:
    raise RuntimeError(f"❌ Cannot load scaler: {e}")

# ================== FASTAPI ==================
app = FastAPI(title="WeatherVN LSTM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================== SCHEMA ==================
class WeatherInput(BaseModel):
    data: list           # shape (14, 8)
    features: list       # tên các biến

# ================== ROUTES ==================
@app.get("/")
def home():
    return {
        "message": "🌦️ WeatherVN LSTM API is running!",
        "model": "LSTM",
        "docs": "http://127.0.0.1:8000/docs",
        "predict": "POST /predict"
    }

@app.get("/predict")
def predict_notice():
    return {
        "message": "Endpoint này chỉ hỗ trợ POST",
        "docs": "http://127.0.0.1:8000/docs"
    }

@app.post("/predict")
def predict_weather(input: WeatherInput):
    try:
        # ================== INPUT ==================
        X = np.array(input.data, dtype=np.float32)

        if X.shape != (TIMESTEPS, FEATURES):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid input shape. Expected ({TIMESTEPS}, {FEATURES}), got {X.shape}"
            )

        # ================== SCALE ==================
        X_scaled = scaler.transform(X)
        X_scaled = X_scaled.reshape(1, TIMESTEPS, FEATURES)

        # ================== PREDICT ==================
        y_pred = model.predict(X_scaled, verbose=0).flatten()

        # ================== INVERSE SCALE (nếu output = FEATURES) ==================
        if len(y_pred) == FEATURES:
            y_pred = scaler.inverse_transform([y_pred])[0]

        y_pred = list(map(float, y_pred))

        # ================== MAP RESULT ==================
        result = {
            input.features[i]: y_pred[i]
            for i in range(min(len(input.features), len(y_pred)))
        }

        return {
            "model": "LSTM",
            "forecast": result
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
