import React from "react";
import { motion } from "framer-motion";
import GoalsManager from "@/components/organisms/GoalsManager";

const Goals = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GoalsManager />
    </motion.div>
  );
};

export default Goals;