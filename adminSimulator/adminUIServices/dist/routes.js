"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = require("express");
const authenticationRoute_1 = require("./modules/authentication/authenticationRoute");
const smartLinkRoute_1 = require("./modules/smartLink/smartLinkRoute");
const certificateRoute_1 = require("./modules/certificate/certificateRoute");
class Routes {
    constructor(NODE_ENV) {
        switch (NODE_ENV) {
            case "production":
                this.basePath = "/app/dist";
                break;
            case "development":
                this.basePath = "/app/public";
                break;
        }
    }
    path() {
        const router = (0, express_1.Router)();
        router.use("/user", authenticationRoute_1.authenticationRoute);
        router.use("/smartlink/certificate", certificateRoute_1.certificateRoute);
        router.use("/smartlink", smartLinkRoute_1.smartLinkRoute);
        return router;
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map