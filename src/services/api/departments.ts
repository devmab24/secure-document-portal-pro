
import { MockDepartment } from '../../mock-db';

const BASE_URL = '/mock-db';

export class DepartmentsAPI {
  static async getDepartments(): Promise<MockDepartment[]> {
    const response = await fetch(`${BASE_URL}/departments.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }
    return response.json();
  }

  static async getDepartmentById(id: string): Promise<MockDepartment | null> {
    const departments = await this.getDepartments();
    return departments.find(dept => dept.id === id) || null;
  }

  static async getDepartmentByCode(code: string): Promise<MockDepartment | null> {
    const departments = await this.getDepartments();
    return departments.find(dept => dept.code === code) || null;
  }

  static async createDepartment(deptData: Omit<MockDepartment, 'id' | 'createdAt'>): Promise<MockDepartment> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDepartment: MockDepartment = {
      ...deptData,
      id: `dept-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating department:', newDepartment);
    return newDepartment;
  }

  static async updateDepartment(id: string, updates: Partial<MockDepartment>): Promise<MockDepartment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const departments = await this.getDepartments();
    const department = departments.find(dept => dept.id === id);
    if (!department) {
      throw new Error('Department not found');
    }
    
    const updatedDepartment = { ...department, ...updates };
    console.log('Updating department:', updatedDepartment);
    return updatedDepartment;
  }
}
