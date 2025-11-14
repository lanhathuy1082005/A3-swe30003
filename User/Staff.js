import User from "./User.js";

class Staff extends User {
    constructor(id, name, pass, email, role) {
        super(id, name, pass, email, role);
    }
}

export default Staff;