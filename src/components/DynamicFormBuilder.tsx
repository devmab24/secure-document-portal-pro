
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormTemplate, FormField } from '@/lib/form-templates';
import { RichTextEditor } from './RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileDown, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DynamicFormBuilderProps {
  template: FormTemplate;
  onSave: (data: any) => void;
  onExportPDF: (data: any) => void;
  initialData?: any;
}

export const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({
  template,
  onSave,
  onExportPDF,
  initialData
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: initialData || {}
  });

  const watchedValues = watch();

  const renderField = (field: FormField) => {
    const fieldError = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={field.required ? 'required' : ''}>
              {field.label}
            </Label>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: controllerField }) => (
                <Input
                  {...controllerField}
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={fieldError ? 'border-destructive' : ''}
                />
              )}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={field.required ? 'required' : ''}>
              {field.label}
            </Label>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: controllerField }) => (
                <Textarea
                  {...controllerField}
                  id={field.id}
                  placeholder={field.placeholder}
                  rows={4}
                  className={fieldError ? 'border-destructive' : ''}
                />
              )}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={field.required ? 'required' : ''}>
              {field.label}
            </Label>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: controllerField }) => (
                <Select
                  onValueChange={controllerField.onChange}
                  value={controllerField.value}
                >
                  <SelectTrigger className={fieldError ? 'border-destructive' : ''}>
                    <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={field.required ? 'required' : ''}>
              {field.label}
            </Label>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: controllerField }) => (
                <Input
                  {...controllerField}
                  id={field.id}
                  type="date"
                  className={fieldError ? 'border-destructive' : ''}
                />
              )}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        );

      case 'richtext':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className={field.required ? 'required' : ''}>
              {field.label}
            </Label>
            <Controller
              name={field.id}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: controllerField }) => (
                <RichTextEditor
                  content={controllerField.value || ''}
                  onChange={controllerField.onChange}
                  placeholder={field.placeholder}
                  className={fieldError ? 'border-destructive' : ''}
                />
              )}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {fieldError && (
              <p className="text-sm text-destructive">{fieldError.message as string}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Controller
                name={field.id}
                control={control}
                render={({ field: controllerField }) => (
                  <Checkbox
                    id={field.id}
                    checked={controllerField.value}
                    onCheckedChange={controllerField.onChange}
                  />
                )}
              />
              <Label htmlFor={field.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {field.label}
              </Label>
            </div>
            {field.description && (
              <p className="text-sm text-muted-foreground ml-6">{field.description}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      toast({
        title: "Form saved successfully",
        description: "Your form data has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error saving form",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = () => {
    onExportPDF(watchedValues);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {template.fields.map(renderField)}
          
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleExportPDF}
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              Export to PDF
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Form'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
