import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
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
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=User.js.map