
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FormsService } from '@/services/formsService';
import { FormTemplateWithAccess } from '@/lib/mock/forms';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Users, DollarSign, Settings, Plus, Shield } from 'lucide-react';

const FormTemplates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Get role-specific forms and categories
  const availableForms = user ? FormsService.getAvailableForms(user) : [];
  const availableCategories = user ? FormsService.getAvailableCategories(user) : [];
  const welcomeMessage = user ? FormsService.getRoleWelcomeMessage(user.role) : '';

  const categories = [
    { id: 'clinical', name: 'Clinical', icon: FileText, color: 'bg-blue-500' },
    { id: 'administrative', name: 'Administrative', icon: Users, color: 'bg-green-500' },
    { id: 'financial', name: 'Financial', icon: DollarSign, color: 'bg-yellow-500' },
    { id: 'operational', name: 'Operational', icon: Settings, color: 'bg-purple-500' }
  ].filter(cat => availableCategories.includes(cat.id));

  const filteredForms = availableForms.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = (template: FormTemplateWithAccess) => {
    // Route based on user role
    const baseRoute = user?.role === 'CMD' ? '/dashboard/cmd' : 
                     user?.role === 'HOD' ? '/dashboard/hod' : 
                     user?.role === 'STAFF' ? '/dashboard/staff' : 
                     '/dashboard';
    
    navigate(`${baseRoute}/forms/create/${template.id}`);
  };

  const handleViewMyForms = () => {
    const baseRoute = user?.role === 'CMD' ? '/dashboard/cmd' : 
                     user?.role === 'HOD' ? '/dashboard/hod' : 
                     user?.role === 'STAFF' ? '/dashboard/staff' : 
                     '/dashboard';
    
    navigate(`${baseRoute}/forms/my-forms`);
  };

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    const Icon = categoryData?.icon || FileText;
    return <Icon className="h-5 w-5" />;
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData?.color || 'bg-gray-500';
  };

  if (!user) {
    return <div>Please log in to access forms.</div>;
  }

  return ( 
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Digital Forms</h1>
            <Badge variant="outline" className="ml-2">
              {user.role} Access
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {welcomeMessage}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            You have access to {availableForms.length} form template{availableForms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleViewMyForms}>
          View My Forms 
        </Button>
      </div>

      {availableForms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Forms Available</h3>
            <p className="text-muted-foreground text-center">
              No form templates are available for your current role and department.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search form templates..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Form Templates by Category */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className={`grid w-full grid-cols-${Math.min(categories.length + 1, 5)}`}>
              <TabsTrigger value="all">All Forms</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredForms.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${getCategoryColor(template.category)} text-white w-fit`}>
                          {getCategoryIcon(template.category)}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline">{template.documentType}</Badge>
                          {template.access.roles.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              Shared
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.fields.length} fields
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {template.category}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTemplateSelect(template)}
                          className="bg-hospital-600 hover:bg-hospital-700"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Create
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {FormsService.getFormsByCategory(category.id, user).map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-lg ${getCategoryColor(template.category)} text-white w-fit`}>
                            {getCategoryIcon(template.category)}
                          </div>
                          <Badge variant="outline">{template.documentType}</Badge>
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {template.fields.length} fields
                          </Badge>
                          <Button
                            size="sm"
                            onClick={() => handleTemplateSelect(template)}
                            className="bg-hospital-600 hover:bg-hospital-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Create
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

export default FormTemplates;
