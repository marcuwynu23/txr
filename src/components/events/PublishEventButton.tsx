
'use client';

import { publishEvent, unpublishEvent } from '@/actions/events';
import { useAlert } from '@/components/ui/Alert';
import { useState } from 'react';

export default function PublishEventButton({ eventId, isPublished, className }: { eventId: string, isPublished: boolean, className?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const { showConfirm, showAlert } = useAlert();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        showConfirm({
            title: isPublished ? 'Unpublish Event?' : 'Publish Event?',
            message: isPublished 
                ? 'This will hide the event from the public listing. Existing tickets will remain valid.'
                : 'This will make the event public and start accepting registrations.',
            type: isPublished ? 'warning' : 'info',
            confirmText: isPublished ? 'Yes, Unpublish' : 'Yes, Publish',
            onConfirm: async () => {
                setIsLoading(true);
                try {
                    if (isPublished) {
                        await unpublishEvent(eventId);
                        showAlert({ title: 'Unpublished', message: 'Event is now a draft.', type: 'info' });
                    } else {
                        await publishEvent(eventId);
                        showAlert({ title: 'Published', message: 'Event is now public!', type: 'success' });
                    }
                } catch (error) {
                    showAlert({ title: 'Error', message: 'Failed to update event status.', type: 'error' });
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={className || `text-sm font-medium px-3 py-1 rounded-md transition-colors ${
                isPublished 
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200' 
                : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200'
            } disabled:opacity-50`}
        >
            {isLoading ? 'Processing...' : (isPublished ? 'Unpublish' : 'Publish')}
        </button>
    );
}
