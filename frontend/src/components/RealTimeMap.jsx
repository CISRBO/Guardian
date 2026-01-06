import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Flame, Wind } from "lucide-react";

export default function RealTimeMap() {
  const mapRef = useRef(null);

  // Sample sensor locations
  const sensors = [
    {
      id: 1,
      name: "River Valley",
      lat: 40.7128,
      lng: -74.006,
      type: "flood",
      risk: 45,
    },
    {
      id:  2,
      name: "Forest Zone A",
      lat: 41.8781,
      lng: -87.6298,
      type: "fire",
      risk: 62,
    },
    {
      id: 3,
      name: "Urban Center",
      lat: 34.0522,
      lng: -118.2437,
      type: "pollution",
      risk: 58,
    },
    {
      id: 4,
      name: "Coastal Region",
      lat: 37.7749,
      lng: -122.4194,
      type: "flood",
      risk:  28,
    },
    {
      id: 5,
      name: "Mountain Region",
      lat: 39.7392,
      lng: -104.9903,
      type: "fire",
      risk: 35,
    },
  ];

  useEffect(() => {
    // Initialize Mapbox or similar here
    // For now, render a canvas-based map visualization
    if (mapRef.current) {
      // Map initialization code
    }
  }, []);

  const getIcon = (type) => {
    const icons = {
      flood:  Droplets,
      fire:  Flame,
      pollution: Wind,
    };
    return icons[type] || AlertTriangle;
  };

  const getRiskColor = (risk) => {
    if (risk > 60) return "bg-red-500 border-red-400";
    if (risk > 40) return "bg-orange-500 border-orange-400";
    return "bg-yellow-500 border-yellow-400";
  };

  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <div
        ref={mapRef}
        className="w-full h-96 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden relative"
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Sensor Points */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="100%" height="100%" className="absolute">
            {sensors.map((sensor) => {
              const x = ((sensor.lng + 180) / 360) * 100;
              const y = ((sensor.lat + 90) / 180) * 100;
              return (
                <motion.g key={sensor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Pulse ring */}
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="30"
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.2)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </motion.g>
              );
            })}
          </svg>

          {/* Sensor Cards Overlay */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 p-4">
            {sensors.map((sensor) => {
              const Icon = getIcon(sensor.type);
              return (
                <motion.div
                  key={sensor.id}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full glass-sm ${getRiskColor(sensor.risk)} backdrop-blur-sm cursor-pointer`}
                >
                  <Icon size={16} className="text-white" />
                  <span className="text-xs font-semibold text-white">
                    {sensor.name}:  {sensor.risk}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sensor Legend */}
      <div className="grid grid-cols-3 gap-3">
        {["flood", "fire", "pollution"].map((type) => {
          const Icon = getIcon(type);
          return (
            <div key={type} className="glass p-3 rounded-lg flex items-center gap-2">
              <Icon className="text-primary-400" size={20} />
              <span className="text-sm font-medium text-neutral-300 capitalize">
                {type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
