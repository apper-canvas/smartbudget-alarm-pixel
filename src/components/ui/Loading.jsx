import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";

const Loading = ({ rows = 3 }) => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="skeleton h-8 w-48 rounded-lg"></div>
          <div className="skeleton h-4 w-64 rounded-lg"></div>
        </div>
        <div className="skeleton h-10 w-32 rounded-lg"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="skeleton h-4 w-24 rounded"></div>
                  <div className="skeleton h-8 w-32 rounded"></div>
                </div>
                <div className="skeleton h-12 w-12 rounded-xl"></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="skeleton h-6 w-48 rounded"></div>
            <div className="skeleton h-64 w-full rounded"></div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-4">
            <div className="skeleton h-6 w-48 rounded"></div>
            <div className="space-y-3">
              {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="skeleton h-10 w-10 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-full rounded"></div>
                    <div className="skeleton h-3 w-2/3 rounded"></div>
                  </div>
                  <div className="skeleton h-6 w-16 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Loading;