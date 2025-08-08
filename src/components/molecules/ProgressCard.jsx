import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const ProgressCard = ({ 
  title, 
  current, 
  target, 
  icon, 
  color = "primary",
  format = "currency"
}) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  
  const formatValue = (value) => {
    if (format === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(value);
    }
    return value.toString();
  };

  const colorClasses = {
    primary: "from-primary to-blue-600",
    success: "from-success to-green-500",
    warning: "from-warning to-yellow-500",
    error: "from-error to-red-500",
    secondary: "from-secondary to-purple-600",
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
            <ApperIcon name={icon} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">
              {formatValue(current)} of {formatValue(target)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600">{percentage.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProgressCard;