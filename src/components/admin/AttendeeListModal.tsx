
'use client';

import { useState, useEffect } from 'react';
import { getEventAttendees } from '@/actions/admin';
import { createPortal } from 'react-dom';

interface Attendee {
  _id: string;
  userName: string;
  userEmail: string;
  status: string;
  checkedInAt: string | null;
  ticketType: string;
  code: string;
}

export default function AttendeeListModal({ 
  eventId, 
  eventTitle,
  trigger
}: { 
  eventId: string, 
  eventTitle: string,
  trigger: React.ReactNode 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchAttendees();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchAttendees = async () => {
    setIsLoading(true);
    try {
      const data = await getEventAttendees(eventId);
      setAttendees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAttendees = attendees.filter(a => 
    a.userName.toLowerCase().includes(search.toLowerCase()) || 
    a.userEmail.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="inline-block">
        {trigger}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Attendance List</h3>
                <p className="text-sm text-gray-500 mt-0.5">{eventTitle}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-50 bg-white">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search by name, email, or ticket code..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
              {isLoading ? (
                <div className="p-12 text-center text-gray-400">
                  <svg className="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading attendees...</span>
                </div>
              ) : filteredAttendees.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <p className="text-sm">No attendees found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Attendee</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ticket</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredAttendees.map((attendee) => (
                      <tr key={attendee._id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">
                            {attendee.userName}
                          </div>
                          <div className="text-[11px] text-gray-400 font-medium lowercase italic">
                            {attendee.userEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter w-fit ${
                              attendee.status === 'used' ? 'bg-green-100 text-green-700' :
                              attendee.status === 'canceled' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {attendee.status}
                            </span>
                            {attendee.checkedInAt && (
                              <span className="text-[9px] text-gray-400 font-mono">
                                {new Date(attendee.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-xs font-bold text-gray-700">{attendee.ticketType}</div>
                          <div className="text-[9px] font-mono text-gray-400 mt-0.5">{attendee.code}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center px-6">
              <span className="text-xs font-bold text-gray-400">
                Total: {filteredAttendees.length} Attendee{filteredAttendees.length !== 1 ? 's' : ''}
              </span>
              <button 
                onClick={fetchAttendees}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 flex items-center gap-1.5 p-2"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Data
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
