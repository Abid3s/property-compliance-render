import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import WizardStep from './WizardStep'
import { CheckCircle, Edit, FileText, Users, PoundSterling, Upload, AlertTriangle } from 'lucide-react'

const ReviewSummary = ({ formData, onNext, onPrev, onEdit }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getOrdinalSuffix = (num) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }

  const getPaymentSchedule = () => {
    if (formData.rentalTerms.paymentFrequency === 'month') {
      return `${formData.rentalTerms.paymentDay}${getOrdinalSuffix(parseInt(formData.rentalTerms.paymentDay))} of each month`
    } else {
      return `Every ${formData.rentalTerms.paymentDay}`
    }
  }

  const getDocumentStatus = (doc) => {
    if (doc.file) return 'uploaded'
    if (doc.hasDocument) return 'acknowledged'
    return 'missing'
  }

  const documentTypes = [
    { key: 'epc', title: 'Energy Performance Certificate (EPC)' },
    { key: 'gasSafety', title: 'Gas Safety Certificate' },
    { key: 'eicr', title: 'Electrical Installation Condition Report (EICR)' },
    { key: 'rightToRent', title: 'Right to Rent Documentation' },
    { key: 'deposit', title: 'Deposit Protection Evidence' }
  ]

  const allRequirementsMet = documentTypes.every(docType => {
    const doc = formData.documents[docType.key]
    return doc && (doc.file || doc.hasDocument)
  })

  const checklist = [
    {
      item: 'Tenancy Agreement',
      status: 'complete',
      description: 'Generated from your provided information'
    },
    {
      item: 'Energy Performance Certificate',
      status: getDocumentStatus(formData.documents.epc),
      description: 'Property energy efficiency rating'
    },
    {
      item: 'Gas Safety Certificate',
      status: getDocumentStatus(formData.documents.gasSafety),
      description: 'Annual gas appliance safety check'
    },
    {
      item: 'Electrical Safety Certificate',
      status: getDocumentStatus(formData.documents.eicr),
      description: 'Electrical installation condition report'
    },
    {
      item: 'Right to Rent Check',
      status: getDocumentStatus(formData.documents.rightToRent),
      description: 'Tenant eligibility verification'
    },
    {
      item: 'Deposit Protection',
      status: getDocumentStatus(formData.documents.deposit),
      description: 'Tenancy deposit scheme protection'
    },
    {
      item: 'How to Rent Guide',
      status: 'complete',
      description: 'Latest government guide (automatically included)'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
      case 'uploaded':
      case 'acknowledged':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>
      case 'uploaded':
        return <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
      case 'acknowledged':
        return <Badge className="bg-blue-100 text-blue-800">Acknowledged</Badge>
      default:
        return <Badge variant="destructive">Missing</Badge>
    }
  }

  return (
    <WizardStep
      title="Review & Confirm"
      description="Please review all the information below. You can edit any section before generating your tenancy pack."
      onNext={onNext}
      onPrev={onPrev}
      canProceed={allRequirementsMet}
      nextLabel="Generate Tenancy Pack"
    >
      <div className="space-y-6">
        {/* Compliance Checklist */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-blue-600" />
              <span>Legal Compliance Checklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium text-gray-900">{item.item}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
            
            {!allRequirementsMet && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Action Required</p>
                    <p className="text-sm text-red-700 mt-1">
                      Please complete all missing requirements before proceeding. 
                      You can upload documents or confirm you have them.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Property Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Property Information</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(0)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{formData.property.fullAddress}</p>
          </CardContent>
        </Card>

        {/* Landlord Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Landlord Information</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(1)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{formData.landlord.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{formData.landlord.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{formData.landlord.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{formData.landlord.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Tenant Information ({formData.tenants.length} tenant{formData.tenants.length > 1 ? 's' : ''})</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(2)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.tenants.map((tenant, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    Tenant {index + 1}
                    {index === 0 && <span className="text-sm text-gray-500 ml-2">(Primary)</span>}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span> {tenant.fullName}
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span> {tenant.email}
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span> {tenant.phone}
                    </div>
                    <div>
                      <span className="text-gray-600">Address:</span> {tenant.address}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rental Terms */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <PoundSterling className="h-5 w-5 text-blue-600" />
              <span>Rental Terms</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(3)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Rent Amount</p>
                <p className="font-medium">{formatCurrency(formData.rentalTerms.rentAmount)} per {formData.rentalTerms.paymentFrequency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Schedule</p>
                <p className="font-medium">{getPaymentSchedule()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Security Deposit</p>
                <p className="font-medium">{formatCurrency(formData.rentalTerms.depositAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tenancy Length</p>
                <p className="font-medium">{formData.rentalTerms.tenancyLength} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{formatDate(formData.rentalTerms.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agreement Date</p>
                <p className="font-medium">{formatDate(formData.rentalTerms.agreementDate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <span>Compliance Documents</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onEdit(4)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentTypes.map((docType) => {
                const doc = formData.documents[docType.key]
                const status = getDocumentStatus(doc)
                
                return (
                  <div key={docType.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{docType.title}</p>
                        {doc.file && (
                          <p className="text-sm text-gray-600">{doc.file.name}</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {allRequirementsMet && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Ready to Generate</p>
                <p className="text-sm text-green-700 mt-1">
                  All requirements have been met. Your tenancy pack will include the completed 
                  tenancy agreement, all uploaded documents, and the official "How to Rent" guide.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardStep>
  )
}

export default ReviewSummary

