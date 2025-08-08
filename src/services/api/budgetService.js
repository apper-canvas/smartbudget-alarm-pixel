import budgetsData from "@/services/mockData/budgets.json";

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.budgets];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.budgets.find(b => b.Id === id);
  }

  async create(budgetData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = this.budgets.length > 0 
      ? Math.max(...this.budgets.map(b => b.Id))
      : 0;
    
    const newBudget = {
      Id: maxId + 1,
      ...budgetData
    };
    
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, budgetData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.budgets.findIndex(b => b.Id === id);
    
    if (index === -1) {
      throw new Error("Budget not found");
    }
    
    this.budgets[index] = {
      ...this.budgets[index],
      ...budgetData
    };
    
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.budgets.findIndex(b => b.Id === id);
    
    if (index === -1) {
      throw new Error("Budget not found");
    }
    
    this.budgets.splice(index, 1);
    return true;
  }

  async getByMonth(month) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.budgets.filter(b => b.month === month);
  }

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.budgets.filter(b => b.category === category);
  }
}

export const budgetService = new BudgetService();