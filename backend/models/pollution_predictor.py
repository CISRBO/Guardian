"""
Air Pollution Risk Prediction Model
Uses particulate matter, gas levels, weather data
"""

import logging

logger = logging.getLogger(__name__)


class PollutionPredictor:
    """
    Predicts air pollution levels (AQI) and health impacts
    """
    
    def __init__(self):
        self.model_name = "Pollution Predictor v1"
        self.is_trained = True
        logger.info(f"✅ {self.model_name} initialized")
    
    def is_ready(self) -> bool:
        """Check if model is ready"""
        return self. is_trained
    
    def predict(self, location_data:  dict) -> dict:
        """
        Predict air pollution levels
        
        Args:
            location_data: Dict with PM2.5, PM10, NO2, O3, CO, etc.
        
        Returns:
            Dict with AQI, pollutants, health_advisory
        """
        try:
            # Extract features
            pm25 = location_data.get("pm25", 25)  # µg/m³
            pm10 = location_data.get("pm10", 40)  # µg/m³
            no2 = location_data.get("no2", 30)  # ppb
            o3 = location_data.get("o3", 50)  # ppb
            co = location_data.get("co", 1. 0)  # ppm
            wind_speed = location_data.get("wind_speed", 5)  # km/h
            
            # Calculate AQI components using EPA breakpoints
            pm25_aqi = self._calculate_pm25_aqi(pm25)
            pm10_aqi = self._calculate_pm10_aqi(pm10)
            no2_aqi = self._calculate_no2_aqi(no2)
            o3_aqi = self._calculate_o3_aqi(o3)
            co_aqi = self._calculate_co_aqi(co)
            
            # Overall AQI is the maximum of all components
            aqi = max(pm25_aqi, pm10_aqi, no2_aqi, o3_aqi, co_aqi)
            
            # Wind effect - high wind disperses pollution
            wind_factor = max(0.5, 1.0 - (wind_speed / 20.0))
            aqi = aqi * wind_factor
            
            return {
                "aqi": float(round(aqi, 1)),
                "aqi_category": self._get_aqi_category(aqi),
                "health_advisory": self._get_health_advisory(aqi),
                "confidence": 0.75,
                "pollutants": {
                    "pm25_ug_m3": pm25,
                    "pm25_aqi": float(round(pm25_aqi, 1)),
                    "pm10_ug_m3": pm10,
                    "pm10_aqi": float(round(pm10_aqi, 1)),
                    "no2_ppb": no2,
                    "no2_aqi": float(round(no2_aqi, 1)),
                    "o3_ppb": o3,
                    "o3_aqi": float(round(o3_aqi, 1)),
                    "co_ppm": co,
                    "co_aqi": float(round(co_aqi, 1))
                },
                "factors": {
                    "wind_speed_kmh": wind_speed,
                    "wind_dispersion_factor": float(round(wind_factor, 2))
                }
            }
        
        except Exception as e: 
            logger.error(f"Error in pollution prediction: {e}")
            return {
                "aqi": 0.0,
                "aqi_category": "error",
                "health_advisory":  "Unable to calculate AQI",
                "error": str(e)
            }
    
    @staticmethod
    def _calculate_pm25_aqi(pm25: float) -> float:
        """Calculate AQI for PM2.5"""
        breakpoints = [
            (0, 12, 0, 50),
            (12.1, 35. 4, 51, 100),
            (35.5, 55.4, 101, 150),
            (55.5, 150.4, 151, 200),
            (150.5, 250.4, 201, 300),
            (250.5, 500, 301, 500),
        ]
        
        for bp_lo, bp_hi, aqi_lo, aqi_hi in breakpoints:
            if bp_lo <= pm25 <= bp_hi:
                return aqi_lo + (pm25 - bp_lo) / (bp_hi - bp_lo) * (aqi_hi - aqi_lo)
        
        return 500.0
    
    @staticmethod
    def _calculate_pm10_aqi(pm10: float) -> float:
        """Calculate AQI for PM10"""
        breakpoints = [
            (0, 54, 0, 50),
            (55, 154, 51, 100),
            (155, 254, 101, 150),
            (255, 354, 151, 200),
            (355, 424, 201, 300),
            (425, 604, 301, 500),
        ]
        
        for bp_lo, bp_hi, aqi_lo, aqi_hi in breakpoints: 
            if bp_lo <= pm10 <= bp_hi:
                return aqi_lo + (pm10 - bp_lo) / (bp_hi - bp_lo) * (aqi_hi - aqi_lo)
        
        return 500.0
    
    @staticmethod
    def _calculate_no2_aqi(no2: float) -> float:
        """Calculate AQI for NO2"""
        breakpoints = [
            (0, 53, 0, 50),
            (54, 100, 51, 100),
            (101, 360, 101, 150),
            (361, 649, 151, 200),
            (650, 1249, 201, 300),
            (1250, 2049, 301, 500),
        ]
        
        for bp_lo, bp_hi, aqi_lo, aqi_hi in breakpoints:
            if bp_lo <= no2 <= bp_hi:
                return aqi_lo + (no2 - bp_lo) / (bp_hi - bp_lo) * (aqi_hi - aqi_lo)
        
        return 500.0
    
    @staticmethod
    def _calculate_o3_aqi(o3: float) -> float:
        """Calculate AQI for O3"""
        # 1-hour O3
        breakpoints = [
            (0, 54, 0, 50),
            (55, 70, 51, 100),
            (71, 85, 101, 150),
            (86, 105, 151, 200),
            (106, 200, 201, 300),
            (201, 604, 301, 500),
        ]
        
        for bp_lo, bp_hi, aqi_lo, aqi_hi in breakpoints:
            if bp_lo <= o3 <= bp_hi:
                return aqi_lo + (o3 - bp_lo) / (bp_hi - bp_lo) * (aqi_hi - aqi_lo)
        
        return 500.0
    
    @staticmethod
    def _calculate_co_aqi(co: float) -> float:
        """Calculate AQI for CO"""
        breakpoints = [
            (0, 4. 4, 0, 50),
            (4.5, 9.4, 51, 100),
            (9.5, 12.4, 101, 150),
            (12.5, 15.4, 151, 200),
            (15.5, 30.4, 201, 300),
            (30.5, 50.4, 301, 500),
        ]
        
        for bp_lo, bp_hi, aqi_lo, aqi_hi in breakpoints:
            if bp_lo <= co <= bp_hi:
                return aqi_lo + (co - bp_lo) / (bp_hi - bp_lo) * (aqi_hi - aqi_lo)
        
        return 500.0
    
    @staticmethod
    def _get_aqi_category(aqi: float) -> str:
        """Get AQI category"""
        if aqi <= 50:
            return "🟢 Good"
        elif aqi <= 100:
            return "🟡 Moderate"
        elif aqi <= 150:
            return "🟠 Unhealthy for Sensitive Groups"
        elif aqi <= 200:
            return "🔴 Unhealthy"
        elif aqi <= 300:
            return "🔴 Very Unhealthy"
        else:
            return "🔴 Hazardous"
    
    @staticmethod
    def _get_health_advisory(aqi: float) -> str:
        """Get health advisory based on AQI"""
        if aqi <= 50:
            return "Air quality is satisfactory. Outdoor activities are safe."
        elif aqi <= 100:
            return "Air quality is acceptable. Hypersensitive people should limit outdoor activities."
        elif aqi <= 150:
            return "Sensitive groups may experience respiratory symptoms. Consider staying indoors."
        elif aqi <= 200:
            return "Everyone may begin to experience health effects. Reduce outdoor activities."
        elif aqi <= 300:
            return "Everyone should avoid outdoor activities. Consider staying indoors with air purifiers."
        else:
            return "EMERGENCY: Stay indoors. Avoid outdoor activities entirely.  Seek medical attention if experiencing symptoms."
