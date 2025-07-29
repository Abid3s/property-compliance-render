import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import WizardStep from './WizardStep'
import { User, Phone, Mail, MapPin } from 'lucide-react'

const LandlordDetails = ({ data, onUpdate, onNext, onPrev }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    ...data
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    onUpdate(formData)
  }, [formData, onUpdate])

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const canProceed = formData.fullName && formData.address && formData.phone && formData.email

  return (
    <WizardStep
      title="Landlord Information"
      description="Please provide your details as the landlord. This information will be included in the tenancy agreement."
      onNext={handleNext}
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Continue to Tenant Details"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Your Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="e.g., John Smith"
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="address">Your Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g., 456 Oak Avenue, Manchester, M1 2AB"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="e.g., 07123 456789"
                className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="e.g., john.smith@email.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Privacy & Security</p>
        <ul className="space-y-1 text-sm">
          <li>• Your information is encrypted and stored securely</li>
          <li>• We comply with GDPR and UK data protection laws</li>
          <li>• You can request deletion of your data at any time</li>
          <li>• This information will appear in your tenancy agreement</li>
        </ul>
      </div>
    </WizardStep>
  )
}

export default LandlordDetails

