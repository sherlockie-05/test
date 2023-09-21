"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express = require("express");
const dotenv = require("dotenv");
const routes_1 = require("./routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");
if (fs.existsSync(path.join(__dirname, "..", ".env"))) {
    dotenv.config();
}
class Server {
    constructor() {
        this.app = express();
        const PORT = process.env.PORT;
        const NODE_ENV = process.env.NODE_ENV;
        const routes = new routes_1.Routes(NODE_ENV);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.app.use(morgan("dev"));
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use("/admin", routes.path());
        this.app.listen(PORT, () => {
            console.log("The server runs on localhost:", PORT);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map