import userService from "../services/Ssignup.js";


 async function createUser(req, res) {
    try{
        const userData = req.body;
      const user= await userService.createUser(userData);
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
 }

export default createUser;