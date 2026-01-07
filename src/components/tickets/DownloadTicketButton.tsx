
'use client';

import React from 'react';
import { useAlert } from '@/components/ui/Alert';

interface TicketData {
    eventTitle: string;
    ticketCode: string;
    qrCodeUrl?: string;
}

export default function DownloadTicketButton({ ticket }: { ticket: TicketData }) {
    const { showAlert } = useAlert();

    const handleDownload = () => {
        if (!ticket.qrCodeUrl) {
            showAlert({
                title: 'Error',
                message: 'QR Code not available.',
                type: 'error'
            });
            return;
        }

        try {
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = ticket.qrCodeUrl;
            link.download = `QR-${ticket.eventTitle.replace(/\s+/g, '-').toLowerCase()}-${ticket.ticketCode.substring(0, 6)}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showAlert({
                title: 'Success!',
                message: 'QR Code downloaded successfully.',
                type: 'success'
            });
        } catch (error) {
            console.error('Download error:', error);
            showAlert({
                title: 'Error',
                message: 'Failed to download the QR code image.',
                type: 'error'
            });
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-bold w-full py-3 border border-indigo-100 rounded-xl transition-all hover:bg-indigo-50 active:scale-95 flex items-center justify-center gap-2"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR Code
        </button>
    );
}
