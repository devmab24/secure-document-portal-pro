
import { MockFormTemplate } from '../../mock-db/index';

const BASE_URL = '/mock-db';

export class FormTemplatesAPI {
  static async getFormTemplates(): Promise<MockFormTemplate[]> {
    const response = await fetch(`${BASE_URL}/formTemplates.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch form templates');
    }
    return response.json();
  }

  static async getFormTemplateById(id: string): Promise<MockFormTemplate | null> {
    const templates = await this.getFormTemplates();
    return templates.find(template => template.id === id) || null;
  }

  static async getFormTemplatesByRole(role: string): Promise<MockFormTemplate[]> {
    const templates = await this.getFormTemplates();
    return templates.filter(template => template.accessRoles.includes(role));
  }

  static async getFormTemplatesByDepartment(department: string): Promise<MockFormTemplate[]> {
    const templates = await this.getFormTemplates();
    return templates.filter(template => 
      !template.accessDepartments || template.accessDepartments.includes(department)
    );
  }

  static async createFormTemplate(templateData: Omit<MockFormTemplate, 'id' | 'createdAt'>): Promise<MockFormTemplate> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTemplate: MockFormTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating form template:', newTemplate);
    return newTemplate;
  }

  static async updateFormTemplate(id: string, updates: Partial<MockFormTemplate>): Promise<MockFormTemplate> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const templates = await this.getFormTemplates();
    const template = templates.find(t => t.id === id);
    if (!template) {
      throw new Error('Form template not found');
    }
    
    const updatedTemplate = { ...template, ...updates };
    console.log('Updating form template:', updatedTemplate);
    return updatedTemplate;
  }

  static async deleteFormTemplate(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Deleting form template:', id);
  }
}
