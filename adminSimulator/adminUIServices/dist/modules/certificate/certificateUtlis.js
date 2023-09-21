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
exports.certificateUtlis = void 0;
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const { readdir } = require('fs/promises');
class certificateUtlis {
    getCertificate(org_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const certificateDir = `./cert/org-certificate/${org_id}`;
                const name = 'client.pfx';
                const matchedFiles = [];
                const files = yield readdir(certificateDir);
                for (const file of files) {
                    const filename = path.parse(file).name;
                    if (filename === name) {
                        matchedFiles.push(file);
                    }
                }
                const certificate = fs.readFileSync(path.join(certificateDir, matchedFiles[0]));
                return {
                    "status_code": 200,
                    "message": null,
                    "data": JSON.stringify({
                        certificate_format: path.extname(matchedFiles[0]),
                        certificate_content: certificate.toString()
                    })
                };
            }
            catch (error) {
                console.error(`Failed to get certificate content ${error}`);
            }
        });
    }
    generateOrganizationCertificate(org_id, cert_password) {
        const caKeyPath = './cert/ca/ca.key';
        const caCertPath = './cert/ca/ca.crt';
        const clientDir = `./cert/org-certificates/${org_id}`;
        const clientKeyPath = `./cert/org-certificates/${org_id}/client.key`;
        const clientCertPath = `./cert/org-certificates/${org_id}/client.crt`;
        const clientPfxCertPath = `./cert/org-certificates/${org_id}/client.pfx`;
        if (!fs.existsSync(clientDir)) {
            fs.mkdirSync(clientDir);
        }
        try {
            // Generate client private key and CSR
            const command = `openssl req -newkey rsa:2048 -nodes -keyout ${clientKeyPath} -out ${clientDir}/client.csr -subj "/CN=${org_id}"`;
            (0, child_process_1.execSync)(command);
            // Sign client certificate using the CA key and certificate
            const signCommand = `openssl x509 -req -in ${clientDir}/client.csr -CA ${caCertPath} -CAkey ${caKeyPath} -CAcreateserial -out ${clientCertPath} -passin pass:${cert_password} -days 365`;
            (0, child_process_1.execSync)(signCommand);
            const pfxCommand = `openssl pkcs12 -export -out ${clientPfxCertPath} -inkey ${clientKeyPath} -in ${clientCertPath} -passout pass:${cert_password}`;
            (0, child_process_1.execSync)(pfxCommand);
            console.log(`Client certificate generated successfully for ${org_id}.`);
            return {
                "status_code": 200,
                "message": null,
                "data": null
            };
        }
        catch (error) {
            console.error(`Failed to generate client certificate for ${org_id}:`, error.message);
        }
    }
    downloadCertificate(org_id) {
        try {
            const clientCertPath = `./cert/org-certificates/${org_id}/client.pfx`;
            const certificateContent = fs.readFileSync(clientCertPath);
            return certificateContent;
        }
        catch (error) {
            console.error(`Failed to download organization certificate ${error}`);
        }
    }
    downloadRootCertificate() {
        try {
            const clientCertPath = `./cert/ca/ca.crt`;
            const certificateContent = fs.readFileSync(clientCertPath);
            return certificateContent;
        }
        catch (error) {
            console.error(`Failed to download root certificate ${error}`);
        }
    }
    getClientCertificate() {
        try {
            const caCertPath = './cert/ca/ca.crt';
            const clientKeyPath = `./cert/ca/client.key`;
            const clientCertPath = `./cert/ca/client.pem`;
            const caCertContent = fs.readFileSync(caCertPath);
            const clientKeyContent = fs.readFileSync(clientKeyPath);
            const clientCertContent = fs.readFileSync(clientCertPath);
            return {
                "status_code": 200,
                "message": null,
                "data": {
                    ca: caCertContent,
                    key: clientKeyContent,
                    pem: clientCertContent
                }
            };
        }
        catch (error) {
            console.error(`Failed to get client certificates ${error}`);
        }
    }
}
exports.certificateUtlis = certificateUtlis;
//# sourceMappingURL=certificateUtlis.js.map