import React from 'react';
import InterDepartmentMessaging from '@/components/InterDepartmentMessaging';

const InterDepartmentCommunication = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Inter-Department Communication</h1>
        <p className="text-muted-foreground mt-2">
          Communicate with other departments, send direct messages to HODs, and broadcast announcements
        </p>
      </div>
      
      <InterDepartmentMessaging />
    </div>
  );
};

export default InterDepartmentCommunication;