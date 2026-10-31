const bcryptjs = require('bcryptjs');
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email Address",
      ],

      unique: [true, "Email already exists"],
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password should contain more than 6 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function(next) {
    
    if(!this.isModified('password')) {

        return next();
    }

    const hashPass = await bcryptjs.hash(this.password, 10);
    this.password = hashPass
})

userSchema.methods.comparePassword = async function(password) {

    return await bcryptjs.compare(password, this.password)
}

// const userModel = 
