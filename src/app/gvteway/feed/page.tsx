'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { PageTitle, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Avatar } from "@/components/atoms/Avatar";
import { Heart, MessageCircle, Share2, Plus } from "lucide-react";
import Image from "next/image";

const _metadata = {
  title: 'Social Feed | GVTEWAY Community',
  description: 'Connect with members, share experiences, and discover what others are attending.',
  keywords: 'social feed, community, events, connections',
};

export default function FeedPage() {
  // Demo feed data
  const feedItems = [
    {
      id: "1",
      user: {
        name: "Sarah Martinez",
        avatar: "/api/placeholder/50/50",
        timestamp: "2 hours ago",
      },
      content: "Just got tickets to The Midnight Collective! Who else is going? 🎉",
      eventCard: {
        title: "The Midnight Collective Live",
        venue: "The Ritz Ybor",
        date: "Nov 25, 2025",
        image: "/api/placeholder/400/200",
      },
      likes: 24,
      comments: 5,
    },
    {
      id: "2",
      user: {
        name: "Marcus Johnson",
        avatar: "/api/placeholder/50/50",
        timestamp: "5 hours ago",
      },
      content: "Amazing show last night! The energy was incredible. Check out these photos 📸",
      images: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
      likes: 89,
      comments: 12,
    },
    {
      id: "3",
      user: {
        name: "Elena Rodriguez",
        avatar: "/api/placeholder/50/50",
        timestamp: "1 day ago",
      },
      content: "Found this amazing vintage vinyl at Sunset Records. Their collection is unreal! 🎵",
      images: ["/api/placeholder/400/400"],
      likes: 45,
      comments: 8,
    },
  ];

  return (
    <GvtewayLayout>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <PageTitle className="text-ghxst-primary">Social Feed</PageTitle>
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
              Create Post
            </Button>
          </div>

          {/* Feed Items */}
          <div className="space-y-6">
            {feedItems.map((item) => (
              <div key={item.id} className="card bg-ghxst-white p-6 space-y-4">
                {/* User Header */}
                <div className="flex items-center gap-3">
                  <Avatar src={item.user.avatar} alt={item.user.name} size="md" />
                  <div className="flex-1">
                    <CardTitle className="text-ghxst-primary">{item.user.name}</CardTitle>
                    <Metadata className="text-ghxst-text-secondary">{item.user.timestamp}</Metadata>
                  </div>
                </div>

                {/* Content */}
                <BodyText className="text-ghxst-text-primary">{item.content}</BodyText>

                {/* Event Card Preview */}
                {item.eventCard && (
                  <div className="border-2 border-ghxst-border rounded-lg overflow-hidden hover:border-ghxst-black transition-colors cursor-pointer">
                    <div className="relative aspect-[2/1] bg-ghxst-surface">
                      <Image
                        src={item.eventCard.image}
                        alt={item.eventCard.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <h5 className="text-ghxst-primary">{item.eventCard.title}</h5>
                      <Metadata className="text-ghxst-text-secondary">
                        {item.eventCard.venue} • {item.eventCard.date}
                      </Metadata>
                    </div>
                  </div>
                )}

                {/* Images */}
                {item.images && (
                  <div className={`grid gap-2 ${item.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {item.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square bg-ghxst-surface rounded-lg overflow-hidden">
                        <Image
                          src={img}
                          alt="Post image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 pt-2 border-t border-ghxst-border">
                  <button className="flex items-center gap-2 text-ghxst-text-secondary hover:text-ghxst-accent transition-colors">
                    <Heart className="w-5 h-5" />
                    <Metadata>{item.likes}</Metadata>
                  </button>
                  <button className="flex items-center gap-2 text-ghxst-text-secondary hover:text-ghxst-accent transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <Metadata>{item.comments}</Metadata>
                  </button>
                  <button className="flex items-center gap-2 text-ghxst-text-secondary hover:text-ghxst-accent transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                    <Metadata>Share</Metadata>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-4">
            <Button variant="secondary" size="lg">
              Load More Posts
            </Button>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
