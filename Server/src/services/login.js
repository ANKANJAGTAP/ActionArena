import bcrypt from "bcrypt";
import User from "../models/User.js";
import {generateToken} from "../Utils/jwtUtils.js";


async function login(email, password) {
    try{
        const user = await User.findOne({email});
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }
        const token = generateToken(user);
        return {token};

    }
    catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
}

export default {login};