import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "There's nothing here yet.",
  action,
  onAction,
  icon = "Inbox"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name={icon} size={32} className="text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600">
            {description}
          </p>
        </div>
        
        {action && onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            className="flex items-center space-x-2 mx-auto"
          >
            <ApperIcon name="Plus" size={16} />
            <span>{action}</span>
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default Empty;