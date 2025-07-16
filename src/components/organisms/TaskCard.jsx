import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const TaskCard = ({ task, onComplete, onEdit, onDelete }) => {
  const getPriorityVariant = (priority) => {
    switch (priority.toLowerCase()) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  const getTaskIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "watering": return "Droplets";
      case "fertilizing": return "Sprout";
      case "harvesting": return "Scissors";
      case "planting": return "Seed";
      case "weeding": return "Trash2";
      default: return "CheckSquare";
    }
  };

const isOverdue = new Date(task.due_date) < new Date();
  const isToday = format(new Date(task.due_date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  
  const getNotificationStatus = () => {
    if (task.completed || isOverdue) return null;
    
    const now = new Date();
const dueDate = new Date(task.due_date);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const hoursDiff = Math.ceil(timeDiff / (1000 * 3600));
    
    if (hoursDiff <= 1) return { type: "urgent", text: "Due Soon!" };
    if (daysDiff <= 1) return { type: "warning", text: "Due Tomorrow" };
    if (daysDiff <= 3) return { type: "info", text: "Due Soon" };
    return null;
  };
  
  const notificationStatus = getNotificationStatus();
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
        task.completed 
          ? "border-green-500" 
          : isOverdue 
            ? "border-red-500" 
            : isToday 
              ? "border-harvest-500" 
              : "border-forest-500"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            task.completed 
              ? "bg-green-100 text-green-600" 
              : isOverdue 
                ? "bg-red-100 text-red-600" 
                : "bg-forest-100 text-forest-600"
          }`}>
            <ApperIcon name={getTaskIcon(task.type)} size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        </div>
<div className="flex items-center gap-2">
          {notificationStatus && (
            <Badge variant={notificationStatus.type} size="sm" className="animate-pulse">
              {notificationStatus.text}
            </Badge>
          )}
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-500 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Edit" size={16} />
          </button>
          <button
            onClick={() => onDelete(task.Id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Due Date</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              isOverdue ? "text-red-600" : isToday ? "text-harvest-600" : "text-gray-700"
            }`}>
{format(new Date(task.due_date), "MMM d, yyyy")}
            </span>
{isOverdue && <Badge variant="high">Overdue</Badge>}
            {isToday && <Badge variant="medium">Today</Badge>}
            {notificationStatus && (
              <Badge variant={notificationStatus.type} size="sm" icon="Bell">
                {notificationStatus.text}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Priority</span>
          <Badge variant={getPriorityVariant(task.priority)}>
            {task.priority}
          </Badge>
        </div>
      </div>
      
      <div className="mt-6 flex gap-2">
        {!task.completed && (
          <button
            onClick={() => onComplete(task.Id)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            <ApperIcon name="Check" size={16} className="mr-2" />
            Mark Complete
          </button>
        )}
        {task.completed && (
          <div className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-center">
            <ApperIcon name="CheckCircle" size={16} className="mr-2" />
            Completed
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;