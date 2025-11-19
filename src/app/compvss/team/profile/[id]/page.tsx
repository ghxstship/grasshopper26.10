'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, MapPin, Calendar, Award, CheckCircle2, Clock, MessageSquare,  } from 'lucide-react';
import { useTeam } from '@/lib/hooks/compvss/useTeam';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { BodyText } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/team/profile/[id]

export default function TeamProfilePage() { 
  const { data,  } = useTeam();
  const profile = (data as any)?.profile || {
    name: 'John Smith',
    role: 'Stage Manager',
    organization: 'Production Co.',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, US',
    joinedDate: 'January 2024',
    status: 'active',
    avatar: 'JS',
  };

  const stats = (data as any)?.stats || [
    { label: 'Events Worked', value: '24' },
    { label: 'Hours Logged', value: '486' },
    { label: 'Tasks Completed', value: '142' },
    { label: 'Team Rating', value: '4.9' },
  ];

  const certifications = (data as any)?.certifications || [
    { name: 'OSHA 30-Hour Construction', issuer: 'OSHA', status: 'verified', expiry: '2027-01-15' },
    { name: 'Electrical Technician License', issuer: 'State Board', status: 'verified', expiry: '2025-06-20' },
    { name: 'First Aid & CPR', issuer: 'Red Cross', status: 'verified', expiry: '2026-03-10' },
  ];

  const recentActivity = [
    { event: 'Summer Music Festival', date: 'June 15, 2025', role: 'Stage Manager', status: 'completed' },
    { event: 'Tech Conference 2025', date: 'June 22, 2025', role: 'AV Lead', status: 'upcoming' },
    { event: 'Food & Wine Expo', date: 'July 3, 2025', role: 'Logistics', status: 'upcoming' },
  ];

  return (
    <CompvssLayout>
      <ContentLayout
        title={profile.name}
        description={`${profile.role} • ${profile.organization}`}
        variant="compvss"
        showToolbar={false}
        
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 flex items-center justify-center text-black">
              {profile.avatar}
            </div>
            <Badge variant="compvss" className="bg-success-light text-success border-success/30">
              {profile.status}
            </Badge>
          </div>
          <Button variant="compvss" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6 text-center">
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact & Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-compvss-cyan-500" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-grey-400" />
                      <div>
                        <BodyText className="text-caption text-grey-400 -tech">Email</BodyText>
                        <p className="text-white text-body-sm">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-grey-400" />
                      <div>
                        <BodyText className="text-caption text-grey-400 -tech">Phone</BodyText>
                        <p className="text-white text-body-sm">{profile.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-grey-400" />
                      <div>
                        <BodyText className="text-caption text-grey-400 -tech">Organization</BodyText>
                        <p className="text-white text-body-sm">{profile.organization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-grey-400" />
                      <div>
                        <BodyText className="text-caption text-grey-400 -tech">Location</BodyText>
                        <p className="text-white text-body-sm">{profile.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-grey-400" />
                      <div>
                        <BodyText className="text-caption text-grey-400 -tech">Member Since</BodyText>
                        <p className="text-white text-body-sm">{profile.joinedDate}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-compvss-cyan-500" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-white text-body-sm">{cert.name}</h3>
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <p className="text-caption text-grey-400 -tech mb-1">{cert.issuer}</p>
                        <p className="text-caption text-grey-500 -tech">Expires: {cert.expiry}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-compvss-cyan-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white mb-1">{activity.event}</h3>
                            <p className="text-body-sm text-grey-400 -tech">{activity.role}</p>
                          </div>
                          <Badge 
                            variant={activity.status === 'completed' ? 'compvss' : 'compvss-outline'}
                            className={activity.status === 'completed' ? 'bg-success-light text-success border-success/30' : ''}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-caption text-grey-500 -tech">{activity.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
