import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface UserInterface {
  email: string;
  passwordHash: string;
  full_name: string;
  comparePassword(password: string): boolean;
}

const userSchema = new mongoose.Schema<UserInterface>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  full_name: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  console.log("pre save");
  const user = this;
  console.log(user);
  console.log(user.isModified);
  console.log(user.isModified());
  console.log(user.isModified("password"));
  if (this.isModified("passwordHash")) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);

export default User;
