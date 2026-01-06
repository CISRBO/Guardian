import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, AlertTriangle, Wind, Droplets, Flame, Eye, Gauge, MapPin } from "lucide-react";
import MetricCard from "../components/MetricCard";
import RealTimeMap from "../components/RealTimeMap";
import AlertBanner from "../components/AlertBanner";
import ChartContainer from "../components/ChartContainer";
import Header from "../components/Header";
import { useStore } from "../store";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { sensorData, alerts } = useStore();
  
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-gradient-to-b from-neutral-950 to-neutral-900 min-h-screen">
      {/* Header */}
      <Header title="Dashboard" subtitle="Real-time environmental monitoring" />

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-3">
          {criticalAlerts.map((alert) => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </motion.div>
      )}

      {/* Main Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Flood Risk */}
        <MetricCard
          icon={Droplets}
          label="Flood Risk"
          value="45%"
          status="moderate"
          trend="+12%"
          color="blue"
        />

        {/* Fire Risk */}
        <MetricCard
          icon={Flame}
          label="Fire Risk"
          value="62%"
          status="high"
          trend="+8%"
          color="red"
        />

        {/* Air Quality */}
        <MetricCard
          icon={Eye}
          label="Air Quality (AQI)"
          value="78"
          status="moderate"
          trend="-3%"
          color="orange"
        />

        {/* Pollution Level */}
        <MetricCard
          icon={Wind}
          label="Pollution Level"
          value="PM 2.5: 32"
          status="good"
          trend="-5%"
          color="green"
        />
      </motion.div>

      {/* Detailed Metrics */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Water Level Chart */}
        <ChartContainer
          title="Water Level Trends"
          icon={Droplets}
          type="line"
        />

        {/* Temperature Chart */}
        <ChartContainer
          title="Temperature & Humidity"
          icon={Gauge}
          type="area"
        />

        {/* Wind Speed Chart */}
        <ChartContainer
          title="Wind Speed Analysis"
          icon={Wind}
          type="bar"
        />
      </motion.div>

      {/* Map Section */}
      <motion.div variants={itemVariants} className="glass-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="text-primary-400" size={24} />
          <h2 className="text-2xl font-display font-bold">Real-Time Monitoring Map</h2>
        </div>
        <RealTimeMap />
      </motion.div>

      {/* Recent Alerts Table */}
      <motion.div variants={itemVariants} className="glass-lg p-6">
        <h2 className="text-xl font-display font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 glass rounded-lg hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getBgColor(alert.type)}`}>
                  {getIcon(alert.type)}
                </div>
                <div>
                  <p className="font-semibold text-white">{alert.type. toUpperCase()}</p>
                  <p className="text-sm text-neutral-400">{alert.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={getBadgeClass(alert.severity)}>
                  {alert.severity}
                </span>
                <p className="text-xs text-neutral-500 mt-1">{alert.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function getBgColor(type) {
  const colors = {
    flood: "bg-blue-500/20",
    fire: "bg-red-500/20",
    pollution: "bg-yellow-500/20",
  };
  return colors[type] || "bg-primary-500/20";
}

function getIcon(type) {
  const icons = {
    flood: <Droplets className="text-blue-400" />,
    fire: <Flame className="text-red-400" />,
    pollution: <Wind className="text-yellow-400" />,
  };
  return icons[type] || <AlertTriangle />;
}

function getBadgeClass(severity) {
  const classes = {
    critical: "badge-danger",
    high: "badge-warning",
    moderate: "badge-info",
    low: "badge-success",
  };
  return classes[severity] || "badge-info";
}
