import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox, Share } from 'lucide-react';
import { Link } from 'react-router-dom';

const CmdDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Inbox className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CMD Dashboard</h1>
          <p className="text-muted-foreground">Centralized management and review panel</p>
        </div>
      </div>

      {/* Document Review & Approval */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Inbox className="h-5 w-5" />
            Document Review & Approval
          </CardTitle>
          <CardDescription>
            Review document submissions from department heads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link to="/dashboard/cmd/inbox">
              <Inbox className="h-4 w-4 mr-2" />
              CMD Inbox
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/dashboard/cmd/documents/sharing">
              <Share className="h-4 w-4 mr-2" />
              Document Sharing
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Additional dashboard content can be added here */}
    </div>
  );
};

export default CmdDashboard;
