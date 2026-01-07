
import mongoose, { Document, Model, Schema } from 'mongoose';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum TicketCategory {
  FREE = 'free',
  PAID = 'paid',
  INVITE_ONLY = 'invite_only',
}

export interface ITicketType {
  name: string;
  description?: string;
  price: number;
  capacity: number;
  sold: number;
  category: TicketCategory;
}

export interface IEvent extends Document {
  title: string;
  description: string;
  location: string;
  date: Date;
  organizer: mongoose.Types.ObjectId; // Reference to User
  status: EventStatus;
  isPrivate: boolean;
  capacity?: number; // Total capacity (optional, or sum of ticket types)
  ticketTypes: ITicketType[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketTypeSchema = new Schema<ITicketType>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  capacity: { type: Number, required: true },
  sold: { type: Number, default: 0 },
  category: { 
      type: String, 
      enum: Object.values(TicketCategory), 
      default: TicketCategory.FREE 
  },
});

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: Object.values(EventStatus), 
        default: EventStatus.DRAFT 
    },
    isPrivate: { type: Boolean, default: false },
    // If not set, capacity is unlimited or determined by ticket types
    capacity: { type: Number },
    ticketTypes: [TicketTypeSchema],
  },
  { timestamps: true }
);

// Indexes
EventSchema.index({ date: 1 });
EventSchema.index({ organizer: 1 });
EventSchema.index({ status: 1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;
