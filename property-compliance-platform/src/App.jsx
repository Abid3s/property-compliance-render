import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { CheckCircle, FileText, Upload, Shield, Users, Download } from 'lucide-react'
import './App.css'

// Import components (we'll create these)
import WizardStep from './components/WizardStep'
import PropertyDetails from './components/PropertyDetails'
import LandlordDetails from './components/LandlordDetails'
import TenantDetails from './components/TenantDetails'
import RentalTerms from './components/RentalTerms'
import DocumentUpload from './components/DocumentUpload'
import ReviewSummary from './components/ReviewSummary'
import FinalConfirmation from './components/FinalConfirmation'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    property: {},
    landlord: {},
    tenants: [{}],
    rentalTerms: {},
    documents: {}
  })

  const steps = [
    { id: 'property', title: 'Property Details', icon: FileText },
    { id: 'landlord', title: 'Landlord Information', icon: Users },
    { id: 'tenants', title: 'Tenant Information', icon: Users },
    { id: 'rental', title: 'Rental Terms', icon: FileText },
    { id: 'documents', title: 'Compliance Documents', icon: Upload },
    { id: 'review', title: 'Review & Confirm', icon: CheckCircle },
    { id: 'download', title: 'Download Pack', icon: Download }
  ]

  const updateFormData = (section, data) => {
    console.log(`Updating formData for section: ${section}`, data);
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const nextStep = () => {
    console.log('Attempting to go to next step. Current step:', currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => {
        console.log('Moved to next step. New step:', prevStep + 1);
        return prevStep + 1;
      });
    }
  }

  const prevStep = () => {
    console.log('Attempting to go to previous step. Current step:', currentStep);
    if (currentStep > 0) {
      setCurrentStep(prevStep => {
        console.log('Moved to previous step. New step:', prevStep - 1);
        return prevStep - 1;
      });
    }
  }

  useEffect(() => {
    console.log('App component re-rendered. Current step:', currentStep);
  }, [currentStep]);

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Property Compliance Platform</h1>
                  <p className="text-sm text-gray-600">Trusted by landlords across the UK</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Fully Compliant
              </Badge>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-500 border-blue-500 text-white' 
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className={`mx-4 h-0.5 w-8 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {currentStep === 0 && (
                <PropertyDetails 
                  data={formData.property} 
                  onUpdate={(data) => updateFormData('property', data)}
                  onNext={nextStep}
                />
              )}
              {currentStep === 1 && (
                <LandlordDetails 
                  data={formData.landlord} 
                  onUpdate={(data) => updateFormData('landlord', data)}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 2 && (
                <TenantDetails 
                  data={formData.tenants} 
                  onUpdate={(data) => updateFormData('tenants', data)}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 3 && (
                <RentalTerms 
                  data={formData.rentalTerms} 
                  onUpdate={(data) => updateFormData('rentalTerms', data)}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 4 && (
                <DocumentUpload 
                  data={formData.documents} 
                  onUpdate={(data) => updateFormData('documents', data)}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}
              {currentStep === 5 && (
                <ReviewSummary 
                  formData={formData}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onEdit={(step) => setCurrentStep(step)}
                />
              )}
              {currentStep === 6 && (
                <FinalConfirmation 
                  formData={formData}
                  onPrev={prevStep}
                />
              )}
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-600">
              <p>© 2024 Property Compliance Platform. All rights reserved.</p>
              <p className="mt-2">GDPR Compliant • SSL Secured • Trusted by landlords across the UK</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App



