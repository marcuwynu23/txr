
export interface SerializedEvent {
    _id: string;
    title: string;
    description: string;
    location: string;
    date: string | Date; // Date if not serialized, string if serialized
    organizer: string;
    status: string;
    isPrivate?: boolean;
    ticketTypes: SerializedTicketType[];
    totalRegistered?: number;
    totalCheckedIn?: number;
    createdAt: string;
    updatedAt: string;
}

export interface SerializedTicketType {
    _id: string;
    name: string;
    description?: string;
    price: number;
    capacity: number;
    sold: number;
    category: string;
}
