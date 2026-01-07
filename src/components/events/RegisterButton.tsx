'use client';

import { registerForEvent } from '@/actions/tickets';
import { useState } from 'react';
import { useAlert } from '@/components/ui/Alert';
import PaymentModal from './PaymentModal';

export default function RegisterButton({ 
  eventId, 
  eventTitle = '',
  price = 0,
  ticketTypeName = 'General Admission',
  disabled = false
}: { 
  eventId: string, 
  eventTitle?: string,
  price?: number,
  ticketTypeName?: string,
  disabled?: boolean
}) {
  const [isPending, setIsPending] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { showAlert } = useAlert();

  const handleRegister = async () => {
    if (disabled || isPending) return;
    
    // If it's a paid event and we haven't paid yet, open payment modal
    if (price > 0 && !isPaymentOpen) {
      setIsPaymentOpen(true);
      return;
    }

    setIsPending(true);
    try {
      await registerForEvent(eventId, ticketTypeName);
      showAlert({
        title: 'Success!',
        message: price > 0 ? 'Payment confirmed and ticket issued.' : 'Registration successful! Your ticket is ready.',
        type: 'success'
      });
    } catch (error) {
      showAlert({
        title: 'Draft Error',
        message: 'Something went wrong during registration.',
        type: 'error'
      });
    } finally {
      setIsPending(false);
      setIsPaymentOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={handleRegister}
          disabled={disabled || isPending}
          className={`w-full flex items-center justify-center rounded-lg border border-transparent px-6 py-4 text-base font-bold text-white shadow-lg transition-all active:scale-95 focus:outline-none ${
            (disabled || isPending) ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
          }`}
        >
          {isPending ? 'Registering...' : (disabled ? 'Registration Closed' : price > 0 ? `Pay & Register` : 'Register Now')}
        </button>
        <p className="text-center text-xs text-gray-400 font-medium">
          {price > 0 ? 'Secure payment via txr-pay' : 'Instant digital ticket issuance'}
        </p>
      </div>

      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onSuccess={handleRegister}
          amount={price}
          eventTitle={eventTitle}
        />
      )}
    </>
  );
}
