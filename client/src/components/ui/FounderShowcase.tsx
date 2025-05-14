import React from 'react';
import { Card } from "@/components/ui/card";
import foundersImage from '@assets/IMG_9497.jpeg';

/**
 * The FounderShowcase component displays an image of the platform founder
 * with a powerful message about the platform's mission and exclusivity.
 * This serves as both a visual filter and a clear statement of the platform's
 * values and purpose.
 */
const FounderShowcase: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-6 max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-center tracking-tight">
        The Face Behind KloudBugs Mining
      </h2>
      
      <Card className="overflow-hidden w-full max-w-md">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={foundersImage} 
            alt="KloudBugs Founder" 
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6 bg-primary/10">
          <p className="text-xl font-semibold mb-2">Representing Our Values</p>
          <p className="text-muted-foreground">
            This platform was created with a clear mission: to honor the legacy of Tera Ann Harris 
            and advance civil rights through innovative technology. Access is not universal - 
            we deliberately choose who can participate based on alignment with our values.
          </p>
        </div>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-lg font-medium">
          "Something universally desired but available only to a chosen few."
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          KloudBugs Mining is designed for special people with special values.
        </p>
      </div>
    </div>
  );
};

export default FounderShowcase;