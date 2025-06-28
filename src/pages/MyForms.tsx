
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Search, 
  FileText, 
  ArrowLeft, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface SavedForm {
  id: string;
  templateId: string;
  templateName: string;
  data: any;
  createdBy: string;
  createdAt: string;
  status: 'draft' | 'submitted' | 'approved';
}

const MyForms = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);

  useEffect(() => {
    // Load saved forms from localStorage (in production, this would be an API call)
    const forms = JSON.parse(localStorage.getItem('digitalForms') || '[]');
    const userForms = forms.filter((form: SavedForm) => form.createdBy === user?.id);
    setSavedForms(userForms);
  }, [user?.id]);

  const filteredForms = savedForms.filter(form =>
    form.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteForm = (formId: string) => {
    const updatedForms = savedForms.filter(form => form.id !== formId);
    setSavedForms(updatedForms);
    
    // Update localStorage
    const allForms = JSON.parse(localStorage.getItem('digitalForms') || '[]');
    const filteredAllForms = allForms.filter((form: SavedForm) => form.id !== formId);
    localStorage.setItem('digitalForms', JSON.stringify(filteredAllForms));
    
    toast({
      title: "Form deleted",
      description: "The form has been successfully deleted.",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'submitted':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/forms')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
            <p className="text-muted-foreground">
              View and manage your saved digital forms
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate('/forms')}
          className="bg-hospital-600 hover:bg-hospital-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search forms..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Forms List */}
      {filteredForms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No forms found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm ? 'No forms match your search criteria.' : 'You haven\'t created any forms yet.'}
            </p>
            <Button
              onClick={() => navigate('/forms')}
              className="bg-hospital-600 hover:bg-hospital-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Saved Forms ({filteredForms.length})</CardTitle>
            <CardDescription>
              Your digital forms are stored as structured data and can be exported to PDF when needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{form.templateName}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {form.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(form.status)}>
                        {form.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(form.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/forms/view/${form.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/forms/edit/${form.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteForm(form.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyForms;
