
'use server';

import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import Event from "@/models/Event";
import { getSession } from "@/lib/session";
import QRCode from "qrcode";

export async function getUserDashboardData() {
    await dbConnect();
    const session = await getSession();
    
    if (!session || !session.userId) {
        throw new Error("Unauthorized");
    }

    const tickets = await Ticket.find({ user: session.userId })
        .populate('event')
        .sort({ createdAt: -1 })
        .lean();
    
    // Generate QRs
    const ticketsWithQR = await Promise.all(tickets.map(async (ticket) => {
        const qrData = JSON.stringify({
            ticketId: (ticket as any)._id,
            code: (ticket as any).code,
            eventId: (ticket as any).event._id
        });
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        return {
            ...ticket,
            _id: (ticket as any)._id.toString(),
            event: {
                ...(ticket as any).event,
                _id: (ticket as any).event._id.toString(),
                date: (ticket as any).event.date.toISOString(), // Serialize date
                organizer: (ticket as any).event.organizer.toString()
            },
            user: (ticket as any).user.toString(),
            qrCodeUrl
        };
    }));

    return { tickets: ticketsWithQR };
}
