'use client';

import { createEvent, updateEvent } from '@/actions/events';
import { useFormStatus } from 'react-dom';
import { SerializedEvent } from '@/types';

function SubmitButton({ isEdit }: { isEdit?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Event' : 'Create Event')}
    </button>
  );
}

export default function CreateEventForm({ event, onSuccess }: { event?: SerializedEvent, onSuccess?: () => void }) {
  const handleSubmit = async (formData: FormData) => {
    if (event) {
        await updateEvent(event._id, formData);
    } else {
        await createEvent(formData);
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Event Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g. Annual Tech Conference"
            defaultValue={event?.title}
          />
        </div>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date & Time
        </label>
        <div className="mt-1">
          <input
            type="datetime-local"
            name="date"
            id="date"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            defaultValue={event?.date ? new Date(event.date).toISOString().slice(0, 16) : ''}
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="location"
            id="location"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="e.g. Convention Center, Hall A"
            defaultValue={event?.location}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            placeholder="Describe your event..."
            defaultValue={event?.description}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Ticket Price ($)
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              $
            </span>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.01"
              required
              className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="0.00 for free"
              defaultValue={event?.ticketTypes?.[0]?.price || 0}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Set to 0 for a free event.</p>
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
            Total Capacity
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="capacity"
              id="capacity"
              min="1"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              placeholder="e.g. 100"
              defaultValue={event?.ticketTypes?.[0]?.capacity || 100}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">Maximum number of attendees.</p>
        </div>
      </div>

      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id="isPrivate"
            name="isPrivate"
            type="checkbox"
            value="true"
            defaultChecked={event?.isPrivate}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor="isPrivate" className="font-medium text-gray-900">
            Private Event
          </label>
          <p id="isPrivate-description" className="text-gray-500">
            Only registered users can see and join this event.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton isEdit={!!event} />
      </div>
    </form>
  );
}
