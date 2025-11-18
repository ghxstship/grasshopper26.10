'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { UserMinus, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useFriends, useUnfollowUser } from '@/lib/hooks/gvteway/useSocial';

export default function FollowingPage() {
  const { data: friends = [], isLoading, error, refetch } = useFriends();
  const { mutate: unfollowUser } = useUnfollowUser();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading following...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Following</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const following = friends.filter((f: any) => f.type === 'following' || f.isFollowing);

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">FOLLOWING</h1>
              
              <div className="grid md:grid-cols-2 gap-4">
                {following.map((user) => (
                  <Card key={user.id} variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-700 rounded-full" />
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-gray-400 text-sm">{user.username}</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => unfollowUser(user.userId || user.id)}
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Unfollow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
