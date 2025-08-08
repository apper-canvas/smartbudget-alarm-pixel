import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "primary", 
  trend = null, 
  gradient = true,
  onClick = null
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    secondary: "text-secondary bg-secondary/10",
  };

  const trendColors = {
    up: "text-success",
    down: "text-error",
    neutral: "text-gray-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={onClick}
        hover
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
            <div className="flex items-center space-x-3">
              <motion.p 
                className={cn(
                  "text-2xl font-bold",
                  gradient ? "gradient-text" : "text-gray-900"
                )}
                key={value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {value}
              </motion.p>
              {trend && (
                <div className={cn("flex items-center text-sm font-medium", trendColors[trend.direction])}>
                  <ApperIcon 
                    name={trend.direction === "up" ? "TrendingUp" : trend.direction === "down" ? "TrendingDown" : "Minus"}
                    size={16} 
                    className="mr-1" 
                  />
                  {trend.value}
                </div>
              )}
            </div>
          </div>
          
          <div className={cn("p-3 rounded-xl", colorClasses[color])}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;