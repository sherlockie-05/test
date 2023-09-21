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
exports.smartLinkController = void 0;
const smartLinkUtils_1 = require("./smartLinkUtils");
class smartLinkController {
    constructor() {
        this.SmartLinkUtlis = new smartLinkUtils_1.smartLinkUtlis();
        this.healthcheck = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.healthcheck();
                res.send(result);
            }
            catch (error) {
                console.error(`SmartLink creation failed ${error}`);
            }
        };
        this.createSmartLink = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.createSmartLink(req.body.org_id);
                res.send(result);
            }
            catch (error) {
                console.error(`SmartLink creation failed ${error}`);
            }
        };
        this.updateSmartLink = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.updateSmartLink(req.body.org_id, req.body.id, req.body.name);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to update smartlink ${error}`);
            }
        };
        this.deleteSmartLink = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.deleteSmartLink(req.params.id);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to update smartlink ${error}`);
            }
        };
        this.createConnection = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.createConnection(req.body.org_id, req.params.id, req.body.connections);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to create new connection ${error}`);
            }
        };
        this.updateConnection = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.updateConnection(req.body.org_id, req.params.id, req.body.connections);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to update connection ${error}`);
            }
        };
        this.deleteConnection = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.deleteConnection(req.params.id, req.params.conn_id);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to delete connection ${error}`);
            }
        };
        this.downloadNodeConfiguration = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.downloadNodeConfiguration(req.body.org_id, req.body.id);
                const fileName = this.SmartLinkUtlis.nodeConfigurationFileName(req.body.org_id, req.body.id);
                res.setHeader('Content-type', "application/json");
                res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to delete connection ${error}`);
            }
        };
        this.getAllConnections = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.getAllConnections(req.params.id);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to get all connection ${error}`);
            }
        };
        this.getAllSmartLinkNodes = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.getAllSmartLinkNodes(req.query.org_id.toString());
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to get all SmartLink Nodes ${error}`);
            }
        };
        this.getSmartLinkNode = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.getSmartLinkNode(req.params.id.toString());
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to get all SmartLink Nodes ${error}`);
            }
        };
        this.getLatestInstaller = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.getLatestInstaller();
                res.send(result);
            }
            catch (error) {
                console.error(`Can't get latest installer details ${error}`);
            }
        };
        this.getSoftwareDownloadUrl = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SmartLinkUtlis.getSoftwareDownloadUrl();
                res.send(result);
            }
            catch (error) {
                console.error("Failed to get presigned url for installer", error.message);
            }
        });
        this.updateLatestInstaller = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.updateLatestInstaller(req.body.version, req.body.installer_name);
                res.send(result);
            }
            catch (error) {
                console.error(`Can't update latest installer details ${error}`);
            }
        };
        this.getCurrentSoftwareVersionInstalled = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.getCurrentSoftwareVersionInstalled(req.params.id);
                res.send(result);
            }
            catch (error) {
                console.error(`can't fetch current software version installer ${error}`);
            }
        };
        this.updateCurrentSoftwareVersionInstalled = (req, res) => {
            try {
                const result = this.SmartLinkUtlis.updateCurrentSoftwareVersionInstalled(req.body.org_id, req.body.id, req.body.version);
                res.send(result);
            }
            catch (error) {
                console.error(`can't fetch current software version installer ${error}`);
            }
        };
        this.updateStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SmartLinkUtlis.updateStatus(req.body.org_id, req.params.id, req.body.message);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to change node service ${error}`);
            }
        });
        this.checkStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SmartLinkUtlis.checkStatus(req.params.id);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to change node service ${error}`);
            }
        });
        this.notifyUpdateConfiguration = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.SmartLinkUtlis.notifyUpdateConfiguration(req.body);
                res.send(result);
            }
            catch (error) {
                console.error(`Failed to notify update configuration ${error}`);
            }
        });
    }
}
exports.smartLinkController = smartLinkController;
//# sourceMappingURL=smartLinkController.js.map