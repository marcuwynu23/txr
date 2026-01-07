'use client';

import { cancelTicket } from '@/actions/tickets';
import { useAlert } from '@/components/ui/Alert';
import { useState } from 'react';

export default function CancelTicketButton({ ticketId }: { ticketId: string }) {
    const [isCancelling, setIsCancelling] = useState(false);
    const { showConfirm, showAlert } = useAlert();

    const handleCancel = () => {
        showConfirm({
            title: 'Cancel Ticket?',
            message: 'Are you sure you want to cancel this ticket? This action cannot be undone and will free up your spot for others.',
            type: 'warning',
            confirmText: 'Yes, Cancel',
            onConfirm: async () => {
                setIsCancelling(true);
                try {
                    await cancelTicket(ticketId);
                    showAlert({
                        title: 'Ticket Canceled',
                        message: 'Your registration has been successfully removed.',
                        type: 'success'
                    });
                } catch (error) {
                    showAlert({
                        title: 'Error',
                        message: 'Failed to cancel ticket. Please try again.',
                        type: 'error'
                    });
                } finally {
                    setIsCancelling(false);
                }
            }
        });
    };

    return (
        <button
            onClick={handleCancel}
            disabled={isCancelling}
            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
        >
            {isCancelling ? 'Cancelling...' : 'Cancel Ticket'}
        </button>
    );
}
