import authService from  "../services/login.js";

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const loginResponse = await authService.login(email, password);
        return res.status(200).json(loginResponse);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Inavild Credentials' });
    }
}

export default login;