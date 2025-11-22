class AuthStrategy {
    
    registerAccount(){
        throw new Error("Method 'register()' must be implemented.");
    }

    validateCredentials(){
        throw new Error("Method 'login()' must be implemented.");
    }
}

export default AuthStrategy;