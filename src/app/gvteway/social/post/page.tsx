'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, MapPin } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';

export default function CreatePostPage() {
  const [content, setContent] = useState('');

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">CREATE POST</h1>
              
              <Card variant="gvteway" className="bg-gray-900/50">
                <CardContent className="p-6">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    variant="gvteway"
                    rows={6}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Image className="w-4 h-4 mr-2" aria-label="Add image" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MapPin className="w-5 h-5" />
                      </Button>
                    </div>
                    <Button variant="gvteway">
                      <Send className="w-5 h-5 mr-2" />
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
