import React from "react";
import { motion } from "framer-motion";
import SpendingCharts from "@/components/organisms/SpendingCharts";

const Reports = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <SpendingCharts />
    </motion.div>
  );
};

export default Reports;