import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Droplets,
  Flame,
  Wind,
  MapPin,
  RefreshCw,
  Zap,
} from "lucide-react";
import Header from "../components/Header";
import ChartContainer from "../components/ChartContainer";
import axios from "axios";
import toast from "react-hot-toast";

const locations = [
  { id: 1, name: "River Valley", lat: 40.7128, lng: -74.006 },
  { id:  2, name: "Forest Zone A", lat: 41.8781, lng: -87.6298 },
  { id:  3, name: "Urban Center", lat: 34.0522, lng: -118.2437 },
  { id: 4, name: "Coastal Region", lat: 37.7749, lng: -122.4194 },
  { id:  5, name: "Mountain Region", lat: 39.7392, lng: -104.9903 },
];

export default function PredictionsPage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState({
    flood: { risk_score: 45, confidence: 85, time_to_event_hours: 8 },
    fire: { risk_score: 62, confidence: 80, time_to_event_hours: 12 },
    pollution: { aqi: 78, aqi_category: "Moderate", confidence: 75 },
  });

  const runPredictions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/predictions/all",
        {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lng,
          location:  selectedLocation.name,
        }
      );

      setPredictions(response.data. predictions);
      toast.success("Predictions updated!");
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast.error("Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  };

  const PredictionCard = ({ icon: Icon, title, value, subtitle, status }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-lg p-6 rounded-xl space-y-4 border-l-4 border-primary-500"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-neutral-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-4xl font-display font-bold text-white">{value}</p>
        </div>
        <Icon className="text-primary-400" size={32} />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-neutral-300">{subtitle}</p>
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            status === "critical" ? "text-red-400" : 
            status === "high" ? "text-orange-400" :
            status === "moderate" ? "text-yellow-400" :
            "text-green-400"
          }`}>
            {status}
          </span>
          <Zap size={16} className="text-yellow-400" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen">
      <Header title="AI Predictions" subtitle="Real-time hazard forecasting" />

      {/* Location Selector */}
      <motion. div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        className="glass-lg p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="flex-1">
            <label className="block text-sm text-neutral-400 mb-3 font-medium">
              📍 Select Location
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {locations.map((loc) => (
                <motion.button
                  key={loc.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedLocation. id === loc.id
                      ? "bg-primary-600 text-white shadow-glow"
                      : "glass hover:bg-white/15"
                  }`}
                >
                  {loc.name. split(" ")[0]}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale:  0.95 }}
            onClick={runPredictions}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            {loading ? "Running..." : "Run Predictions"}
          </motion.button>
        </div>

        {/* Location Info */}
        <div className="mt-4 p-4 glass rounded-lg">
          <p className="text-neutral-300">
            <span className="font-semibold">{selectedLocation.name}</span> •
            <span className="text-neutral-500 ml-2">
              {selectedLocation.lat. toFixed(4)}°, {selectedLocation.lng.toFixed(4)}°
            </span>
          </p>
        </div>
      </motion. div>

      {/* Predictions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 md: grid-cols-3 gap-4"
      >
        <PredictionCard
          icon={Droplets}
          title="Flood Risk"
          value={`${predictions.flood.risk_score}%`}
          subtitle={`Confidence: ${predictions.flood.confidence}% • ETA: ${predictions.flood.time_to_event_hours}h`}
          status={predictions.flood.risk_score > 60 ? "high" : "moderate"}
        />

        <PredictionCard
          icon={Flame}
          title="Fire Risk"
          value={`${predictions.fire.risk_score}%`}
          subtitle={`Confidence: ${predictions.fire.confidence}% • ETA: ${predictions.fire.time_to_event_hours}h`}
          status={predictions.fire.risk_score > 60 ? "high" : "moderate"}
        />

        <PredictionCard
          icon={Wind}
          title="Air Quality"
          value={`${predictions.pollution.aqi}`}
          subtitle={`${predictions.pollution.aqi_category}`}
          status="moderate"
        />
      </motion.div>

      {/* Detailed Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y:  0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <ChartContainer
          title="Flood Risk Progression"
          icon={Droplets}
          type="line"
        />
        <ChartContainer
          title="Fire Risk Trend"
          icon={Flame}
          type="area"
        />
        <ChartContainer
          title="Air Quality Index"
          icon={Wind}
          type="bar"
        />
        <ChartContainer
          title="Environmental Factors"
          icon={TrendingUp}
          type="line"
        />
      </motion.div>

      {/* Detailed Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-lg p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-display font-bold mb-6">Detailed Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flood Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2">
              <Droplets size={20} />
              Flood Risk Analysis
            </h3>
            <div className="space-y-2 text-neutral-300 text-sm">
              <p>• Water level:  2. 5m (Critical threshold:  3. 0m)</p>
              <p>• Recent rainfall: 15mm/h (Heavy)</p>
              <p>• Terrain slope: 5° (Flat terrain increases risk)</p>
              <p>• Soil saturation: 75% (Very high)</p>
              <p className="text-yellow-300 font-semibold mt-3">
                ⚠️ Recommendation: Monitor closely.  Evacuate if levels rise further.
              </p>
            </div>
          </div>

          {/* Fire Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-red-300 flex items-center gap-2">
              <Flame size={20} />
              Fire Risk Analysis
            </h3>
            <div className="space-y-2 text-neutral-300 text-sm">
              <p>• Temperature: 38°C (Very high)</p>
              <p>• Humidity: 28% (Very dry - high fire risk)</p>
              <p>• Wind speed: 25km/h (Spreads fire rapidly)</p>
              <p>• Recent rainfall: 0mm (Vegetation very dry)</p>
              <p className="text-orange-300 font-semibold mt-3">
                ⚠️ Recommendation: High alert.  Prepare evacuation routes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
