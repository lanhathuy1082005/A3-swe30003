import UserService from "../services/UserService.js";

export const handleLogin = async (req,res) => {
    try {
        const {email, password, role_name} = req.body;
        const user = await UserService.handleLogin(email, password, role_name)

        if (!user.success){
            res.status(401).json({
                message: user.message
        });
        } else {
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                permissions: user.permissions.map(p => p.name)  // Convert to array of strings
            };

            return res.status(201).json({ 
                id: user.id,
                name: user.name,
                email: user.email,
                permissions: user.permissions.map(p => p.name),
                message: user.message
        })};
    } catch(err){
        console.error(err)
        res.status(500).json({ message: 'Cannot log in ' });
    }
}

export const handleRegister = async (req,res) => {
    try {
        const {email, name, password, role_name} = req.body;
        await UserService.handleRegister(email, name, password, role_name)
        return res.status(201).json({ 
            message: 'Registered successfully'
        });
    } catch(err){
        console.error(err)
        res.status(500).json({ message: 'Cannot register ' });
    }
}

export const handleLogout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};


export const getCurrentUser = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not logged in' });
    }

    return res.status(200).json({
        id: req.session.user.id,
        email: req.session.user.email,
        name: req.session.user.name,
        permissions: req.session.user.permissions  // Convert to array of strings
    });
};