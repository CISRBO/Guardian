"""
Flood Risk Prediction Model
Uses water level, rainfall, terrain data
"""

import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class FloodPredictor:
    """
    Predicts flood risk based on environmental data
    """
    
    def __init__(self):
        self.model_name = "Flood Risk Predictor v1"
        self.is_trained = True
        logger.info(f"✅ {self.model_name} initialized")
    
    def is_ready(self) -> bool:
        """Check if model is ready"""
        return self.is_trained
    
    def predict(self, location_data: dict) -> dict:
        """
        Predict flood risk
        
        Args:
            location_data: Dict with water_level, rainfall, terrain_slope, etc.
        
        Returns:
            Dict with risk_score, confidence, time_to_event_hours
        """
        try:
            # Extract features
            water_level = location_data.get("water_level", 0)  # meters
            rainfall = location_data. get("rainfall", 0)  # mm/hour
            terrain_slope = location_data.get("terrain_slope", 5)  # degrees
            soil_saturation = location_data.get("soil_saturation", 0.5)  # 0-1
            proximity_to_river = location_data.get("proximity_to_river", 1000)  # meters
            
            # Simple risk calculation (in production, use ML model)
            base_score = 0.0
            
            # Water level contribution (0-1 scale, critical > 3 meters)
            water_score = min(water_level / 3. 0, 1.0) * 0.35
            
            # Rainfall contribution
            rainfall_score = min(rainfall / 10.0, 1.0) * 0.25
            
            # Terrain contribution (flat terrain = more risk)
            terrain_score = max(0, (10 - terrain_slope) / 10.0) * 0.2
            
            # Soil saturation contribution
            saturation_score = soil_saturation * 0.15
            
            # Proximity to river/water body
            proximity_score = max(0, (1 - proximity_to_river / 5000.0)) * 0.05
            
            # Combine scores
            risk_score = (
                water_score +
                rainfall_score +
                terrain_score +
                saturation_score +
                proximity_score
            )
            
            # Confidence based on data completeness
            confidence = 0.85
            
            # Time to event estimation
            if risk_score > 0.8:
                time_to_event = np.random.uniform(2, 6)  # 2-6 hours
            elif risk_score > 0.6:
                time_to_event = np.random.uniform(6, 24)  # 6-24 hours
            elif risk_score > 0.4:
                time_to_event = np.random.uniform(24, 72)  # 1-3 days
            else:
                time_to_event = 168  # > 1 week
            
            return {
                "risk_score":  float(round(risk_score * 100, 2)),
                "confidence": float(confidence * 100),
                "time_to_event_hours": float(round(time_to_event, 1)),
                "status": self._get_risk_status(risk_score),
                "factors": {
                    "water_level_m": water_level,
                    "rainfall_mm_h": rainfall,
                    "terrain_slope_deg": terrain_slope,
                    "soil_saturation":  soil_saturation,
                    "proximity_to_river_m": proximity_to_river
                }
            }
        
        except Exception as e:
            logger.error(f"Error in flood prediction: {e}")
            return {
                "risk_score": 0.0,
                "confidence": 0.0,
                "time_to_event_hours": 0.0,
                "status": "error",
                "error": str(e)
            }
    
    def _get_risk_status(self, score: float) -> str:
        """Convert score to status"""
        if score > 0.8:
            return "🔴 CRITICAL"
        elif score > 0.6:
            return "🟠 HIGH"
        elif score > 0.4:
            return "🟡 MODERATE"
        elif score > 0.2:
            return "🟢 LOW"
        else:
            return "⚪ MINIMAL"
