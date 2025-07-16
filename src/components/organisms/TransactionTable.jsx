import { format } from "date-fns";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "seeds": return "Seed";
      case "fertilizer": return "Sprout";
      case "equipment": return "Wrench";
      case "labor": return "Users";
      case "fuel": return "Fuel";
      case "crop sales": return "DollarSign";
      case "livestock": return "Cow";
      default: return "DollarSign";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-forest-500 to-forest-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Type</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Category</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Description</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Payment</th>
              <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-gray-700">
                  {format(new Date(transaction.date), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={transaction.type === "income" ? "income" : "expense"}>
                    {transaction.type}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <ApperIcon name={getCategoryIcon(transaction.category)} size={16} className="text-gray-500" />
                    <span className="text-gray-700">{transaction.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{transaction.description}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{transaction.paymentMethod}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 text-gray-500 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <ApperIcon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.Id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;