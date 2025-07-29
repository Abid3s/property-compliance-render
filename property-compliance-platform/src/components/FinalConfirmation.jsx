import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import WizardStep from './WizardStep'
import { Download, CheckCircle, FileText, Shield, Star, ExternalLink, Loader2 } from 'lucide-react'

const FinalConfirmation = ({ formData, onPrev }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState(null)

  const handleGenerateAndDownload = async () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before proceeding.')
      return
    }

    setIsGenerating(true)
    
    try {
      // Call the backend API to generate the tenancy pack
      const response = await fetch('/api/generate-tenancy-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate tenancy pack')
      }
      
      // Download the zip file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tenancy_pack_${new Date().toISOString().slice(0, 10)}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setIsGenerated(true)
      setDownloadUrl(url)
    } catch (error) {
      console.error('Error generating tenancy pack:', error)
      alert('There was an error generating your tenancy pack. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const packContents = [
    {
      title: 'Assured Shorthold Tenancy Agreement',
      description: 'Completed with all your provided information',
      icon: FileText,
      status: 'included'
    },
    {
      title: 'Energy Performance Certificate',
      description: formData.documents.epc.file ? 'Your uploaded document' : 'Acknowledged as available',
      icon: FileText,
      status: formData.documents.epc.file ? 'uploaded' : 'acknowledged'
    },
    {
      title: 'Gas Safety Certificate',
      description: formData.documents.gasSafety.file ? 'Your uploaded document' : 'Acknowledged as available',
      icon: FileText,
      status: formData.documents.gasSafety.file ? 'uploaded' : 'acknowledged'
    },
    {
      title: 'Electrical Safety Certificate (EICR)',
      description: formData.documents.eicr.file ? 'Your uploaded document' : 'Acknowledged as available',
      icon: FileText,
      status: formData.documents.eicr.file ? 'uploaded' : 'acknowledged'
    },
    {
      title: 'Right to Rent Documentation',
      description: formData.documents.rightToRent.file ? 'Your uploaded document' : 'Acknowledged as available',
      icon: FileText,
      status: formData.documents.rightToRent.file ? 'uploaded' : 'acknowledged'
    },
    {
      title: 'Deposit Protection Evidence',
      description: formData.documents.deposit.file ? 'Your uploaded document' : 'Acknowledged as available',
      icon: FileText,
      status: formData.documents.deposit.file ? 'uploaded' : 'acknowledged'
    },
    {
      title: 'How to Rent Guide',
      description: 'Latest official government guide',
      icon: FileText,
      status: 'included'
    },
    {
      title: 'Tenancy Checklist',
      description: 'Complete compliance checklist',
      icon: CheckCircle,
      status: 'included'
    }
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'included':
        return <Badge className="bg-green-100 text-green-800">Included</Badge>
      case 'uploaded':
        return <Badge className="bg-blue-100 text-blue-800">Uploaded</Badge>
      case 'acknowledged':
        return <Badge className="bg-gray-100 text-gray-800">Acknowledged</Badge>
      default:
        return null
    }
  }

  return (
    <WizardStep
      title={isGenerated ? "Download Your Tenancy Pack" : "Generate Tenancy Pack"}
      description={isGenerated ? "Your complete tenancy pack is ready for download." : "Review the contents of your tenancy pack and generate your documents."}
      onPrev={onPrev}
      showNext={false}
    >
      <div className="space-y-6">
        {/* Focus Insurance CTA */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Protect Your Property</h3>
                  <p className="text-gray-600 mt-1">Get comprehensive landlord insurance coverage</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Trusted by thousands of landlords</span>
                  </div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                Get a Quote
                <ExternalLink className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pack Contents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span>Your Tenancy Pack Contents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {packContents.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        {!isGenerated && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                  className="mt-1"
                />
                <div className="space-y-2">
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to the terms and conditions and privacy policy
                  </label>
                  <p className="text-xs text-gray-600">
                    By proceeding, you confirm that all information provided is accurate and complete. 
                    You understand that this platform generates legal documents and you are responsible 
                    for ensuring compliance with all applicable laws and regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate/Download Button */}
        <div className="text-center">
          {!isGenerated ? (
            <Button
              onClick={handleGenerateAndDownload}
              disabled={!agreedToTerms || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your Pack...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Generate Tenancy Pack
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <p className="text-lg font-medium text-green-800">
                    Your tenancy pack has been generated successfully!
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => window.open(downloadUrl, '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Tenancy Pack
              </Button>
              
              <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                Your download will begin automatically. The pack contains all required documents 
                in a single ZIP file. Please save this file securely as it contains sensitive information.
              </p>
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Important Information</p>
          <ul className="space-y-1 text-sm">
            <li>• Your data is automatically deleted 30 days after download</li>
            <li>• All documents are legally compliant with current UK regulations</li>
            <li>• Keep your tenancy pack secure and provide copies to tenants as required</li>
            <li>• For support or questions, contact our team at support@propertyplatform.co.uk</li>
          </ul>
        </div>
      </div>
    </WizardStep>
  )
}

export default FinalConfirmation

