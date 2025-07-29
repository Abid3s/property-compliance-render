import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import WizardStep from './WizardStep'
import { Upload, FileText, CheckCircle, X, Eye, AlertCircle } from 'lucide-react'

const DocumentUpload = ({ data, onUpdate, onNext, onPrev }) => {
  const [documents, setDocuments] = useState({
    epc: { file: null, hasDocument: false, required: true },
    gasSafety: { file: null, hasDocument: false, required: true },
    eicr: { file: null, hasDocument: false, required: true },
    rightToRent: { file: null, hasDocument: false, required: true },
    deposit: { file: null, hasDocument: false, required: true },
    ...data
  })

  const [dragOver, setDragOver] = useState(null)

  useEffect(() => {
    onUpdate(documents)
  }, [documents, onUpdate])

  const documentTypes = [
    {
      key: 'epc',
      title: 'Energy Performance Certificate (EPC)',
      description: 'Required for all rental properties. Must be valid and not expired.',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    },
    {
      key: 'gasSafety',
      title: 'Gas Safety Certificate',
      description: 'Annual gas safety check certificate. Required if property has gas appliances.',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    },
    {
      key: 'eicr',
      title: 'Electrical Installation Condition Report (EICR)',
      description: 'Electrical safety certificate. Required for all rental properties.',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    },
    {
      key: 'rightToRent',
      title: 'Right to Rent Documentation',
      description: 'Evidence that tenants have the right to rent in the UK.',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    },
    {
      key: 'deposit',
      title: 'Deposit Protection Evidence',
      description: 'Proof that the deposit is protected in an approved scheme.',
      acceptedFormats: '.pdf,.jpg,.jpeg,.png'
    }
  ]

  const handleFileUpload = (docType, file) => {
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setDocuments(prev => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          file: file,
          hasDocument: false
        }
      }))
    } else {
      alert('File size must be less than 10MB')
    }
  }

  const handleHasDocument = (docType, checked) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        hasDocument: checked,
        file: checked ? null : prev[docType].file
      }
    }))
  }

  const removeFile = (docType) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        ...prev[docType],
        file: null
      }
    }))
  }

  const handleDragOver = (e, docType) => {
    e.preventDefault()
    setDragOver(docType)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(null)
  }

  const handleDrop = (e, docType) => {
    e.preventDefault()
    setDragOver(null)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(docType, files[0])
    }
  }

  const isDocumentComplete = (doc) => {
    return doc.file !== null || doc.hasDocument
  }

  const allDocumentsComplete = documentTypes.every(docType => 
    isDocumentComplete(documents[docType.key])
  )

  const getDocumentStatus = (doc) => {
    if (doc.file) return 'uploaded'
    if (doc.hasDocument) return 'acknowledged'
    return 'missing'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'uploaded':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Uploaded</Badge>
      case 'acknowledged':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Acknowledged</Badge>
      default:
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Required</Badge>
    }
  }

  return (
    <WizardStep
      title="Compliance Documents"
      description="Upload your compliance documents or confirm you have them. All documents are required for a complete tenancy pack."
      onNext={onNext}
      onPrev={onPrev}
      canProceed={allDocumentsComplete}
      nextLabel="Continue to Review"
    >
      <div className="space-y-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800 font-medium">
            {documentTypes.filter(docType => isDocumentComplete(documents[docType.key])).length} of {documentTypes.length} documents complete
          </p>
        </div>

        {documentTypes.map((docType) => {
          const doc = documents[docType.key]
          const status = getDocumentStatus(doc)
          
          return (
            <Card key={docType.key} className="border-2 border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>{docType.title}</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{docType.description}</p>
                  </div>
                  {getStatusBadge(status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                {!doc.hasDocument && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragOver === docType.key
                        ? 'border-blue-500 bg-blue-50'
                        : doc.file
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={(e) => handleDragOver(e, docType.key)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, docType.key)}
                  >
                    {doc.file ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center space-x-2">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div className="text-left">
                            <p className="font-medium text-green-800">{doc.file.name}</p>
                            <p className="text-sm text-green-600">
                              {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Preview</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFile(docType.key)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                            <span>Remove</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Drop your file here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">
                            Accepted formats: {docType.acceptedFormats} (Max 10MB)
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = docType.acceptedFormats
                            input.onchange = (e) => {
                              if (e.target.files[0]) {
                                handleFileUpload(docType.key, e.target.files[0])
                              }
                            }
                            input.click()
                          }}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Alternative Option */}
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Checkbox
                    id={`has-${docType.key}`}
                    checked={doc.hasDocument}
                    onCheckedChange={(checked) => handleHasDocument(docType.key, checked)}
                  />
                  <label
                    htmlFor={`has-${docType.key}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I have this document and don't want to upload it now
                  </label>
                </div>

                {doc.hasDocument && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Important:</strong> You've confirmed you have this document. 
                      Please ensure you have it available for the tenancy as it may be required 
                      for compliance checks.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Document Requirements</p>
          <ul className="space-y-1 text-sm">
            <li>• All documents must be current and valid</li>
            <li>• Files should be clear and readable</li>
            <li>• Maximum file size: 10MB per document</li>
            <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
            <li>• Documents are stored securely and encrypted</li>
          </ul>
        </div>
      </div>
    </WizardStep>
  )
}

export default DocumentUpload

