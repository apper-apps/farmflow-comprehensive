import { useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "@/App";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/farms", label: "Farms", icon: "MapPin" },
    { path: "/crops", label: "Crops", icon: "Sprout" },
    { path: "/tasks", label: "Tasks", icon: "CheckSquare" },
    { path: "/finance", label: "Finance", icon: "DollarSign" },
    { path: "/weather", label: "Weather", icon: "CloudSun" },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ApperIcon name={isOpen ? "X" : "Menu"} size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-forest-500 to-forest-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Sprout" size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">FarmFlow</h1>
          </div>
        </div>
        
<nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-forest-500 to-forest-600 text-white"
                    : "text-gray-700 hover:bg-forest-50 hover:text-forest-600"
                }`
              }
            >
              <ApperIcon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-red-50 hover:text-red-600 mt-4"
          >
            <ApperIcon name="LogOut" size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.aside
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-50"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-forest-500 to-forest-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Sprout" size={24} className="text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">FarmFlow</h1>
                </div>
              </div>
              
<nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-forest-500 to-forest-600 text-white"
                          : "text-gray-700 hover:bg-forest-50 hover:text-forest-600"
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-red-50 hover:text-red-600 mt-4"
                >
                  <ApperIcon name="LogOut" size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;