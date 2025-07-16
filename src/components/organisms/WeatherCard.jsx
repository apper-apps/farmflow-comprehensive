import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ weather, isToday = false }) => {
  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny": return "Sun";
      case "cloudy": return "Cloud";
      case "rainy": return "CloudRain";
      case "stormy": return "CloudLightning";
      case "snow": return "CloudSnow";
      case "partly cloudy": return "CloudSun";
      default: return "Sun";
    }
  };

  const getWeatherGradient = (condition) => {
    switch (condition.toLowerCase()) {
      case "sunny": return "from-yellow-400 to-orange-500";
      case "cloudy": return "from-gray-400 to-gray-500";
      case "rainy": return "from-blue-400 to-blue-600";
      case "stormy": return "from-gray-600 to-gray-800";
      case "snow": return "from-blue-200 to-blue-400";
      case "partly cloudy": return "from-yellow-300 to-blue-400";
      default: return "from-yellow-400 to-orange-500";
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const weatherDate = new Date(date);
    
    if (isToday) return "Today";
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (weatherDate.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    
    return weatherDate.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric" 
    });
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 ${
        isToday ? "ring-2 ring-forest-500" : ""
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {formatDate(weather.date)}
          </h3>
          <p className="text-sm text-gray-600">{weather.condition}</p>
        </div>
        <div className={`w-16 h-16 bg-gradient-to-br ${getWeatherGradient(weather.condition)} rounded-full flex items-center justify-center`}>
          <ApperIcon name={getWeatherIcon(weather.condition)} size={32} className="text-white" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Temperature</span>
          <span className="text-lg font-bold text-gray-900">
            {weather.tempHigh}°/{weather.tempLow}°F
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Precipitation</span>
          <div className="flex items-center gap-1">
            <ApperIcon name="Droplets" size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-700">{weather.precipitation}%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Humidity</span>
          <span className="text-sm font-medium text-gray-700">{weather.humidity}%</span>
        </div>
      </div>
      
      {weather.precipitation > 70 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <ApperIcon name="AlertCircle" size={16} className="text-blue-600" />
            <span className="text-sm text-blue-800">High chance of rain - plan indoor activities</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeatherCard;