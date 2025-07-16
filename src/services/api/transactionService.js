import transactionsData from "../mockData/transactions.json";

let transactions = [...transactionsData];

const transactionService = {
  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...transactions]);
      }, 300);
    });
  },

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transaction = transactions.find(t => t.Id === parseInt(id));
        if (transaction) {
          resolve({ ...transaction });
        } else {
          reject(new Error("Transaction not found"));
        }
      }, 200);
    });
  },

  async getByFarm(farmId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const farmTransactions = transactions.filter(t => t.farmId === farmId.toString());
        resolve([...farmTransactions]);
      }, 250);
    });
  },

  async create(transactionData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction = {
          ...transactionData,
          Id: Math.max(...transactions.map(t => t.Id)) + 1
        };
        transactions.push(newTransaction);
        resolve({ ...newTransaction });
      }, 400);
    });
  },

  async update(id, transactionData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = transactions.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          transactions[index] = { ...transactions[index], ...transactionData };
          resolve({ ...transactions[index] });
        } else {
          reject(new Error("Transaction not found"));
        }
      }, 350);
    });
  },

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = transactions.findIndex(t => t.Id === parseInt(id));
        if (index !== -1) {
          transactions.splice(index, 1);
          resolve();
        } else {
          reject(new Error("Transaction not found"));
        }
      }, 250);
    });
  }
};

export default transactionService;