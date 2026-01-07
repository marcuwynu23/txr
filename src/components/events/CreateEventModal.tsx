'use client';

import { SerializedEvent } from '@/types';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const CreateEventForm = dynamic(() => import('./CreateEventForm'), {
    loading: () => <div className="p-8 text-center text-gray-400">Loading form...</div>
});

export default function CreateEventModal({ event, className }: { event?: SerializedEvent, className?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden">
            <div 
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsOpen(false)}
            />
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all overflow-hidden border border-gray-100">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{event ? 'Edit Event' : 'Create New Event'}</h2>
                            <p className="text-sm text-gray-500">{event ? 'Update your event details.' : 'Fill in the details to launch your event.'}</p>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-all focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="max-h-[80vh] overflow-y-auto">
                        <CreateEventForm event={event} onSuccess={() => setIsOpen(false)} />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className={className || (event 
                    ? "text-indigo-600 hover:text-indigo-900 text-sm font-medium" 
                    : "inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all active:scale-95")}
            >
                {event ? 'Edit' : '+ New Event'}
            </button>

            {isOpen && createPortal(modalContent, document.body)}
        </>
    );
}
