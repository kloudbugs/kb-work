import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  BookOpen, 
  Trophy, 
  Target, 
  Clock,
  Star,
  Award,
  Brain,
  Zap,
  Shield
} from 'lucide-react';

export default function TrainingCenter() {
  const userProgress = {
    level: 12,
    xp: 2850,
    xpToNext: 150,
    completedModules: 8,
    totalModules: 24,
    achievements: ['First Steps', 'Mining Expert', 'Optimizer', 'Security Guardian']
  };

  const trainingModules = [
    {
      id: 'mining-basics',
      title: 'Mining Fundamentals',
      description: 'Learn the basics of cryptocurrency mining, algorithms, and pool concepts',
      difficulty: 'Beginner',
      duration: '45 min',
      progress: 100,
      status: 'completed',
      category: 'mining'
    },
    {
      id: 'pool-optimization',
      title: 'Pool Selection & Optimization',
      description: 'Master the art of choosing the right mining pools for maximum profitability',
      difficulty: 'Intermediate',
      duration: '1h 30min',
      progress: 100,
      status: 'completed',
      category: 'optimization'
    },
    {
      id: 'hardware-tuning',
      title: 'Hardware Tuning & Overclocking',
      description: 'Optimize your mining hardware for peak performance and efficiency',
      difficulty: 'Advanced',
      duration: '2h 15min',
      progress: 75,
      status: 'in-progress',
      category: 'optimization'
    },
    {
      id: 'security-protocols',
      title: 'Mining Security Protocols',
      description: 'Implement advanced security measures to protect your mining operations',
      difficulty: 'Expert',
      duration: '3h 00min',
      progress: 0,
      status: 'available',
      category: 'security'
    },
    {
      id: 'ai-integration',
      title: 'AI-Powered Mining Strategies',
      description: 'Leverage TERA Guardian AI for automated mining optimization',
      difficulty: 'Expert',
      duration: '2h 45min',
      progress: 0,
      status: 'locked',
      category: 'advanced'
    },
    {
      id: 'profit-analysis',
      title: 'Advanced Profit Analysis',
      description: 'Deep dive into profitability calculations and market analysis',
      difficulty: 'Advanced',
      duration: '1h 45min',
      progress: 100,
      status: 'completed',
      category: 'optimization'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'available': return 'bg-gray-500';
      case 'locked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mining': return <Target className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'optimization': return <Zap className="h-4 w-4" />;
      case 'advanced': return <Brain className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cosmic-blue to-cosmic-purple bg-clip-text text-transparent">
          TERA Training Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Master advanced mining techniques and TERA Guardian AI systems
        </p>
      </div>

      <div className="space-y-6">
        {/* User Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Level</CardTitle>
              <GraduationCap className="h-4 w-4 text-cosmic-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {userProgress.level}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {userProgress.xp} XP ({userProgress.xpToNext} to next level)
              </div>
              <Progress value={(userProgress.xp / (userProgress.xp + userProgress.xpToNext)) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-cosmic-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userProgress.completedModules}/{userProgress.totalModules}
              </div>
              <Progress value={(userProgress.completedModules / userProgress.totalModules) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-cyber-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProgress.achievements.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Unlock more by completing modules
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Star className="h-4 w-4 text-cosmic-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((userProgress.completedModules / userProgress.totalModules) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Overall progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Training Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainingModules.map((module) => (
            <Card key={module.id} className="hover:border-cosmic-blue/50 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(module.category)}
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(module.status)} text-white text-xs`}
                  >
                    {module.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge 
                    variant="outline" 
                    className={`${getDifficultyColor(module.difficulty)} text-white`}
                  >
                    {module.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{module.duration}</span>
                  </div>
                </div>

                {module.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                )}

                <Button 
                  className="w-full" 
                  variant={module.status === 'locked' ? 'secondary' : 'default'}
                  disabled={module.status === 'locked'}
                >
                  {module.status === 'completed' && 'Review Module'}
                  {module.status === 'in-progress' && 'Continue Learning'}
                  {module.status === 'available' && 'Start Module'}
                  {module.status === 'locked' && 'Locked'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Achievements</span>
            </CardTitle>
            <CardDescription>Your training milestones and accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userProgress.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <Trophy className="h-5 w-5 text-cyber-gold" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}