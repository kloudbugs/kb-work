import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { ElectricBorder } from '@/components/ui/ElectricBorder';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string | number;
    positive?: boolean;
  };
  suffix?: string;
  className?: string;
  electricBorder?: boolean;
  borderIntensity?: 'low' | 'medium' | 'high';
  image?: string; // Added image prop for custom images
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  trend,
  suffix,
  className,
  electricBorder = false, // Disable electric border by default
  borderIntensity = 'medium',
  image
}: StatCardProps) {
  
  // Card content
  const cardContent = (
    <CardContent className="p-5">
      <div className="flex items-center">
        {image ? (
          <div className="flex-shrink-0 rounded-md p-1">
            <img src={image} alt={title} className="w-12 h-12 object-contain" />
          </div>
        ) : (
          <div className={cn(
            "flex-shrink-0 rounded-md p-3",
            iconColor === "text-primary" && "bg-primary bg-opacity-10 dark:bg-opacity-20",
            iconColor === "text-accent" && "bg-accent bg-opacity-10 dark:bg-opacity-20",
            iconColor === "text-secondary" && "bg-secondary bg-opacity-10 dark:bg-opacity-20",
            iconColor === "text-red-500" && "bg-red-500 bg-opacity-10 dark:bg-opacity-20"
          )}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        )}
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white font-mono">
                {value}
              </div>
              {suffix && (
                <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-500">
                  {suffix}
                </div>
              )}
              {trend && (
                <div className={cn(
                  "ml-2 flex items-baseline text-sm font-semibold",
                  trend.positive 
                    ? "text-green-600" 
                    : "text-red-600"
                )}>
                  {trend.positive ? (
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="sr-only">
                    {trend.positive ? "Increased by" : "Decreased by"}
                  </span>
                  {trend.value}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </CardContent>
  );
  
  // Return either a regular card or a card with electric border
  return electricBorder ? (
    <Card className={cn("overflow-hidden", className)}>
      <ElectricBorder intensity={borderIntensity} color="yellow">
        {cardContent}
      </ElectricBorder>
    </Card>
  ) : (
    <Card className={cn("overflow-hidden", className)}>
      {cardContent}
    </Card>
  );
}

export default StatCard;
