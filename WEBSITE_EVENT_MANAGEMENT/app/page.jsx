"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters from "./components/Filters";
import EventCard from "./components/EventCard";

export default function Page() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("User in Home Page:", user?.user?.role);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/backend/api/allEvents');

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          // Transform API data to match your EventCard component structure
          const formattedEvents = result.data.events.map(event => ({
            id: event._id,
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            endTime: event.endTime,
            location: event.location,
            category: event.category,
            organizer: event.organizer,
            attendees: event.attendees || 0,
            capacity: event.capacity || 100,
            price: event.price || "Free",
            status: "idle",
            contactEmail: event.contactEmail,
            contactPhone: event.contactPhone,
            requirements: event.requirements || []
          }));
          
          setEvents(formattedEvents);
        } else {
          throw new Error(result.error || 'Failed to fetch events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Redirect organizer to organizer page
  useEffect(() => {
    if (user?.user?.role === "organizer") {
      router.push(`/organizer`);
    }
  }, [user, router]);

  const handleRegister = (id) => {
    // Redirect to event detail page
    router.push(`/event/${id}`);
  };

  const filteredEvents = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const matchesText =
        searchText === "" ||
        e.title.toLowerCase().includes(searchText) ||
        e.description.toLowerCase().includes(searchText) ||
        e.location.toLowerCase().includes(searchText) ||
        e.organizer.toLowerCase().includes(searchText);
      return matchesCategory && matchesText;
    });
  }, [events, query, category]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 text-gray-900">
      {/* Pass user to Navbar */}
      <Navbar user={user} />
      <Hero />

      <div className="my-4">
        <Filters
          query={query}
          category={category}
          onQueryChange={setQuery}
          onCategoryChange={setCategory}
        />
      </div>

      <section id="events" className="mx-auto max-w-7xl px-4 pb-12">
        {/* Events Summary */}
        {!loading && !error && events.length > 0 && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
              {category !== "All" && ` in ${category}`}
              {query && ` matching "${query}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading events...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <svg className="w-6 h-6 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">Error loading events</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onRegister={handleRegister}
                  user={user}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                {events.length === 0 
                  ? "No events available at the moment. Please check back later."
                  : "No events match your search."
                }
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}