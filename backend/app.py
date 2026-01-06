"""
AI-Guardian: Real-Time Environmental & Disaster Prevention AI
FastAPI Backend - Main Application
"""

from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks
from fastapi. middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging
from datetime import datetime, timedelta
import asyncio
import json

from config import settings
from models.flood_predictor import FloodPredictor
from models.fire_predictor import FirePredictor
from models.pollution_predictor import PollutionPredictor
from models.nlp_translator import NLPTranslator
from data.sensor_ingestion import SensorDataManager
from data.external_api import ExternalAPIManager
from alerts.notification_engine import AlertEngine
from alerts.alert_rules import AlertRules
from simulation.scenario_simulator import ScenarioSimulator
from database.models import init_db, get_latest_sensor_data, save_sensor_data, get_alerts

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global instances
flood_predictor = FloodPredictor()
fire_predictor = FirePredictor()
pollution_predictor = PollutionPredictor()
nlp_translator = NLPTranslator()
sensor_manager = SensorDataManager()
api_manager = ExternalAPIManager()
alert_engine = AlertEngine()
alert_rules = AlertRules()
scenario_simulator = ScenarioSimulator()

# Store connected WebSocket clients
connected_clients = set()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("🚀 AI-Guardian Starting Up...")
    init_db()
    
    # Start background tasks
    asyncio.create_task(background_data_collection())
    asyncio.create_task(background_prediction_loop())
    
    yield
    
    logger.info("🛑 AI-Guardian Shutting Down...")


app = FastAPI(
    title="AI-Guardian API",
    description="Real-Time Environmental & Disaster Prevention AI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# HEALTH & STATUS ENDPOINTS
# ============================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status":  "healthy",
        "timestamp":  datetime.utcnow().isoformat(),
        "service":  "AI-Guardian Backend"
    }


@app.get("/status")
async def system_status():
    """Get system status and stats"""
    return {
        "status": "operational",
        "timestamp": datetime. utcnow().isoformat(),
        "models_loaded": {
            "flood_predictor": flood_predictor.is_ready(),
            "fire_predictor": fire_predictor.is_ready(),
            "pollution_predictor": pollution_predictor.is_ready(),
            "nlp_translator": nlp_translator. is_ready()
        },
        "connected_websockets": len(connected_clients),
        "database":  "connected"
    }


# ============================================
# SENSOR DATA ENDPOINTS
# ============================================

