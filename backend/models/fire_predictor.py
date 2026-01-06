"""
Forest Fire Risk Prediction Model
Uses temperature, humidity, wind speed, vegetation data
"""

import numpy as np
import logging

logger = logging.getLogger(__name__)


class FirePredictor:
    """
    Predicts forest fire risk using Fire Weather Index (FWI) calculations
    """
    
    def __init__(self):
        self.model_name = "Fire Risk Predictor v1"
        self.is_trained = True
        logger.info(f"✅ {self.model_name} initialized")
    
    def is_ready(self) -> bool:
        """Check if model is ready"""
        return self.is_trained
    
    def predict(self, location_data: dict) -> dict:
        """
        Predict fire risk using FWI-like calculation
        
        Args: 
            location_data: Dict with temperature, humidity, wind_speed, etc.
        
        Returns:
            Dict with risk_score, confidence, time_to_event_hours
        """
        try: 
            # Extract features
            temperature = location_data.get("temperature", 25)  # Celsius
            humidity = location_data.get("humidity", 50)  # Percent
            wind_speed = location_data.get("wind_speed", 5)  # km/h
            rainfall_last_24h = location_data.get("rainfall_last_24h", 0)  # mm
            vegetation_type = location_data.get("vegetation_type", "grassland")
            
            # FWI-like calculation
            base_score = 0.0
            
            # Temperature contribution (critical > 35°C)
            temp_score = max(0, (temperature - 10) / 40.0) * 0.35
            
            # Humidity contribution (dry = high risk, < 30% is critical)
            humidity_score = max(0, (100 - humidity) / 100.0) * 0.3
            
            # Wind speed contribution (high wind spreads fire)
            wind_score = min(wind_speed / 30.0, 1.0) * 0.25
            
            # Recent rainfall (less rainfall = higher risk)
            rainfall_score = max(0, (50 - rainfall_last_24h) / 50.0) * 0.1
            
            # Vegetation type adjustment
            veg_multiplier = {
                "grassland": 1.2,
                "shrubland": 1.3,
                "forest": 1.0,
                "urban": 0.5,
                "water": 0.0
            }. get(vegetation_type, 1.0)
            
            # Combine scores
            risk_score = (
                temp_score +
                humidity_score +
                wind_score +
                rainfall_score
            ) * veg_multiplier
            risk_score = min(risk_score, 1.0)
            
            # Confidence
            confidence = 0.8
            
            # Time to event
            if risk_score > 0.8:
                time_to_event = np.random.uniform(1, 4)  # hours
            elif risk_score > 0.6:
                time_to_event = np.random. uniform(4, 12)
            elif risk_score > 0.4:
                time_to_event = np.random.uniform(12, 48)
            else:
                time_to_event = 168
            
            return {
                "risk_score": float(round(risk_score * 100, 2)),
                "confidence": float(confidence * 100),
                "time_to_event_hours": float(round(time_to_event, 1)),
                "status": self._get_risk_status(risk_score),
                "factors": {
                    "temperature_c": temperature,
                    "humidity_percent": humidity,
                    "wind_speed_kmh": wind_speed,
                    "rainfall_last_24h_mm": rainfall_last_24h,
                    "vegetation_type": vegetation_type
                }
            }
        
        except Exception as e:
            logger.error(f"Error in fire prediction:  {e}")
            return {
                "risk_score": 0.0,
                "confidence":  0.0,
                "time_to_event_hours":  0.0,
                "status": "error",
                "error": str(e)
            }
    
    def _get_risk_status(self, score: float) -> str:
        """Convert score to status"""
        if score > 0.8:
            return "🔴 EXTREME"
        elif score > 0.6:
            return "🟠 VERY HIGH"
        elif score > 0.4:
            return "🟡 HIGH"
        elif score > 0.2:
            return "🟢 MODERATE"
        else: 
            return "⚪ LOW"
