import React, { useState } from 'react';
import { ArrowLeft, Lock, CreditCard, CheckCircle2, Loader2 } from 'lucide-react';
import PillButton from './ui/PillButton';
import LuxuryInput from './ui/LuxuryInput';

interface SecurePaymentViewProps {
  totalAmount: number;
  onBack: () => void;
  onPaymentComplete: () => void;
}

export default function SecurePaymentView({ totalAmount, onBack, onPaymentComplete }: SecurePaymentViewProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentComplete();
    }, 2500);
  };

  return (
    <div className="flex-grow bg-parchment animate-fade-in-up min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full mx-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Checkout</span>
        </button>

        <div className="bg-white border border-charcoal/5 rounded-[24px] p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-gold-dark" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
              Secure Payment
            </h2>
            <p className="text-xs text-charcoal/60">
              Your payment information is encrypted and secure
            </p>
          </div>

          <div className="bg-gold/5 border border-gold/10 rounded-xl p-4 text-center">
            <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
              Amount Due
            </span>
            <span className="font-serif text-3xl text-gold-dark font-bold">
              ₦{totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="space-y-4">
            <LuxuryInput
              label="Card Number"
              value={cardNumber}
              onChange={setCardNumber}
              placeholder="1234 5678 9012 3456"
            />
            <LuxuryInput
              label="Cardholder Name"
              value={cardName}
              onChange={setCardName}
              placeholder="Alexander Sterling"
            />
            <div className="grid grid-cols-2 gap-4">
              <LuxuryInput
                label="Expiry Date"
                value={expiry}
                onChange={setExpiry}
                placeholder="MM/YY"
              />
              <LuxuryInput
                label="CVV"
                value={cvv}
                onChange={setCvv}
                placeholder="123"
                type="password"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl">
            <CreditCard className="w-4 h-4 text-charcoal/40" />
            <span className="text-[10px] text-charcoal/60 font-medium">
              Supported: Visa, Mastercard, Verve
            </span>
          </div>

          <PillButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pay ₦{totalAmount.toLocaleString()}</span>
              </>
            )}
          </PillButton>

          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[9px] text-charcoal/40 font-bold uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-charcoal/40 font-bold uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3" />
              <span>PCI Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
