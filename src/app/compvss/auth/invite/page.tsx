'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { UserPlus, Mail, Send, CheckCircle2,  } from 'lucide-react';
import { useAuth } from '@/lib/hooks/compvss/useAuth';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { BodyText, HeroTitle, SubsectionHeader } from "@/components/atoms/Typography";

export default function InvitePage() {
  const [emails, setEmails] = useState(['']);
  const [sent, setSent] = useState(false);
  const [_isSending, setIsSending] = useState(false);
  const { data: authData } = useAuth();

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      // TODO: Implement actual invite API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <CompvssLayout>
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 -m-6">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-96 h-96 bg-compvss-cyan-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="relative z-10 w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <Link href="/compvss">
              <HeroTitle className="compvss-text-gradient mb-2 cursor-pointer">
                COMPVSS
              </HeroTitle>
            </Link>
            <BodyText className="text-grey-400">Invite Team Members</BodyText>
          </div>

          {/* Invite Card */}
          <Card variant="compvss" className="bg-grey-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-compvss-cyan-500" />
                Send Invitations
              </CardTitle>
              <CardDescription className="text-grey-400">
                Invite crew members and staff to join your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSend} className="space-y-6">
                {/* Email Fields */}
                <FormField label="Email Addresses" required>
                  <div className="space-y-3">
                    {emails.map((email, index) => (
                      <div key={index} className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          value={email}
                          onChange={(e) => updateEmail(index, e.target.value)}
                          className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </FormField>

                {/* Add More Button */}
                <Button
                  type="button"
                  variant="compvss-outline"
                  size="sm"
                  onClick={addEmailField}
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Another Email
                </Button>

                {/* Role Selection */}
                <FormField label="Default Role" required>
                  <Select variant="compvss">
                    <option value="crew">Crew Member</option>
                    <option value="manager">Stage Manager</option>
                    <option value="tech">Technician</option>
                    <option value="security">Security</option>
                    <option value="vendor">Vendor</option>
                  </Select>
                </FormField>

                {/* Message */}
                <FormField label="Personal Message (Optional)">
                  <Textarea
                    variant="compvss"
                    rows={3}
                    placeholder="Add a personal message to your invitation..."
                  />
                </FormField>

                {/* Send Button */}
                {sent ? (
                  <div className="p-4 rounded-lg bg-success-light0/10 border border-success/30 text-center">
                    <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
                    <BodyText className="text-success">
                      Invitations sent successfully!
                    </BodyText>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="compvss"
                    size="lg"
                    className="w-full"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Invitations
                  </Button>
                )}
              </form>

              {/* Info */}
              <div className="mt-6 p-4 rounded-lg bg-black/30 border border-compvss-cyan-500/20">
                <SubsectionHeader className="text-body-sm text-white mb-2">What happens next?</SubsectionHeader>
                <ul className="space-y-2 text-caption text-grey-400 -tech">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-1.5" />
                    <span>Recipients will receive an email invitation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-1.5" />
                    <span>They can create an account using the invite link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-1.5" />
                    <span>Invites expire after 7 days</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link href="/compvss/team/directory">
              <Button variant="compvss-ghost" size="sm">
                Back to Team Directory
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
    </CompvssLayout>
  );
}
