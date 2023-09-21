"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateRoute = void 0;
const express_1 = require("express");
const certificateController_1 = require("./certificateController");
const router = (0, express_1.Router)();
const CertificateController = new certificateController_1.certificateController();
router.get("/", CertificateController.getCertificate);
router.get("/client", CertificateController.getClientCertificate);
router.post("/", CertificateController.generateOrganizationCertificate);
router.get("/root", CertificateController.downloadRootCertificate);
router.get("/:org_id", CertificateController.downloadCertificate);
exports.certificateRoute = router;
//# sourceMappingURL=certificateRoute.js.map