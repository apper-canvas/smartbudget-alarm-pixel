import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { savingsGoalService } from "@/services/api/savingsGoalService";
import { format } from "date-fns";

const GoalsManager = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributingGoal, setContributingGoal] = useState(null);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await savingsGoalService.getAll();
      setGoals(data);
    } catch (err) {
      setError("Failed to load savings goals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: editingGoal?.currentAmount || 0,
      };

      if (editingGoal) {
        await savingsGoalService.update(editingGoal.Id, goalData);
        setGoals(prev => prev.map(g => 
          g.Id === editingGoal.Id ? { ...g, ...goalData } : g
        ));
        toast.success("Goal updated successfully!");
      } else {
        const newGoal = await savingsGoalService.create(goalData);
        setGoals(prev => [...prev, newGoal]);
        toast.success("Goal created successfully!");
      }
      
      setShowForm(false);
      setEditingGoal(null);
      setFormData({ name: "", targetAmount: "", deadline: "" });
    } catch (error) {
      toast.error("Failed to save goal");
    }
  };

  const handleContribution = async (e) => {
    e.preventDefault();
    
    if (!contributingGoal || !contributionAmount) return;
    
    try {
      const amount = parseFloat(contributionAmount);
      const updatedGoal = {
        ...contributingGoal,
        currentAmount: contributingGoal.currentAmount + amount
      };
      
      await savingsGoalService.update(contributingGoal.Id, updatedGoal);
      setGoals(prev => prev.map(g => 
        g.Id === contributingGoal.Id ? updatedGoal : g
      ));
      
      setContributingGoal(null);
      setContributionAmount("");
      toast.success(`$${amount.toFixed(2)} added to ${contributingGoal.name}!`);
    } catch (error) {
      toast.error("Failed to add contribution");
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      deadline: goal.deadline,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await savingsGoalService.delete(id);
      setGoals(prev => prev.filter(g => g.Id !== id));
      toast.success("Goal deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  const CircularProgress = ({ current, target, size = 120 }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-500 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-xs text-gray-500">Complete</span>
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGoals} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Savings Goals</h2>
          <p className="text-gray-600">Track your progress toward financial milestones</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Create Goal</span>
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
                {editingGoal ? "Edit Goal" : "Create New Goal"}
              </h3>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Goal Name"
                  type="text"
                  placeholder="Emergency Fund, Vacation, etc."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                
                <FormField
                  label="Target Amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  required
                />
                
                <FormField
                  label="Target Date"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                />
                
                <div className="md:col-span-3 flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setEditingGoal(null);
                      setFormData({ name: "", targetAmount: "", deadline: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    {editingGoal ? "Update Goal" : "Create Goal"}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contributingGoal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="p-6 mb-6 border-success/20 bg-success/5">
              <h3 className="text-lg font-semibold mb-4 text-success">
                Add Contribution to {contributingGoal.name}
              </h3>
              
              <form onSubmit={handleContribution} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <FormField
                    label="Contribution Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex space-x-4 sm:items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setContributingGoal(null);
                      setContributionAmount("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="success">
                    Add Contribution
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {goals.length === 0 ? (
        <Empty
          title="No savings goals yet"
          description="Create your first savings goal to start tracking your progress."
          action="Create Goal"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {goals.map((goal, index) => (
              <motion.div
                key={goal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card className="p-6 text-center relative overflow-hidden">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(goal)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.Id)}
                      className="p-2 text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <CircularProgress 
                      current={goal.currentAmount}
                      target={goal.targetAmount}
                    />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {goal.name}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current:</span>
                      <span className="font-medium">
                        ${goal.currentAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Target:</span>
                      <span className="font-medium">
                        ${goal.targetAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Remaining:</span>
                      <span className="font-medium text-primary">
                        ${Math.max(0, goal.targetAmount - goal.currentAmount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Deadline:</span>
                      <span className="font-medium">
                        {format(new Date(goal.deadline), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => setContributingGoal(goal)}
                    className="w-full"
                    disabled={goal.currentAmount >= goal.targetAmount}
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    {goal.currentAmount >= goal.targetAmount ? "Goal Achieved!" : "Add Contribution"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default GoalsManager;