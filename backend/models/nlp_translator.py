"""
NLP Translator - Converts raw AI predictions into human-readable alerts
GPT-style text generation for disaster predictions
"""

import logging
from typing import Dict

logger = logging.getLogger(__name__)


class NLPTranslator:
    """
    Translates AI predictions into human-readable, actionable language
    """
    
    def __init__(self):
        self.model_name = "NLP Translator v1"
        self.is_trained = True
        logger.info(f"✅ {self.model_name} initialized")
    
    def is_ready(self) -> bool:
        """Check if model is ready"""
        return self.is_trained
    
    def translate_prediction(self, prediction_type: str, prediction:  dict) -> str:
        """
        Translate prediction to human-readable format
        
        Args:
            prediction_type:  "flood", "fire", or "pollution"
            prediction: Dict with risk_score, time_to_event, factors, etc.
        
        Returns:
            Human-readable alert string
        """
        try: 
            if prediction_type == "flood": 
                return self._translate_flood(prediction)
            elif prediction_type == "fire":
                return self._translate_fire(prediction)
            elif prediction_type == "pollution":
                return self._translate_pollution(prediction)
            else:
                return "Unable to translate prediction."
        
        except Exception as e:
            logger.error(f"Error translating prediction: {e}")
            return "An error occurred while processing the prediction."
    
    @staticmethod
    def _translate_flood(prediction: dict) -> str:
        """Generate human-readable flood alert"""
        risk = prediction.get("risk_score", 0)
        time_to_event = prediction.get("time_to_event_hours", 0)
        factors = prediction.get("factors", {})
        
        water_level = factors.get("water_level_m", 0)
        rainfall = factors.get("rainfall_mm_h", 0)
        proximity = factors.get("proximity_to_river_m", 0)
        
        if risk > 80:
            alert = f"🌊 CRITICAL FLOOD WARNING: "
            alert += f"Rising water levels ({water_level}m) with heavy rainfall ({rainfall}mm/h) "
            alert += f"suggest a {risk:. 0f}% chance of flooding in {time_to_event:. 0f} hours.  "
            alert += "IMMEDIATELY evacuate low-lying areas.  Move to higher ground.  Follow official evacuation orders."
        
        elif risk > 60:
            alert = f"⚠️ FLOOD ALERT: "
            alert += f"Water levels at {water_level}m with rainfall patterns indicate potential flooding "
            alert += f"within {time_to_event:.0f} hours ({risk:.0f}% probability). "
            alert += "Prepare to evacuate. Monitor updates closely.  Move valuables to upper floors."
        
        elif risk > 40:
            alert = f"ℹ️ FLOOD WATCH: "
            alert += f"Water levels rising ({water_level}m). Monitor nearby rivers and streams. "
            alert += f"Possible flooding within {time_to_event:.0f} hours ({risk:.0f}% risk). "
            alert += "Prepare emergency supplies and have evacuation plans ready."
        
        else:
            alert = f"📊 FLOOD ADVISORY: "
            alert += f"Water levels normal ({water_level}m) but monitoring conditions.  "
            alert += "No immediate flood risk detected."
        
        return alert
    
    @staticmethod
    def _translate_fire(prediction: dict) -> str:
        """Generate human-readable fire alert"""
        risk = prediction.get("risk_score", 0)
        time_to_event = prediction.get("time_to_event_hours", 0)
        factors = prediction.get("factors", {})
        
        temp = factors.get("temperature_c", 0)
        humidity = factors.get("humidity_percent", 0)
        wind = factors.get("wind_speed_kmh", 0)
        
        if risk > 80:
            alert = f"🔥 EXTREME FIRE WARNING: "
            alert += f"Critical fire conditions with {temp}°C heat, {humidity}% humidity, "
            alert += f"and {wind}km/h winds.  {risk:.0f}% risk of rapid fire spread within {time_to_event:.0f} hours. "
            alert += "EVACUATE IMMEDIATELY. Close all windows.  Use designated evacuation routes."
        
        elif risk > 60:
            alert = f"🟠 FIRE ALERT: "
            alert += f"Very high fire risk with temperature at {temp}°C and {wind}km/h winds. "
            alert += f"{risk:.0f}% probability of fire within {time_to_event:.0f} hours. "
            alert += "Prepare for possible evacuation. Have emergency kit ready. Watch for smoke."
        
        elif risk > 40:
            alert = f"🟡 FIRE WATCH: "
            alert += f"Elevated fire risk conditions ({temp}°C, {wind}km/h winds, {humidity}% humidity). "
            alert += f"Potential fire risk within {time_to_event:. 0f} hours ({risk:.0f}%). "
            alert += "Avoid outdoor burning. Keep fire extinguishers accessible."
        
        else:
            alert = f"ℹ️ FIRE ADVISORY: "
            alert += f"Current fire risk is low ({risk:.0f}%). Conditions favorable ({temp}°C, {humidity}% humidity)."
        
        return alert
    
    @staticmethod
    def _translate_pollution(prediction:  dict) -> str:
        """Generate human-readable pollution alert"""
        aqi = prediction.get("aqi", 0)
        category = prediction.get("aqi_category", "Unknown")
        health_advisory = prediction.get("health_advisory", "")
        pollutants = prediction.get("pollutants", {})
        
        pm25 = pollutants.get("pm25_ug_m3", 0)
        
        if aqi > 300:
            alert = f"🔴 HAZARDOUS AIR QUALITY (AQI: {aqi:. 0f}): "
            alert += f"PM2.5 levels critical at {pm25}µg/m³. {health_advisory} "
            alert += "Wear N95 masks if outside. Use air purifiers indoors. Limit outdoor exposure."
        
        elif aqi > 200:
            alert = f"🔴 VERY UNHEALTHY AIR (AQI: {aqi:. 0f}): "
            alert += f"PM2.5 dangerous at {pm25}µg/m³. {health_advisory} "
            alert += "Everyone should reduce outdoor activities."
        
        elif aqi > 150:
            alert = f"🟠 UNHEALTHY AIR (AQI: {aqi:.0f}): "
            alert += f"PM2.5 at {pm25}µg/m³.  Sensitive groups should limit outdoor activities.  "
            alert += health_advisory
        
        elif aqi > 100:
            alert = f"🟡 MODERATE AIR QUALITY (AQI: {aqi:.0f}): "
            alert += f"PM2.5 at {pm25}µg/m³. Acceptable, but sensitive groups may feel effects. "
            alert += health_advisory
        
        else:
            alert = f"🟢 GOOD AIR QUALITY (AQI: {aqi:.0f}): "
            alert += f"PM2.5 low at {pm25}µg/m³. Safe for outdoor activities."
        
        return alert
    
    def generate_community_report(self, location:  str, predictions: dict) -> str:
        """
        Generate a comprehensive community report combining all predictions
        """
        flood_alert = self._translate_flood(predictions. get("flood", {}))
        fire_alert = self._translate_fire(predictions.get("fire", {}))
        pollution_alert = self._translate_pollution(predictions. get("pollution", {}))
        
        report = f"""
        ═══════════════════════════════════════════════════
        🛡️ AI-GUARDIAN HAZARD REPORT
        Location: {location}
        Generated: {NLPTranslator._get_timestamp()}
        ═══════════════════════════════════════════════════
        
        {flood_alert}
        
        {fire_alert}
        
        {pollution_alert}
        
        ═══════════════════════════════════════════════════
        For more information: Visit your local emergency services website
        Download the AI-Guardian app for real-time personalized alerts
        ═══════════════════════════════════════════════════
        """
        
        return report
    
    @staticmethod
    def _get_timestamp() -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime. utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
