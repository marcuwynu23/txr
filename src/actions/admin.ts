
'use server';

import dbConnect from "@/lib/db";
import Event, { IEvent } from "@/models/Event";
import Ticket from "@/models/Ticket";

export async function getAdminStats() {
    await dbConnect();
    const session = await (await import("@/lib/session")).getSession();
    if (!session?.userId || session.role !== 'admin') return null;
    
    // Filter by events created by this admin
    const adminEvents = await Event.find({ organizer: session.userId }).lean();
    const eventIds = adminEvents.map(e => (e as any)._id);

    const totalEvents = adminEvents.length;
    const totalTicketsSold = await Ticket.countDocuments({ event: { $in: eventIds } });
    const totalCheckedIn = await Ticket.countDocuments({ event: { $in: eventIds }, status: 'used' });
    
    const recentEvents = await Event.find({ organizer: session.userId }).sort({ createdAt: -1 }).limit(10).lean<IEvent[]>();
    const allTickets = await Ticket.find({ event: { $in: eventIds } })
        .populate('event')
        .populate('user')
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();
    
    return {
        totalEvents,
        totalTicketsSold,
        totalCheckedIn,
        recentEvents: recentEvents.map(e => ({
            ...e,
            _id: (e as any)._id.toString(),
            organizer: (e as any).organizer.toString(),
            date: e.date.toISOString(),
            ticketTypes: e.ticketTypes?.map((t: any) => ({...t, _id: t._id.toString()}))
        })),
        allTickets: allTickets.map((t: any) => ({
            ...t,
            _id: t._id.toString(),
            event: { title: t.event?.title, _id: t.event?._id.toString() },
            user: { name: t.user?.name, email: t.user?.email, _id: t.user?._id.toString() }
        }))
    };
}

export async function getEventAttendees(eventId: string) {
    await dbConnect();
    const session = await (await import("@/lib/session")).getSession();
    if (!session?.userId || session.role !== 'admin') throw new Error("Unauthorized");

    const tickets = await Ticket.find({ event: eventId })
        .populate('user', 'name email')
        .sort({ checkedInAt: -1, createdAt: -1 })
        .lean();

    return tickets.map((t: any) => ({
        _id: t._id.toString(),
        userName: t.user?.name || 'Unknown',
        userEmail: t.user?.email || 'N/A',
        status: t.status,
        checkedInAt: t.checkedInAt ? t.checkedInAt.toISOString() : null,
        ticketType: t.ticketType,
        code: t.code
    }));
}
