import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.header 
      className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">{title}</h1>
            <p className="text-sm text-gray-500 mt-1">{currentDate}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="primary" 
            size="sm"
            className="hidden sm:flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Transaction</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="p-2"
          >
            <ApperIcon name="Bell" size={20} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;