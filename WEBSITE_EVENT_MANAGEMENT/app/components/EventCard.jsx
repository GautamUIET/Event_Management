"use client";

export default function EventCard({ event, onRegister, user }) {
  const {
    id,
    title,
    description,
    date,
    time,
    endTime,
    location,
    category,
    organizer,
    attendees,
    capacity,
    price,
    status,
    contactEmail,
    contactPhone,
    requirements
  } = event;

  const isRegistered = status === "pending" || status === "approved";
  const isFull = attendees >= capacity;

  const handleRegisterClick = () => {
    if (!user) {
      // Redirect to login page
      window.location.href = '/auth/login';
      return;
    }
    onRegister(id);
  };

  const handleViewDetails = () => {
    // Navigate to event detail page
    window.location.href = `/event/${id}`;
  };

  // Category color mapping
  const getCategoryColor = (cat) => {
    const colors = {
      'Workshop': 'bg-blue-50 text-blue-700',
      'Conference': 'bg-purple-50 text-purple-700',
      'Seminar': 'bg-green-50 text-green-700',
      'Social': 'bg-pink-50 text-pink-700',
      'Sports': 'bg-orange-50 text-orange-700',
      'Technology': 'bg-indigo-50 text-indigo-700',
      'Education': 'bg-teal-50 text-teal-700'
    };
    return colors[cat] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Event Header with Category */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(category)}`}>
              {category}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            {price}
          </span>
        </div>
      </div>

      {/* Event Content */}
      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 text-sm text-gray-600 mb-4">{description}</p>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <CalendarIcon />
            <span>
              {new Date(date).toLocaleDateString()} • {time}
              {endTime && ` - ${endTime}`}
            </span>
          </div>
          <div className="flex items-center">
            <LocationIcon />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <OrganizerIcon />
            <span>{organizer}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">
              {attendees} / {capacity} attendees
            </span>
            <span className="text-gray-500">
              {Math.round((attendees / capacity) * 100)}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(attendees / capacity) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleViewDetails}
            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={handleRegisterClick}
            disabled={isFull || !user}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium text-white transition ${
              isFull || !user
                ? "cursor-not-allowed bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {!user ? "Login" : isFull ? "Full" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper icon components
function CalendarIcon() {
  return (
    <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function OrganizerIcon() {
  return (
    <svg className="mr-2 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}