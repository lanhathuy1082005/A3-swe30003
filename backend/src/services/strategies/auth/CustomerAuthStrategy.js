import User from '../../../models/User.js';
import AuthStrategy from './AuthStrategy.js';
import bcrypt from 'bcrypt';

class CustomerAuthStrategy extends AuthStrategy {
    
    async registerAccount(email,name, password, roleName){
        const roleId = await User.getRoleIdByRoleName(roleName);
        const passwordHash = await bcrypt.hash(password,10)
        await User.createUser(email, name, passwordHash, roleId);
    }

    async validateCredentials(email,password,roleName){
        const user = await User.getUserbyEmail(email);
        if (!user){return {success: false, message: "Incorrect email/password/roles"}}
        const passwordMatched = await bcrypt.compare(password, user.password_hash)
        if (!passwordMatched){return {success: false, message: "Incorrect email/password/roles"}}
        const roleId = await User.getRoleIdByRoleName(roleName);
        if (roleId !== user.role_id){return {success: false, message: "Incorrect email/password/roles"}}

        const perms =  await User.getUserPermsByRoleId(user.role_id)
        return {success: true, 
            message: "Logged in successfully", 
            permissions: perms, 
            id: user.id, 
            name: user.name, 
            email: user.email}

    }
}

export default CustomerAuthStrategy;