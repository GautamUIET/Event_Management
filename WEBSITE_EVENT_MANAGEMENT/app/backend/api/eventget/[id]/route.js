
import Event from "../../../models/event";
import { NextResponse } from "next/server";
import { connect } from "../../../db";


export async function GET(request, { params }) {
  try {
    console.log("Connecting to database...");
    await connect();
    console.log("Database connected");

    const { id } = params;
    console.log("Fetching events for organizer ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Organizer ID is required" },
        { status: 400 }
      );
    }

    // Fetch events for this organizer
    const events = await Event.find({ organizerId: id })
      .sort({ createdAt: -1 })
      .populate('organizerId', 'name email');

    console.log(`Found ${events.length} events for organizer ${id}`);

    return NextResponse.json({
      status: "success",
      data: {
        events: events.map(event => ({
          _id: event._id,
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          endTime: event.endTime,
          location: event.location,
          category: event.category,
          capacity: event.capacity,
          price: event.price,
          requirements: event.requirements,
          contactEmail: event.contactEmail,
          contactPhone: event.contactPhone,
          image: event.image,
          status: event.status,
          attendees: event.attendees,
          organizer: event.organizer,
          organizerId: event.organizerId,
          createdAt: event.createdAt
        }))
      }
    });

  } catch (error) {
    console.error("Error in GET /backend/api/eventget/[id]:", error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: "Invalid organizer ID format" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error while fetching events" },
      { status: 500 }
    );
  }
}
