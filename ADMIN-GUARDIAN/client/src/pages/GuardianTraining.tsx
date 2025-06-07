import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Shield, Book, Award, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TrainingProgram {
  name: string;
  modules: string[];
  duration: string;
  certification: boolean;
  prerequisites?: string[];
  restricted?: boolean;
}

interface TrainingData {
  newUserOnboarding: TrainingProgram;
  adminTraining: TrainingProgram;
  guardianTraining: TrainingProgram;
}

export default function GuardianTraining() {
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await fetch('tera://training/programs');
        const data = await response.json();
        setTrainingPrograms(data);
      } catch (err) {
        setError('Failed to load training programs');
        console.error('Error fetching training data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Bot className="w-12 h-12 text-red-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-6 bg-red-500/10 border border-red-500/30">
          <div className="flex items-center space-x-2 text-red-500">
            <XCircle className="w-6 h-6" />
            <p>{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Bot className="h-12 w-12 text-red-500" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Guardian Training</h1>
            <p className="text-gray-400">AI-Powered Training and Certification Programs</p>
          </div>
        </div>
      </div>

      {/* Training Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingPrograms && Object.entries(trainingPrograms).map(([key, program]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-black/50 border border-red-500/30 backdrop-blur-sm relative overflow-hidden">
              {/* Background Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 100%',
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-100">
                    {key === 'newUserOnboarding' ? 'New User Training' :
                     key === 'adminTraining' ? 'Admin Training' :
                     'Guardian Training'}
                  </h3>
                  {program.certification && (
                    <Award className="w-6 h-6 text-yellow-500" />
                  )}
                </div>

                {/* Duration */}
                <div className="flex items-center text-gray-400 mb-4">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{program.duration}</span>
                </div>

                {/* Modules */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-semibold text-gray-300">Modules:</h4>
                  <ul className="space-y-1">
                    {program.modules.map((module, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {module}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prerequisites */}
                {program.prerequisites && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Prerequisites:</h4>
                    <ul className="space-y-1">
                      {program.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-sm text-gray-400">
                          • {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
                  disabled={program.restricted}
                >
                  {program.restricted ? 'Restricted Access' : 'Start Training'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
