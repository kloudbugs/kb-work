import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Bot, Ghost, Zap, Activity, Network, Book, Award, Users, Brain } from 'lucide-react';
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

interface AISystem {
  name: string;
  role: string;
  capabilities: string[];
  accessLevel: string;
  parentAI?: string;
  independenceLevel?: number;
  integration?: string;
  trainingData?: {
    sources: string[];
    updateFrequency: string;
  };
}

export default function GuardianSystem() {
  const [activeTab, setActiveTab] = useState<'systems' | 'training'>('systems');
  const [aiSystemsData, setAiSystemsData] = useState<any>(null);
  const [trainingData, setTrainingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch AI systems data
        const systemsResponse = await fetch('tera://system/overview');
        const systemsData = await systemsResponse.json();
        setAiSystemsData(systemsData);

        // Fetch training programs data
        const trainingResponse = await fetch('tera://training/programs');
        const trainingProgramsData = await trainingResponse.json();
        setTrainingData(trainingProgramsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderAISystems = () => {
    if (!aiSystemsData) return null;

    const systems = [
      {
        title: aiSystemsData.primaryAI.name,
        icon: Shield,
        description: "Primary Guardian AI System",
        status: "Active",
        color: "text-red-500",
        type: "Core"
      },
      ...aiSystemsData.specializedAIs.map((ai: AISystem) => ({
        title: ai.name,
        icon: ai.role.includes('MINING') ? Zap :
             ai.role.includes('SECURITY') ? Ghost :
             ai.role.includes('FINANCE') ? Activity :
             ai.role.includes('COMMUNITY') ? Users : Bot,
        description: ai.role,
        status: "Active",
        color: ai.role.includes('MINING') ? "text-yellow-500" :
               ai.role.includes('SECURITY') ? "text-purple-500" :
               ai.role.includes('FINANCE') ? "text-green-500" :
               "text-blue-500",
        type: ai.accessLevel
      }))
    ];

    return systems.map((ai, index) => (
      <motion.div
        key={ai.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative p-4 rounded-lg bg-gray-900/50 border border-gray-800"
      >
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
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <ai.icon className={`h-6 w-6 ${ai.color}`} />
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full bg-gray-800 ${ai.color}`}>
                {ai.status}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300">
                {ai.type}
              </span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">{ai.title}</h3>
          <p className="text-sm text-gray-400">{ai.description}</p>
          
          <div className="mt-4 flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 border-gray-700 hover:border-gray-600"
            >
              Configure
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 border-gray-700 hover:border-gray-600"
            >
              Monitor
            </Button>
          </div>
        </div>
      </motion.div>
    ));
  };

  const renderTrainingPrograms = () => {
    if (!trainingData) return null;

    return Object.entries(trainingData).map(([key, program]: [string, any]) => (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-black/50 border border-red-500/30 backdrop-blur-sm relative overflow-hidden">
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

            <div className="flex items-center text-gray-400 mb-4">
              <Book className="w-4 h-4 mr-2" />
              <span className="text-sm">{program.duration}</span>
            </div>

            <div className="space-y-2 mb-4">
              <h4 className="text-sm font-semibold text-gray-300">Modules:</h4>
              <ul className="space-y-1">
                {program.modules.map((module: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-400">
                    <Brain className="w-4 h-4 mr-2 text-cyan-500" />
                    {module}
                  </li>
                ))}
              </ul>
            </div>

            {program.prerequisites && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">Prerequisites:</h4>
                <ul className="space-y-1">
                  {program.prerequisites.map((prereq: string, index: number) => (
                    <li key={index} className="text-sm text-gray-400 flex items-center">
                      <Award className="w-4 h-4 mr-2 text-amber-500" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
              disabled={program.restricted}
            >
              {program.restricted ? 'Restricted Access' : 'Start Training'}
            </Button>
          </div>
        </Card>
      </motion.div>
    ));
  };

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
            <Shield className="h-12 w-12 text-red-500" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Guardian System</h1>
            <p className="text-gray-400">AI Management and Protection Controls</p>
          </div>
        </div>
        <Button 
          variant="destructive"
          className="bg-red-500 hover:bg-red-600"
        >
          Emergency Override
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={activeTab === 'systems' ? 'default' : 'outline'}
          onClick={() => setActiveTab('systems')}
          className={`flex items-center space-x-2 ${
            activeTab === 'systems' 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'border-red-500/30 hover:border-red-500/50 text-gray-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>AI Systems</span>
        </Button>
        <Button
          variant={activeTab === 'training' ? 'default' : 'outline'}
          onClick={() => setActiveTab('training')}
          className={`flex items-center space-x-2 ${
            activeTab === 'training' 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'border-red-500/30 hover:border-red-500/50 text-gray-300'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Training Programs</span>
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'systems' && (
        <>
          {/* AI Systems Grid */}
          <Card className="p-6 bg-black/50 border border-red-500/30 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">AI Systems</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Bot className="w-8 h-8 text-red-500" />
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderAISystems()}
              </div>
            )}
          </Card>

          {/* System Controls */}
          <Card className="p-6 bg-black/50 border border-red-500/30 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">System Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" className="border-red-500/30 hover:border-red-500/50">
                Sync AIs
              </Button>
              <Button variant="outline" className="border-red-500/30 hover:border-red-500/50">
                Update Rules
              </Button>
              <Button variant="outline" className="border-red-500/30 hover:border-red-500/50">
                View Logs
              </Button>
              <Button variant="outline" className="border-red-500/30 hover:border-red-500/50">
                Performance Report
              </Button>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'training' && (
        <Card className="p-6 bg-black/50 border border-red-500/30 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Training Programs</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Bot className="w-8 h-8 text-red-500" />
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderTrainingPrograms()}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
