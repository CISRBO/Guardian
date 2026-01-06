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

const locations = [
  { id: 1, name: "River Valley", lat: 40.7128, lng: -74.006 },
  { id: 2, name: "Forest Zone A", lat: 41.8781, lng: -87.6298 },
  { id: 3, name: "Urban Center", lat: 34.0522, lng: -118.2437 },
  { id: 4, name: "Coastal Region", lat: 37.7749, lng: -122.4194 },
  { id:  5, name: "Mountain Region", lat: 39.7392, lng: -104.9903 },
];

export default function PredictionsPage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [loading, setLoading] = useState(false);
  const [predictions,
