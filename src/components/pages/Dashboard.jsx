import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/organisms/WeatherCard";
import TaskCard from "@/components/organisms/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";
import transactionService from "@/services/api/transactionService";
import weatherService from "@/services/api/weatherService";

const Dashboard = () => {
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [farmsData, cropsData, tasksData, transactionsData, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        transactionService.getAll(),
        weatherService.getToday()
      ]);

      setFarms(farmsData);
      setCrops(cropsData);
      setTasks(tasksData);
      setTransactions(transactionsData);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.update(taskId, { completed: true });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? { ...task, completed: true } : task
        )
      );
      toast.success("Task completed successfully!");
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  const activeCrops = crops.filter(crop => crop.status !== "harvested");
  const todaysTasks = tasks.filter(task => {
const taskDate = format(new Date(task.due_date), "yyyy-MM-dd");
    const today = format(new Date(), "yyyy-MM-dd");
    return taskDate === today && !task.completed;
  });
  const overdueTasks = tasks.filter(task => {
const taskDate = new Date(task.due_date);
    const today = new Date();
    return taskDate < today && !task.completed;
  });

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back to your farm management overview</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-right"
        >
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {format(new Date(), "MMMM d, yyyy")}
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farms"
          value={farms.length}
          icon="MapPin"
          gradient="from-forest-500 to-forest-600"
        />
        <StatCard
          title="Active Crops"
          value={activeCrops.length}
          icon="Sprout"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Today's Tasks"
          value={todaysTasks.length}
          icon="CheckSquare"
          gradient="from-harvest-500 to-harvest-600"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          icon="AlertCircle"
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString()}`}
          icon="TrendingUp"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={`$${totalExpenses.toLocaleString()}`}
          icon="TrendingDown"
          gradient="from-red-500 to-red-600"
        />
      </div>

      {/* Weather and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Weather</h2>
          {weather ? (
            <WeatherCard weather={weather} isToday={true} />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <p className="text-gray-500 text-center">Weather data unavailable</p>
            </div>
          )}
        </div>

        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Tasks</h2>
          {todaysTasks.length > 0 ? (
            <div className="space-y-4">
              {todaysTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <Empty
              icon="CheckSquare"
              title="No tasks today"
              description="You're all caught up! No tasks scheduled for today."
              actionLabel="Add Task"
              onAction={() => {}}
            />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <button className="text-forest-600 hover:text-forest-700 font-medium">
            View All
          </button>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.Id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === "income" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    <ApperIcon 
                      name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} 
                      size={20} 
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.date), "MMM d")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <Empty
            icon="DollarSign"
            title="No transactions yet"
            description="Start tracking your farm expenses and income."
            actionLabel="Add Transaction"
            onAction={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;