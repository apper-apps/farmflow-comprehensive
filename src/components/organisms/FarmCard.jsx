import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const FarmCard = ({ farm, onEdit, onDelete, onView, cropsCount = 0 }) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-forest-500 to-forest-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="MapPin" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
              <p className="text-sm text-gray-600">{farm.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(farm)}
              className="p-2 text-gray-500 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Edit" size={16} />
            </button>
            <button
              onClick={() => onDelete(farm.Id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Size</span>
            <Badge variant="default">
              {farm.size} {farm.sizeUnit}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Crops</span>
            <Badge variant="growing" icon="Sprout">
              {cropsCount}
            </Badge>
          </div>
        </div>
        
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onView(farm)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-forest-500 to-forest-600 text-white rounded-lg hover:from-forest-600 hover:to-forest-700 transition-all duration-200"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FarmCard;