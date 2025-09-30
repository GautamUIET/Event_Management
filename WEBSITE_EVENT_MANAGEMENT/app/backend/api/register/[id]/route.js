import Registration from "../../../models/registerEvent";
import { connect } from "../../../db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    console.log("=== DEBUG INFO ===");
    console.log("Full params object:", params);
    console.log("Request URL:", request.url);
    
    await connect();
    
    // Extract userId from params - handle both params object and direct value
    let userId;
    
    if (params && typeof params === 'object') {
      userId = params.userId || params.id; // Try both common patterns
    } else {
      userId = params; // If params is directly the userId
    }
    
    console.log("Extracted userId:", userId);
    console.log("Type of userId:", typeof userId);
    
    // Better validation for userId
    if (!userId || 
        userId === 'undefined' || 
        userId === 'null' || 
        userId === '[object Object]' ||
        userId.length < 10) { // Basic MongoDB ID length check
      console.log("UserId is invalid:", userId);
      return NextResponse.json(
        { 
          error: "Valid User ID is required", 
          received: userId,
          suggestion: "Check if the route parameter is correctly passed"
        },
        { status: 400 }
      );
    }

    console.log("Fetching registrations for user ID:", userId);

    // Get all registrations for this user with event details
    const registrations = await Registration.find({ userId })
      .populate('eventId', 'title date time location category organizer price image status')
      .sort({ registrationDate: -1 })
      .select('eventId registrationDate name email phone department')
      .lean(); // Use lean() for better performance

    console.log(`Found ${registrations.length} registrations for user ${userId}`);

    // Format the response - handle cases where event might be deleted
    const formattedRegistrations = registrations.map(reg => {
      const baseRegistration = {
        _id: reg._id,
        registrationDate: reg.registrationDate,
        name: reg.name,
        email: reg.email,
        phone: reg.phone,
        department: reg.department,
      };

      // Check if event exists and has required fields
      if (reg.eventId && typeof reg.eventId === 'object' && reg.eventId._id) {
        return {
          ...baseRegistration,
          event: {
            _id: reg.eventId._id,
            title: reg.eventId.title || 'Event Title Not Available',
            date: reg.eventId.date,
            time: reg.eventId.time,
            location: reg.eventId.location || 'Location Not Specified',
            category: reg.eventId.category,
            organizer: reg.eventId.organizer || 'Organizer Not Specified',
            price: reg.eventId.price || 0,
            image: reg.eventId.image,
            status: reg.eventId.status || 'unknown'
          }
        };
      } else {
        // Event might have been deleted or not properly populated
        return {
          ...baseRegistration,
          event: null,
          note: "Event information not available"
        };
      }
    });

    // Filter out null events if needed, or keep them with the note
    const validRegistrations = formattedRegistrations.filter(reg => reg.event !== null);
    
    return NextResponse.json({
      status: "success",
      data: {
        registrations: formattedRegistrations,
        totalRegistrations: registrations.length,
        validRegistrations: validRegistrations.length,
        registrationsWithMissingEvents: formattedRegistrations.length - validRegistrations.length
      }
    });

  } catch (error) {
    console.error("Error fetching user registrations:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { 
          error: "Invalid user ID format",
          details: "The user ID provided is not a valid MongoDB ObjectId"
        },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Data validation error", details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error while fetching registrations",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}