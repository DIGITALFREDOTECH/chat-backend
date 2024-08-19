import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log(req.headers('Authorization'));
    if (!token) {
        return res.status(401).send({ error: "Authentication required" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send({ error: "Invalid token" });
    }
};
//# sourceMappingURL=auth.js.map