'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { FormField } from '@/components/molecules/FormField';

export default function EditProfilePage() {
  const [name, setName] = useState('Sarah Johnson');
  const [bio, setBio] = useState('Music lover and festival enthusiast');

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-h1 font-bebas mb-8 gvteway-text-gradient">EDIT PROFILE</h1>
              
              <Card variant="gvteway" className="bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <FormField label="Profile Photo">
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </FormField>
                    <FormField label="Name">
                      <Input value={name} onChange={(e) => setName(e.target.value)} variant="gvteway" />
                    </FormField>
                    <FormField label="Bio">
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        variant="gvteway"
                        rows={4}
                      />
                    </FormField>
                    <Button variant="gvteway" size="lg" className="w-full">
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
