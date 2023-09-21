import { Request,Response } from "express";
import { smartLinkUtlis } from "./smartLinkUtils";

export class smartLinkController{
    private SmartLinkUtlis: smartLinkUtlis = new smartLinkUtlis();

    public healthcheck = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.healthcheck();
            res.send(result);
        }
        catch(error){
            console.error(`SmartLink creation failed ${error}`);
        }
    }
    public createSmartLink = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.createSmartLink(req.body.org_id);
            res.send(result);
        }
        catch(error){
            console.error(`SmartLink creation failed ${error}`);
        }
    }

    public updateSmartLink = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel =  this.SmartLinkUtlis.updateSmartLink(req.body.org_id,req.body.id,req.body.name);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to update smartlink ${error}`);
        }
    }

    public deleteSmartLink = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel =  this.SmartLinkUtlis.deleteSmartLink(req.params.id);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to update smartlink ${error}`);
        }
    }

    public createConnection = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.createConnection(req.body.org_id,req.params.id,req.body.connections);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to create new connection ${error}`);
        }
    }

    public updateConnection = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.updateConnection(req.body.org_id,req.params.id,req.body.connections);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to update connection ${error}`);
        }
    }

    public deleteConnection = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.deleteConnection(req.params.id,req.params.conn_id);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to delete connection ${error}`);
        }
    }

    public downloadNodeConfiguration = (req:Request,res:Response)=>{
        try{
            const result = this.SmartLinkUtlis.downloadNodeConfiguration(req.body.org_id,req.body.id);
            const fileName = this.SmartLinkUtlis.nodeConfigurationFileName(req.body.org_id,req.body.id);
            res.setHeader('Content-type', "application/json");
            res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to delete connection ${error}`);
        }
    }

    public getAllConnections = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.getAllConnections(req.params.id);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to get all connection ${error}`);
        }
    }

    public getAllSmartLinkNodes = (req:Request,res:Response)=>{
        try{
            const result = this.SmartLinkUtlis.getAllSmartLinkNodes(req.query.org_id.toString());
            res.send(result);
        }
        catch(error){
            console.error(`Failed to get all SmartLink Nodes ${error}`);
        }
    }
    public getSmartLinkNode = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.getSmartLinkNode(req.params.id.toString());
            res.send(result);
        }
        catch(error){
            console.error(`Failed to get all SmartLink Nodes ${error}`);
        }
    }

    public getLatestInstaller = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.getLatestInstaller();
            res.send(result);
        }
        catch(error){
            console.error(`Can't get latest installer details ${error}`);
        }
    }

    public getSoftwareDownloadUrl = async(req:Request,res:Response)=>{
        try{
            const result = await this.SmartLinkUtlis.getSoftwareDownloadUrl();
            res.send(result);
        }
        catch(error){
            console.error("Failed to get presigned url for installer",error.message);
        }
    }

    public updateLatestInstaller =  (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.updateLatestInstaller(req.body.version,req.body.installer_name);
            res.send(result);
        }
        catch(error){
            console.error(`Can't update latest installer details ${error}`);
        }
    }

    public getCurrentSoftwareVersionInstalled = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.getCurrentSoftwareVersionInstalled(req.params.id);
            res.send(result);
        }
        catch(error){
            console.error(`can't fetch current software version installer ${error}`);
        }
    }

    public updateCurrentSoftwareVersionInstalled = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.SmartLinkUtlis.updateCurrentSoftwareVersionInstalled(req.body.org_id,req.body.id,req.body.version);
            res.send(result);
        }
        catch(error){
            console.error(`can't fetch current software version installer ${error}`);
        }
    }

    public updateStatus =async (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = await this.SmartLinkUtlis.updateStatus(req.body.org_id,req.params.id,req.body.message);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to change node service ${error}`)
        }
    }

    public checkStatus =async (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = await this.SmartLinkUtlis.checkStatus(req.params.id);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to change node service ${error}`)
        }
    }

    public notifyUpdateConfiguration = async (req:Request,res:Response)=>{
        try{
            const result = await this.SmartLinkUtlis.notifyUpdateConfiguration(req.body);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to notify update configuration ${error}`)
        }
    }
}