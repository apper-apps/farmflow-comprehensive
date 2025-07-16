import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
const [editingTask, setEditingTask] = useState(null);
  const [showNotificationPrefs, setShowNotificationPrefs] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    enabled: true,
    reminderTimes: ["1day", "1hour"],
    highPriorityOnly: false
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    type: "general"
});

  const reminderOptions = [
    { value: "1hour", label: "1 Hour Before" },
    { value: "1day", label: "1 Day Before" },
    { value: "3days", label: "3 Days Before" },
    { value: "1week", label: "1 Week Before" }
  ];

  const taskTypes = [
    { value: "general", label: "General" },
    { value: "watering", label: "Watering" },
    { value: "fertilizing", label: "Fertilizing" },
    { value: "harvesting", label: "Harvesting" },
    { value: "planting", label: "Planting" },
    { value: "weeding", label: "Weeding" },
    { value: "pruning", label: "Pruning" }
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, farmsData, cropsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll(),
        cropService.getAll()
      ]);

      setTasks(tasksData);
      setFarms(farmsData);
      setCrops(cropsData);
      setFilteredTasks(tasksData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (filterStatus !== "all") {
      filtered = filtered.filter(task => {
        const isCompleted = task.completed;
        const isOverdue = new Date(task.dueDate) < new Date() && !isCompleted;
        
        switch (filterStatus) {
          case "completed":
            return isCompleted;
          case "pending":
            return !isCompleted && !isOverdue;
          case "overdue":
            return isOverdue;
          default:
            return true;
        }
      });
    }

    setFilteredTasks(filtered);
  }, [tasks, filterStatus]);

  const handleSearch = (searchTerm) => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.Id, formData);
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.Id === editingTask.Id ? { ...task, ...formData } : task
          )
        );
        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskService.create(formData);
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast.success("Task created successfully!");
      }
      
      setShowForm(false);
      setEditingTask(null);
      setFormData({
        farmId: "",
        cropId: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        type: "general"
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farmId: task.farmId,
      cropId: task.cropId,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split("T")[0],
      priority: task.priority,
      type: task.type
    });
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
        toast.success("Task deleted successfully!");
        loadData();
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await taskService.update(taskId, { completed: true });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? { ...task, completed: true } : task
        )
      );
      toast.success("Task completed successfully!");
      loadData();
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  const getFilteredCrops = () => {
    if (!formData.farmId) return [];
    return crops.filter(crop => crop.farmId === formData.farmId);
  };

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage your farm activities and schedules</p>
        </motion.div>
        
<div className="flex items-center gap-2">
          <Button
            onClick={() => setShowNotificationPrefs(true)}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <ApperIcon name="Bell" size={20} />
            Notifications
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            Add Task
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search tasks by title or description..."
          className="flex-1"
        />
        
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          options={[
            { value: "all", label: "All Tasks" },
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "overdue", label: "Overdue" }
          ]}
          className="sm:w-48"
        />
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTask ? "Edit Task" : "Add New Task"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Farm" required>
                <Select
                  value={formData.farmId}
                  onChange={(e) => setFormData({...formData, farmId: e.target.value, cropId: ""})}
                  options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
                  placeholder="Select a farm"
                  required
                />
              </FormField>

              <FormField label="Crop (Optional)">
                <Select
                  value={formData.cropId}
                  onChange={(e) => setFormData({...formData, cropId: e.target.value})}
                  options={getFilteredCrops().map(crop => ({ value: crop.Id.toString(), label: `${crop.name} - ${crop.variety}` }))}
                  placeholder="Select a crop"
                />
              </FormField>

              <FormField label="Task Title" required>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Water tomatoes"
                  required
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Task description..."
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-forest-500 focus:outline-none transition-colors duration-200"
                />
              </FormField>

              <FormField label="Due Date" required>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Priority" required>
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    options={priorities}
                    required
                  />
                </FormField>
                
                <FormField label="Type" required>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    options={taskTypes}
                    required
                  />
                </FormField>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                    setFormData({
                      farmId: "",
                      cropId: "",
                      title: "",
                      description: "",
                      dueDate: "",
                      priority: "medium",
                      type: "general"
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingTask ? "Update Task" : "Create Task"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
)}

      {/* Notification Preferences Modal */}
      {showNotificationPrefs && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Enable Notifications
                </label>
                <input
                  type="checkbox"
                  checked={notificationPreferences.enabled}
                  onChange={(e) => setNotificationPreferences({
                    ...notificationPreferences,
                    enabled: e.target.checked
                  })}
                  className="w-4 h-4 text-forest-600 rounded focus:ring-forest-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  High Priority Tasks Only
                </label>
                <input
                  type="checkbox"
                  checked={notificationPreferences.highPriorityOnly}
                  onChange={(e) => setNotificationPreferences({
                    ...notificationPreferences,
                    highPriorityOnly: e.target.checked
                  })}
                  className="w-4 h-4 text-forest-600 rounded focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Times
                </label>
                <div className="space-y-2">
                  {reminderOptions.map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={option.value}
                        checked={notificationPreferences.reminderTimes.includes(option.value)}
                        onChange={(e) => {
                          const reminderTimes = e.target.checked
                            ? [...notificationPreferences.reminderTimes, option.value]
                            : notificationPreferences.reminderTimes.filter(time => time !== option.value);
                          setNotificationPreferences({
                            ...notificationPreferences,
                            reminderTimes
                          });
                        }}
                        className="w-4 h-4 text-forest-600 rounded focus:ring-forest-500"
                      />
                      <label htmlFor={option.value} className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowNotificationPrefs(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowNotificationPrefs(false);
                  toast.success("Notification preferences updated!");
                }}
                className="flex-1"
              >
                Save Preferences
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Tasks Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.Id}
              task={task}
              onComplete={handleComplete}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description="Start organizing your farm work by adding your first task."
          actionLabel="Add Task"
          onAction={() => setShowForm(true)}
        />
      )}
    </div>
  );
};

export default Tasks;