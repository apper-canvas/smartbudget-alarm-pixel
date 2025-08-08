import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const SpendingCharts = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chartType, setChartType] = useState("pie");
  const [timeRange, setTimeRange] = useState(6);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transaction data");
    } finally {
      setLoading(false);
    }
  };

  // Prepare pie chart data for current month expenses
  const preparePieChartData = () => {
    const currentMonth = new Date();
    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    
    const currentMonthExpenses = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === "expense" && 
             transactionDate >= startDate && 
             transactionDate <= endDate;
    });

    const categoryTotals = currentMonthExpenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    return {
      series: amounts,
      options: {
        chart: {
          type: "pie",
          height: 350,
        },
        labels: categories,
        colors: [
          "#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444",
          "#8B5CF6", "#06B6D4", "#84CC16", "#F97316", "#EC4899"
        ],
        legend: {
          position: "bottom",
          horizontalAlign: "center",
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            const amount = opts.w.config.series[opts.seriesIndex];
            return "$" + amount.toFixed(0);
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$" + val.toFixed(2);
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: "bottom"
            }
          }
        }]
      }
    };
  };

  // Prepare line chart data for spending trends
  const prepareLineChartData = () => {
    const months = [];
    const expenseData = [];
    const incomeData = [];

    for (let i = timeRange - 1; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStr = format(monthDate, "MMM yyyy");
      const startDate = startOfMonth(monthDate);
      const endDate = endOfMonth(monthDate);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      const monthExpenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
        
      const monthIncome = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      months.push(monthStr);
      expenseData.push(monthExpenses);
      incomeData.push(monthIncome);
    }

    return {
      series: [
        {
          name: "Expenses",
          data: expenseData,
          color: "#EF4444"
        },
        {
          name: "Income",
          data: incomeData,
          color: "#10B981"
        }
      ],
      options: {
        chart: {
          type: "line",
          height: 350,
          zoom: {
            enabled: false
          }
        },
        xaxis: {
          categories: months,
        },
        yaxis: {
          labels: {
            formatter: function (val) {
              return "$" + val.toFixed(0);
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$" + val.toFixed(2);
            }
          }
        },
        stroke: {
          curve: "smooth",
          width: 3
        },
        markers: {
          size: 6,
          hover: {
            size: 8
          }
        },
        grid: {
          borderColor: "#f1f5f9",
          strokeDashArray: 5,
        }
      }
    };
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  const pieData = preparePieChartData();
  const lineData = prepareLineChartData();
  const hasExpenseData = pieData.series.length > 0;
  const hasTransactionData = transactions.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Spending Analysis</h2>
          <p className="text-gray-600">Visualize your financial patterns and trends</p>
        </div>
        
        <div className="flex space-x-4">
          <div className="flex rounded-lg border border-gray-200 bg-white p-1">
            <Button
              variant={chartType === "pie" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setChartType("pie")}
              className="px-4 py-2"
            >
              <ApperIcon name="PieChart" size={16} className="mr-2" />
              Categories
            </Button>
            <Button
              variant={chartType === "line" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setChartType("line")}
              className="px-4 py-2"
            >
              <ApperIcon name="TrendingUp" size={16} className="mr-2" />
              Trends
            </Button>
          </div>
          
          {chartType === "line" && (
            <div className="flex rounded-lg border border-gray-200 bg-white p-1">
              {[3, 6, 12].map(months => (
                <Button
                  key={months}
                  variant={timeRange === months ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(months)}
                  className="px-3 py-2"
                >
                  {months}M
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!hasTransactionData ? (
        <Empty
          title="No transaction data"
          description="Add some transactions to see your spending analysis and charts."
          icon="BarChart3"
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Main Chart */}
          <motion.div
            key={chartType}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="xl:col-span-2"
          >
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {chartType === "pie" ? "Current Month Expenses by Category" : "Income vs Expenses Trend"}
                </h3>
                <p className="text-sm text-gray-500">
                  {chartType === "pie" 
                    ? `Breakdown of your spending for ${format(new Date(), "MMMM yyyy")}`
                    : `Financial trends over the last ${timeRange} months`
                  }
                </p>
              </div>
              
              {chartType === "pie" ? (
                hasExpenseData ? (
                  <Chart
                    options={pieData.options}
                    series={pieData.series}
                    type="pie"
                    height={400}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <ApperIcon name="PieChart" size={48} className="mb-4" />
                    <p className="text-lg font-medium">No expenses this month</p>
                    <p className="text-sm">Start adding expenses to see category breakdown</p>
                  </div>
                )
              ) : (
                <Chart
                  options={lineData.options}
                  series={lineData.series}
                  type="line"
                  height={400}
                />
              )}
            </Card>
          </motion.div>

          {/* Summary Stats */}
          {hasExpenseData && chartType === "pie" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="xl:col-span-2"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Summary</h3>
                <div className="space-y-3">
                  {pieData.options.labels.map((category, index) => {
                    const amount = pieData.series[index];
                    const percentage = ((amount / pieData.series.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                    const color = pieData.options.colors[index];
                    
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium text-gray-900">{category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpendingCharts;