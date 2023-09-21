"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationController = void 0;
const authenticationUtlis_1 = require("./authenticationUtlis");
class authenticationController {
    constructor() {
        this.AuthenticationUtlis = new authenticationUtlis_1.authenticationUtlis();
        this.userLogin = (req, res) => {
            try {
                const result = this.AuthenticationUtlis.userLogin(req.body);
                res.send(result);
            }
            catch (error) {
                console.error("User login failed", error.message);
            }
        };
        this.getUserDetails = (req, res) => {
            try {
                const result = this.AuthenticationUtlis.getUserDetails(req.params.org_id);
                res.send(result);
            }
            catch (error) {
                console.error("Failed to fetch user details", error.message);
            }
        };
    }
}
exports.authenticationController = authenticationController;
//# sourceMappingURL=authenticationController.js.map