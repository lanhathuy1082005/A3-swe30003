import CustomerAuthStrategy from "./strategies/auth/CustomerAuthStrategy.js";
import StaffAuthStrategy from "./strategies/auth/StaffAuthStrategy.js";
import AuthStrategyProcessor from "./strategies/auth/AuthStrategyProcessor.js";

const customer = new CustomerAuthStrategy();
const staff = new StaffAuthStrategy();
const authStrategy = new AuthStrategyProcessor();

export default class UserService {

    static async handleRegister(email, name, password, roleName){
        if (roleName === "customer"){
            authStrategy.setStrategy(customer)
        } else if (roleName === "staff"){
            authStrategy.setStrategy(staff)
        }

        authStrategy.registerAccount(email,name, password, roleName);
    }
    static async handleLogin(email, password, roleName){
        if (roleName === "customer"){
            authStrategy.setStrategy(customer)
        } else if (roleName === "staff"){
            authStrategy.setStrategy(staff)
        }

        return await authStrategy.validateCredentials(email,password,roleName);

    }
}