import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const SALT_ROUNDS = 10;

export type UserDocument = mongoose.Document & {
  username: string;
  password: string;
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
  user.password = hash;
  next();
});

export const User = mongoose.model<UserDocument>('User', userSchema);
