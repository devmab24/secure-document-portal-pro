
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Eye, RotateCcw, Clock, User } from 'lucide-react';
import { Document, DocumentVersion, User as UserType, UserRole } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface DocumentVersionHistoryProps {
  document: Document;
  onRestoreVersion?: (versionId: string) => void;
  getUserById?: (userId: string) => UserType | undefined;
}

export const DocumentVersionHistory: React.FC<DocumentVersionHistoryProps> = ({
  document,
  onRestoreVersion,
  getUserById
}) => {
  const { user } = useAuth();
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const canRestoreVersions = user && (
    user.role === UserRole.CMD || 
    user.role === UserRole.ADMIN || 
    user.role === UserRole.SUPER_ADMIN ||
    user.id === document.uploadedBy
  );

  const versions = document.versions || [];
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  const handleRestoreVersion = (versionId: string) => {
    if (onRestoreVersion) {
      onRestoreVersion(versionId);
      setIsOpen(false);
    }
  };

  const getVersionUser = (userId: string) => {
    if (getUserById) {
      const versionUser = getUserById(userId);
      return versionUser ? `${versionUser.firstName} ${versionUser.lastName}` : 'Unknown User';
    }
    return userId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Version History ({versions.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version History - {document.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh]">
          {/* Version List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Versions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-2 p-4">
                  {sortedVersions.map((version, index) => (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedVersion?.id === version.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedVersion(version)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            v{version.version}
                          </Badge>
                          {index === 0 && (
                            <Badge variant="outline" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(version.modifiedAt, 'MMM d, HH:mm')}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          {getVersionUser(version.modifiedBy)}
                        </div>
                        {version.changeDescription && (
                          <p className="text-sm text-muted-foreground">
                            {version.changeDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {versions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No version history available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Version Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Version Preview
                {selectedVersion && canRestoreVersions && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreVersion(selectedVersion.id)}
                    disabled={selectedVersion.version === document.version}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedVersion ? (
                <ScrollArea className="h-[50vh]">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Version:</strong> {selectedVersion.version}
                      </div>
                      <div>
                        <strong>Modified:</strong> {format(selectedVersion.modifiedAt, 'PPp')}
                      </div>
                      <div>
                        <strong>Author:</strong> {getVersionUser(selectedVersion.modifiedBy)}
                      </div>
                      <div>
                        <strong>Size:</strong> {selectedVersion.fileSize ? `${(selectedVersion.fileSize / 1024).toFixed(1)} KB` : 'N/A'}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {selectedVersion.changeDescription && (
                      <div>
                        <strong className="text-sm">Changes:</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedVersion.changeDescription}
                        </p>
                      </div>
                    )}
                    
                    {selectedVersion.content && (
                      <div>
                        <strong className="text-sm">Content Preview:</strong>
                        <div className="mt-2 p-3 bg-muted rounded text-sm max-h-40 overflow-y-auto">
                          <pre className="whitespace-pre-wrap">
                            {typeof selectedVersion.content === 'string' 
                              ? selectedVersion.content 
                              : JSON.stringify(selectedVersion.content, null, 2)
                            }
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>Select a version to preview</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
