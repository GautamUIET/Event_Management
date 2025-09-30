"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function OrganizerPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    category: "",
    capacity: "",
    price: "0",
    requirements: [],
    contactEmail: "",
    contactPhone: "",
    image: "",
    organizer: "",
    organizerId: ""
  });

  const [currentRequirement, setCurrentRequirement] = useState("");
  const [organizerEvents, setOrganizerEvents] = useState([]);

  const categories = [
    "Technology",
    "Sports",
    "Education",
    "Arts & Culture",
    "Business",
    "Social",
    "Workshop",
    "Conference",
    "Seminar",
    "Networking"
  ];

  const user = useSelector((state) => state.auth.user);

  // Fetch events when component mounts or when activeTab changes to "manage"
  useEffect(() => {
    if (activeTab === "manage" && user?.user?._id) {
      fetchOrganizerEvents();
    }
  }, [activeTab, user]);

  const getCurrentUser = () => {
    return {
      id: user?.user?._id || "user123",
      name: user?.user?.name || "John Doe"
    };
  };
  console.log("Current User:", getCurrentUser().id, getCurrentUser().name);

  // Fetch all events for the current organizer
  const fetchOrganizerEvents = async () => {
    if (!user?.user?._id) {
      setError("User not found. Please log in.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const currentUser = getCurrentUser();
      const response = await fetch(`/backend/api/eventget/${currentUser.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`API returned HTML instead of JSON. Check if the endpoint exists.`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch events');
      }

      // Set the events from API response
      setOrganizerEvents(result.data?.events || []);

    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const addRequirement = () => {
    const req = currentRequirement.trim();
    if (req && !eventForm.requirements.includes(req)) {
      setEventForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, req]
      }));
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setEventForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const currentUser = getCurrentUser();
      
      const eventData = {
        ...eventForm,
        organizer: currentUser.name,
        organizerId: currentUser.id,
        capacity: parseInt(eventForm.capacity),
        price: eventForm.price === "0" ? "Free" : `₹${eventForm.price}`,
        status: "published"
      };

      const response = await fetch('backend/api/eventApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`API returned HTML instead of JSON. Check if the endpoint exists.`);
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create event');
      }

      // Refresh the events list after creating a new event
      await fetchOrganizerEvents();

      // Reset form
      setEventForm({
        title: "",
        description: "",
        date: "",
        time: "",
        endTime: "",
        location: "",
        category: "",
        capacity: "",
        price: "0",
        requirements: [],
        contactEmail: "",
        contactPhone: "",
        image: "",
        organizer: "",
        organizerId: ""
      });

      setIsSubmitting(false);
      setActiveTab("manage");

    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
            <p className="text-gray-600 mt-2">Create and manage your events</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("create")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "create"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Create New Event
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "manage"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Events ({organizerEvents.length})
            </button>
          </nav>
        </div>

        <div className="py-8">
          {activeTab === "create" ? (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={eventForm.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={eventForm.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Describe your event"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={eventForm.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity *</label>
                    <input
                      type="number"
                      name="capacity"
                      value={eventForm.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Maximum attendees"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={eventForm.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                    <input
                      type="time"
                      name="time"
                      value={eventForm.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                    <input
                      type="time"
                      name="endTime"
                      value={eventForm.endTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={eventForm.price}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="0 for free event"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Event venue address"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentRequirement}
                      onChange={(e) => setCurrentRequirement(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Add a requirement"
                    />
                    <button type="button" onClick={addRequirement} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {eventForm.requirements.map((req, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                        {req}
                        <button type="button" onClick={() => removeRequirement(index)} className="ml-2 text-indigo-600 hover:text-indigo-800">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={eventForm.contactEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="organizer@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={eventForm.contactPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={eventForm.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="https://example.com/event-image.jpg"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Event..." : "Create Event"}
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Events</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading events...</p>
                </div>
              ) : organizerEvents.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-600 mb-4">Create your first event to get started</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Create Event
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organizerEvents.map(event => (
                    <div key={event._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between"><span>Date:</span><span className="font-medium">{event.date}</span></div>
                        <div className="flex justify-between"><span>Time:</span><span className="font-medium">{event.time} - {event.endTime}</span></div>
                        <div className="flex justify-between"><span>Attendees:</span><span className="font-medium">{event.attendees || 0}/{event.capacity}</span></div>
                        <div className="flex justify-between"><span>Price:</span><span className="font-medium">{event.price === "0" || event.price === "Free" ? "Free" : event.price}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}