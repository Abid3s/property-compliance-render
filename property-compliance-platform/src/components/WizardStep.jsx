import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const WizardStep = ({ 
  title, 
  description, 
  children, 
  onNext, 
  onPrev, 
  nextLabel = "Continue", 
  prevLabel = "Back",
  canProceed = true,
  showPrev = true,
  showNext = true 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
        )}
      </div>
      
      <div className="space-y-6">
        {children}
      </div>
      
      <div className="flex justify-between pt-6 border-t">
        {showPrev ? (
          <Button 
            variant="outline" 
            onClick={onPrev}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{prevLabel}</span>
          </Button>
        ) : (
          <div />
        )}
        
        {showNext && (
          <Button 
            onClick={onNext}
            disabled={!canProceed}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <span>{nextLabel}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default WizardStep

