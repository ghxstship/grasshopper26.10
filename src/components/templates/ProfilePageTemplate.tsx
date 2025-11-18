import { ReactNode } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { HeroTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Avatar } from '@/components/atoms/Avatar';
import { Tabs } from '@/components/molecules/Tabs';
import { Edit, MessageCircle, UserPlus, UserMinus, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';

export interface ProfileStat {
  label: string;
  value: string | number;
  href?: string;
}

export interface ProfileTab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface ProfilePageTemplateProps {
  coverImage?: string;
  avatarUrl?: string;
  name: string;
  username?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'warning' | 'success' | 'error';
  }>;
  stats?: ProfileStat[];
  tabs: ProfileTab[];
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onEdit?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  actions?: ReactNode;
}

/**
 * ProfilePageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for user profiles, artist profiles, and team member profiles.
 * Provides consistent layout with hero section, stats, and tabbed content.
 * 
 * Features:
 * - Hero section with cover photo and avatar
 * - Stats row (followers, following, posts, etc.)
 * - Tabbed content (About, Activity, Posts, etc.)
 * - Edit mode for own profile
 * - Follow/Unfollow actions
 * - Message button
 * - Mobile-responsive layout
 * 
 * @example
 * <ProfilePageTemplate
 *   name="Sarah Johnson"
 *   username="@sarahjohnson"
 *   bio="Event producer & music lover"
 *   stats={[
 *     { label: 'Followers', value: '1.2K' },
 *     { label: 'Following', value: '345' }
 *   ]}
 *   tabs={[
 *     { id: 'about', label: 'About', content: <AboutTab /> },
 *     { id: 'activity', label: 'Activity', content: <ActivityTab /> }
 *   ]}
 *   isOwnProfile={false}
 *   onFollow={handleFollow}
 * />
 */
export function ProfilePageTemplate({
  coverImage,
  avatarUrl,
  name,
  username,
  bio,
  location,
  joinedDate,
  badges,
  stats,
  tabs,
  isOwnProfile = false,
  isFollowing = false,
  onEdit,
  onFollow,
  onUnfollow,
  onMessage,
  actions,
}: ProfilePageTemplateProps) {
  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      {/* Cover Image */}
      {coverImage && (
        <section className="relative h-[300px] bg-gradient-to-br from-ghxst-primary to-ghxst-secondary">
          <Image
            src={coverImage}
            alt={`${name} cover`}
            fill
            className="object-cover"
            priority
          />
        </section>
      )}

      {/* Profile Header */}
      <section className={coverImage ? '-mt-24' : 'pt-8'}>
        <div className="max-w-7xl mx-auto px-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar
                  src={avatarUrl}
                  alt={name}
                  size="xl"
                  className="w-32 h-32 border-4 border-white shadow-lg"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <HeroTitle className="mb-2 truncate">{name}</HeroTitle>
                    {username && (
                      <Metadata className="text-ghxst-text-secondary mb-3">
                        {username}
                      </Metadata>
                    )}
                    {bio && (
                      <BodyText className="mb-3 text-ghxst-text-secondary">
                        {bio}
                      </BodyText>
                    )}
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      {location && (
                        <div className="flex items-center gap-1 text-ghxst-text-secondary">
                          <MapPin className="w-4 h-4" />
                          <Metadata>{location}</Metadata>
                        </div>
                      )}
                      {joinedDate && (
                        <div className="flex items-center gap-1 text-ghxst-text-secondary">
                          <Calendar className="w-4 h-4" />
                          <Metadata>Joined {joinedDate}</Metadata>
                        </div>
                      )}
                    </div>
                    {badges && badges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {badges.map((badge, index) => (
                          <Badge key={index} variant={badge.variant}>
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isOwnProfile ? (
                      <Button variant="secondary" onClick={onEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        {isFollowing ? (
                          <Button variant="secondary" onClick={onUnfollow}>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Unfollow
                          </Button>
                        ) : (
                          <Button variant="primary" onClick={onFollow}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </Button>
                        )}
                        {onMessage && (
                          <Button variant="secondary" onClick={onMessage}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        )}
                      </>
                    )}
                    {actions}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-ghxst-border">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    {stat.href ? (
                      <a
                        href={stat.href}
                        className="block hover:text-ghxst-primary transition-colors"
                      >
                        <SectionHeader className="font-bebas text-h3 mb-1">
                          {stat.value}
                        </SectionHeader>
                        <Metadata className="text-ghxst-text-secondary">
                          {stat.label}
                        </Metadata>
                      </a>
                    ) : (
                      <>
                        <SectionHeader className="font-bebas text-h3 mb-1">
                          {stat.value}
                        </SectionHeader>
                        <Metadata className="text-ghxst-text-secondary">
                          {stat.label}
                        </Metadata>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </section>

      {/* Tabbed Content */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          {/* TODO: Fix Tabs component API - currently incompatible */}
          <div>
            {tabs.map(tab => (
              <div key={tab.id}>
                {tab.content}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
