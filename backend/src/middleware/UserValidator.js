export const validateHandleRegister = (req,res,next) => {
    const {email, name, password, role_name} = req.body;

    //check required fields
    if (!email){return res.status(400).json({ message: 'email is required' });}
    if(!name){return res.status(400).json({ message: 'name is required' });}
    if(!password){return res.status(400).json({ message: 'password is required' });}
    if(!role_name){return res.status(400).json({ message: 'role is required' });}

    //validate type
    if (typeof email !== 'string' || email.trim() === ""){return res.status(400).json({ message: 'email must be a string and not empty' });}
    if (typeof name !== 'string' || name.trim() === ""){return res.status(400).json({ message: 'name must be a string and not empty' });}
    if (typeof password !== 'string' || password.trim() === ""){return res.status(400).json({ message: 'password must be a string and not empty' });}
    if (typeof role_name !== 'string' || role_name.trim() === ""){return res.status(400).json({ message: 'role_name must be a string and not empty' });}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //validate format
    if(!emailRegex.test(email)){return res.status(400).json({ message: 'email format invalid' });}
    if(password.length < 6){return res.status(400).json({ message: 'password must be 6 chars or above' });}
    const roles = ["customer","staff"]
    if(!roles.includes(role_name)){return res.status(400).json({ message: 'role does not exist' });}

    next()
}

export const validateHandleLogin = (req,res,next) => {
        const {email, password, role_name} = req.body;

    //check required fields
    if (!email){return res.status(400).json({ message: 'email is required' });}
    if(!password){return res.status(400).json({ message: 'password is required' });}
    if(!role_name){return res.status(400).json({ message: 'role is required' });}

    //validate type
    if (typeof email !== 'string' || email.trim() === ""){return res.status(400).json({ message: 'email must be a string and not empty' });}
    if (typeof password !== 'string' || password.trim() === ""){return res.status(400).json({ message: 'password must be a string and not empty' });}
    if (typeof role_name !== 'string' || role_name.trim() === ""){return res.status(400).json({ message: 'role_name must be a string and not empty' });}


    next()
}