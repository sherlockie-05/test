"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateController = void 0;
const certificateUtlis_1 = require("./certificateUtlis");
class certificateController {
    constructor() {
        this.CertificateUtlis = new certificateUtlis_1.certificateUtlis();
        this.getCertificate = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.CertificateUtlis.getCertificate(req.query.org_id.toString());
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to get certificate content ${error}`);
            }
        });
        this.generateOrganizationCertificate = (req, res) => {
            try {
                const result = this.CertificateUtlis.generateOrganizationCertificate(req.body.org_id, req.body.cert_password);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to generate certificate for organization ${error}`);
            }
        };
        this.downloadCertificate = (req, res) => {
            try {
                const result = this.CertificateUtlis.downloadCertificate(req.params.org_id);
                res.setHeader('Content-type', 'application/x-pkcs12');
                res.setHeader('Content-disposition', `attachment; filename=client.pfx`);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to download certificate ${error}`);
            }
        };
        this.downloadRootCertificate = (req, res) => {
            try {
                const result = this.CertificateUtlis.downloadRootCertificate();
                res.setHeader('Content-type', 'application/x-x509-ca-crt');
                res.setHeader('Content-disposition', `attachment; filename=ca.crt`);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to download certificate ${error}`);
            }
        };
        this.getClientCertificate = (req, res) => {
            try {
                const result = this.CertificateUtlis.getClientCertificate();
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to generate certificate for organization ${error}`);
            }
        };
    }
}
exports.certificateController = certificateController;
//# sourceMappingURL=certificateController.js.map