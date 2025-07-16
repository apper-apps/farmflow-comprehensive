import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, gradient = "from-forest-500 to-forest-600", change = null }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center`}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-sm ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            <ApperIcon name={change >= 0 ? "TrendingUp" : "TrendingDown"} size={16} className="mr-1" />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </motion.div>
  );
};

export default StatCard;