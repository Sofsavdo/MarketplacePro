import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Store, Upload, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function SellerRegister() {
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
    // Business info
    businessName: '',
    businessDescription: '',
    businessType: '',
    taxId: '',
    businessAddress: '',
    // Documents
    businessLicense: null as File | null,
    taxCertificate: null as File | null,
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
        description: 'Seller registration submitted for review',
      });
      
      navigate('/seller/dashboard');
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
    const { businessLicense, taxCertificate, ...registerData } = formData;
    registerMutation.mutate({
      ...registerData,
      role: 'seller',
    });
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = (field: 'businessLicense' | 'taxCertificate') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const steps = [
    { number: 1, title: 'Personal Information' },
    { number: 2, title: 'Business Details' },
    { number: 3, title: 'Documents' },
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
              <Store className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{t('common.becomeSeller')}</CardTitle>
            <CardDescription>
              Join TexnoGrand marketplace and start selling your products
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
                  <h3 className="text-lg font-semibold">Business Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange('businessName')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                      value={formData.businessType}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="individual">Individual Entrepreneur</option>
                      <option value="llc">LLC</option>
                      <option value="corporation">Corporation</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID *</Label>
                    <Input
                      id="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange('taxId')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessAddress">Business Address *</Label>
                    <Textarea
                      id="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange('businessAddress')}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description *</Label>
                    <Textarea
                      id="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange('businessDescription')}
                      placeholder="Describe your business and products..."
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <p className="text-sm text-gray-600">
                    Upload required documents for verification
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Business License *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        id="businessLicense"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange('businessLicense')}
                        className="hidden"
                        required
                      />
                      <label htmlFor="businessLicense" className="cursor-pointer">
                        {formData.businessLicense ? (
                          <span className="text-green-600">{formData.businessLicense.name}</span>
                        ) : (
                          <span className="text-gray-600">Click to upload business license</span>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxCertificate">Tax Certificate *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        id="taxCertificate"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange('taxCertificate')}
                        className="hidden"
                        required
                      />
                      <label htmlFor="taxCertificate" className="cursor-pointer">
                        {formData.taxCertificate ? (
                          <span className="text-green-600">{formData.taxCertificate.name}</span>
                        ) : (
                          <span className="text-gray-600">Click to upload tax certificate</span>
                        )}
                      </label>
                    </div>
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
