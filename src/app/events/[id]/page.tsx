
import { getEventById } from "@/actions/events";
import { getTicketForUser } from "@/actions/tickets";
import CreateEventModal from "@/components/events/CreateEventModal";
import DeleteEventButton from "@/components/events/DeleteEventButton";
import PublishEventButton from "@/components/events/PublishEventButton";
import RegisterButton from "@/components/events/RegisterButton";
import DownloadTicketButton from "@/components/tickets/DownloadTicketButton";
import { getSession } from "@/lib/session";
import AttendeeListModal from "@/components/admin/AttendeeListModal";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params; 
  const event = await getEventById(id);
  
  if (!event) {
    notFound();
  }

  const session = await getSession();
  
  // Access control
  const isOrganizer = session?.userId === event.organizer;
  const isAdmin = session?.role === 'admin';
  const isDraft = event.status === 'draft';
  const isCanceled = event.status === 'canceled';

  // If draft, only organizer/admin can see
  if (isDraft && !isAdmin) {
      notFound();
  }

  // If private, only logged-in users
  if (event.isPrivate && !session?.userId) {
     notFound(); 
  }

  const existingTicket = await getTicketForUser(id);

  return (
    <div className="space-y-6">
      {(isDraft || (isAdmin && !isCanceled)) && (
        <div className={`border-l-4 p-4 rounded-md ${isDraft ? 'bg-purple-50 border-purple-400' : 'bg-indigo-50 border-indigo-400'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${isDraft ? 'text-purple-400' : 'text-indigo-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isDraft ? 'text-purple-800' : 'text-indigo-800'}`}>
                {isDraft ? 'Draft Preview' : 'Admin View'}
              </h3>
              <p className={`mt-2 text-sm ${isDraft ? 'text-purple-700' : 'text-indigo-700'}`}>
                {isDraft 
                    ? 'This event is a draft. Only organizers can see this page. Publish it to start accepting registrations.'
                    : 'You are viewing this event as an administrator. You can manage settings using the sidebar.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {isCanceled && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Event Canceled</h3>
              <p className="mt-2 text-sm text-red-700">This event has been canceled by the organizer. All registrations are now invalid.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
             <h1 className={`text-3xl font-bold mb-2 ${isCanceled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{event.title}</h1>
             <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   {new Date(event.date as string).toLocaleDateString()} at {new Date(event.date as string).toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                   {event.location}
                </span>
             </div>
             
             <div className="prose max-w-none text-gray-700">
               <h3 className="text-lg font-semibold mb-2 text-gray-900">About this event</h3>
               <p className="whitespace-pre-wrap leading-relaxed">{event.description}</p>
             </div>
          </div>
        </div>

        <div className="md:col-span-1">
           <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-24">
              {isAdmin ? (
                  <div className="space-y-6 text-center">
                      <div className="pb-4 border-b border-gray-100 text-left">
                          <h3 className="text-lg font-bold text-gray-900">Management</h3>
                          <p className="text-sm text-gray-500">Event settings and actions.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-sm font-medium text-gray-700">Status</span>
                            <span className={`text-xs font-bold uppercase ${
                                event.status === 'published' ? 'text-green-600' : 
                                event.status === 'canceled' ? 'text-red-600' : 'text-amber-600'
                            }`}>
                                {event.status}
                            </span>
                        </div>
                        
                        <div className="space-y-3">
                            <CreateEventModal 
                                event={event} 
                                className="w-full inline-flex items-center justify-center rounded-lg bg-white border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
                            />
                            {!isCanceled && (
                                <PublishEventButton 
                                    eventId={id} 
                                    isPublished={event.status === 'published'} 
                                    className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold shadow-sm transition-all active:scale-[0.98] ${
                                        event.status === 'published' 
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' 
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                />
                            )}
                        </div>


                        <div className="pt-4 border-t border-gray-100 flex gap-4">
                            <AttendeeListModal 
                                eventId={id} 
                                eventTitle={event.title} 
                                trigger={
                                    <div className="flex-1 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-center cursor-pointer hover:bg-indigo-100 transition-colors">
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Registered</p>
                                        <p className="text-xl font-black text-indigo-700">{event.totalRegistered || 0}</p>
                                    </div>
                                } 
                            />
                            <div className="flex-1 bg-green-50/50 p-3 rounded-xl border border-green-100/50 text-center">
                                <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Checked In</p>
                                <p className="text-xl font-black text-green-700">{event.totalCheckedIn || 0}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <DeleteEventButton eventId={id} />
                        </div>
                      </div>
                      <div className="pt-6">
                          <p className="text-[10px] text-gray-400 italic leading-tight">Administrators cannot book tickets for events they manage to prevent data pollution.</p>
                      </div>
                  </div>
              ) : existingTicket ? (
                  <div className="text-center space-y-4">
                      <div className={`flex items-center justify-center h-12 w-12 rounded-full mx-auto ${isCanceled ? 'bg-red-100' : 'bg-green-100'}`}>
                          {isCanceled ? (
                              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          ) : (
                              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          )}
                      </div>
                      <div>
                          <h3 className="text-lg font-medium text-gray-900">{isCanceled ? 'Ticket Canceled' : "You're going!"}</h3>
                          <p className="text-sm text-gray-500">Ticket Code: <span className="font-mono">{existingTicket.code}</span></p>
                      </div>
                      {existingTicket.qrCodeUrl && !isCanceled && (
                          <div className="mt-4 flex justify-center">
                              <Image 
                                  src={existingTicket.qrCodeUrl} 
                                  alt="Ticket QR Code" 
                                  width={160} 
                                  height={160} 
                                  className="border border-gray-200 rounded-md"
                              />
                          </div>
                      )}
                      {!isCanceled && (
                         <DownloadTicketButton 
                           ticket={{
                             eventTitle: event.title,
                             ticketCode: existingTicket.code,
                             qrCodeUrl: existingTicket.qrCodeUrl
                           }}
                         />
                      )}
                  </div>
              ) : (
                  <div className="space-y-6">
                      <div>
                          <h3 className="text-lg font-medium text-gray-900">Registration</h3>
                          <p className="text-sm text-gray-500 mt-1">
                              {isCanceled ? "Registration is closed." : isDraft ? "Registration not yet available." : "Secure your spot today."}
                          </p>
                      </div>
                      <div className="border-t border-b border-gray-100 py-4">
                          <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">General Admission</span>
                              <span className="font-semibold text-gray-900">
                                  {event.ticketTypes?.[0]?.price > 0 ? `$${event.ticketTypes[0].price}` : 'Free'}
                              </span>
                          </div>
                      </div>
                      <RegisterButton 
                        eventId={id} 
                        eventTitle={event.title}
                        price={event.ticketTypes?.[0]?.price || 0}
                        disabled={isCanceled || isDraft} 
                      />
                  </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
