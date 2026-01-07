
'use client';

import { checkInTicket } from '@/actions/tickets';
import { useAlert } from '@/components/ui/Alert';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

export default function QRScanner() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const [lastScanTime, setLastScanTime] = useState(0);
    const { showAlert } = useAlert();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (!isScanning) return;

        // Create scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch((err: any) => console.error("Failed to clear scanner", err));
            }
        };
    }, [isScanning]);

    async function onScanSuccess(decodedText: string) {
        // Prevent duplicate scans within 3 seconds
        const now = Date.now();
        if (now - lastScanTime < 3000) return;
        setLastScanTime(now);

        console.log(`Scan Result: ${decodedText}`);
        
        try {
            // Parse data if it's JSON (we stringified it earlier) or use raw code
            let ticketCode = decodedText;
            try {
                const data = JSON.parse(decodedText);
                ticketCode = data.code || decodedText;
            } catch (e) {
                // Not JSON, use raw
            }

            setScanResult(ticketCode);
            
            // Call server action
            const result = await checkInTicket(ticketCode);
            
            if (result.success) {
                showAlert({
                    title: 'Check-in Success',
                    message: `${result.ticket?.userName} has been checked into ${result.ticket?.eventTitle}.`,
                    type: 'success'
                });
            } else {
                showAlert({
                    title: 'Check-in Failed',
                    message: result.message || 'Invalid ticket.',
                    type: 'error'
                });
            }
        } catch (error: any) {
            showAlert({
                title: 'Error',
                message: error.message || 'Failed to process ticket.',
                type: 'error'
            });
        }
    }

    function onScanFailure(error: any) {
        // console.warn(`QR error = ${error}`);
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Attendance Scanner</h3>
                    <button 
                        onClick={() => setIsScanning(!isScanning)}
                        className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition-colors ${
                            isScanning ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                    >
                        {isScanning ? 'Stop Camera' : 'Start Camera'}
                    </button>
                </div>

                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                    {!isScanning ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm font-medium">Camera is inactive</p>
                            <button 
                                onClick={() => setIsScanning(true)}
                                className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
                            >
                                Re-activate Scanner
                            </button>
                        </div>
                    ) : (
                        <div id="reader" className="w-full h-full"></div>
                    )}
                </div>

                {scanResult && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Last Scanned Code</p>
                        <p className="font-mono text-sm text-gray-700">{scanResult}</p>
                    </div>
                )}
                
                <div className="mt-6 space-y-3">
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                        Point your camera at the ticket QR code. The system will automatically detect the code and process the check-in.
                    </p>
                </div>
            </div>
        </div>
    );
}
