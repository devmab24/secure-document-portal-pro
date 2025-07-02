import { MockUser } from '../../../mock-db/index';

const BASE_URL = '/mock-db';

export class UsersAPI {
  static async getUsers(): Promise<MockUser[]> {
    const response = await fetch(`${BASE_URL}/users.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return response.json();
  }

  static async getUserById(id: string): Promise<MockUser | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static async getUsersByRole(role: string): Promise<MockUser[]> {
    const users = await this.getUsers();
    return users.filter(user => user.role === role);
  }

  static async getUsersByDepartment(department: string): Promise<MockUser[]> {
    const users = await this.getUsers();
    return users.filter(user => user.department === department);
  }

  static async createUser(userData: Omit<MockUser, 'id' | 'createdAt'>): Promise<MockUser> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: MockUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    // In a real implementation, this would save to the backend
    console.log('Creating user:', newUser);
    return newUser;
  }

  static async updateUser(id: string, updates: Partial<MockUser>): Promise<MockUser> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = await this.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = { ...user, ...updates };
    console.log('Updating user:', updatedUser);
    return updatedUser;
  }

  static async deleteUser(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleting user:', id);
  }
}
