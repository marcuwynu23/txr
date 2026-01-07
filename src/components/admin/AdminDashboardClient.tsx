
'use client';

import CreateEventModal from "@/components/events/CreateEventModal";
import DeleteEventButton from "@/components/events/DeleteEventButton";
import AttendeeListModal from "@/components/admin/AttendeeListModal";
import dynamic from "next/dynamic";
import Link from 'next/link';

const QRScanner = dynamic(() => import("@/components/admin/QRScanner"), {
    ssr: false,
    loading: () => <div className="p-8 text-center text-gray-400">Loading scanner...</div>
});

interface AdminDashboardClientProps {
    stats: any;
}

export default function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of system activity.</p>
        </div>
        <CreateEventModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Events Managed</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Tickets Issued</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalTicketsSold}</p>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Check-in Attendance</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalCheckedIn}</p>
         </div>
         <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm opacity-60">
            <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">$0.00</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <QRScanner />
        </div>

        <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">My Events</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {stats.recentEvents.map((event: any) => (
                <li key={event._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                    <p className="font-semibold text-gray-900 truncate">{event.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                        <span className="text-[10px] h-4 flex items-center px-1.5 bg-indigo-50 text-indigo-600 rounded font-bold uppercase tracking-tighter border border-indigo-100/50">
                            {event.totalRegistered || 0} Registered
                        </span>
                        <span className="text-[10px] h-4 flex items-center px-1.5 bg-green-50 text-green-600 rounded font-bold uppercase tracking-tighter border border-green-100/50">
                            {event.totalCheckedIn || 0} In
                        </span>
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                    <AttendeeListModal 
                        eventId={event._id} 
                        eventTitle={event.title} 
                        trigger={
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                Attendees
                            </button>
                        } 
                    />
                    <CreateEventModal event={event} />
                    <DeleteEventButton eventId={event._id} />
                    <Link href={`/events/${event._id}`} className="text-sm font-medium text-gray-400 hover:text-gray-900">
                        View
                    </Link>
                    </div>
                </li>
                ))}
                {stats.recentEvents.length === 0 && (
                    <li className="px-6 py-4 text-sm text-gray-500 text-center">No recent events.</li>
                )}
            </ul>
            </section>

            <section className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Tickets</h3>
            </div>
            <ul className="divide-y divide-gray-200">
                {stats.allTickets.map((ticket: any) => (
                <li key={ticket._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{ticket.user?.name || 'Unknown User'}</p>
                        <span className="text-xs font-mono text-gray-400">{ticket.code}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">{ticket.event?.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                            ticket.status === 'used' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {ticket.status}
                        </span>
                    </div>
                </li>
                ))}
                {stats.allTickets.length === 0 && (
                    <li className="px-6 py-4 text-sm text-gray-500 text-center">No recent tickets.</li>
                )}
            </ul>
            </section>
        </div>
      </div>
    </div>
  );
}
