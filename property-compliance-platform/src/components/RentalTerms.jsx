import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import WizardStep from './WizardStep';

const RentalTerms = ({ data, onUpdate, onNext, onPrev }) => {
  const [terms, setTerms] = useState(data || {
    rentAmount: '',
    rentFrequency: 'monthly',
    paymentDate: '',
    depositAmount: '',
    tenancyStartDate: '',
    tenancyLength: '12',
  });

  useEffect(() => {
    onUpdate(terms);
  }, [terms, onUpdate]);

  const handleChange = (field, value) => {
    setTerms(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = Object.values(terms).every(Boolean);

  return (
    <WizardStep
      title="Rental Terms"
      description="Define the key terms of the tenancy agreement."
      onNext={onNext}
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Continue to Document Upload"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rent Amount */}
        <div className="space-y-2">
          <Label htmlFor="rent-amount">Rent Amount (£) *</Label>
          <Input
            id="rent-amount"
            type="number"
            value={terms.rentAmount}
            onChange={(e) => handleChange('rentAmount', e.target.value)}
            placeholder="e.g., 1200"
          />
        </div>

        {/* Rent Frequency */}
        <div className="space-y-2">
          <Label htmlFor="rent-frequency">Rent Frequency *</Label>
          <Select value={terms.rentFrequency} onValueChange={(value) => handleChange('rentFrequency', value)}>
            <SelectTrigger id="rent-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Date */}
        <div className="space-y-2">
          <Label htmlFor="payment-date">Rent Payment Date *</Label>
          <Input
            id="payment-date"
            type="text"
            value={terms.paymentDate}
            onChange={(e) => handleChange('paymentDate', e.target.value)}
            placeholder="e.g., 1st of each month"
          />
        </div>

        {/* Deposit Amount */}
        <div className="space-y-2">
          <Label htmlFor="deposit-amount">Deposit Amount (£) *</Label>
          <Input
            id="deposit-amount"
            type="number"
            value={terms.depositAmount}
            onChange={(e) => handleChange('depositAmount', e.target.value)}
            placeholder="e.g., 1800"
          />
        </div>

        {/* Tenancy Start Date */}
        <div className="space-y-2">
          <Label htmlFor="tenancy-start-date">Tenancy Start Date *</Label>
          <Input
            id="tenancy-start-date"
            type="date"
            value={terms.tenancyStartDate}
            onChange={(e) => handleChange('tenancyStartDate', e.target.value)}
          />
        </div>

        {/* Tenancy Length */}
        <div className="space-y-2">
          <Label htmlFor="tenancy-length">Tenancy Length (months) *</Label>
          <Select value={terms.tenancyLength} onValueChange={(value) => handleChange('tenancyLength', value)}>
            <SelectTrigger id="tenancy-length">
              <SelectValue placeholder="Select length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
              <SelectItem value="18">18 months</SelectItem>
              <SelectItem value="24">24 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </WizardStep>
  );
};

export default RentalTerms;

