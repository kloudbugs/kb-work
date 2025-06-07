import React from 'react';
import TeraCore from '@/components/guardians/tera-core';

export default function GuardianDashboard() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
          TERA Guardian Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your AI-powered mining guardian system
        </p>
      </div>
      
      <TeraCore />
    </div>
  );
}