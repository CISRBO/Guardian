import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  AlertTriangle,
  TrendingUp,
  Zap,
  Settings,
  Menu,
  X,
  Shield,
  Cloud,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon:  Home, label: "Dashboard", href: "/" },
    { icon:  AlertTriangle, label: "Alerts", href: "/alerts" },
    { icon: TrendingUp, label: "Predictions", href: "/predictions" },
    { icon: Zap, label:  "Simulation", href: "/simulation" },
    { icon: Settings, label: "Settings", href:  "/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-neutral-900 text-primary-400"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <motion. aside
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed md:relative w-64 h-screen glass-lg flex flex-col gap-8 p-6 border-r border-white/10 z-40 md:translate-x-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">
              AI-Guardian
            </h1>
            <p className="text-xs text-neutral-400">Real-Time Protection</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-success-500/10 border border-success-500/30">
          <div className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
          <div className="text-sm">
            <p className="text-neutral-300 font-medium">System Status</p>
            <p className="text-xs text-success-400">Operational</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map(({ icon: Icon, label, href }) => {
            const isActive = location. pathname === href;
            return (
              <Link key={href} to={href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ x: 2 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer group ${
                    isActive
                      ? "bg-primary-600 text-white shadow-glow"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer Stats */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Active Alerts</span>
            <span className="badge-danger">3</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Locations</span>
            <span className="badge-info">5</span>
          </div>
        </div>
      </motion. aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
