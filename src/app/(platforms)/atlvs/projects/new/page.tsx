/**
 * New Project Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


export default function NewProjectPage() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">New Project</H1>
          <Body className="text-gray-600">
            New Project page content
          </Body>
        </div>

        <Card variant="atlvs">
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Start a new project</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="atlvs">Create Project</Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
