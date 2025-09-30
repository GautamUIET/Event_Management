import Event from "../../../models/event";
import { connect } from "../../../db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connect();

    const eventId = params.id;

    console.log("Params received:", params);
    console.log("Event ID:", eventId);

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId).select('-__v').lean();

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: { event }
    });

  } catch (error) {
    console.error("Error fetching event:", error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}