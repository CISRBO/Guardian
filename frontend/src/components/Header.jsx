import { motion } from "framer-motion";
import { Clock, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header({ title, subtitle }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-4xl font-display font-bold gradient-text mb-2">
          {title}
        </h1>
        <p className="text-neutral-400 text-lg flex items-center gap-2">
          <Clock size={18} />
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Time Display */}
        <div className="glass-lg px-4 py-3 rounded-xl text-center hidden md:block">
          <p className="text-sm text-neutral-400">Current Time</p>
          <p className="text-2xl font-mono font-bold text-primary-400">
            {time.toLocaleTimeString()}
          </p>
        </div>

        {/* Notifications */}
        <button className="p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-primary-400 transition-all duration-300 relative">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-danger-500 animate-pulse" />
        </button>
      </div>
    </motion. div>
  );
}
