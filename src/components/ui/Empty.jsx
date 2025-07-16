import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Sprout",
  title = "Nothing here yet",
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-8 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-forest-500 to-forest-600 rounded-full flex items-center justify-center"
      >
        <ApperIcon name={icon} size={32} className="text-white" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;