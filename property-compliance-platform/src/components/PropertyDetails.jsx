import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import WizardStep from './WizardStep'
import { MapPin, Home } from 'lucide-react'

const PropertyDetails = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState({
    houseNumber: '',
    street: '',
    city: '',
    postcode: '',
    fullAddress: '',
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
    
    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'House number/name is required'
    }
    
    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required'
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    
    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode is required'
    } else if (!/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(formData.postcode.trim())) {
      newErrors.postcode = 'Please enter a valid UK postcode'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      // Construct full address
      const fullAddress = `${formData.houseNumber} ${formData.street}, ${formData.city}, ${formData.postcode}`
      setFormData(prev => ({ ...prev, fullAddress }))
      onNext()
    }
  }

  const canProceed = formData.houseNumber && formData.street && formData.city && formData.postcode

  return (
    <WizardStep
      title="Property Details"
      description="Let's start with the rental property information. This will be used in your tenancy agreement."
      onNext={handleNext}
      canProceed={canProceed}
      showPrev={false}
      nextLabel="Continue to Landlord Details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Home className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Rental Property Address</h3>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="houseNumber">House Number/Name *</Label>
          <Input
            id="houseNumber"
            value={formData.houseNumber}
            onChange={(e) => handleChange('houseNumber', e.target.value)}
            placeholder="e.g., 123 or Flat 2A"
            className={errors.houseNumber ? 'border-red-500' : ''}
          />
          {errors.houseNumber && (
            <p className="text-sm text-red-600">{errors.houseNumber}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="street">Street Address *</Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="e.g., Baker Street"
            className={errors.street ? 'border-red-500' : ''}
          />
          {errors.street && (
            <p className="text-sm text-red-600">{errors.street}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City/Town *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="e.g., London"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-sm text-red-600">{errors.city}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postcode">Postcode *</Label>
          <Input
            id="postcode"
            value={formData.postcode}
            onChange={(e) => handleChange('postcode', e.target.value.toUpperCase())}
            placeholder="e.g., SW1A 1AA"
            className={errors.postcode ? 'border-red-500' : ''}
          />
          {errors.postcode && (
            <p className="text-sm text-red-600">{errors.postcode}</p>
          )}
        </div>
      </div>
      
      {formData.houseNumber && formData.street && formData.city && formData.postcode && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Property Address Preview</h4>
              <p className="text-blue-700 mt-1">
                {formData.houseNumber} {formData.street}, {formData.city}, {formData.postcode}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Why do we need this information?</p>
        <ul className="space-y-1 text-sm">
          <li>• This address will appear on your tenancy agreement</li>
          <li>• Required for legal compliance and documentation</li>
          <li>• Used for property identification in all official documents</li>
        </ul>
      </div>
    </WizardStep>
  )
}

export default PropertyDetails

