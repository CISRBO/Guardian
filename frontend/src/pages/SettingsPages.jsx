import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  TrendingUp,
  Users,
  AlertTriangle,
} from "lucide-react";
import Header from "../components/Header";
import axios from "axios";
import toast from "react-hot-toast";

const scenarios = [
  {
    id: 1,
    name:  "Rapid Flooding",
    description: "Simulate sudden flood event with high water levels",
    icon: "💧",
    difficulty: "Hard",
    duration: "45 min",
  },
  {
    id:  2,
    name: "Wildfire Spread",
    description:  "Model forest fire propagation under various wind conditions",
    icon: "🔥",
    difficulty: "Hard",
    duration: "60 min",
  },
  {
    id: 3,
    name: "Air Pollution Crisis",
    description: "Simulate industrial pollution spike and dispersion",
    icon: "💨",
    difficulty: "Medium",
    duration: "30 min",
  },
  {
    id: 4,
    name: "Multi-Hazard Event",
    description: "Complex scenario with multiple concurrent disasters",
    icon: "⚡",
    difficulty: "Extreme",
    duration: "90 min",
  },
  {
    id: 5,
    name: "Urban Evacuation",
    description:  "Test evacuation procedures and population movement",
    icon: "🚗",
    difficulty: "Medium",
    duration: "40 min",
  },
  {
    id: 6,
    name: "Recovery Simulation",
    description: "Model post-disaster recovery and resource allocation",
    icon: "🏗️",
    difficulty: "Hard",
    duration: "75 min",
  },
];

export default function SimulationPage() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const runSimulation = async () => {
    setIsRunning(true);
    setProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + Math.random() * 30, 95));
      }, 500);

      const response = await axios.post(
        "http://localhost:8000/api/v1/simulation/run",
        {
          name: selectedScenario.name,
          duration: parseInt(selectedScenario.duration),
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      setResults(response.data. result);
      toast.success("Simulation completed!");

      setTimeout(() => {
        setIsRunning(false);
        setProgress(0);
      }, 2000);
    } catch (error) {
      console.error("Simulation error:", error);
      toast.error("Simulation failed");
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 min-h-screen">
      <Header title="Scenario Simulation" subtitle="Test disaster response plans" />

      {/* Scenario Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {scenarios.map((scenario) => (
          <motion.div
            key={scenario.id}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedScenario(scenario)}
            className={`glass-lg p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedScenario.id === scenario.id
                ? "ring-2 ring-primary-500 bg-primary-500/10"
                : "hover:bg-white/15"
            }`}
          >
            <div className="text-5xl mb-3">{scenario.icon}</div>
            <h3 className="text-lg font-display font-bold mb-2">
              {scenario.name}
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              {scenario.description}
            </p>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>⏱️ {scenario.duration}</span>
              <span
                className={`px-2 py-1 rounded-full font-semibold ${
                  scenario. difficulty === "Extreme"
                    ? "bg-red-500/20 text-red-300"
                    : scenario.difficulty === "Hard"
                    ?  "bg-orange-500/20 text-orange-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {scenario.difficulty}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Simulation Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-lg p-8 rounded-2xl"
      >
        <h2 className="text-2xl font-display font-bold mb-6">
          {selectedScenario.name}
        </h2>

        <div className="space-y-6">
          {/* Description */}
          <p className="text-neutral-300">{selectedScenario.description}</p>

          {/* Progress Bar */}
          {isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-300">
                  Simulation Progress
                </span>
                <span className="text-sm font-mono text-primary-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                />
              </div>
            </div>
          )}

          {/* Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 glass rounded-lg">
              <label className="block text-sm text-neutral-400 mb-2">
                Duration
              </label>
              <p className="text-2xl font-bold text-primary-400">
                {selectedScenario. duration}
              </p>
            </div>

            <div className="p-4 glass rounded-lg">
              <label className="block text-sm text-neutral-400 mb-2">
                Complexity
              </label>
              <p className="text-2xl font-bold text-orange-400">
                {selectedScenario.difficulty}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runSimulation}
              disabled={isRunning}
              className="btn-primary flex items-center gap-2 flex-1"
            >
              {isRunning ? (
                <>
                  <Pause size={20} />
                  Simulation Running...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start Simulation
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isRunning}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw size={20} />
              Reset
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-lg p-8 rounded-2xl"
        >
          <h2 className="text-2xl font-display font-bold mb-6">
            📊 Simulation Results
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 glass rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users size={24} className="text-primary-400" />
              </div>
              <p className="text-neutral-400 text-sm mb-2">Affected Population</p>
              <p className="text-3xl font-display font-bold text-white">
                {results.affected_population || "45,000"}
              </p>
            </div>

            <div className="p-6 glass rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertTriangle size={24} className="text-orange-400" />
              </div>
              <p className="text-neutral-400 text-sm mb-2">Response Time</p>
              <p className="text-3xl font-display font-bold text-white">
                {results.response_time || "18"} min
              </p>
            </div>

            <div className="p-6 glass rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <TrendingUp size={24} className="text-green-400" />
              </div>
              <p className="text-neutral-400 text-sm mb-2">Success Rate</p>
              <p className="text-3xl font-display font-bold text-white">
                {results.success_rate || "87"}%
              </p>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="mt-6 p-6 glass rounded-lg space-y-3">
            <h3 className="font-bold text-lg mb-4">Key Metrics</h3>
            <div className="space-y-2 text-neutral-300">
              <p>✅ Evacuation Routes:  Optimal</p>
              <p>✅ Resource Allocation: Efficient</p>
              <p>⚠️ Communication Delays: 5 min</p>
              <p>✅ Medical Response: 12 minutes average</p>
              <p>⚠️ Infrastructure Damage: 34%</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
