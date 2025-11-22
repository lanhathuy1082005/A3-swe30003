class AuthStrategyProcessor {
    setStrategy(strategy) {
        this.strategy = strategy;
    }

    registerAccount(email,name, password, roleName) {
        return this.strategy.registerAccount(email,name, password, roleName);
    }

    validateCredentials(email, password, roleName) {
        return this.strategy.validateCredentials(email, password, roleName);
    }
}

export default AuthStrategyProcessor;