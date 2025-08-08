import savingsGoalsData from "@/services/mockData/savingsGoals.json";

class SavingsGoalService {
  constructor() {
    this.savingsGoals = [...savingsGoalsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.savingsGoals];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.savingsGoals.find(g => g.Id === id);
  }

  async create(goalData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = this.savingsGoals.length > 0 
      ? Math.max(...this.savingsGoals.map(g => g.Id))
      : 0;
    
    const newGoal = {
      Id: maxId + 1,
      ...goalData,
      createdAt: new Date().toISOString()
    };
    
    this.savingsGoals.push(newGoal);
    return { ...newGoal };
  }

  async update(id, goalData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.savingsGoals.findIndex(g => g.Id === id);
    
    if (index === -1) {
      throw new Error("Savings goal not found");
    }
    
    this.savingsGoals[index] = {
      ...this.savingsGoals[index],
      ...goalData
    };
    
    return { ...this.savingsGoals[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.savingsGoals.findIndex(g => g.Id === id);
    
    if (index === -1) {
      throw new Error("Savings goal not found");
    }
    
    this.savingsGoals.splice(index, 1);
    return true;
  }

  async addContribution(id, amount) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const goal = this.savingsGoals.find(g => g.Id === id);
    
    if (!goal) {
      throw new Error("Savings goal not found");
    }
    
    goal.currentAmount += amount;
    return { ...goal };
  }
}

export const savingsGoalService = new SavingsGoalService();