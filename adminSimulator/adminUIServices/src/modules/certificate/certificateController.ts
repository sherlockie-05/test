import { Request, Response } from 'express';
import { certificateUtlis } from './certificateUtlis';
export class certificateController{
    private CertificateUtlis: certificateUtlis = new certificateUtlis();
    
    public getCertificate = async(req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = await this.CertificateUtlis.getCertificate(req.query.org_id.toString());
            res.send(result);
        }
        catch(error){
            console.error(`Failed to get certificate content ${error}`);
        }
    }

    public generateOrganizationCertificate = (req:Request,res:Response)=>{
        try{
            const result:genericResponseModel = this.CertificateUtlis.generateOrganizationCertificate(req.body.org_id,req.body.cert_password);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to generate certificate for organization ${error}`);
        }
    }

    public downloadCertificate = (req:Request,res:Response)=>{
        try{
            const result = this.CertificateUtlis.downloadCertificate(req.params.org_id);
            res.setHeader('Content-type', 'application/x-pkcs12');
            res.setHeader('Content-disposition', `attachment; filename=client.pfx`);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to download certificate ${error}`);
        }
    }

    public downloadRootCertificate = (req:Request,res:Response)=>{
        try{
            const result = this.CertificateUtlis.downloadRootCertificate();
            res.setHeader('Content-type', 'application/x-x509-ca-crt');
            res.setHeader('Content-disposition', `attachment; filename=ca.crt`);
            res.send(result);
        }
        catch(error){
            console.error(`Failed to download certificate ${error}`);
        }
    }

    public getClientCertificate = (req:Request,res:Response)=>{
        try{
            const result:Object = this.CertificateUtlis.getClientCertificate();
            res.send(result);
        }
        catch(error){
            console.error(`Failed to generate certificate for organization ${error}`);
        }
    }
}