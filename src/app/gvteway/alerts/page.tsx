'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, X, MapPin, Calendar, Music, Ticket, Settings, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { useAlerts, type Alert } from '@/lib/hooks/gvteway/useAlerts';
import { BodyText, CardTitle, HeroTitle, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/alerts

export default function AlertsPage() {
  const { alerts, isLoading, error, refetch, createAlert, updateAlert, deleteAlert } = useAlerts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [alertType, setAlertType] = useState<Alert['type']>('artist');
  const [alertName, setAlertName] = useState('');
  const [alertCriteria, setAlertCriteria] = useState('');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!alertName || !alertCriteria) return;

    createAlert({
      type: alertType,
      name: alertName,
      criteria: alertCriteria,
    });
    
    setShowCreateForm(false);
    setAlertName('');
    setAlertCriteria('');
  };

  const handleDeleteAlert = (alertId: string) => {
    deleteAlert(alertId);
  };
  
  const _handleToggleAlert = (alertId: string, active: boolean) => {
    updateAlert({ id: alertId, active: !active });
  };
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading alerts...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Alerts</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'artist': return <Music className="w-5 h-5" />;
      case 'venue': return <MapPin className="w-5 h-5" />;
      case 'genre': return <Ticket className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
    }
  };

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <header className="flex items-center justify-between mb-8">
                <div>
                  <HeroTitle className="mb-2 gvteway-text-gradient">
                    ALERTS
                  </HeroTitle>
                  <BodyText className="text-grey-400">
                    Get notified about events you care about
                  </BodyText>
                </div>
                <Button
                  variant="gvteway"
                  size="lg"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  rounded="full"
                  aria-expanded={showCreateForm}
                  aria-controls="create-alert-form"
                  aria-label={showCreateForm ? "Close create alert form" : "Open create alert form"}
                >
                  <Plus className="w-5 h-5 mr-2" aria-hidden="true" />
                  Create Alert
                </Button>
              </header>

              {/* Create Alert Form */}
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8"
                  id="create-alert-form"
                  role="region"
                  aria-label="Create new alert"
                >
                  <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span>Create New Alert</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowCreateForm(false)}
                          className="text-grey-400 hover:text-white h-auto p-1"
                          aria-label="Close form"
                        >
                          <X className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateAlert} className="space-y-4">
                        <FormField label="Alert Type" required>
                          <Select
                            value={alertType}
                            onChange={(e) => setAlertType(e.target.value as Alert['type'])}
                            variant="gvteway"
                            aria-label="Select alert type"
                          >
                            <option value="artist">Artist</option>
                            <option value="venue">Venue</option>
                            <option value="genre">Genre</option>
                            <option value="event">Event</option>
                          </Select>
                        </FormField>

                        <FormField label="Name" required>
                          <Input
                            type="text"
                            value={alertName}
                            aria-label="Alert name"
                            onChange={(e) => setAlertName(e.target.value)}
                            placeholder="e.g., Taylor Swift, Madison Square Garden"
                            variant="gvteway"
                            required
                          />
                        </FormField>

                        <FormField label="Criteria" required>
                          <Input
                            type="text"
                            value={alertCriteria}
                            onChange={(e) => setAlertCriteria(e.target.value)}
                            placeholder="e.g., New York, Rock, Weekend shows"
                            variant="gvteway"
                            required
                          />
                        </FormField>

                        <div className="flex gap-3">
                          <Button
                            type="submit"
                            variant="gvteway"
                            size="lg"
                            rounded="full"
                            className="flex-1"
                          >
                            Create Alert
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            rounded="full"
                            onClick={() => setShowCreateForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Alerts List */}
              {isLoading ? (
                <div className="text-center py-12">
                  <BodyText className="text-grey-400">Loading alerts...</BodyText>
                </div>
              ) : alerts.length === 0 ? (
                <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                  <CardContent className="py-12 text-center">
                    <Bell className="w-16 h-16 mx-auto mb-4 text-grey-600" />
                    <SubsectionHeader className="text-white mb-2">
                      No Alerts Yet
                    </SubsectionHeader>
                    <BodyText className="text-grey-400 mb-6">
                      Create your first alert to get notified about events
                    </BodyText>
                    <Button
                      variant="gvteway"
                      size="lg"
                      onClick={() => setShowCreateForm(true)}
                      rounded="full"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Alert
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="p-3 bg-gvteway-red-500/10 rounded-xl text-gvteway-red-500">
                                {getAlertIcon(alert.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-white">
                                    {alert.name}
                                  </h3>
                                  <Badge className="bg-gvteway-red-500/20 text-gvteway-red-500 text-caption">
                                    {alert.type}
                                  </Badge>
                                  {alert.active && (
                                    <Badge className="bg-success-light0/20 text-success text-caption">
                                      Active
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-body-sm text-grey-400">
                                  {alert.criteria}
                                </p>
                                <p className="text-caption text-grey-500 mt-2">
                                  Created {new Date(alert.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Info Card */}
              <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Settings className="w-6 h-6 text-gvteway-red-500 flex-shrink-0" />
                    <div>
                      <CardTitle className="text-white mb-2">
                        How Alerts Work
                      </CardTitle>
                      <ul className="text-body-sm text-grey-400 space-y-1">
                        <li>• Get notified when new events match your criteria</li>
                        <li>• Receive email and push notifications</li>
                        <li>• Manage your alerts anytime</li>
                        <li>• Never miss your favorite artists or venues</li>
                      </ul>
                    </div>
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
