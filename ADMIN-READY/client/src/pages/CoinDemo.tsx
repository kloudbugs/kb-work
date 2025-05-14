import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import JusticeCoinAnimation from '@/components/ui/JusticeCoinAnimation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CoinDemo() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Justice Token Animation</h1>
        
        <div className="max-w-lg mx-auto">
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Justice Token Coin Animation</CardTitle>
              <CardDescription className="text-gray-400">
                Watch the Justice token coin spin 7 times before displaying
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <JusticeCoinAnimation size="lg" />
            </CardContent>
          </Card>
          
          <div className="mt-8 space-y-4 text-gray-300">
            <h2 className="text-xl font-semibold">About Justice Token</h2>
            <p>
              The Justice Token represents our commitment to legal rights initiatives and support for 
              legal proceedings. A portion of mining proceeds contributes to legal aid services and advocacy.
            </p>
            <p>
              The token features the image of a miner with justice symbols, representing the fusion of 
              blockchain technology with civil rights and legal support initiatives.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}