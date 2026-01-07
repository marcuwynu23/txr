import { getAllEvents, getOrganizerEvents } from "@/actions/events";
import CreateEventModal from "@/components/events/CreateEventModal";
import DeleteEventButton from "@/components/events/DeleteEventButton";
import PublishEventButton from "@/components/events/PublishEventButton";
import { getSession } from "@/lib/session";
import { SerializedEvent } from "@/types";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EventsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ tab?: string }> | { tab?: string } 
}) {
  const resolvedParams = await searchParams;
  const session = await getSession();
  const isAdmin = session?.role === 'admin';
  const currentTab = resolvedParams.tab || 'all';

  const allEvents = (await getAllEvents()) as unknown as SerializedEvent[];
  const myEvents = isAdmin ? (await getOrganizerEvents()) as unknown as SerializedEvent[] : [];

  const displayEvents = currentTab === 'my' ? myEvents : allEvents;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-gray-900">Events</h1>
           <p className="text-gray-500 mt-1">Discover upcoming events and book your tickets.</p>
        </div>
        {isAdmin && <CreateEventModal />}
      </div>

      {isAdmin && (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <Link
              href="/events?tab=all"
              className={`${
                currentTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
            >
              All Events
            </Link>
            <Link
              href="/events?tab=my"
              className={`${
                currentTab === 'my'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
            >
              My Events
            </Link>
          </nav>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayEvents.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {currentTab === 'my' ? "You haven't created any events yet." : "Check back later for new events."}
              </p>
            </div>
        ) : (
          displayEvents.map((event) => (
             <div 
               key={event._id} 
               className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg transition-all"
             >
                <Link href={`/events/${event._id}`} className="p-6 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                            {event.isPrivate && (
                                <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                    Private
                                </span>
                            )}
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                            event.status === 'published' ? 'bg-green-50 text-green-700 ring-green-600/20' : 
                            event.status === 'canceled' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                            'bg-amber-50 text-amber-700 ring-amber-600/20'
                        }`}>
                          {event.status.toUpperCase()}
                        </span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                           <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.45-.96 2.337-1.774 1.775-1.626 3.654-4.08 4.25-7.694.015-.09.033-.197.051-.314.072-.474.12-.996.12-1.569 0-3.313-2.687-6-6-6S2 4.687 2 8c0 .573.048 1.095.12 1.569.018.117.036.223.051.314.596 3.614 2.475 6.068 4.25 7.694.886.814 1.716 1.39 2.336 1.774.311.192.571.337.757.433a5.741 5.741 0 00.299.149zM6 8a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" />
                           </svg>
                           {event.location}
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                            {event.ticketTypes?.[0]?.price > 0 ? `$${event.ticketTypes[0].price}` : 'Free'}
                        </span>
                    </div>
                </Link>

                {currentTab === 'my' && (
                    <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <PublishEventButton 
                                eventId={event._id} 
                                isPublished={event.status === 'published'} 
                            />
                            <CreateEventModal event={event} />
                        </div>
                        <DeleteEventButton eventId={event._id} />
                    </div>
                )}
             </div>
          ))
        )}
      </div>
    </div>
  );
}
