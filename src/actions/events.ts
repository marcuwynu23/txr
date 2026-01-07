'use server';

import dbConnect from "@/lib/db";
import { getSession } from "@/lib/session";
import Event, { EventStatus, IEvent, TicketCategory } from "@/models/Event";
import { SerializedEvent } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  await dbConnect();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const date = formData.get("date") as string;
  const isPrivate = formData.get("isPrivate") === "true"; 
  const price = parseFloat(formData.get("price") as string || "0");
  const capacity = parseInt(formData.get("capacity") as string || "100");
  
  const session = await getSession();
  const organizerId = session?.userId;
  
  if (!organizerId || session.role !== 'admin') {
    throw new Error("Unauthorized to create events");
  }

  if (!title || !date || !location) {
    throw new Error("Missing required fields");
  }

  const newEvent = await Event.create({
    title,
    description,
    location,
    date: new Date(date),
    organizer: organizerId as any,
    status: EventStatus.DRAFT, 
    isPrivate,
    ticketTypes: [
       {
           name: "General Admission",
           price: price,
           capacity: capacity,
           sold: 0,
           category: price > 0 ? TicketCategory.PAID : TicketCategory.FREE
       }
    ],
  });

  revalidatePath("/events");
  redirect("/events");
}

export async function getAllEvents() {
    await dbConnect();
    const session = await getSession();
    const isLoggedIn = !!session?.userId;

    const query: any = { status: EventStatus.PUBLISHED };
    
    // If not logged in, only show public events
    if (!isLoggedIn) {
        query.isPrivate = { $ne: true };
    }

    const events = await Event.find(query).sort({ date: 1 }).lean<IEvent[]>();
    
    return events.map(event => ({
        ...event,
        _id: event._id.toString(),
        organizer: (event as any).organizer.toString(),
        date: event.date.toISOString(),
        ticketTypes: event.ticketTypes?.map((t: any) => ({...t, _id: t._id.toString()}))
    })) as unknown as SerializedEvent[];
}

export async function getEventById(id: string) {
    await dbConnect();
    const mongoose = (await import("mongoose")).default;
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const event = await Event.findById(id).lean<IEvent>();
    if (!event) return null;
    
    const Ticket = (await import("@/models/Ticket")).default;
    const totalRegistered = await Ticket.countDocuments({ event: id, status: { $ne: 'canceled' } });
    const totalCheckedIn = await Ticket.countDocuments({ event: id, status: 'used' });
    
    return {
        ...event,
        _id: (event as any)._id.toString(),
        organizer: (event as any).organizer.toString(),
        date: (event as any).date.toISOString(),
        ticketTypes: (event as any).ticketTypes.map((t: any) => ({...t, _id: t._id.toString()})),
        totalRegistered,
        totalCheckedIn
    } as unknown as SerializedEvent;
}

export async function updateEvent(eventId: string, formData: FormData) {
    await dbConnect();
    const session = await getSession();
    if (!session?.userId || session.role !== 'admin') throw new Error("Unauthorized");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (event.organizer.toString() !== session.userId) throw new Error("Unauthorized: Not the organizer");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const date = formData.get("date") as string;
    const isPrivate = formData.get("isPrivate") === "true";
    const price = parseFloat(formData.get("price") as string || "0");
    const capacity = parseInt(formData.get("capacity") as string || "100");

    await Event.findByIdAndUpdate(eventId, {
        title,
        description,
        location,
        date: new Date(date),
        isPrivate,
        "ticketTypes.0.price": price,
        "ticketTypes.0.capacity": capacity,
        "ticketTypes.0.category": price > 0 ? TicketCategory.PAID : TicketCategory.FREE
    });

    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);
    revalidatePath("/admin");
    return { success: true };
}

export async function deleteEvent(eventId: string) {
    await dbConnect();
    const session = await getSession();
    if (!session?.userId || session.role !== 'admin') throw new Error("Unauthorized");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (event.organizer.toString() !== session.userId) throw new Error("Unauthorized: Not the organizer");

    // Update associated tickets to CANCELED instead of deleting them
    const Ticket = (await import("@/models/Ticket")).default;
    await Ticket.updateMany({ event: eventId }, { status: 'canceled' });
    
    // Mark the event as canceled (soft delete)
    await Event.findByIdAndUpdate(eventId, { status: EventStatus.CANCELED });

    revalidatePath("/events");
    revalidatePath("/admin");
    revalidatePath(`/events/${eventId}`);
    return { success: true };
}

export async function getOrganizerEvents() {
    await dbConnect();
    const session = await getSession();
    if (!session?.userId || session.role !== 'admin') return [];

    const mongoose = (await import("mongoose")).default;
    const events = await Event.find({ 
        organizer: new mongoose.Types.ObjectId(session.userId as string) 
    }).sort({ date: 1 }).lean<IEvent[]>();
    
    const Ticket = (await import("@/models/Ticket")).default;
    
    return Promise.all(events.map(async (event) => {
        const totalRegistered = await Ticket.countDocuments({ event: event._id, status: { $ne: 'canceled' } });
        const totalCheckedIn = await Ticket.countDocuments({ event: event._id, status: 'used' });
        
        return {
            ...event,
            _id: event._id.toString(),
            organizer: (event as any).organizer.toString(),
            date: event.date.toISOString(),
            ticketTypes: event.ticketTypes?.map((t: any) => ({...t, _id: t._id.toString()})),
            totalRegistered,
            totalCheckedIn
        };
    })) as unknown as Promise<SerializedEvent[]>;
}

export async function publishEvent(eventId: string) {
    await dbConnect();
    const session = await getSession();
    if (!session?.userId || session.role !== 'admin') throw new Error("Unauthorized");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (event.organizer.toString() !== session.userId) throw new Error("Unauthorized");

    await Event.findByIdAndUpdate(eventId, { status: EventStatus.PUBLISHED });

    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);
    revalidatePath("/admin");
    return { success: true };
}

export async function unpublishEvent(eventId: string) {
    await dbConnect();
    const session = await getSession();
    if (!session?.userId || session.role !== 'admin') throw new Error("Unauthorized");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (event.organizer.toString() !== session.userId) throw new Error("Unauthorized");

    await Event.findByIdAndUpdate(eventId, { status: EventStatus.DRAFT });

    revalidatePath("/events");
    revalidatePath(`/events/${eventId}`);
    revalidatePath("/admin");
    return { success: true };
}
