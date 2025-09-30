import User from "../../models/user";
import Event from "../../models/event";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "../../db";

connect();

export async function POST(req) {
  let event;

  try {
    const body = await req.json();
    const {
      title,
      description,
      date,
      time,
      endTime,
      location,
      category,
      organizer,
      organizerId,
      capacity,
      price = "Free",
      requirements = [],
      contactEmail,
      contactPhone,
      image = "",
      status = "draft"
    } = body;

    // Required field validation
    const requiredFields = {
      title,
      description,
      date,
      time,
      endTime,
      location,
      category,
      organizer,
      organizerId,
      capacity,
      contactEmail,
      contactPhone
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate organizer exists
    const organizerUser = await User.findById(organizerId);
    if (!organizerUser) {
      return NextResponse.json(
        { error: "Organizer user not found" },
        { status: 404 }
      );
    }

    // Validate category
    const validCategories = [
      'Technology', 'Sports', 'Education', 'Arts & Culture', 'Business',
      'Social', 'Workshop', 'Conference', 'Seminar', 'Networking'
    ];
    
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate capacity
    if (capacity < 1) {
      return NextResponse.json(
        { error: "Capacity must be at least 1" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid contact email" },
        { status: 400 }
      );
    }

    // Create event
    event = await Event.create({
      title: title.trim(),
      description,
      date,
      time,
      endTime,
      location: location.trim(),
      category,
      organizer: organizer.trim(),
      organizerId,
      capacity,
      price,
      requirements: requirements.map(req => req.trim()),
      contactEmail,
      contactPhone,
      image,
      status
    });

    // Populate the event with organizer details for response
    const populatedEvent = await Event.findById(event._id).populate(
      'organizerId',
      'name email'
    );

    return NextResponse.json(
      {
        status: "success",
        message: "Event created successfully",
        data: {
          event: populatedEvent
        }
      },
      { status: 201 }
    );

  } catch (error) {
    // Clean up if event creation failed
    if (event) {
      await Event.findByIdAndDelete(event._id);
    }
    
    console.error("Error creating event:", error.message);
    
    // Handle duplicate key errors or other MongoDB errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Event with similar details already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Error while creating event" },
      { status: 500 }
    );
  }
}