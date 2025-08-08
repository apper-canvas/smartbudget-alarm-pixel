import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
    { name: "Budgets", href: "/budgets", icon: "Target" },
    { name: "Goals", href: "/goals", icon: "TrendingUp" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-xl">
                <ApperIcon name="Wallet" className="w-8 h-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold gradient-text">SmartBudget</h1>
                <p className="text-xs text-gray-500">Personal Finance</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
                onClick={() => onClose && onClose()}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Demo User</p>
                <p className="text-xs text-gray-500">Free Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {isOpen && (
          <div className="fixed inset-0 z-40 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex flex-col flex-1 w-full max-w-xs bg-white"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={onClose}
                >
                  <ApperIcon name="X" className="h-6 w-6 text-white" />
                </button>
              </div>
              
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 px-4 mb-8">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-xl">
                      <ApperIcon name="Wallet" className="w-8 h-8 text-white" />
                    </div>
                    <div className="ml-3">
                      <h1 className="text-xl font-bold gradient-text">SmartBudget</h1>
                      <p className="text-xs text-gray-500">Personal Finance</p>
                    </div>
                  </div>
                </div>
                
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `sidebar-link ${isActive ? "active" : ""}`
                      }
                      onClick={onClose}
                    >
                      <ApperIcon name={item.icon} size={20} />
                      <span className="font-medium">{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
              
              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                  <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                    <ApperIcon name="User" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Demo User</p>
                    <p className="text-xs text-gray-500">Free Plan</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;