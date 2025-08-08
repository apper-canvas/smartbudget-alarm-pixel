import React from "react";
import { motion } from "framer-motion";
import BudgetManager from "@/components/organisms/BudgetManager";

const Budgets = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <BudgetManager />
    </motion.div>
  );
};

export default Budgets;