import User from "../models/User.js";
import bcrypt from "bcrypt";


async function createUser(userData) {
    const {username, email, password, phoneNumber,address,city,gender}=userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new User({
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        address,
        city,
        gender

    });
   const savedUser= await createdUser.save();
    
}

export default {createUser};