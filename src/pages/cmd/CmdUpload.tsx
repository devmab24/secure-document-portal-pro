
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CmdUpload = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMD Document Upload</h1>
          <p className="text-muted-foreground">Upload and manage documents across all departments</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Department Upload
            </CardTitle>
            <CardDescription>
              Upload documents for multiple departments simultaneously
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop files here or click to select
                </p>
                <Button>Select Files</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Templates
            </CardTitle>
            <CardDescription>
              Access and manage department-specific document templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Hospital Policy Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Department Procedure Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Compliance Document Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent CMD Uploads</CardTitle>
          <CardDescription>
            Documents recently uploaded through the CMD interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent uploads found</p>
            <p className="text-sm">Documents uploaded will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CmdUpload;
