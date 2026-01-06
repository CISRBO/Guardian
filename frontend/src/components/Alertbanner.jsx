import { motion } from "framer-motion";
import { AlertTriangle, Flame, Droplets, Wind, X } from "lucide-react";
import { useState } from "react";

export default function AlertBanner({ alert }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const icons = {
    flood:  Droplets,
    fire:  Flame,
    pollution: Wind,
  };

  const Icon = icons[alert.type] || AlertTriangle;

  const getBgColor = () => {
    if (alert.severity === "critical") return "from-red-600/30 to-red-900/20";
    if (alert.severity === "high") return "from-orange-600/30 to-orange-900/20";
    return "from-yellow-600/30 to-yellow-900/20";
  };

  const getBorderColor = () => {
    if (alert.severity === "critical") return "border-red-500/50";
    if (alert.severity === "high") return "border-orange-500/50";
    return "border-yellow-500/50";
  };

  const getTextColor = () => {
    if (alert.severity === "critical") return "text-red-200";
    if (alert.severity === "high") return "text-orange-200";
    return "text-yellow-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y:  -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y:  -20 }}
      className={`bg-gradient-to-r ${getBgColor()} border ${getBorderColor()} rounded-xl p-5 flex items-start gap-4 backdrop-blur-sm`}
    >
      <Icon className={`${getTextColor()} flex-shrink-0 mt-1`} size={24} />
      
      <div className="flex-1">
        <h3 className={`font-display font-bold text-lg ${getTextColor()}`}>
          {alert.type. toUpperCase()} ALERT - {alert.severity. toUpperCase()}
        </h3>
        <p className="text-neutral-200 mt-1 text-sm">
          {alert.humanReadable || alert.message}
        </p>
        <p className="text-neutral-400 text-xs mt-2">
          📍 {alert.location} • {alert.createdAt}
        </p>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X size={20} className="text-neutral-400" />
      </button>
    </motion.div>
  );
}
