import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
    },
      role: {
      type: String,
      enum: {
        values: ["student", "organizer", "admin"],
        message: "Role must be student, organizer, or admin",
      },
      required: [true, "Please provide a role"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: true,
    },
 
    lastLogin: {
      type: Date,
      default: Date.now,
    },
 

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;


