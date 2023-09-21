"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRoute = void 0;
const express_1 = require("express");
const authenticationController_1 = require("./authenticationController");
const router = (0, express_1.Router)();
const AuthenticationController = new authenticationController_1.authenticationController();
router.post("/login", AuthenticationController.userLogin);
router.get("/details/:org_id", AuthenticationController.getUserDetails);
exports.authenticationRoute = router;
//# sourceMappingURL=authenticationRoute.js.map