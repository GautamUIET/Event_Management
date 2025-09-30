import Event from "../../models/event";
import { connect } from "../../db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const organizer = searchParams.get('organizer');

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (organizer) filter.organizer = organizer;

    // Fetch events with filtering and sorting
    const events = await Event.find(filter)
      .sort({ date: 1, time: 1 }) // Sort by date and time ascending
      .select('-__v') // Exclude version key
      .lean();

    console.log(`Found ${events.length} events`);

    return NextResponse.json({
      status: "success",
      data: {
        events,
        totalEvents: events.length
      }
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    
    return NextResponse.json(
      { 
        error: "Internal server error while fetching events",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}