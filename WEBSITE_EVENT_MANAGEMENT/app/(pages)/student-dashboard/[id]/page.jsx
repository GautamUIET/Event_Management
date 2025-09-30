"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function UserProfilePage() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
  });

  // Update user profile when user data is available
  useEffect(() => {
    if (user?.user) {
      setUserProfile({
        name: user.user.name || "",
        email: user.user.email || "",
      });
    }
  }, [user]);

  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user registrations from API
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user?.user?._id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/backend/api/register/${user.user._id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch registrations");
        }

        if (data.status === "success") {
          // Transform API data to match component structure
          const transformedEvents = data.data.registrations
            .filter(reg => reg.event) // Only include registrations with valid events
            .map(reg => ({
              id: reg._id,
              title: reg.event.title,
              date: new Date(reg.event.date).toISOString().split('T')[0],
              time: reg.event.time || "Time TBD",
              location: reg.event.location,
              category: reg.event.category,
              organizer: reg.event.organizer,
              registrationDate: new Date(reg.registrationDate).toISOString().split('T')[0],
              status: determineEventStatus(reg.event.date, reg.event.status),
              price: formatPrice(reg.event.price)
            }));

          setRegisteredEvents(transformedEvents);
        }
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError(err.message || "Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);

  // Determine event status based on date and event status
  const determineEventStatus = (eventDate, eventStatus) => {
    const today = new Date();
    const event = new Date(eventDate);
    
    if (eventStatus === 'cancelled') return 'cancelled';
    if (event < today) return 'attended';
    return 'registered';
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || price === 0) return "Free";
    return `₹${price}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "registered": return "bg-green-100 text-green-800";
      case "attended": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "waiting": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "registered": return "Confirmed";
      case "attended": return "Attended";
      case "cancelled": return "Cancelled";
      case "waiting": return "Waitlist";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-2">Your registered events and profile information</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-indigo-600">
                    {userProfile.name 
                      ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()
                      : 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {userProfile.name || 'User'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {userProfile.email || 'user@example.com'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Events</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm font-bold">
                    {loading ? "..." : registeredEvents.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Attended</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                    {loading ? "..." : registeredEvents.filter(event => event.status === "attended").length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Upcoming</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
                    {loading ? "..." : registeredEvents.filter(event => event.status === "registered").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area - Events List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Registered Events</h2>
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
                  <p className="text-gray-600 mt-4">Loading your registrations...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Events</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : registeredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events registered</h3>
                  <p className="text-gray-600 mb-4">You haven't registered for any events yet.</p>
                  <button
                    onClick={() => router.push("/")}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Browse Events
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{event.date} • {event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{event.organizer}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>{event.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Registered on {new Date(event.registrationDate).toLocaleDateString('en-IN')}</span>
                        <span className="text-indigo-600 font-medium">{event.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}