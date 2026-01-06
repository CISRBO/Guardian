import { useEffect } from "react";
import { useStore } from "../store";
import toast from "react-hot-toast";

export function useWebSocket() {
  const { addAlert, updateSensorData, setConnected } = useStore();

  useEffect(() => {
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${wsProtocol}//localhost:8000/ws/live-data`);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);
      toast.success("Connected to AI-Guardian Server");
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "sensor_update") {
          updateSensorData(message.data);
        } else if (message.type === "alert") {
          addAlert(message.data);
          // Show toast notification
          toast.error(
            `🚨 ${message.data.type. toUpperCase()}: ${message.data.message}`,
            {
              duration: 5,
              icon: "⚠️",
            }
          );
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws. onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
      toast.error("Connection error - trying to reconnect.. .");
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnected(false);

      // Reconnect after 3 seconds
      setTimeout(() => {
        console.log("🔄 Attempting to reconnect...");
      }, 3000);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [addAlert, updateSensorData, setConnected]);
}
