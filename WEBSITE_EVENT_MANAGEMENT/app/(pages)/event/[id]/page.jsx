"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";

export default function EventRegistration() {
  const router = useRouter();
  const params = useParams();
  const user = useSelector((state) => state.auth.user);
  
  const eventId = params.id;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    department: ""
  });

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setEventLoading(true);
        const response = await fetch(`/backend/api/allEvents/${eventId}`);
        
        if (!response.ok) {
          throw new Error('Event not found');
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          setEvent(result.data.event);
        } else {
          throw new Error(result.error || 'Failed to fetch event');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.message);
      } finally {
        setEventLoading(false);
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user?.user) {
      setFormData(prev => ({
        ...prev,
        name: user.user.name || "",
        email: user.user.email || "",
        phone: user.user.phone || "",
        studentId: user.user.studentId || "",
        department: user.user.department || ""
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/backend/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: user.user._id,
          name: formData.name,
          studentId: formData.studentId,
          // Include additional fields that might be needed
          email: formData.email,
          phone: formData.phone,
          department: formData.department
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      if (result.status === 'success') {
        console.log("Registration successful:", result.data);
        router.push("/student-dashboard/user?.user?._id");
      } else {
        throw new Error(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading || eventLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Events
        </button>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details - Left */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {event.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.attendees || 0}/{event.capacity || 100} attendees
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {event.title}
                </h1>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{event.date}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Time:</span>
                    <span className="ml-2">{event.time}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{event.location}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">Organizer:</span>
                    <span className="ml-2">{event.organizer}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <span className="font-medium">Price:</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      {event.price || "Free"}
                    </span>
                  </div>
                </div>

                {event.requirements && event.requirements.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Requirements:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Registration Form - Right */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Event Registration
              </h2>
              <p className="text-gray-600 mt-2">
                Complete the form below to register for this event
              </p>
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-yellow-700 font-medium">Please log in to register for this event</span>
                </div>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="mt-3 w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
                >
                  Login to Register
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {["name", "email", "phone", "studentId"].map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    {field === "name"
                      ? "Full Name *"
                      : field === "studentId"
                      ? "Student ID *"
                      : field === "email"
                      ? "Email Address *"
                      : "Phone Number *"}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    id={field}
                    name={field}
                    required
                    value={formData[field]}
                    onChange={handleInputChange}
                    disabled={!user || isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder={"Enter your " + field}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  disabled={!user || isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select your department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">
                    Electrical Engineering
                  </option>
                  <option value="Mechanical Engineering">
                    Mechanical Engineering
                  </option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Business Administration">
                    Business Administration
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-800 mb-2">
                  Registration Summary
                </h3>
                <div className="flex justify-between text-sm text-indigo-700">
                  <span>Event:</span>
                  <span className="font-medium">{event.title}</span>
                </div>
                <div className="flex justify-between text-sm text-indigo-700 mt-1">
                  <span>Price:</span>
                  <span className="font-medium">{event.price || "Free"}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !user || (event.attendees >= event.capacity)}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!user 
                  ? "Please Login to Register" 
                  : event.attendees >= event.capacity 
                    ? "Event Full" 
                    : isSubmitting 
                      ? "Processing Registration..." 
                      : "Complete Registration"
                }
              </button>

              <p className="text-xs text-gray-500 text-center">
                By registering, you agree to our terms and conditions. You'll
                receive a confirmation email shortly.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}