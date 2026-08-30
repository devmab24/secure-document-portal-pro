
import { User, UserRole } from '@/lib/types';
import { 
  mockFormTemplates, 
  getFormsByRole, 
  getFormsByCategory, 
  getFormById,
  canUserAccessForm,
  FormTemplateWithAccess
} from '@/lib/mock/forms';

export class FormsService {
  // Get forms available to a specific user
  static getAvailableForms(user: User): FormTemplateWithAccess[] {
    return getFormsByRole(user.role, user.department);
  }

  // Get forms by category for a specific user
  static getFormsByCategory(category: string, user: User): FormTemplateWithAccess[] {
    return getFormsByCategory(category, user.role, user.department);
  }

  // Get a specific form if user has access
  static getFormById(formId: string, user: User): FormTemplateWithAccess | null {
    const form = getFormById(formId);
    if (!form) return null;

    const hasAccess = canUserAccessForm(formId, user.role, user.department);
    return hasAccess ? form : null;
  }

  // Check if user can access a form
  static canUserAccessForm(formId: string, user: User): boolean {
    return canUserAccessForm(formId, user.role, user.department);
  }

  // Get categories available to a user
  static getAvailableCategories(user: User): string[] {
    const userForms = this.getAvailableForms(user);
    const categories = [...new Set(userForms.map(form => form.category))];
    return categories;
  }

  // Get role-specific welcome message
  static getRoleWelcomeMessage(role: UserRole): string {
    switch (role) {
      case UserRole.CMD:
        return 'Create hospital-wide policies and executive directives';
      case UserRole.HOD:
        return 'Manage department forms including budget requests and staff evaluations';
      case UserRole.STAFF:
        return 'Access department-specific forms and submit applications';
      case UserRole.ADMIN:
        return 'Manage user accounts and administrative processes';
      case UserRole.SUPER_ADMIN:
        return 'Full access to all administrative and system forms';
      default:
        return 'Create and manage your digital forms';
    }
  }
}
