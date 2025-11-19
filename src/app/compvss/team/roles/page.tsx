'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Shield, Users2, Edit, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useTeamRoles } from '@/lib/hooks/compvss/useTeamMembers';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/team/roles

export default function TeamRolesPage() {
  const { data: roles = [], isLoading, error, refetch } = useTeamRoles();

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Team Roles"
          description="Manage team roles and permissions"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading roles...</BodyText>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Team Roles"
          description="Manage team roles and permissions"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Roles</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Team Roles"
        description="Manage roles and permissions"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'Create Role',
            icon: <Shield className="w-5 h-5" />,
            onClick: () => {},
            variant: 'compvss'
          }
        ]}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all h-full">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${role.color} flex items-center justify-center text-white mb-4`}>
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-white mb-2">{role.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Users2 className="w-4 h-4 text-grey-400" />
                    <span className="text-body-sm text-grey-400 -tech">{role.members} members</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <BodyText className="text-caption text-grey-500">Permissions:</BodyText>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm) => (
                        <Badge key={perm} variant="compvss-outline" className="text-caption">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="compvss-ghost" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Role
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
