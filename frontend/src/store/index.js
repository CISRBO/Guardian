import { create } from "zustand";

const initialAlerts = [
  {
    id: 1,
    type: "flood",
    location: "River Valley",
    severity: "critical",
    message: "Rising water levels detected",
    humanReadable: "Rising water levels (2. 5m) with heavy rainfall (15mm/h) suggest a 78% chance of flooding in 4 hours.  IMMEDIATELY evacuate low-lying areas.",
    createdAt: "2 min ago",
  },
  {
    id: 2,
    type: "fire",
    location: "Forest Zone A",
    severity: "high",
    message: "Very high fire risk conditions",
    humanReadable: "Very high fire risk with temperature at 38°C and 25km/h winds. 65% probability of fire within 6 hours.",
    createdAt: "15 min ago",
  },
  {
    id: 3,
    type: "pollution",
    location: "Urban Center",
    severity: "moderate",
    message: "Air quality degrading",
    humanReadable: "PM2.5 at 95µg/m³.  Acceptable, but sensitive groups may feel effects.",
    createdAt: "1 hour ago",
  },
];

const initialSensorData = [
  {
    sensorId: "sensor_001",
    location: "River Valley",
    temperature: 22,
    humidity: 65,
    waterLevel: 2.3,
    rainfall: 12,
  },
  {
    sensorId: "sensor_002",
    location: "Forest Zone A",
    temperature: 38,
    humidity: 28,
    windSpeed: 25,
    smokeLe vel: 0,
  },
  {
    sensorId: "sensor_003",
    location: "Urban Center",
    pm25: 95,
    aqi: 78,
    temperature: 26,
    humidity: 45,
  },
];

export const useStore = create((set) => ({
  // State
  alerts: initialAlerts,
  sensorData: initialSensorData,
  isConnected: false,

  // Actions
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),

  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts. filter((a) => a.id !== id),
    })),

  updateSensorData: (data) =>
    set(() => ({
      sensorData:  data,
    })),

  setConnected: (isConnected) =>
    set(() => ({
      isConnected,
    })),

  clearAlerts: () =>
    set(() => ({
      alerts: [],
    })),
}));
