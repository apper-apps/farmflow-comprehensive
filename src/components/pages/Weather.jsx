import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import WeatherCard from "@/components/organisms/WeatherCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import weatherService from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError("");
      
      const weatherData = await weatherService.getForecast();
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const getTodayWeather = () => {
    const today = new Date().toISOString().split("T")[0];
    return weather.find(w => w.date.startsWith(today)) || weather[0];
  };

  const getWeatherInsights = () => {
    const insights = [];
    
    weather.forEach((day, index) => {
      if (day.precipitation > 70) {
        insights.push({
          type: "warning",
          icon: "CloudRain",
          title: "Heavy Rain Expected",
          description: `${day.precipitation}% chance of rain on ${new Date(day.date).toLocaleDateString()}`,
          action: "Consider indoor activities and protect crops"
        });
      }
      
if (day.temp_high > 85) {
        insights.push({
          type: "info",
          icon: "Sun",
          title: "Hot Weather Alert",
description: `High temperature of ${day.temp_high}°F expected`,
          action: "Ensure adequate irrigation and livestock shade"
        });
      }
      
if (day.temp_low < 40) {
        insights.push({
          type: "warning",
          icon: "Snowflake",
          title: "Cold Weather Warning",
description: `Low temperature of ${day.temp_low}°F expected`,
          action: "Protect sensitive crops from frost"
        });
      }
    });

    return insights.slice(0, 3);
  };

  if (loading) {
    return <Loading type="cards" count={5} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadWeather} />;
  }

  const todayWeather = getTodayWeather();
  const insights = getWeatherInsights();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>
        <p className="text-gray-600 mt-1">5-day weather outlook for your farming operations</p>
      </motion.div>

      {/* Today's Weather Highlight */}
      {todayWeather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-forest-500 to-forest-600 rounded-xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Today's Weather</h2>
<p className="text-forest-100 mb-4">{todayWeather.condition}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Thermometer" size={20} />
                  <span className="text-lg font-semibold">
{todayWeather.temp_high}°/{todayWeather.temp_low}°F
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Droplets" size={20} />
<span className="text-lg font-semibold">{todayWeather.precipitation}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Wind" size={20} />
<span className="text-lg font-semibold">{todayWeather.humidity}%</span>
                </div>
              </div>
            </div>
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ApperIcon name="Sun" size={48} className="text-yellow-200" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Weather Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Weather Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === "warning" 
                    ? "bg-red-50 border-red-500" 
                    : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    insight.type === "warning" 
                      ? "bg-red-100 text-red-600" 
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    <ApperIcon name={insight.icon} size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <p className="text-xs text-gray-500 italic">{insight.action}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {weather.map((day, index) => (
            <WeatherCard
              key={day.date}
              weather={day}
              isToday={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Agricultural Tips */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Agricultural Weather Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Droplets" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Irrigation Planning</h3>
                <p className="text-sm text-gray-600">Check precipitation forecasts to optimize watering schedules and conserve water.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Wind" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Spray Applications</h3>
                <p className="text-sm text-gray-600">Avoid spraying during high wind conditions or before rain events.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sun" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Heat Stress</h3>
                <p className="text-sm text-gray-600">Monitor high temperatures and provide adequate shade for livestock.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CloudSnow" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Frost Protection</h3>
                <p className="text-sm text-gray-600">Protect sensitive crops when temperatures drop below 40°F.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;