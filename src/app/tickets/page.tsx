
import { getUserDashboardData } from "@/actions/dashboard";
import Link from 'next/link';
import Image from "next/image";
import CancelTicketButton from "@/components/tickets/CancelTicketButton";
import DownloadTicketButton from "@/components/tickets/DownloadTicketButton";

export const dynamic = 'force-dynamic';

export default async function TicketsPage() {
  const { tickets } = await getUserDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Tickets</h1>
        <p className="text-gray-500 mt-1">Manage your upcoming events and tickets.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tickets.length === 0 ? (
           <div className="bg-white rounded-lg border border-dashed border-gray-300 p-12 text-center">
             <h3 className="mt-2 text-sm font-semibold text-gray-900">No tickets yet</h3>
             <p className="mt-1 text-sm text-gray-500">Browse events and book your first ticket.</p>
             <div className="mt-6">
               <Link
                 href="/events"
                 className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
               >
                 Browse Events
               </Link>
             </div>
           </div>
        ) : (
          tickets.map((ticket: any) => (
             <div key={ticket._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-all">
                <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{ticket.event.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">{new Date(ticket.event.date).toLocaleDateString()} at {new Date(ticket.event.date).toLocaleTimeString()}</p>
                            <p className="text-gray-500 text-sm">{ticket.event.location}</p>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ticket.status === 'valid' ? 'bg-green-100 text-green-800' : 
                            ticket.status === 'canceled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {ticket.status.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Ticket Type</div>
                            <div className="font-semibold">{ticket.ticketType}</div>
                            <div className="text-xs font-mono text-gray-400 mt-1">{ticket.code}</div>
                        </div>
                        <div className="flex gap-2">
                             {ticket.status === 'valid' && <DownloadTicketButton ticket={{
                                 eventTitle: ticket.event.title,
                                 ticketCode: ticket.code,
                                 qrCodeUrl: ticket.qrCodeUrl
                             }} />}
                             {ticket.status === 'valid' && <CancelTicketButton ticketId={ticket._id} />}
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-200 min-w-[200px]">
                    {ticket.qrCodeUrl && (
                        <div className="text-center">
                            <Image 
                                src={ticket.qrCodeUrl} 
                                alt="QR Code" 
                                width={120} 
                                height={120} 
                                className="mix-blend-multiply"
                            />
                            <p className="text-xs text-gray-400 mt-2">Scan at entrance</p>
                        </div>
                    )}
                </div>
             </div>
          ))
        )}
      </div>
    </div>
  );
}
