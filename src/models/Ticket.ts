
import mongoose, { Schema, Document, Model } from 'mongoose';

export enum TicketStatus {
  VALID = 'valid',
  USED = 'used',
  CANCELED = 'canceled',
}

export interface ITicket extends Document {
  event: mongoose.Types.ObjectId;
  ticketType: string; // Name of the ticket type or ID if we made it a subdocument with ID
  user: mongoose.Types.ObjectId; // Attendee
  code: string; // Unique codes for QR
  status: TicketStatus;
  checkedInAt?: Date;
  metadata?: Record<string, any>; // Extra info if needed
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema<ITicket> = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    ticketType: { type: String, required: true }, // Referencing the subdocument name
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true, unique: true },
    status: { 
        type: String, 
        enum: Object.values(TicketStatus), 
        default: TicketStatus.VALID 
    },
    checkedInAt: { type: Date },
    metadata: { type: Map, of: String },
  },
  { timestamps: true }
);

// Indexes
TicketSchema.index({ event: 1, user: 1 }); // User's ticket for an event
TicketSchema.index({ code: 1 }, { unique: true }); // Fast lookup by code

const Ticket: Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
