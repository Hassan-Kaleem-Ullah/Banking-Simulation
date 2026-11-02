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
      minlength: [2, "Password should contain more than 2 characters"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function() {
    
    if(!this.isModified('password')) {

        return
    }

    const hashPass = await bcryptjs.hash(this.password, 10);
    this.password = hashPass;
    return
})

userSchema.methods.comparePassword = async function(password) {

    return await bcryptjs.compare(password, this.password)
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
