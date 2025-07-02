
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FormsService } from '@/services/formsService';
import { DynamicFormBuilder } from '@/components/DynamicFormBuilder';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FormCreate = () => {
  const { templateId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const template = templateId && user ? FormsService.getFormById(templateId, user) : null;

  const getBackRoute = () => {
    const baseRoute = user?.role === 'CMD' ? '/dashboard/cmd' : 
                     user?.role === 'HOD' ? '/dashboard/hod' : 
                     user?.role === 'STAFF' ? '/dashboard/staff' : 
                     '/dashboard';
    return `${baseRoute}/forms`;
  };

  const getMyFormsRoute = () => {
    const baseRoute = user?.role === 'CMD' ? '/dashboard/cmd' : 
                     user?.role === 'HOD' ? '/dashboard/hod' : 
                     user?.role === 'STAFF' ? '/dashboard/staff' : 
                     '/dashboard';
    return `${baseRoute}/forms/my-forms`;
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-muted-foreground">Please log in to access forms.</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Shield className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Form Not Available</h2>
        <p className="text-muted-foreground">
          The requested form template is not available for your role or could not be found.
        </p>
        <Button onClick={() => navigate(getBackRoute())}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forms
        </Button>
      </div>
    );
  }

  const handleSave = async (formData: any) => {
    // Here you would typically save to your backend/database
    // For now, we'll simulate saving to localStorage
    const savedForm = {
      id: Date.now().toString(),
      templateId: template.id,
      templateName: template.name,
      data: formData,
      createdBy: user?.id,
      createdByRole: user?.role,
      createdByDepartment: user?.department,
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    // Save to localStorage (in production, this would be a database call)
    const existingForms = JSON.parse(localStorage.getItem('digitalForms') || '[]');
    existingForms.push(savedForm);
    localStorage.setItem('digitalForms', JSON.stringify(existingForms));

    console.log('Form saved:', savedForm);
    navigate(getMyFormsRoute());
  };

  const handleExportPDF = async (formData: any) => {
    try {
      // Create a temporary div to render the form data
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      // Build HTML content
      let htmlContent = `
        <div style="margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
          <h1 style="color: #333; margin: 0; font-size: 24px;">${template.name}</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 12px;">Created by: ${user.firstName} ${user.lastName} (${user.role})</p>
        </div>
      `;

      template.fields.forEach(field => {
        const value = formData[field.id];
        if (value) {
          htmlContent += `
            <div style="margin-bottom: 20px;">
              <label style="font-weight: bold; color: #333; display: block; margin-bottom: 5px; font-size: 14px;">
                ${field.label}:
              </label>
              <div style="color: #555; font-size: 14px; line-height: 1.5;">
                ${field.type === 'richtext' ? value : 
                  field.type === 'checkbox' ? (value ? 'Yes' : 'No') : 
                  String(value)}
              </div>
            </div>
          `;
        }
      });

      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        width: 800,
        height: tempDiv.scrollHeight,
        backgroundColor: '#ffffff'
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${template.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);

      toast({
        title: "PDF exported successfully",
        description: "Your form has been exported as a PDF file.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Error exporting PDF",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate(getBackRoute())}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Forms
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">Create {template.name}</h1>
            <Badge variant="outline" className="ml-2">
              {user.role} Form
            </Badge>
          </div>
          <p className="text-muted-foreground">{template.description}</p>
        </div>
      </div>

      <DynamicFormBuilder
        template={template}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
      />
    </div>
  );
};

export default FormCreate;
