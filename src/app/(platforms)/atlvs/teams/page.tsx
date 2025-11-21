'use client';

import { useTeams } from '@/hooks/atlvs/useTeams';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function TeamsPage() {
  const { teams, isLoading } = useTeams();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Teams</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <p>Loading teams...</p>
        ) : (
          teams.map((team) => (
            <Card key={team.id} variant="atlvs">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{team.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}