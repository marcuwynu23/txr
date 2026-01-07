
'use server';

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket, { TicketStatus } from "@/models/Ticket";
import { revalidatePath } from "next/cache";
import QRCode from 'qrcode';

export async function generateTicketCode() {
    // Simple random string for demo, real world might use UUID or signed tokens
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

import { getSession } from "@/lib/session";

export async function registerForEvent(eventId: string, ticketType: string) {
    await dbConnect();
    const session = await getSession();
    const userId = session?.userId;

    if (!userId) throw new Error("Must be logged in to register");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");


    // Find nested ticket type and check capacity (simplified logic)
    // In production we would check e.ticketTypes.find(...) and use atomic updates
    
    await Event.updateOne(
        { _id: eventId, "ticketTypes.name": ticketType },
        { 
            $inc: { "ticketTypes.$.sold": 1 } 
        }
    );

    const code = await generateTicketCode();
    
    await Ticket.create({
        event: eventId,
        user: userId as any,
        ticketType, // e.g. "General Admission"
        code,
        status: TicketStatus.VALID
    });

    // In a real app, we might email the QR code here
    
    revalidatePath(`/events/${eventId}`);
    revalidatePath('/tickets');
    return { success: true };
}

export async function getTicketForUser(eventId: string) {
    await dbConnect();
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) return null;

    const ticket = await Ticket.findOne({ event: eventId, user: userId }).populate('user', 'name').lean();
    if (!ticket) return null;

    // Generate QR Data URL
    const qrData = JSON.stringify({
        ticketId: (ticket as any)._id,
        code: (ticket as any).code,
        eventId
    });
    
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    return {
        ...ticket,
        _id: (ticket as any)._id.toString(),
        event: (ticket as any).event.toString(),
        user: (ticket as any).user.toString(),
        qrCodeUrl
    };
}

export async function cancelTicket(ticketId: string) {
    await dbConnect();
    const session = await getSession();
    if (!session?.userId) throw new Error("Unauthorized");

    // Find ticket and ensure ownership
    const ticket = await Ticket.findOne({ _id: ticketId, user: session.userId as any });
    if (!ticket) throw new Error("Ticket not found or unauthorized");

    const eventId = ticket.event;
    const ticketTypeName = ticket.ticketType;

    // Remove the ticket
    await Ticket.deleteOne({ _id: ticketId });

    // Decrement the sold count in the event
    await Event.updateOne(
        { _id: eventId, "ticketTypes.name": ticketTypeName },
        { 
            $inc: { "ticketTypes.$.sold": -1 } 
        }
    );

    revalidatePath('/tickets');
    revalidatePath(`/events/${eventId}`);
    
    return { success: true };
}

export async function checkInTicket(code: string) {
    await dbConnect();
    const session = await getSession();
    if (session?.role !== 'admin') throw new Error("Unauthorized: Admin access required");

    const ticket = await Ticket.findOne({ code }).populate('event').populate('user');
    if (!ticket) throw new Error("Ticket not found");

    if (ticket.status === TicketStatus.USED) {
        return { 
            success: false, 
            message: "Ticket has already been used.",
            ticket: {
                userName: (ticket.user as any)?.name,
                eventTitle: (ticket.event as any)?.title,
                checkedInAt: ticket.checkedInAt
            }
        };
    }

    if (ticket.status === TicketStatus.CANCELED) {
        return { success: false, message: "Ticket is canceled and invalid." };
    }

    // Update ticket status
    ticket.status = TicketStatus.USED;
    ticket.checkedInAt = new Date();
    await ticket.save();

    revalidatePath('/admin');
    revalidatePath(`/events/${ticket.event}`);

    return { 
        success: true, 
        message: "Check-in successful!",
        ticket: {
            userName: (ticket.user as any)?.name,
            eventTitle: (ticket.event as any)?.title
        }
    };
}
