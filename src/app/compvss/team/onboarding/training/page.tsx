'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, CheckCircle2, Lock, Clock, Award } from 'lucide-react';
import { useTeam } from '@/lib/hooks/compvss/useTeam';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress?: number;
  required: boolean;
}

export default function TrainingModulesPage() {
  const { data } = useTeam();
  const [modules] = useState<TrainingModule[]>((data as { trainingModules?: TrainingModule[] })?.trainingModules || [
    {
      id: '1',
      title: 'Safety & Security Fundamentals',
      description: 'Essential safety protocols and emergency procedures',
      duration: '30 min',
      status: 'completed',
      progress: 100,
      required: true,
    },
    {
      id: '2',
      title: 'Production Workflow Basics',
      description: 'Understanding the production process and your role',
      duration: '45 min',
      status: 'in-progress',
      progress: 60,
      required: true,
    },
    {
      id: '3',
      title: 'Communication Protocols',
      description: 'Effective communication on production sites',
      duration: '20 min',
      status: 'available',
      required: true,
    },
    {
      id: '4',
      title: 'Equipment Handling',
      description: 'Proper use and maintenance of production equipment',
      duration: '40 min',
      status: 'locked',
      required: false,
    },
    {
      id: '5',
      title: 'Advanced Rigging Techniques',
      description: 'Specialized training for rigging professionals',
      duration: '60 min',
      status: 'locked',
      required: false,
    },
  ]);

  const completedCount = modules.filter(m => m.status === 'completed').length;
  const totalRequired = modules.filter(m => m.required).length;

  const getStatusIcon = (status: TrainingModule['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'available':
        return <Play className="w-5 h-5 text-compvss-cyan-500" />;
      default:
        return <Lock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (module: TrainingModule) => {
    if (module.status === 'completed') {
      return <Badge variant="success">Completed</Badge>;
    }
    if (module.status === 'in-progress') {
      return <Badge variant="warning">In Progress</Badge>;
    }
    if (module.status === 'available') {
      return <Badge variant="compvss">Start</Badge>;
    }
    return <Badge variant="default">Locked</Badge>;
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Training Modules"
        description="Complete required training to get certified"
        variant="compvss"
        showToolbar={false}
        
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* Progress Overview */}
          <Card variant="compvss" className="mb-6 bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-compvss-cyan-500" />
                  <div>
                    <h3 className="font-oswald text-white text-h6">Training Progress</h3>
                    <p className="text-body-sm text-gray-400 font-share-tech">
                      {completedCount} of {totalRequired} required modules completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-h3 font-bebas text-compvss-cyan-500">
                    {Math.round((completedCount / totalRequired) * 100)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / totalRequired) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Training Modules List */}
          <div className="space-y-4 mb-6">
            {modules.map((module) => (
              <Card key={module.id} variant="compvss" className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(module.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-oswald text-white">{module.title}</h3>
                          {module.required && (
                            <Badge variant="error" className="text-caption">Required</Badge>
                          )}
                        </div>
                        <p className="text-body-sm text-gray-400 font-share-tech mb-2">
                          {module.description}
                        </p>
                        <p className="text-caption text-gray-500 font-share-tech">
                          Duration: {module.duration}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(module)}
                  </div>

                  {/* Progress Bar for In-Progress Modules */}
                  {module.status === 'in-progress' && module.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-caption text-gray-400 font-share-tech">Progress</p>
                        <p className="text-caption text-compvss-cyan-500 font-bebas">{module.progress}%</p>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 h-2 rounded-full"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {module.status === 'available' && (
                      <Button variant="compvss" size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Start Module
                      </Button>
                    )}
                    {module.status === 'in-progress' && (
                      <Button variant="compvss" size="sm" className="flex-1">
                        Continue
                      </Button>
                    )}
                    {module.status === 'completed' && (
                      <Button variant="compvss-outline" size="sm" className="flex-1">
                        Review
                      </Button>
                    )}
                    {module.status === 'locked' && (
                      <Button variant="compvss-outline" size="sm" className="flex-1" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/compvss/team/onboarding/compliance" className="flex-1">
              <Button 
                variant="compvss" 
                size="lg" 
                className="w-full"
                disabled={completedCount < totalRequired}
              >
                Continue to Compliance
              </Button>
            </Link>
            <Link href="/compvss/dashboard">
              <Button variant="compvss-outline" size="lg">
                Save & Exit
              </Button>
            </Link>
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
