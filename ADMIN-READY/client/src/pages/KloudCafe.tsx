import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import WebsiteLayout from '@/components/website/WebsiteLayout';

const KloudCafe = () => {
  const [_, navigate] = useLocation();

  // Redirect to the Mining Update page
  useEffect(() => {
    navigate('/mining-update');
  }, [navigate]);

  return (
    <WebsiteLayout>
      <div className="flex items-center justify-center min-h-screen bg-black">
        {/* Empty container with redirect - redirecting to /mining-update */}
      </div>
    </WebsiteLayout>
  );
}

export default KloudCafe;