import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import WizardStep from './WizardStep'
import { Users, Plus, Minus, Phone, Mail } from 'lucide-react'

const TenantDetails = ({ data, onUpdate, onNext, onPrev }) => {
  const [tenants, setTenants] = useState(
    data && data.length > 0 ? data : [{ fullName: '', address: '', phone: '', email: '' }]
  )
  const [errors, setErrors] = useState({})

  useEffect(() => {
    onUpdate(tenants)
  }, [tenants, onUpdate])

  const handleTenantChange = (index, field, value) => {
    const updatedTenants = [...tenants]
    updatedTenants[index] = {
      ...updatedTenants[index],
      [field]: value
    }
    setTenants(updatedTenants)
    
    // Clear error when user starts typing
    if (errors[`${index}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${index}_${field}`]: ''
      }))
    }
  }

  const addTenant = () => {
    if (tenants.length < 4) {
      setTenants([...tenants, { fullName: '', address: '', phone: '', email: '' }])
    }
  }

  const removeTenant = (index) => {
    if (tenants.length > 1) {
      const updatedTenants = tenants.filter((_, i) => i !== index)
      setTenants(updatedTenants)
      
      // Clear errors for removed tenant
      const newErrors = { ...errors }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${index}_`)) {
          delete newErrors[key]
        }
      })
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    tenants.forEach((tenant, index) => {
      if (!tenant.fullName.trim()) {
        newErrors[`${index}_fullName`] = 'Full name is required'
      }
      
      if (!tenant.address.trim()) {
        newErrors[`${index}_address`] = 'Address is required'
      }
      
      if (!tenant.phone.trim()) {
        newErrors[`${index}_phone`] = 'Phone number is required'
      } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(tenant.phone.trim())) {
        newErrors[`${index}_phone`] = 'Please enter a valid phone number'
      }
      
      if (!tenant.email.trim()) {
        newErrors[`${index}_email`] = 'Email address is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tenant.email.trim())) {
        newErrors[`${index}_email`] = 'Please enter a valid email address'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const canProceed = tenants.every(tenant => 
    tenant.fullName && tenant.address && tenant.phone && tenant.email
  )

  return (
    <WizardStep
      title="Tenant Information"
      description="Please provide details for all tenants who will be named on the tenancy agreement. You can add up to 4 tenants."
      onNext={handleNext}
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Continue to Rental Terms"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Tenant Details ({tenants.length} of 4 maximum)
            </h3>
          </div>
          
          {tenants.length < 4 && (
            <Button
              variant="outline"
              onClick={addTenant}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Tenant</span>
            </Button>
          )}
        </div>
        
        {tenants.map((tenant, index) => (
          <Card key={index} className="border-2 border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Tenant {index + 1}
                  {index === 0 && <span className="text-sm font-normal text-gray-500 ml-2">(Primary Tenant)</span>}
                </CardTitle>
                {tenants.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTenant(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`tenant-${index}-name`}>Full Name *</Label>
                  <Input
                    id={`tenant-${index}-name`}
                    value={tenant.fullName}
                    onChange={(e) => handleTenantChange(index, 'fullName', e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className={errors[`${index}_fullName`] ? 'border-red-500' : ''}
                  />
                  {errors[`${index}_fullName`] && (
                    <p className="text-sm text-red-600">{errors[`${index}_fullName`]}</p>
                  )}
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`tenant-${index}-address`}>Current Address *</Label>
                  <Input
                    id={`tenant-${index}-address`}
                    value={tenant.address}
                    onChange={(e) => handleTenantChange(index, 'address', e.target.value)}
                    placeholder="e.g., 789 High Street, Birmingham, B1 1AA"
                    className={errors[`${index}_address`] ? 'border-red-500' : ''}
                  />
                  {errors[`${index}_address`] && (
                    <p className="text-sm text-red-600">{errors[`${index}_address`]}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`tenant-${index}-phone`}>Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`tenant-${index}-phone`}
                      value={tenant.phone}
                      onChange={(e) => handleTenantChange(index, 'phone', e.target.value)}
                      placeholder="e.g., 07987 654321"
                      className={`pl-10 ${errors[`${index}_phone`] ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors[`${index}_phone`] && (
                    <p className="text-sm text-red-600">{errors[`${index}_phone`]}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`tenant-${index}-email`}>Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id={`tenant-${index}-email`}
                      type="email"
                      value={tenant.email}
                      onChange={(e) => handleTenantChange(index, 'email', e.target.value)}
                      placeholder="e.g., jane.doe@email.com"
                      className={`pl-10 ${errors[`${index}_email`] ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors[`${index}_email`] && (
                    <p className="text-sm text-red-600">{errors[`${index}_email`]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Important Information</p>
          <ul className="space-y-1 text-sm">
            <li>• All tenants listed will be jointly and severally liable for the rent</li>
            <li>• Each tenant must be 18 years or older</li>
            <li>• All tenants will need to sign the tenancy agreement</li>
            <li>• You can add up to 4 tenants maximum</li>
          </ul>
        </div>
      </div>
    </WizardStep>
  )
}

export default TenantDetails

