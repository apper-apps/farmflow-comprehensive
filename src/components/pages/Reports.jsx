import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";
import { format, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import transactionService from "@/services/api/transactionService";
import expenseSummaryService from "@/services/api/expenseSummaryService";
import incomeSummaryService from "@/services/api/incomeSummaryService";

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [summaries, setSummaries] = useState({ expenses: [], income: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [generateSummaries, setGenerateSummaries] = useState(false);
  const [summaryPeriod, setSummaryPeriod] = useState("monthly");
const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [transactionsData, expenseSummariesData, incomeSummariesData] = await Promise.all([
        transactionService.getAll(),
        expenseSummaryService.getAll(),
        incomeSummaryService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setSummaries({
        expenses: expenseSummariesData,
        income: incomeSummariesData
      });
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  const generateSummaryData = async () => {
    try {
      setGenerateSummaries(true);
      const yearTransactions = getTransactionsForYear(selectedYear);
      
      if (summaryPeriod === "monthly") {
        // Generate monthly summaries
        for (let month = 0; month < 12; month++) {
          const startDate = format(startOfMonth(new Date(selectedYear, month, 1)), 'yyyy-MM-dd');
          const endDate = format(endOfMonth(new Date(selectedYear, month, 1)), 'yyyy-MM-dd');
          
          const monthTransactions = yearTransactions.filter(t => {
            const transactionDate = parseISO(t.date);
            return transactionDate.getMonth() === month;
          });
          
          const expenseTotal = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const incomeTotal = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          if (expenseTotal > 0) {
            await expenseSummaryService.create({
              period_type: "monthly",
              total_amount: expenseTotal,
              period_start_date: startDate,
              period_end_date: endDate
            });
          }
          
          if (incomeTotal > 0) {
            await incomeSummaryService.create({
              period_type: "monthly",
              total_amount: incomeTotal,
              period_start_date: startDate,
              period_end_date: endDate
            });
          }
        }
      } else if (summaryPeriod === "seasonal") {
        // Generate seasonal summaries
        const seasons = [
          { name: "Spring", months: [0, 1, 2] },
          { name: "Summer", months: [3, 4, 5] },
          { name: "Fall", months: [6, 7, 8] },
          { name: "Winter", months: [9, 10, 11] }
        ];
        
        for (const season of seasons) {
          const seasonTransactions = yearTransactions.filter(t => {
            const month = parseISO(t.date).getMonth();
            return season.months.includes(month);
          });
          
          const startDate = format(startOfQuarter(new Date(selectedYear, season.months[0], 1)), 'yyyy-MM-dd');
          const endDate = format(endOfQuarter(new Date(selectedYear, season.months[2], 1)), 'yyyy-MM-dd');
          
          const expenseTotal = seasonTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          
          const incomeTotal = seasonTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
          
          if (expenseTotal > 0) {
            await expenseSummaryService.create({
              period_type: "seasonal",
              total_amount: expenseTotal,
              period_start_date: startDate,
              period_end_date: endDate
            });
          }
          
          if (incomeTotal > 0) {
            await incomeSummaryService.create({
              period_type: "seasonal",
              total_amount: incomeTotal,
              period_start_date: startDate,
              period_end_date: endDate
            });
          }
        }
      }
      
      toast.success("Financial summaries generated successfully");
      await loadData(); // Reload data to show new summaries
    } catch (err) {
      toast.error("Failed to generate summaries");
      console.error("Error generating summaries:", err);
    } finally {
      setGenerateSummaries(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter transactions by year
  const getTransactionsForYear = (year) => {
    return transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return transactionDate.getFullYear() === year;
    });
  };

  // Get available years from transactions
  const getAvailableYears = () => {
    const years = new Set();
    transactions.forEach(t => {
      const year = parseISO(t.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  // Group transactions by month
  const getMonthlyData = () => {
    const yearTransactions = getTransactionsForYear(selectedYear);
    const monthlyData = {};
    
    // Initialize all months
    for (let i = 0; i < 12; i++) {
      const monthKey = format(new Date(selectedYear, i, 1), 'MMM');
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    
    yearTransactions.forEach(transaction => {
      const month = format(parseISO(transaction.date), 'MMM');
      if (transaction.type === 'income') {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });
    
    return monthlyData;
  };

// Group transactions by quarter/season
  const getSeasonalData = () => {
    const yearTransactions = getTransactionsForYear(selectedYear);
    const seasonalData = {
      'Spring': { income: 0, expenses: 0 },
      'Summer': { income: 0, expenses: 0 },
      'Fall': { income: 0, expenses: 0 },
      'Winter': { income: 0, expenses: 0 }
    };
    
    yearTransactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const month = date.getMonth();
      
      let season;
      if (month >= 0 && month <= 2) season = 'Spring';
      else if (month >= 3 && month <= 5) season = 'Summer';
      else if (month >= 6 && month <= 8) season = 'Fall';
      else season = 'Winter';
      
      if (transaction.type === 'income') {
        seasonalData[season].income += transaction.amount;
      } else {
        seasonalData[season].expenses += transaction.amount;
      }
    });
    
    return seasonalData;
  };

  // Get category breakdown
  const getCategoryBreakdown = () => {
    const yearTransactions = getTransactionsForYear(selectedYear);
    const categories = {};
    
    yearTransactions.forEach(transaction => {
      if (!categories[transaction.category]) {
        categories[transaction.category] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        categories[transaction.category].income += transaction.amount;
      } else {
        categories[transaction.category].expenses += transaction.amount;
      }
    });
    
    return categories;
  };

  // Calculate totals for the year
  const getYearlyTotals = () => {
    const yearTransactions = getTransactionsForYear(selectedYear);
    const totals = { income: 0, expenses: 0 };
    
    yearTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        totals.income += transaction.amount;
      } else {
        totals.expenses += transaction.amount;
      }
    });
    
    return totals;
  };

// Prepare chart data
  const getChartData = () => {
    const data = period === 'monthly' ? getMonthlyData() : 
                 period === 'seasonal' ? getSeasonalData() : getSeasonalData();
    const categories = Object.keys(data);
    const incomeData = categories.map(cat => data[cat].income);
    const expenseData = categories.map(cat => data[cat].expenses);
    
    return { categories, incomeData, expenseData };
  };

  // Chart options
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#10B981', '#EF4444'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: getChartData().categories,
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280'
        },
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3
    }
  };

  const pieChartOptions = {
    chart: {
      type: 'pie',
      height: 350
    },
    colors: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'],
    labels: Object.keys(getCategoryBreakdown()),
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`
    },
    legend: {
      position: 'bottom'
    }
  };

  const availableYears = getAvailableYears();
  const chartData = getChartData();
  const categoryData = getCategoryBreakdown();
  const yearlyTotals = getYearlyTotals();

  if (loading) {
    return <Loading type="table" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (transactions.length === 0) {
    return (
      <Empty
        icon="BarChart3"
        title="No transaction data available"
        description="Add some transactions to view financial reports and analytics."
        actionLabel="Go to Finance"
        onAction={() => window.location.href = '/finance'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial analysis and insights</p>
        </motion.div>
<div className="flex items-center gap-4">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "seasonal", label: "Seasonal" }
            ]}
          />
          <Select
            value={selectedYear.toString()}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            options={availableYears.map(year => ({ value: year.toString(), label: year.toString() }))}
          />
          <div className="flex items-center gap-2">
            <Select
              value={summaryPeriod}
              onChange={(e) => setSummaryPeriod(e.target.value)}
              options={[
                { value: "monthly", label: "Monthly Summaries" },
                { value: "seasonal", label: "Seasonal Summaries" }
              ]}
            />
            <Button
              onClick={generateSummaryData}
              disabled={generateSummaries}
              variant="outline"
              size="sm"
            >
              {generateSummaries ? (
                <>
                  <ApperIcon name="Loader2" className="animate-spin mr-2" size={16} />
                  Generating...
                </>
              ) : (
                <>
                  <ApperIcon name="BarChart3" className="mr-2" size={16} />
                  Generate Summary
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={`Total Income (${selectedYear})`}
          value={`$${yearlyTotals.income.toLocaleString()}`}
          icon="TrendingUp"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title={`Total Expenses (${selectedYear})`}
          value={`$${yearlyTotals.expenses.toLocaleString()}`}
          icon="TrendingDown"
          gradient="from-red-500 to-red-600"
        />
        <StatCard
          title={`Net Profit (${selectedYear})`}
          value={`$${(yearlyTotals.income - yearlyTotals.expenses).toLocaleString()}`}
          icon="DollarSign"
          gradient={yearlyTotals.income - yearlyTotals.expenses >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
<h3 className="text-xl font-bold text-gray-900 mb-4">
            Income vs Expenses - {period === 'monthly' ? 'Monthly' : 'Seasonal'} ({selectedYear})
          </h3>
          <Chart
            options={lineChartOptions}
            series={[
              {
                name: 'Income',
                data: chartData.incomeData
              },
              {
                name: 'Expenses',
                data: chartData.expenseData
              }
            ]}
            type="line"
            height={350}
          />
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Expense Categories ({selectedYear})
          </h3>
          <Chart
            options={pieChartOptions}
            series={Object.values(categoryData).map(cat => cat.expenses)}
            type="pie"
            height={350}
          />
        </motion.div>
      </div>

      {/* Monthly/Quarterly Breakdown Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
<div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {period === 'monthly' ? 'Monthly' : 'Seasonal'} Breakdown ({selectedYear})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Profit
                </th>
              </tr>
            </thead>
<tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(period === 'monthly' ? getMonthlyData() : getSeasonalData()).map(([period, data]) => (
                <tr key={period} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ${data.income.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    ${data.expenses.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    data.income - data.expenses >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${(data.income - data.expenses).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Category Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            Category Analysis ({selectedYear})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(categoryData).map(([category, data]) => (
                <tr key={category} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    ${data.income.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    ${data.expenses.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    data.income - data.expenses >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${(data.income - data.expenses).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;