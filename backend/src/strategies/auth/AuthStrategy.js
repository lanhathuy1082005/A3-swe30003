class AuthStrategy {
    login(){
        throw new Error("Method 'login()' must be implemented.");
    }
    logout(){
        throw new Error("Method 'logout()' must be implemented.");
    }
}

export default AuthStrategy;