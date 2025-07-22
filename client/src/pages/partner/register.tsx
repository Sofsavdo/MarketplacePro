import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Users, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function PartnerRegister() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal info
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    // Partner info
    companyName: '',
    companyDescription: '',
    partnershipType: '',
    website: '',
    socialMedia: '',
    experience: '',
    expectedRevenue: '',
    // Portfolio
    portfolio: null as File | null,
    businessPlan: null as File | null,
  });

  const registerMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('POST', '/api/auth/register', data),
    onSuccess: async (response) => {
      const result = await response.json();
      localStorage.setItem('texnogrand-token', result.token);
      localStorage.setItem('texnogrand-user', JSON.stringify(result.user));
      
      toast({
        title: t('common.success'),
        description: 'Partner application submitted for review',
      });
      
      navigate('/partner/dashboard');
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: 'Registration failed. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission
    const { portfolio, businessPlan, ...registerData } = formData;
    registerMutation.mutate({
      ...registerData,
      role: 'partner',
    });
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (field: 'portfolio' | 'businessPlan') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Partnership Details' },
    { number: 3, title: 'Portfolio & Documents' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.number 
                    ? 'bg-[#2A6BFF] text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {step.number < 3 && (
                  <div className={`w-24 h-1 mx-4 ${
                    currentStep > step.number ? 'bg-[#2A6BFF]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span key={step.number} className="text-sm text-gray-600 w-32 text-center">
                {step.title}
              </span>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#2A6BFF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{t('common.becomePartner')}</CardTitle>
            <CardDescription>
              Partner with TexnoGrand and grow your business together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t('auth.firstName')} *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t('auth.lastName')} *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange('username')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('auth.phone')} *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      placeholder="+998 XX XXX XX XX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')} *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Partnership Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange('companyName')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partnershipType">Partnership Type *</Label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                      value={formData.partnershipType}
                      onChange={(e) => setFormData(prev => ({ ...prev, partnershipType: e.target.value }))}
                      required
                    >
                      <option value="">Select partnership type</option>
                      <option value="affiliate">Affiliate Marketing</option>
                      <option value="wholesale">Wholesale Partner</option>
                      <option value="logistics">Logistics Partner</option>
                      <option value="technology">Technology Partner</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange('website')}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialMedia">Social Media Links</Label>
                    <Textarea
                      id="socialMedia"
                      value={formData.socialMedia}
                      onChange={handleInputChange('socialMedia')}
                      placeholder="Instagram, Facebook, Telegram channels etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience *</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={handleInputChange('experience')}
                      placeholder="Describe your relevant experience..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedRevenue">Expected Monthly Revenue (USD)</Label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                      value={formData.expectedRevenue}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedRevenue: e.target.value }))}
                    >
                      <option value="">Select expected revenue</option>
                      <option value="0-1000">$0 - $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000+">$10,000+</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyDescription">Company Description *</Label>
                    <Textarea
                      id="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleInputChange('companyDescription')}
                      placeholder="Describe your company and partnership goals..."
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Portfolio & Documents</h3>
                  <p className="text-sm text-gray-600">
                    Upload documents to support your partnership application
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/Presentation</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        id="portfolio"
                        accept=".pdf,.ppt,.pptx"
                        onChange={handleFileChange('portfolio')}
                        className="hidden"
                      />
                      <label htmlFor="portfolio" className="cursor-pointer">
                        {formData.portfolio ? (
                          <span className="text-green-600">{formData.portfolio.name}</span>
                        ) : (
                          <span className="text-gray-600">Click to upload portfolio/presentation</span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessPlan">Business Plan</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        id="businessPlan"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange('businessPlan')}
                        className="hidden"
                      />
                      <label htmlFor="businessPlan" className="cursor-pointer">
                        {formData.businessPlan ? (
                          <span className="text-green-600">{formData.businessPlan.name}</span>
                        ) : (
                          <span className="text-gray-600">Click to upload business plan</span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Partnership Benefits</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Commission-based earnings</li>
                      <li>• Marketing support and resources</li>
                      <li>• Dedicated partner manager</li>
                      <li>• Access to exclusive products and promotions</li>
                      <li>• Regular training and development programs</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <Button
                  type="submit"
                  className="btn-texno-primary"
                  disabled={registerMutation.isPending}
                >
                  {currentStep === 3 
                    ? (registerMutation.isPending ? 'Submitting...' : 'Submit Application')
                    : 'Next'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
