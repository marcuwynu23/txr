'use server';

import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { getSession } from "@/lib/session";
import QRCode from "qrcode";
import { Types } from "mongoose";

interface LeanDashboardTicket {
    _id: Types.ObjectId;
    event: {
        _id: Types.ObjectId;
        title: string;
        date: Date;
        location: string;
        organizer: Types.ObjectId;
    };
    user: Types.ObjectId;
    code: string;
    ticketType: string;
    status: string;
    createdAt: Date;
}

export interface SerializedDashboardTicket {
    _id: string;
    event: {
        _id: string;
        title: string;
        date: string;
        location: string;
        organizer: string;
    };
    user: string;
    code: string;
    ticketType: string;
    status: string;
    qrCodeUrl: string;
}

export async function getUserDashboardData(): Promise<{ tickets: SerializedDashboardTicket[] }> {
    await dbConnect();
    const session = await getSession();
    
    if (!session || !session.userId) {
        throw new Error("Unauthorized");
    }

    const tickets = await Ticket.find({ user: session.userId })
        .populate('event')
        .sort({ createdAt: -1 })
        .lean<LeanDashboardTicket[]>();
    
    // Generate QRs
    const ticketsWithQR = await Promise.all(tickets.map(async (ticket) => {
        const qrData = JSON.stringify({
            ticketId: ticket._id,
            code: ticket.code,
            eventId: ticket.event._id
        });
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        return {
            ...ticket,
            _id: ticket._id.toString(),
            event: {
                ...ticket.event,
                _id: ticket.event._id.toString(),
                date: ticket.event.date.toISOString(),
                organizer: ticket.event.organizer.toString()
            },
            user: ticket.user.toString(),
            qrCodeUrl
        };
    }));

    return { tickets: ticketsWithQR };
}
