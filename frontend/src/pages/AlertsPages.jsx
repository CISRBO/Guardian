import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Flame,
  Droplets,
  Wind,
  Filter,
  Download,
  Trash2,
} from "lucide-react";
import Header from "../components/Header";
import { useStore } from "../store";

export default function AlertsPage() {
  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const { alerts, removeAlert, clearAlerts } = useStore();

  const filteredAlerts = alerts.filter(
    (alert) =>
      (filterType === "all" || alert.type === filterType) &&
      (filterSeverity === "all" || alert.severity === filterSeverity)
  );

  const getIcon = (type) => {
    const icons = {
      flood: Droplets,
      fire: Flame,
      pollution: Wind,
    };
    return icons[type] || AlertTriangle;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-500/20 border-red-500/50 text-red-300",
      high: "bg-orange-500/20 border-orange-500/50 text-orange-300",
      moderate:  "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
      low: "bg-green-500/20 border-green-500/50 text-green-300",
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen">
      <Header title="Alerts" subtitle="Real-time emergency notifications" />

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-lg p-6 rounded-2xl"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-primary-400" />
            <h3 className="text-lg font-bold">Filter Alerts</h3>
          </div>

          <div className="flex gap-3">
            <button className="btn-glass flex items-center gap-2">
              <Download size={18} />
              Export
            </button>
            <button
              onClick={clearAlerts}
              className="btn-secondary flex items-center gap-2"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <div>
            <label className="text-sm text-neutral-400 mb-2 block">
              Alert Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="flood">Flood</option>
              <option value="fire">Fire</option>
              <option value="pollution">Pollution</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="text-sm text-neutral-400 mb-2 block">
              Severity
            </label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target. value)}
              className="input-field"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Count */}
          <div className="flex items-end">
            <div className="w-full p-3 glass rounded-lg text-center">
              <p className="text-neutral-400 text-sm">Active Alerts</p>
              <p className="text-3xl font-display font-bold text-primary-400">
                {filteredAlerts.length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="space-y-3"
      >
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const Icon = getIcon(alert.type);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x:  -20 }}
                whileHover={{ x: 4 }}
                className={`glass-lg p-6 rounded-xl border ${getSeverityColor(alert.severity)} flex items-start gap-4 cursor-pointer hover:bg-white/15 transition-all duration-300`}
              >
                <Icon size={28} className="flex-shrink-0 mt-1" />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-display font-bold">
                      {alert.type. toUpperCase()} ALERT
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getSeverityColor(alert.severity)}`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <p className="text-neutral-300 mb-2">{alert.message}</p>
                  <p className="text-sm text-neutral-400 mb-3">
                    {alert.humanReadable}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span>📍 {alert.location}</span>
                    <span>🕐 {alert.createdAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => removeAlert(alert.id)}
                  className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} className="text-neutral-400" />
                </button>
              </motion.div>
            );
          })
        ) : (
          <motion. div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-lg p-12 rounded-xl text-center"
          >
            <AlertTriangle size={48} className="mx-auto text-neutral-600 mb-4" />
            <p className="text-neutral-400 text-lg">No alerts found</p>
            <p className="text-neutral-500 text-sm mt-2">
              Great!  No alerts matching your filters. 
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
