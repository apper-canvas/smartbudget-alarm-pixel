import categoriesData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoriesData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.categories];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    return this.categories.find(c => c.Id === id);
  }

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = this.categories.length > 0 
      ? Math.max(...this.categories.map(c => c.Id))
      : 0;
    
    const newCategory = {
      Id: maxId + 1,
      ...categoryData
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, categoryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.categories.findIndex(c => c.Id === id);
    
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    this.categories[index] = {
      ...this.categories[index],
      ...categoryData
    };
    
    return { ...this.categories[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.categories.findIndex(c => c.Id === id);
    
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    this.categories.splice(index, 1);
    return true;
  }

  async getByType(type) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.categories.filter(c => c.type === type);
  }

  async getIncomeCategories() {
    return this.getByType("income");
  }

  async getExpenseCategories() {
    return this.getByType("expense");
  }
}

export const categoryService = new CategoryService();