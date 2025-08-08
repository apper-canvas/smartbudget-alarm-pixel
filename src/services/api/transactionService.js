import transactionsData from "@/services/mockData/transactions.json";

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.transactions];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.transactions.find(t => t.Id === id);
  }

  async create(transactionData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = this.transactions.length > 0 
      ? Math.max(...this.transactions.map(t => t.Id))
      : 0;
    
    const newTransaction = {
      Id: maxId + 1,
      ...transactionData,
      createdAt: new Date().toISOString()
    };
    
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.transactions.findIndex(t => t.Id === id);
    
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    
    this.transactions[index] = {
      ...this.transactions[index],
      ...transactionData
    };
    
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.transactions.findIndex(t => t.Id === id);
    
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    
    this.transactions.splice(index, 1);
    return true;
  }

  async getByDateRange(startDate, endDate) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  }

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.transactions.filter(t => t.category === category);
  }

  async getByType(type) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.transactions.filter(t => t.type === type);
  }
}

export const transactionService = new TransactionService();