@app.get("/api/v1/sensors/latest")
async def get_latest_sensor_readings():
    """Get latest sensor readings from all locations"""
    try:
        data = get_latest_sensor_data()
        return {
            "status": "success",
            "data": data,
            "timestamp":  datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching sensor data: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch sensor data")


@app.post("/api/v1/sensors/ingest")
async def ingest_sensor_data(sensor_data: dict):
    """Ingest sensor data from IoT devices"""
    try: 
        # Validate and process sensor data
        processed = sensor_manager.validate_and_process(sensor_data)
        saved = save_sensor_data(processed)
        
        logger.info(f"✅ Sensor data ingested from {processed.get('sensor_id')}")
        
        return {
            "status":  "success",
            "data": saved,
            "timestamp":  datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error ingesting sensor data: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/v1/sensors/history/{location}")
async def get_sensor_history(location: str, hours: int = 24):
    """Get historical sensor data for a location"""
    try:
        # TODO: Query database for historical data
        return {
            "location": location,
            "hours":  hours,
            "data": [],
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# PREDICTION ENDPOINTS
# ============================================

@app.post("/api/v1/predictions/flood")
async def predict_flood(location: dict):
    """Predict flood risk for a location"""
    try: 
        prediction = flood_predictor.predict(location)
        
        # Translate to human-readable format
        human_readable = nlp_translator.translate_prediction(
            prediction_type="flood",
            prediction=prediction
        )
        
        logger.info(f"🌊 Flood prediction:  {location} - Risk: {prediction['risk_score']}%")
        
        return {
            "status": "success",
            "prediction_type": "flood",
            "location": location,
            "risk_score": prediction['risk_score'],
            "confidence": prediction['confidence'],
            "time_to_event": prediction['time_to_event_hours'],
            "human_readable":  human_readable,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in flood prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/predictions/fire")
async def predict_fire(location:  dict):
    """Predict fire risk for a location"""
    try:
        prediction = fire_predictor.predict(location)
        human_readable = nlp_translator. translate_prediction(
            prediction_type="fire",
            prediction=prediction
        )
        
        logger.info(f"🔥 Fire prediction: {location} - Risk: {prediction['risk_score']}%")
        
        return {
            "status":  "success",
            "prediction_type": "fire",
            "location": location,
            "risk_score": prediction['risk_score'],
            "confidence": prediction['confidence'],
            "time_to_event": prediction['time_to_event_hours'],
            "human_readable": human_readable,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in fire prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/predictions/pollution")
async def predict_pollution(location: dict):
    """Predict pollution levels for a location"""
    try:
        prediction = pollution_predictor.predict(location)
        human_readable = nlp_translator.translate_prediction(
            prediction_type="pollution",
            prediction=prediction
        )
        
        logger.info(f"💨 Pollution prediction: {location} - AQI: {prediction['aqi']}")
        
        return {
            "status": "success",
            "prediction_type": "pollution",
            "location": location,
            "aqi": prediction['aqi'],
            "pollutants": prediction['pollutants'],
            "health_advisory": prediction['health_advisory'],
            "human_readable": human_readable,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in pollution prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/predictions/all")
async def predict_all_hazards(location: dict):
    """Get all hazard predictions for a location"""
    try:
        flood_pred = flood_predictor.predict(location)
        fire_pred = fire_predictor.predict(location)
        pollution_pred = pollution_predictor.predict(location)
        
        return {
            "status": "success",
            "location": location,
            "predictions": {
                "flood": flood_pred,
                "fire":  fire_pred,
                "pollution": pollution_pred
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in multi-hazard prediction: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# ALERTS ENDPOINTS
# ============================================

@app.get("/api/v1/alerts/active")
async def get_active_alerts():
    """Get all active alerts"""
    try: 
        alerts = get_alerts(status="active")
        return {
            "status": "success",
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e: 
        logger.error(f"Error fetching alerts: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/alerts/history")
async def get_alert_history(limit: int = 100):
    """Get alert history"""
    try:
        alerts = get_alerts(status="all", limit=limit)
        return {
            "status": "success",
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error fetching alert history:  {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/alerts/manual")
async def create_manual_alert(alert_data: dict):
    """Manually create an alert (for testing/admin)"""
    try:
        alert = alert_engine.create_alert(alert_data)
        
        # Broadcast to WebSocket clients
        await broadcast_alert(alert)
        
        logger.info(f"⚠️ Manual alert created: {alert['type']}")
        
        return {
            "status": "success",
            "alert":  alert,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger. error(f"Error creating alert: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================
# SIMULATION ENDPOINTS
# ============================================

@app.post("/api/v1/simulation/run")
async def run_simulation(scenario: dict):
    """Run a disaster scenario simulation"""
    try:
        result = scenario_simulator.simulate(scenario)
        
        logger.info(f"🎮 Simulation completed: {scenario. get('name')}")
        
        return {
            "status": "success",
            "scenario": scenario. get('name'),
            "result": result,
            "timestamp": datetime. utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error in simulation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/simulation/scenarios")
async def list_scenarios():
    """List available scenarios"""
    return {
        "status": "success",
        "scenarios": scenario_simulator.get_available_scenarios(),
        "timestamp":  datetime.utcnow().isoformat()
    }


# ============================================
# WEBSOCKET ENDPOINTS
# ============================================

@app.websocket("/ws/live-data")
async def websocket_live_data(websocket: WebSocket):
    """WebSocket for real-time data streaming"""
    await websocket.accept()
    connected_clients.add(websocket)
    
    try:
        logger.info(f"✅ WebSocket connected.  Total clients: {len(connected_clients)}")
        
        while True:
            # Send latest data every 2 seconds
            data = get_latest_sensor_data()
            await websocket.send_json({
                "type": "sensor_update",
                "data": data,
                "timestamp": datetime.utcnow().isoformat()
            })
            await asyncio.sleep(2)
    except Exception as e:
        logger. error(f"WebSocket error: {e}")
    finally:
        connected_clients. discard(websocket)
        logger.info(f"❌ WebSocket disconnected. Total clients: {len(connected_clients)}")


@app.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    """WebSocket for real-time alerts"""
    await websocket.accept()
    connected_clients.add(websocket)
    
    try:
        logger.info("✅ Alert WebSocket connected")
        
        while True:
            # This will receive alerts from the background task
            await asyncio.sleep(1)
    except Exception as e:
        logger.error(f"Alert WebSocket error: {e}")
    finally:
        connected_clients.discard(websocket)
        logger.info("❌ Alert WebSocket disconnected")


# ============================================
# BACKGROUND TASKS
# ============================================

async def background_data_collection():
    """Continuously collect sensor data from external sources"""
    while True:
        try:
            logger.info("📊 Collecting external environmental data...")
            
            # Fetch from external APIs
            weather_data = await api_manager. fetch_weather()
            air_quality_data = await api_manager.fetch_air_quality()
            water_level_data = await api_manager. fetch_water_levels()
            
            # Simulate IoT sensors
            iot_data = sensor_manager.simulate_iot_data()
            
            # Combine and save
            all_data = {
                **weather_data,
                **air_quality_data,
                **water_level_data,
                **iot_data
            }
            
            save_sensor_data(all_data)
            
            # Broadcast to clients
            await broadcast_update({
                "type": "sensor_update",
                "data": all_data,
                "timestamp": datetime.utcnow().isoformat()
            })
            
            await asyncio.sleep(60)  # Collect every minute
            
        except Exception as e:
            logger.error(f"Error in background data collection:  {e}")
            await asyncio.sleep(60)


async def background_prediction_loop():
    """Continuously run predictions and generate alerts"""
    while True: 
        try:
            logger.info("🤖 Running AI predictions...")
            
            # Get latest sensor data
            sensor_data = get_latest_sensor_data()
            
            if sensor_data:
                for location_data in sensor_data:
                    # Run all predictions
                    flood_risk = flood_predictor.predict(location_data)
                    fire_risk = fire_predictor. predict(location_data)
                    pollution_risk = pollution_predictor.predict(location_data)
                    
                    # Check against alert rules
                    alerts_triggered = alert_rules.evaluate(
                        location_data,
                        flood_risk,
                        fire_risk,
                        pollution_risk
                    )
                    
                    # Send alerts if triggered
                    for alert in alerts_triggered:
                        await alert_engine.send_alert(alert)
                        await broadcast_alert(alert)
            
            await asyncio.sleep(300)  # Run predictions every 5 minutes
            
        except Exception as e:
            logger.error(f"Error in prediction loop: {e}")
            await asyncio.sleep(300)


async def broadcast_update(message: dict):
    """Broadcast data update to all connected WebSocket clients"""
    if connected_clients:
        disconnected = set()
        for client in connected_clients:
            try:
                await client.send_json(message)
            except Exception: 
                disconnected.add(client)
        
        for client in disconnected:
            connected_clients.discard(client)


async def broadcast_alert(alert: dict):
    """Broadcast alert to all connected WebSocket clients"""
    message = {
        "type": "alert",
        "data": alert,
        "timestamp":  datetime.utcnow().isoformat()
    }
    await broadcast_update(message)


# ============================================
# EXTERNAL DATA ENDPOINTS (for testing)
# ============================================

@app.get("/api/v1/external/weather")
async def get_weather():
    """Fetch weather data from external API"""
    try:
        data = await api_manager.fetch_weather()
        return {"status": "success", "data":  data}
    except Exception as e: 
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/external/air-quality")
async def get_air_quality():
    """Fetch air quality data from external API"""
    try:
        data = await api_manager.fetch_air_quality()
        return {"status": "success", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__": 
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
