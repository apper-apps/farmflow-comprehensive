import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const CropTable = ({ crops, onEdit, onDelete, onHarvest }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "planted": return "planted";
      case "growing": return "growing";
      case "ready": return "ready";
      case "harvested": return "harvested";
      default: return "default";
    }
  };

const getDaysUntilHarvest = (harvestDate) => {
    if (!harvestDate) return 'Not set';
    
    const today = new Date();
    const harvest = new Date(harvestDate);
    
    // Check if the date is valid
    if (isNaN(harvest.getTime())) {
      return 'Invalid date';
    }
    
    const diffTime = harvest - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-forest-500 to-forest-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium">Crop</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Variety</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Planted</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Harvest</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Area</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {crops.map((crop, index) => (
              <motion.tr
                key={crop.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Sprout" size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{crop.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{crop.variety}</td>
<td className="px-6 py-4 text-gray-700">
                  {crop.plantingDate && !isNaN(new Date(crop.plantingDate).getTime()) 
                    ? format(new Date(crop.plantingDate), "MMM d, yyyy")
                    : "Not set"}
                </td>
                <td className="px-6 py-4">
<div className="text-gray-700">
                    {crop.expectedHarvestDate && !isNaN(new Date(crop.expectedHarvestDate).getTime())
                      ? format(new Date(crop.expectedHarvestDate), "MMM d, yyyy")
                      : "Not set"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {typeof getDaysUntilHarvest(crop.expectedHarvestDate) === 'number'
                      ? `${getDaysUntilHarvest(crop.expectedHarvestDate)} days`
                      : getDaysUntilHarvest(crop.expectedHarvestDate)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(crop.status)}>
                    {crop.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-gray-700">{crop.area} acres</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(crop)}
                      className="p-2 text-gray-500 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
                    {crop.status.toLowerCase() === "ready" && (
                      <button
                        onClick={() => onHarvest(crop)}
                        className="p-2 text-gray-500 hover:text-harvest-600 hover:bg-harvest-50 rounded-lg transition-colors"
                        title="Mark as Harvested"
                      >
                        <ApperIcon name="Scissors" size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(crop.Id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CropTable;