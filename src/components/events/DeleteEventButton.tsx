'use client';

import { deleteEvent } from '@/actions/events';
import { useAlert } from '@/components/ui/Alert';
import { useState } from 'react';

export default function DeleteEventButton({ eventId }: { eventId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { showConfirm, showAlert } = useAlert();

    const handleDelete = () => {
        showConfirm({
            title: 'Delete Event?',
            message: 'Are you sure you want to delete this event? This will also cancel all sold tickets and cannot be undone.',
            type: 'error',
            confirmText: 'Delete Event',
            onConfirm: async () => {
                setIsDeleting(true);
                try {
                    await deleteEvent(eventId);
                    showAlert({
                        title: 'Deleted',
                        message: 'Event and associated tickets have been canceled.',
                        type: 'success'
                    });
                } catch (error) {
                    showAlert({
                        title: 'Error',
                        message: 'Failed to delete event. Please try again.',
                        type: 'error'
                    });
                } finally {
                    setIsDeleting(false);
                }
            }
        });
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    );
}
