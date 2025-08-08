import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import ProgressCard from "@/components/molecules/ProgressCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { budgetService } from "@/services/api/budgetService";
import { categoryService } from "@/services/api/categoryService";

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [budgetsData, categoriesData] = await Promise.all([
        budgetService.getAll(),
        categoryService.getAll()
      ]);
      setBudgets(budgetsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const budgetData = {
        ...formData,
        amount: parseFloat(formData.amount),
        spent: editingBudget?.spent || 0,
      };

      if (editingBudget) {
        await budgetService.update(editingBudget.Id, budgetData);
        setBudgets(prev => prev.map(b => 
          b.Id === editingBudget.Id ? { ...b, ...budgetData } : b
        ));
        toast.success("Budget updated successfully!");
      } else {
        const newBudget = await budgetService.create(budgetData);
        setBudgets(prev => [...prev, newBudget]);
        toast.success("Budget created successfully!");
      }
      
      setShowForm(false);
      setEditingBudget(null);
      setFormData({
        category: "",
        amount: "",
        month: new Date().toISOString().slice(0, 7),
      });
    } catch (error) {
      toast.error("Failed to save budget");
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      await budgetService.delete(id);
      setBudgets(prev => prev.filter(b => b.Id !== id));
      toast.success("Budget deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const availableCategories = categories.filter(cat => 
    cat.type === "expense" && 
    !budgets.some(b => b.category === cat.name && b.month === formData.month)
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
          <p className="text-gray-600">Set and track your monthly spending limits</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Create Budget</span>
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingBudget ? "Edit Budget" : "Create New Budget"}
              </h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Category"
                  type="select"
                  options={editingBudget ? 
                    [{ value: editingBudget.category, label: editingBudget.category }] :
                    availableCategories.map(cat => ({
                      value: cat.name,
                      label: cat.name
                    }))
                  }
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  disabled={!!editingBudget}
                  required
                />
                
                <FormField
                  label="Budget Amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
                
                <FormField
                  label="Month"
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  disabled={!!editingBudget}
                  required
                />
                
                <div className="md:col-span-3 flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setEditingBudget(null);
                      setFormData({
                        category: "",
                        amount: "",
                        month: new Date().toISOString().slice(0, 7),
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingBudget ? "Update Budget" : "Create Budget"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {budgets.length === 0 ? (
        <Empty
          title="No budgets set"
          description="Create your first budget to start tracking your spending limits."
          action="Create Budget"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {budgets.map((budget, index) => (
              <motion.div
                key={budget.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="relative overflow-hidden">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(budget)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget.Id)}
                      className="p-2 text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                  
                  <ProgressCard
                    title={budget.category}
                    current={budget.spent}
                    target={budget.amount}
                    icon="Target"
                    color={budget.spent > budget.amount ? "error" : "success"}
                  />
                  
                  <div className="px-6 pb-6">
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                      <span>Month: {budget.month}</span>
                      <span>
                        Remaining: ${Math.max(0, budget.amount - budget.spent).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;