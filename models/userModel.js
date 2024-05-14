const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Enter your name'],
    // validate: [validator.isAlpha, 'Name must only contaimns letters'],
  },
  email: {
    type: String,
    required: [true, 'Please Enter yourvalid email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid Email'],
  },

  photo: String,

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please create a password'],
    minlength: [8, 'Password must be atleast 8 characters'],
    // validate: [validator.isStrongPassword, 'User must have strong Password'],
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    //this only works on create and save!!
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password is not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  //Only run this function if password is actually modified
  if (!this.isModified('password')) return next();

  //Passsword Encryption
  //we use hash to salt the password it means that js randomly add some sting to our password so that no one can guess it
  //Hash the password with cost of 12
  //if we use same passwords it will never encrypted as a same encrypted password.
  this.password = await bcrypt.hash(this.password, 12);

  //Deleting the confirm password field because we dont need it to save in database
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
