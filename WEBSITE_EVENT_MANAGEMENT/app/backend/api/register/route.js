import Registration from "../../models/registerEvent";
import User from "../../models/user";
import Event from "../../models/event";
import { connect } from "../../db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connect();
    const body = await req.json();
    const { name,eventId, studentId, userId } = body;

    // Validate required fields
    if (!eventId || !studentId || !userId) {
      return NextResponse.json(
        { error: "Event ID, Student ID, and User ID are required" },
        { status: 400 }
      );
    }

    // Check if event exists and registration is open
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }


    // Check if user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { error: "User not found with this student ID" },
        { status: 404 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      $or: [
        { studentId },
        { userId: user._id }
      ]
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 400 }
      );
    }

    // Create registration
    const registration = await Registration.create({
      eventId,
      studentId,
      userId: user._id,
      name,
      email: user.email,
      phone: user.phone,
      department: user.department,
    });

    // Update event registration count
    await event.updateRegistrationCount();

    // Add user to event's registeredUsers array
    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { registeredUsers: user._id }
    });

    return NextResponse.json({
      status: "success",
      message: "Registration successful",
      data: {
        registration: {
          _id: registration._id,
          eventId: registration.eventId,
          studentId: registration.studentId,
          name: registration.name,
          email: registration.email,
          registrationDate: registration.registrationDate,
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating registration:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate registration detected" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


