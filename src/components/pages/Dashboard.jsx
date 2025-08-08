import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import ProgressCard from "@/components/molecules/ProgressCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { budgetService } from "@/services/api/budgetService";
import { savingsGoalService } from "@/services/api/savingsGoalService";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        budgetService.getAll(),
        savingsGoalService.getAll()
      ]);
      setTransactions(transactionsData);
      setBudgets(budgetsData);
      setGoals(goalsData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate current month stats
  const currentMonth = new Date();
  const currentMonthStart = startOfMonth(currentMonth);
  const currentMonthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd;
  });

  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const currentMonthNet = currentMonthIncome - currentMonthExpenses;

  // Calculate last month for comparison
  const lastMonth = subMonths(currentMonth, 1);
  const lastMonthStart = startOfMonth(lastMonth);
  const lastMonthEnd = endOfMonth(lastMonth);
  
  const lastMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd;
  });

  const lastMonthExpenses = lastMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTrend = lastMonthExpenses > 0 ? 
    ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100) : 0;

  // Calculate total savings
  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  // Calculate budget utilization
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalBudgetUsed = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Budget alerts
  const budgetAlerts = budgets.filter(budget => budget.spent / budget.amount > 0.8);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">
            Here's your financial overview for {format(currentMonth, "MMMM yyyy")}
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => navigate("/transactions")}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Transaction</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Monthly Income"
          value={`$${currentMonthIncome.toFixed(2)}`}
          icon="TrendingUp"
          color="success"
          onClick={() => navigate("/transactions")}
        />
        
        <StatCard
          title="Monthly Expenses"
          value={`$${currentMonthExpenses.toFixed(2)}`}
          icon="TrendingDown"
          color="error"
          trend={{
            direction: expenseTrend > 0 ? "up" : expenseTrend < 0 ? "down" : "neutral",
            value: `${Math.abs(expenseTrend).toFixed(1)}%`
          }}
          onClick={() => navigate("/transactions")}
        />
        
        <StatCard
          title="Net Income"
          value={`$${currentMonthNet.toFixed(2)}`}
          icon="DollarSign"
          color={currentMonthNet >= 0 ? "success" : "error"}
          onClick={() => navigate("/reports")}
        />
        
        <StatCard
          title="Total Savings"
          value={`$${totalSavings.toFixed(2)}`}
          icon="PiggyBank"
          color="primary"
          onClick={() => navigate("/goals")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Budget Overview</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/budgets")}
              className="flex items-center space-x-2"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" size={14} />
            </Button>
          </div>
          
          {budgets.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Target" size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No budgets set yet</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/budgets")}
              >
                Create Budget
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.slice(0, 3).map((budget) => (
                <ProgressCard
                  key={budget.Id}
                  title={budget.category}
                  current={budget.spent}
                  target={budget.amount}
                  icon="Target"
                  color={budget.spent > budget.amount ? "error" : "primary"}
                />
              ))}
              
              {budgetAlerts.length > 0 && (
                <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-warning mb-2">
                    <ApperIcon name="AlertTriangle" size={16} />
                    <span className="font-medium">Budget Alerts</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {budgetAlerts.length} budget{budgetAlerts.length > 1 ? "s" : ""} over 80% used
                  </p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/transactions")}
              className="flex items-center space-x-2"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" size={14} />
            </Button>
          </div>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Receipt" size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No transactions yet</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/transactions")}
              >
                Add Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <motion.div
                  key={transaction.Id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === "income" 
                        ? "bg-success/10 text-success" 
                        : "bg-error/10 text-error"
                    }`}>
                      <ApperIcon 
                        name={transaction.type === "income" ? "TrendingUp" : "TrendingDown"} 
                        size={16} 
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.category} • {format(new Date(transaction.date), "MMM dd")}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    transaction.type === "income" ? "text-success" : "text-error"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Goals Progress */}
      {goals.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Savings Goals Progress</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/goals")}
              className="flex items-center space-x-2"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" size={14} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.slice(0, 3).map((goal) => (
              <ProgressCard
                key={goal.Id}
                title={goal.name}
                current={goal.currentAmount}
                target={goal.targetAmount}
                icon="Target"
                color="secondary"
              />
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/transactions")}
            className="flex flex-col items-center space-y-2 h-auto p-4"
          >
            <ApperIcon name="Plus" size={24} />
            <span>Add Transaction</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate("/budgets")}
            className="flex flex-col items-center space-y-2 h-auto p-4"
          >
            <ApperIcon name="Target" size={24} />
            <span>Set Budget</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate("/goals")}
            className="flex flex-col items-center space-y-2 h-auto p-4"
          >
            <ApperIcon name="TrendingUp" size={24} />
            <span>Create Goal</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate("/reports")}
            className="flex flex-col items-center space-y-2 h-auto p-4"
          >
            <ApperIcon name="BarChart3" size={24} />
            <span>View Reports</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;