'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import Image from 'next/image';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { QrCode, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { useGenerateQR } from '@/lib/hooks/compvss/useQRCodes';
import { BodyText } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/qr/generate

export default function GenerateQRPage() {
  const [formData, setFormData] = useState({
    type: 'access',
    name: '',
    description: '',
    validFrom: '',
    validUntil: '',
    maxScans: '',
    zone: '',
  });
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrData, setQrData] = useState<any>(null);

  const generateQRMutation = useGenerateQR();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await generateQRMutation.mutateAsync({
        type: formData.type,
        data: {
          name: formData.name,
          description: formData.description,
          validFrom: formData.validFrom || undefined,
          validUntil: formData.validUntil || undefined,
          maxScans: formData.maxScans ? parseInt(formData.maxScans) : undefined,
          zone: formData.zone || undefined,
        },
      });

      setQrData(result);
      setGenerated(true);
    } catch (err) {
      console.error('QR generation error:', err);
    }
  };

  const handleCopy = async () => {
    if (!qrData?.qrCodeUrl) return;
    
    try {
      await navigator.clipboard.writeText(qrData.qrCodeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    if (!qrData?.qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrData.qrCodeUrl;
    link.download = `qr-${qrData.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Generate QR Code"
        description="Create new QR codes for access and tracking"
        variant="compvss"
        showToolbar={false}
        
      >
        <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">QR Code Details</CardTitle>
                <CardDescription className="text-grey-400">
                  Configure your QR code settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerate} className="space-y-4">
                  {/* Type */}
                  <FormField
                    label="QR Code Type"
                    required
                  >
                    <Select
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      variant="compvss"
                      required
                    >
                      <option value="access">Access Pass</option>
                      <option value="equipment">Equipment Tracking</option>
                      <option value="meal">Meal Voucher</option>
                      <option value="parking">Parking Pass</option>
                    </Select>
                  </FormField>

                  {/* Name */}
                  <FormField
                    label="Name"
                    required
                  >
                    <Input
                      type="text"
                      placeholder="e.g., Backstage Access - John Smith"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      variant="compvss"
                      required
                    />
                  </FormField>

                  {/* Description */}
                  <FormField
                    label="Description"
                  >
                    <Textarea
                      rows={3}
                      placeholder="Additional details..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      variant="compvss"
                    />
                  </FormField>

                  {/* Valid Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Valid From">
                      <Input
                        type="date"
                        value={formData.validFrom}
                        onChange={(e) => handleChange('validFrom', e.target.value)}
                        variant="compvss"
                      />
                    </FormField>
                    <FormField label="Valid Until">
                      <Input
                        type="date"
                        value={formData.validUntil}
                        onChange={(e) => handleChange('validUntil', e.target.value)}
                        variant="compvss"
                      />
                    </FormField>
                  </div>

                  {/* Max Scans & Zone */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Max Scans">
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        value={formData.maxScans}
                        onChange={(e) => handleChange('maxScans', e.target.value)}
                        variant="compvss"
                      />
                    </FormField>
                    <FormField label="Zone">
                      <Input
                        type="text"
                        placeholder="e.g., Backstage"
                        value={formData.zone}
                        onChange={(e) => handleChange('zone', e.target.value)}
                        variant="compvss"
                      />
                    </FormField>
                  </div>

                  {/* Error Message */}
                  {generateQRMutation.error && (
                    <div className="p-3 rounded-lg bg-destructive/100/10 border border-destructive/20 text-destructive text-body-sm">
                      {generateQRMutation.error.message || 'Failed to generate QR code'}
                    </div>
                  )}

                  {/* Generate Button */}
                  <Button
                    type="submit"
                    variant="compvss"
                    size="lg"
                    className="w-full"
                    disabled={generateQRMutation.isPending}
                  >
                    <QrCode className="w-5 h-5 mr-2" />
                    {generateQRMutation.isPending ? 'Generating...' : 'Generate QR Code'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">QR Code Preview</CardTitle>
                <CardDescription className="text-grey-400">
                  {generated ? 'Your QR code is ready' : 'Preview will appear here'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generated ? (
                  <div className="space-y-6">
                    {/* QR Code Display */}
                    <div className="flex justify-center p-8 bg-white rounded-lg">
                      {qrData?.qrCodeUrl ? (
                        <Image src={qrData.qrCodeUrl} 
                          alt="QR Code" 
                          className="w-64 h-64" width={500} height={500} />
                      ) : (
                        <div className="w-64 h-64 bg-gradient-to-br from-compvss-cyan-500 to-compvss-teal-500 rounded-lg flex items-center justify-center">
                          <QrCode className="w-48 h-48 text-white" />
                        </div>
                      )}
                    </div>

                    {/* QR Details */}
                    <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                      <h3 className="text-white mb-2">{formData.name}</h3>
                      <p className="text-body-sm text-grey-400 -tech mb-3">
                        Type: {formData.type}
                      </p>
                      <div className="text-caption text-grey-500 -tech">
                        ID: {qrData?.id || 'Generating...'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Button
                        variant="compvss"
                        size="lg"
                        className="w-full"
                        onClick={handleDownload}
                        disabled={!qrData?.qrCodeUrl}
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download QR Code
                      </Button>
                      <Button
                        variant="compvss-outline"
                        size="lg"
                        className="w-full"
                        onClick={handleCopy}
                        disabled={!qrData?.qrCodeUrl}
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5 mr-2" />
                            Copy Link
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96 text-grey-600">
                    <div className="text-center">
                      <QrCode className="w-24 h-24 mx-auto mb-4 opacity-20" />
                      <BodyText className="-tech">Fill out the form to generate a QR code</BodyText>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
