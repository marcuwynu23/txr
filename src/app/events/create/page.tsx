
import CreateEventForm from '@/components/events/CreateEventForm';

export default function CreateEventPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to publish your event.
        </p>
      </div>
      <CreateEventForm />
    </div>
  );
}
