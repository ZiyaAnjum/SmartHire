const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const inMemoryStore = require('./inMemoryStore');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'Please specify a user role'],
      enum: {
        values: ['candidate', 'employer'],
        message: 'Role must be either candidate or employer',
      },
    },
    headline: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUserModel = mongoose.models.User || mongoose.model('User', UserSchema);

const UserProxy = new Proxy(MongooseUserModel, {
  get(target, prop) {
    if (mongoose.connection.readyState !== 1) {
      if (prop in inMemoryStore.User) {
        return inMemoryStore.User[prop];
      }
    }
    return target[prop];
  },
});

module.exports = UserProxy;
