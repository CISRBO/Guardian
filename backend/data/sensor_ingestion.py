"""
IoT Sensor Data Ingestion and Validation
Handles real and simulated sensor data
"""

import logging
from datetime import datetime
import random
import uuid

logger = logging.getLogger(__name__)


class SensorDataManager:
    """
    Manages IoT sensor data collection, validation, and processing
    """
    
    def __init__(self):
        self.sensors = self._initialize_sensors()
        logger.info(f"✅ SensorDataManager initialized with {len(self.sensors)} sensors")
    
    def _initialize_sensors(self) -> dict:
        """Initialize virtual sensor network"""
        sensors = {
            "sensor_001": {"location": "River Valley", "lat": 40.7128, "lon": -74.0060, "type": "water_level"},
            "sensor_002": {"location": "Forest Zone A", "lat": 41.8781, "lon": -87.6298, "type":  "fire"},
            "sensor_003": {"location": "Urban Center", "lat": 34.0522, "lon": -118.2437, "type":  "air_quality"},
            "sensor_004": {"location": "Coastal Region", "lat": 37.7749, "lon": -122.4194, "type": "weather"},
            "sensor_005":  {"location": "Mountain Region", "lat": 39.7392, "lon": -104.9903, "type": "water_level"},
        }
        return sensors
    
    def validate_and_process(self, raw_data: dict) -> dict:
        """
        Validate and process incoming sensor data
        
        Args: 
            raw_data: Raw sensor data from IoT device
        
        Returns:
            Processed and validated sensor data
        """
        try: 
            # Add metadata
            processed = {
                "id": raw_data. get("id", str(uuid. uuid4())),
                "sensor_id": raw_data.get("sensor_id"),
                "timestamp":  raw_data.get("timestamp", datetime.utcnow().isoformat()),
                "location": raw_data.get("location", "Unknown"),
                "latitude": raw_data.get("latitude", 0),
                "longitude": raw_data.get("longitude", 0),
                "sensor_type": raw_data.get("sensor_type"),
                
                # Environmental data
                "temperature": float(raw_data.get("temperature", 20)),
                "humidity": float(raw_data.get("humidity", 50)),
                "pressure": float(raw_data.get("pressure", 1013)),
                "wind_speed": float(raw_data.get("wind_speed", 5)),
                "wind_direction": raw_data.get("wind_direction", "N"),
                "rainfall": float(raw_data.get("rainfall", 0)),
                
                # Water data
                "water_level":  float(raw_data.get("water_level", 0)),
                "water_quality": raw_data.get("water_quality", "normal"),
                
                # Air quality
                "pm25": float(raw_data. get("pm25", 25)),
                "pm10": float(raw_data.get("pm10", 40)),
                "no2": float(raw_data. get("no2", 30)),
                "o3": float(raw_data.get("o3", 50)),
                "co": float(raw_data.get("co", 1.0)),
                
                # Fire sensors
                "smoke_level": float(raw_data.get("smoke_level", 0)),
                "radiation": float(raw_data.get("radiation", 0)),
                
                "status": "processed"
            }
            
            # Validation rules
            if processed["temperature"] < -50 or processed["temperature"] > 70:
                processed["status"] = "warning_invalid_temp"
            
            if processed["humidity"] < 0 or processed["humidity"] > 100:
                processed["status"] = "warning_invalid_humidity"
            
            logger.info(f"✅ Sensor data validated:  {processed['sensor_id']}")
            return processed
        
        except Exception as e: 
            logger.error(f"Error validating sensor data: {e}")
            raise ValueError(f"Sensor data validation failed: {e}")
    
    def simulate_iot_data(self) -> dict:
        """
        Simulate IoT sensor data for demo purposes
        
        Returns: 
            Dict with simulated data from multiple sensors
        """
        simulated_data = {}
        
        for sensor_id, sensor_info in self.sensors.items():
            # Simulate realistic environmental data
            sensor_data = {
                "sensor_id": sensor_id,
                "location": sensor_info["location"],
                "latitude": sensor_info["lat"],
                "longitude": sensor_info["lon"],
                "sensor_type": sensor_info["type"],
                "timestamp": datetime.utcnow().isoformat(),
                
                # Temperature:  15-35°C with seasonal variation
                "temperature": random. uniform(15, 35),
                "humidity": random.uniform(30, 90),
                "pressure": random.uniform(1000, 1030),
                "wind_speed":  random.uniform(0, 20),
                "wind_direction": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
                "rainfall": random.uniform(0, 50) if random.random() < 0.3 else 0,
                
                # Water sensors
                "water_level": random.uniform(0.5, 3.0) if sensor_info["type"] == "water_level" else 0,
                "water_quality":  random.choice(["excellent", "good", "fair", "poor"]),
                
                # Air quality sensors
                "pm25": random. uniform(10, 100),
                "pm10": random. uniform(20, 150),
                "no2": random.uniform(10, 100),
                "o3": random.uniform(30, 150),
                "co": random. uniform(0.5, 5),
                
                # Fire sensors
                "smoke_level": random. uniform(0, 10) if sensor_info["type"] == "fire" else 0,
                "radiation": random.uniform(0, 100) if sensor_info["type"] == "fire" else 0,
                
                "battery_level": random.uniform(20, 100),
                "signal_strength": random.choice([-80, -70, -60, -50])
            }
            
            simulated_data[sensor_id] = sensor_data
        
        return simulated_data
    
    def get_sensor_info(self, sensor_id: str) -> dict:
        """Get information about a specific sensor"""
        return self.sensors.get(sensor_id, {})
    
    def list_sensors(self) -> list:
        """List all available sensors"""
        return list(self. sensors.keys())
