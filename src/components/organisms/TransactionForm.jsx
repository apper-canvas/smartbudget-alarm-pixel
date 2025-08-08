import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";

const TransactionForm = ({ transaction = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      });
    }
  }, [transaction]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (transaction) {
        await transactionService.update(transaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await transactionService.create(transactionData);
        toast.success("Transaction added successfully!");
      }
      
      onSuccess();
    } catch (error) {
      toast.error(transaction ? "Failed to update transaction" : "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="max-w-md mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {transaction ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === "income"
                    ? "border-success bg-success/10 text-success"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => handleChange("type", "income")}
              >
                <ApperIcon name="TrendingUp" size={20} className="mx-auto mb-2" />
                <span className="text-sm font-medium">Income</span>
              </button>
              
              <button
                type="button"
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  formData.type === "expense"
                    ? "border-error bg-error/10 text-error"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                onClick={() => handleChange("type", "expense")}
              >
                <ApperIcon name="TrendingDown" size={20} className="mx-auto mb-2" />
                <span className="text-sm font-medium">Expense</span>
              </button>
            </div>

            <FormField
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              error={errors.amount}
              required
            />

            <FormField
              label="Category"
              type="select"
              options={filteredCategories.map(cat => ({
                value: cat.name,
                label: cat.name
              }))}
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              error={errors.category}
              required
            />

            <FormField
              label="Description"
              type="text"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              error={errors.description}
              required
            />

            <FormField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              error={errors.date}
              required
            />

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  transaction ? "Update" : "Add Transaction"
                )}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
};

export default TransactionForm;