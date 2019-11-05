import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: value => {
        return validator.isEmail(value);
      },
    },
    github: { type: String, required: true, unique: true },
    membership: {
      active: { type: Boolean, default: false },
      date_joined: { type: Date, default: Date.now },
      years: { type: [Number], default: [] },
    },
  },
  { timestamps: true },
);

/*
 * Set the current membership to active
 */
UserSchema.methods.activateMembership = function() {
  // Update year
  const currentYear = new Date().getFullYear();
  if (!this.membership.years.includes(currentYear)) {
    this.membership.years.push(currentYear);
  }
  // Set active flag
  this.membership.active = true;
};

/*
 * Reset active membership status
 */
UserSchema.methods.resetMembership = function() {
  this.active = false;
};

/*
 * Get number of years they have been a member
 */
UserSchema.methods.yearsActive = function() {
  return this.membership.years.length;
};

module.exports = mongoose.model('User', UserSchema);
