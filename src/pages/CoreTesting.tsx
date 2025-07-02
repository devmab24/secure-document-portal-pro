
import React from 'react';
import { CoreFunctionalityTester } from '@/components/CoreFunctionalityTester';

const CoreTesting = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Core Functionality Testing</h1>
        <p className="text-muted-foreground">
          Test and validate all critical system operations using mock database
        </p>
      </div>
      
      <CoreFunctionalityTester />
    </div>
  );
};

export default CoreTesting;
