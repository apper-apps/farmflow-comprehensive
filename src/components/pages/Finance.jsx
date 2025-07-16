import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import StatCard from "@/components/molecules/StatCard";
import TransactionTable from "@/components/organisms/TransactionTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import transactionService from "@/services/api/transactionService";
import farmService from "@/services/api/farmService";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [farms, setFarms] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    farmId: "",
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: "",
    paymentMethod: "cash"
  });

  const expenseCategories = [
    { value: "seeds", label: "Seeds" },
    { value: "fertilizer", label: "Fertilizer" },
    { value: "equipment", label: "Equipment" },
    { value: "labor", label: "Labor" },
    { value: "fuel", label: "Fuel" },
    { value: "utilities", label: "Utilities" },
    { value: "maintenance", label: "Maintenance" },
    { value: "other", label: "Other" }
  ];

  const incomeCategories = [
    { value: "crop sales", label: "Crop Sales" },
    { value: "livestock", label: "Livestock" },
    { value: "equipment rental", label: "Equipment Rental" },
    { value: "consulting", label: "Consulting" },
    { value: "grants", label: "Grants" },
    { value: "other", label: "Other" }
  ];

  const paymentMethods = [
    { value: "cash", label: "Cash" },
    { value: "credit card", label: "Credit Card" },
    { value: "bank transfer", label: "Bank Transfer" },
    { value: "check", label: "Check" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [transactionsData, farmsData] = await Promise.all([
        transactionService.getAll(),
        farmService.getAll()
      ]);

      setTransactions(transactionsData);
      setFarms(farmsData);
      setFilteredTransactions(transactionsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    if (activeTab === "income") {
      filtered = filtered.filter(t => t.type === "income");
    } else if (activeTab === "expenses") {
      filtered = filtered.filter(t => t.type === "expense");
    }

    setFilteredTransactions(filtered);
  }, [transactions, activeTab]);

  const handleSearch = (searchTerm) => {
    const filtered = transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (editingTransaction) {
        await transactionService.update(editingTransaction.Id, transactionData);
        setTransactions(prevTransactions => 
          prevTransactions.map(transaction => 
            transaction.Id === editingTransaction.Id ? { ...transaction, ...transactionData } : transaction
          )
        );
        toast.success("Transaction updated successfully!");
      } else {
        const newTransaction = await transactionService.create(transactionData);
        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
        toast.success("Transaction created successfully!");
      }
      
      setShowForm(false);
      setEditingTransaction(null);
      setFormData({
        farmId: "",
        type: "expense",
        category: "",
        amount: "",
        description: "",
        date: "",
        paymentMethod: "cash"
      });
      loadData();
    } catch (err) {
      toast.error("Failed to save transaction");
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      farmId: transaction.farmId,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date.split("T")[0],
      paymentMethod: transaction.paymentMethod
    });
    setShowForm(true);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(transactionId);
        setTransactions(prevTransactions => prevTransactions.filter(transaction => transaction.Id !== transactionId));
        toast.success("Transaction deleted successfully!");
        loadData();
      } catch (err) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetProfit = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  if (loading) {
    return <Loading type="table" count={8} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-600 mt-1">Track your farm income and expenses</p>
        </motion.div>
        
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          Add Transaction
        </Button>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income"
          value={`$${getTotalIncome().toLocaleString()}`}
          icon="TrendingUp"
          gradient="from-green-500 to-green-600"
        />
        <StatCard
          title="Total Expenses"
          value={`$${getTotalExpenses().toLocaleString()}`}
          icon="TrendingDown"
          gradient="from-red-500 to-red-600"
        />
        <StatCard
          title="Net Profit"
          value={`$${getNetProfit().toLocaleString()}`}
          icon="DollarSign"
          gradient={getNetProfit() >= 0 ? "from-green-500 to-green-600" : "from-red-500 to-red-600"}
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {["all", "income", "expenses"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              activeTab === tab
                ? "bg-white text-forest-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search */}
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search transactions by description or category..."
      />

      {/* Transaction Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Farm" required>
                <Select
                  value={formData.farmId}
                  onChange={(e) => setFormData({...formData, farmId: e.target.value})}
                  options={farms.map(farm => ({ value: farm.Id.toString(), label: farm.name }))}
                  placeholder="Select a farm"
                  required
                />
              </FormField>

              <FormField label="Type" required>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value, category: ""})}
                  options={[
                    { value: "income", label: "Income" },
                    { value: "expense", label: "Expense" }
                  ]}
                  required
                />
              </FormField>

              <FormField label="Category" required>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  options={formData.type === "income" ? incomeCategories : expenseCategories}
                  placeholder="Select a category"
                  required
                />
              </FormField>

              <FormField label="Amount" required>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </FormField>

              <FormField label="Description" required>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Transaction description"
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date" required>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </FormField>
                
                <FormField label="Payment Method" required>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    options={paymentMethods}
                    required
                  />
                </FormField>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                    setFormData({
                      farmId: "",
                      type: "expense",
                      category: "",
                      amount: "",
                      description: "",
                      date: "",
                      paymentMethod: "cash"
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingTransaction ? "Update Transaction" : "Create Transaction"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <Empty
          icon="DollarSign"
          title="No transactions found"
          description="Start tracking your farm finances by adding your first transaction."
          actionLabel="Add Transaction"
          onAction={() => setShowForm(true)}
        />
      )}
    </div>
  );
};

export default Finance;