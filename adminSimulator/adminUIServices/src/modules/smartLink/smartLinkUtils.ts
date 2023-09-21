import { Request,Response } from 'express';
import * as fs from 'fs';
import { Aws } from "../../helper/aws";
import { dicomModel, smartLinkModel } from '../../type/smartLinkModel';
import { v4 as uuidv4 } from 'uuid';
import { Organizations } from 'aws-sdk';
import path = require('path');
import { AxiosInstance } from 'axios';
import { execSync } from 'child_process';
const axios = require('axios');
const https = require('https');

export class smartLinkUtlis{

    public healthcheck():genericResponseModel{
        try{
            return {
                "status_code": 200,
                "message": "success",
                "data":null
              };
        }
        catch(error){
            console.error(`Failed to check health ${error}`);
        }
    }

    public createSmartLink(org_id:string):genericResponseModel{
        try{
            const clients = this.readClientsDetail();
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let name:string = "";
            let uuid:string = uuidv4();
            let writeResponse:boolean = false;
            let clientCount:number = 0;
            let allSmartLinkDetailCount:number = 0;
            for(var client of clients){
                clientCount++;
                if(org_id == client.org_id){
                    const org = client.org_name.slice(0,3);
                    const timeStamp = JSON.parse(JSON.stringify(new Date()));
                    const dateTime = timeStamp.split('T');
                    const time = dateTime[1];
                    const timeComponents = time.split(':');
                    const minutes = timeComponents[1];
                    const secondsAndMilliseconds = timeComponents[2].split('.');
                    const seconds = secondsAndMilliseconds[0];
                    const milliseconds = secondsAndMilliseconds[1].slice(0,3);
                    name = `EXOLINK-${minutes}${seconds}${milliseconds}`;
                    for(var OrganizationSmartLinkNodes of allOrganizationSmartLinkNodes){
                        //allOrganizationSmartLinkNodes represents all org's smartlink nodes
                        //OrganizationSmartLinkNodes represents particular org's smartlink nodes
                        allSmartLinkDetailCount++;
                        if(org_id == OrganizationSmartLinkNodes.org_id){
                            const smartLink:smartLinkModel = {
                                id: uuid,
                                name: name,
                                status: "",
                                version: "",
                                last_status_updated: "",
                                connections: {
                                    dicom: []
                                },
                                last_updated: timeStamp
                            };
                            OrganizationSmartLinkNodes.smartLink.push(smartLink);
                            writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                            if(writeResponse)
                                return {
                                    "status_code": 200,
                                    "message":null,
                                    "data":JSON.stringify({
                                        name:name,
                                        id:uuid
                                    })
                                }; 
                        }
                    };
                    if(allSmartLinkDetailCount == allOrganizationSmartLinkNodes.length){
                        const smartLink:smartLinkModel = {
                            id: uuid,
                            name: name,
                            status: "",
                            version: "",
                            last_status_updated: "",
                            connections: {
                                dicom: []
                            },
                            last_updated: timeStamp
                        };
                        allOrganizationSmartLinkNodes.push({org_id:client.org_id,org_name:client.org_name,smartLink:[smartLink]})
                        writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                        if(writeResponse)
                            return {
                                "status_code": 200,
                                "message":null,
                                "data": JSON.stringify({
                                    name:name,
                                    id:uuid
                                })
                            }; 
                    }
                }
            };
            if(clientCount == clients.length){
                console.log(`Client details unavailable`);
            }
        }
        catch(error){
            console.error(`SmartLink creation failed ${error}`);
        }
    }


    public updateSmartLink(org_id:string,id:string,name:string):genericResponseModel{
        try{
            let writeResponse:boolean = false;
            const clients = this.readClientsDetail();
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            clients.find((client)=>{
                if(org_id == client.org_id){
                    allOrganizationSmartLinkNodes.find((organizationSmartLinkNodes)=>{
                        organizationSmartLinkNodes.smartLink.find((smartLink:smartLinkModel)=>{
                            if(id == smartLink.id){
                                smartLink.name = name;
                                smartLink.last_updated = JSON.parse(JSON.stringify(new Date()));
                                writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);  
                                console.log(`Is SmartLink updated in json ${writeResponse}`);                                  
                            }
                        })
                    })
                }
            })

            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":null,
                    "data":null
                };
        }
        catch(error){
            console.error(`Failed to update SmartLink ${error}`);
        }
    }


    public deleteSmartLink(id:string):genericResponseModel{
        try{
            const clients = this.readClientsDetail();
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let writeResponse:boolean = false;
            allOrganizationSmartLinkNodes.find((organizationSmartLinkNodes)=>{
                    let index = organizationSmartLinkNodes.smartLink.findIndex(smartLink => smartLink.id == id);
                    organizationSmartLinkNodes.smartLink.splice(index,1);
                    writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                    console.log(`Is delete smartlink updated in json ${writeResponse}`);     
            })
        
            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":null,
                    "data":null
                };
        }
        catch(error){
            console.error(`Failed to delete SmartLink ${error}`)
        }
    }


    public createConnection(org_id:string,id:string,connections):genericResponseModel{ 
        try{
            const clients = this.readClientsDetail();
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let writeResponse:boolean = false;
            let smartLinkName:string;
            const connectionId = uuidv4();
            clients.find((client)=>{
                if(org_id == client.org_id){
                    allOrganizationSmartLinkNodes.find((organizationSmartLinkNodes)=>{
                        organizationSmartLinkNodes.smartLink.find((smartLink)=>{
                            if(id == smartLink.id){
                                smartLinkName = smartLink.name;
                                smartLink.connections.dicom.push({"conn_id": connectionId,...connections.dicom[0]});
                                smartLink.last_updated = JSON.parse(JSON.stringify(new Date()));
                                writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                                console.log(`Is new connection updated in json ${writeResponse}`);     
                            }
                        })
                    })
                }
            })

            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":"",
                    "data":JSON.stringify({
                        dicom:[
                            JSON.stringify({
                                name:smartLinkName,
                                conn_id: connectionId
                            })
                        ]
                    })
                };
        }
        catch(error){
            console.error(`Failed to create new connection ${error}`);
        }
    }


    public updateConnection(org_id:string,id:string,connections):genericResponseModel{
        try{
            const clients = this.readClientsDetail();
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let writeResponse:boolean = false;
            let last_updated = JSON.parse(JSON.stringify(new Date()));
            clients.find((client)=>{
                if(org_id == client.org_id){
                    allOrganizationSmartLinkNodes.find((organizationSmartLinkNodes)=>{
                        organizationSmartLinkNodes.smartLink.find((smartLink)=>{
                            if(id == smartLink.id){
                                
                                for(let index =0;index<connections.dicom.length;index++){
                                    let dicomExists = false;
                                    for(let dicomIndex =0;dicomIndex<smartLink.connections.dicom.length;dicomIndex++){
                                        if(connections.dicom[index].conn_id == smartLink.connections.dicom[dicomIndex].conn_id){
                                            smartLink.connections.dicom[dicomIndex]=connections.dicom[index];
                                            dicomExists = true;
                                        }
                                    }
                                    if(dicomExists == false){
                                        // const uuid:string = uuidv4();
                                        // connections.dicom[index].conn_id = uuid;
                                        smartLink.connections.dicom.push(connections.dicom[index])
                                    }
                                }
                                smartLink.last_updated = last_updated;
                                writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                                console.log(`Is connection updated in json ${writeResponse}`);     
                            }
                        })
                    })
                }
            })

            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":null,
                    "data":JSON.stringify({
                        id:id,
                        org_id:org_id,
                        last_updated:last_updated
                    })
                };
        }
        catch(error){
            console.error(`Failed to update connection ${error}`);
        }
    }


    public deleteConnection(id:string,conn_id:string):genericResponseModel{
        try{
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let writeResponse:boolean = false;
            allOrganizationSmartLinkNodes.find((organizationSmartLinkNodes)=>{
                organizationSmartLinkNodes.smartLink.find((smartLink)=>{
                    if(id == smartLink.id){
                        const dicomConnection : [dicomModel] = smartLink.connections.dicom.filter(dicom=>dicom.conn_id != conn_id);
                        smartLink.connections.dicom = dicomConnection;
                        smartLink.last_updated = JSON.parse(JSON.stringify(new Date()));
                        writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                        console.log(`Is delete connection updated in json ${writeResponse}`);     
                    }
                })
            })
            
            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":null,
                    "data":null
                };
        }
        catch(error){
            console.error(`Failed to delete connection ${error}`);
        }
    }

    public downloadNodeConfiguration(org_id:string,id:string){
        try{
            const clients = this.readClientsDetail();
            let nodeConfiguration;
            clients.find((client)=>{
                if(org_id == client.org_id){
                    const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
                    allOrganizationSmartLinkNodes.find((organizationSmartLink)=>{
                        if(org_id == organizationSmartLink.org_id){
                            organizationSmartLink.smartLink.find((smartLink)=>{
                                if(id == smartLink.id){
                                    let linkDetail = this.readLinkDetail();
                                    const clientCert:string = this.getClientCertContent(org_id);
                                    const rootCert:string = this.getRootCertificate();
                                    nodeConfiguration={
                                        smartlink:{
                                            id: smartLink.id,
                                            name : smartLink.name,
                                            org_name: organizationSmartLink.org_name,
                                            org_id: organizationSmartLink.org_id,
                                            server_message_link : linkDetail.server_message_link,
                                            api_link : linkDetail.api_link,
                                            last_updated: smartLink.last_updated
                                        },
                                        connections:{
                                            dicom:smartLink.connections.dicom
                                        },
                                        certificate:{
                                            client: clientCert,
                                            root: rootCert
                                        }
                                    };
                                }
                            })
                        }
                    })
                }
            })
            return nodeConfiguration;
        }
        catch(error){
            console.error("Failed to download node connfiguration details",error.message);
        }
    }

    public nodeConfigurationFileName(org_id:string,id:string){
        try{
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let smartLinkName;
            let org_name;
            allOrganizationSmartLinkNodes.find((organizationSmartLink)=>{
                if(org_id == organizationSmartLink.org_id){
                    organizationSmartLink.smartLink.find((smartLink)=>{
                        if(id == organizationSmartLink.id){
                            smartLinkName = smartLink.name;
                            org_name = organizationSmartLink.org_name;
                        }
                    })
                }
            })
            return `${smartLinkName}_${org_name}.json`;
        }
        catch(error){
            console.error("Failed to fetche smartlink details",error.message);
        }
    }

    public getAllConnections(id:string):genericResponseModel{
        try{
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let allConnections;
            allOrganizationSmartLinkNodes.forEach(organizationSmartLinkNodes => {
                organizationSmartLinkNodes.smartLink.forEach((smartLink)=>{
                    if(id == smartLink.id){
                        allConnections = {
                            id:smartLink.id,
                            connections:smartLink.connections
                        }
                    }
                })
            });
            return {
                "status_code":200,
                "message":null,
                "data":JSON.stringify(allConnections)
            }
        }
        catch(error){
            console.error(`Failed to get all connection ${error}`);
        }
    }


    public getAllSmartLinkNodes(org_id:string){
        try{
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let allSmartLinkNodes = [];
            allOrganizationSmartLinkNodes.forEach((organizationSmartLinkNodes)=>{
                if(org_id == organizationSmartLinkNodes.org_id){
                    organizationSmartLinkNodes.smartLink.forEach((smartLink)=>{
                        let smartLinkNode ={
                            id: smartLink.id,
                            org_id: organizationSmartLinkNodes.org_id,
                            name: smartLink.name
                        }
                        allSmartLinkNodes.push(smartLinkNode);
                    })
                }
            })
            return allSmartLinkNodes;
        }  
        catch(error){
            console.error(`Failed to get all SmartLink nodes ${error}`);
        }
    }


    public getSmartLinkNode(id:string):genericResponseModel{
        try{
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let smartLinkDetail;
            let connections;
            allOrganizationSmartLinkNodes.forEach((organizationSmartLinkNodes)=>{
                    organizationSmartLinkNodes.smartLink.find((smartLink)=>{
                        if(id == smartLink.id){
                            let linkDetail = this.readLinkDetail();
                            smartLinkDetail = {
                                id: smartLink.id,
                                name: smartLink.name,
                                org_id: organizationSmartLinkNodes.org_id,
                                org_name: organizationSmartLinkNodes.org_name,
                                api_link: linkDetail.ApiLink,
                                server_message_link: linkDetail.CloudLink,
                                last_updated: smartLink.last_updated
                            }
                            connections = {
                                dicom: smartLink.connections.dicom
                            }
                        }
                    })
            })
            return {
                "status_code": 200,
                "message":null,
                "data": JSON.stringify({
                    smartlink: smartLinkDetail,
                    connections: connections
                })
            }
        }  
        catch(error){
            console.error(`Failed to get all SmartLink nodes ${error}`);
        }
    }



    public getLatestInstaller():genericResponseModel{
        try{
            const latestInstaller:installerModel = this.readLatestInstaller();
            return {
                "status_code": 200,
                "message":null,
                "data":JSON.stringify(latestInstaller)
            }
        }
        catch(error){
            console.error(`Failed to fetch latest installer details ${error}`);
        }
    }

    public async getSoftwareDownloadUrl(){
        try{
            const latestInstaller:installerModel = this.readLatestInstaller();
            const keyString = `smartlink_installers/${latestInstaller.installer_name}`;
            const result = await Aws.getUrlFromS3(keyString);
            return {
                "status_code": 200,
                "message": null,
                "data": JSON.stringify({url: result})
            }
        }
        catch(error){
            console.error("Failed to get presigned url for installer",error.message);
        }
    }

    public updateLatestInstaller(version:string,installer_name:string):genericResponseModel{
        try{
            const latestInstaller:installerModel = this.readLatestInstaller();
            latestInstaller.version = version;
            latestInstaller.installer_name = installer_name;
            const writeResponse:boolean = this.writeLatestInstaller(latestInstaller);
            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":null,
                    "data":null
                };
        }
        catch(error){
            console.error(`Failed to update latest installer details ${error}`);
        }
    }

    public getCurrentSoftwareVersionInstalled(id:string):genericResponseModel{
        try{
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let response;
            allOrganizationSmartLinkNodes.forEach((organizationSmartLink)=>{
                organizationSmartLink.smartLink.find((smartLink)=>{
                    if(id == smartLink.id){
                        response = {
                            "id":smartLink.id,
                            "org_id":organizationSmartLink.org_id,
                            "version":smartLink.version
                        }
                    }
                })
            })
            return {
                "status_code":200,
                "message":null,
                "data": JSON.stringify(response)
               }
               
        }
        catch(error){
            console.error(`can't fetch current software version installer ${error}`);
        }
    }

    public updateCurrentSoftwareVersionInstalled(org_id:string,id:string,version:string):genericResponseModel{
        try{
            const clients = this.readClientsDetail();
            let writeResponse:boolean = false;
            clients.find((client)=>{
                if(org_id == client.org_id){
                    const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
                    allOrganizationSmartLinkNodes.find((organizationSmartLink)=>{
                        organizationSmartLink.smartLink.find((smartLink:smartLinkModel)=>{
                            if(id == smartLink.id){
                                smartLink.version = version;
                                smartLink.last_updated = JSON.parse(JSON.stringify(new Date()));
                                writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                            }
                        })
                    })
                }
            })
            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":null,
                    "data":null
                };
        }
        catch(error){
            console.error(`can't update current software version installer ${error}`);
        }
    }

    public async updateStatus(org_id:string,id:string,message:string):Promise<genericResponseModel>{
        try{
            const clients = this.readClientsDetail();
            let writeResponse:boolean = false;
            const last_status_updated = JSON.parse(JSON.stringify(new Date()));
            clients.find((client)=>{
                if(org_id == client.org_id){
                    const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
                    allOrganizationSmartLinkNodes.find((organizationSmartLink)=>{
                        organizationSmartLink.smartLink.find((smartLink:smartLinkModel)=>{
                            if(id == smartLink.id){
                                smartLink.status = message;
                                smartLink.last_status_updated = last_status_updated;
                                writeResponse = this.writeSmartLinksDetail(allOrganizationSmartLinkNodes);
                            }
                        })
                    })
                }
            })
            if(writeResponse)
                return {
                    "status_code": 200,
                    "message":null,
                    "data":JSON.stringify({
                        id:id,
                        org_id:org_id,
                        last_status_updated:last_status_updated
                    })
                };                
        }
        catch(error){
            console.error(`Failed to ${message} node service ${error}`)
        }
    }

    public async checkStatus(id:string){
        try{
            const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
            let status;
            let last_status_updated;
            allOrganizationSmartLinkNodes.forEach((organizationSmartLinkNodes)=>{
                    organizationSmartLinkNodes.smartLink.find((smartLink)=>{
                        if(id == smartLink.id){
                            status = smartLink.status;
                            last_status_updated = smartLink.last_status_updated;
                        }
                    })
            })
            return {
                "status_code": 200,
                "message":null,
                "data":JSON.stringify({id:id,status:status,last_status_updated:last_status_updated})
            }
        }
        catch(error){
            console.error(`Failed to node service ${error}`)
        }
    }

    public async notifyUpdateConfiguration(requestData){
        try{
            const notifySmartLinkResponse = await this.notifySmartLink(requestData);
            return notifySmartLinkResponse;
        }
        catch(error){
            console.error(`Failed to notify update configuration ${error}`);
        }
    }

    private async notifySmartLink(requestData){
        try{
            const axiosInstance:AxiosInstance = this.axiosInstance();
            let response:genericResponseModel = 
                await axiosInstance.post(process.env.EXO_MICROSERVICE_URL + "notify",requestData)
                    .then(response=>{
                        return response.data;
                    })
                    .catch(error=>{
                        console.error(`Failed to connect EXO Microservice ${error}`);
                    });
            return response;
        }
        catch(error){
            console.error(`Failed to notify update configuration ${error}`);
        }
    }

    private axiosInstance ():AxiosInstance{
        try{
            const ca = fs.readFileSync(path.join(__dirname, "..", "..", "..", "cert", "ca", "ca.crt"));
            const cert = fs.readFileSync(path.join(__dirname, "..", "..", "..", "cert", "ca", "client.pem"));
            const key = fs.readFileSync(path.join(__dirname, "..", "..", "..", "cert", "ca", "client.key"));

            const agent = new https.Agent({
                cert: cert,
                key: key,
                ca:ca,
                rejectUnauthorized: true,
                checkServerIdentity: (host, cert) => { }  //certificate validation call back
            });

            const axiosInstance = axios.create({
                httpsAgent: agent
            });

            return axiosInstance;
        }
        catch(error){
            console.error(`Failed to configure HTTPS axios request ${error}`);
        }
    }

    private readClientsDetail(){
        try{
            const clientsDetailFile = fs.readFileSync("./data/client.json");
            const clientsDetail = JSON.parse(clientsDetailFile.toString());
            return clientsDetail;
        }
        catch(error){
            console.error(`Failed to read clients detail ${error}`);
        }
    }

    private readLinkDetail(){
        try{
            const clientsDetailFile = fs.readFileSync("./data/linkdetail.json");
            const clientsDetail = JSON.parse(clientsDetailFile.toString());
            return clientsDetail;
        }
        catch(error){
            console.error(`Failed to read link detail ${error}`);
        }
    }


    private readSmartLinksDetail(){
        try{
            const smartlinksDetailFile = fs.readFileSync("./data/smartlink.json");
            const smartlinksDetail = JSON.parse(smartlinksDetailFile.toString());
            return smartlinksDetail;
        }
        catch(error){
            console.error(`Failed to read smartLinks detail ${error}`)
        }
    }


    private writeSmartLinksDetail(smartlinkDetails:[smartLinkModel]){
        try{
            fs.writeFileSync('./data/smartlink.json',JSON.stringify(smartlinkDetails,null,2));
            return true;
        }
        catch(error){
            console.error(`Failed to write smartLinks detail ${error}`)
        }
    }

    private readLatestInstaller():installerModel{
        try{
            const lastestInstallerFile = fs.readFileSync("./data/latestinstaller.json");
            const latestInstaller:installerModel = JSON.parse(lastestInstallerFile.toString());
            return latestInstaller;
        }
        catch(error){
            console.error(`Failed to read latest installer detail ${error}`)
        }
    }

    private writeLatestInstaller(latestInstaller:installerModel){
        try{
            fs.writeFileSync('./data/latestinstaller.json',JSON.stringify(latestInstaller,null,2));
            return true;
        }
        catch(error){
            console.error(`Failed to write smartLinks detail ${error}`)
        }
    }

    private generateOrganizationCertificate(org_id: string, cert_password: string):genericResponseModel {
        const caKeyPath:string = './cert/ca/ca.key';
        const caCertPath:string = './cert/ca/ca.crt';
        const clientDir:string = `./cert/org-certificates/${org_id}`;
        const clientKeyPath:string = `./cert/org-certificates/${org_id}/client.key`;
        const clientCertPath:string = `./cert/org-certificates/${org_id}/client.crt`;
        const clientPfxCertPath:string = `./cert/org-certificates/${org_id}/client.pfx`;
    
        if (!fs.existsSync(clientDir)) {
          	fs.mkdirSync(clientDir);
        }
    
        try {
          // Generate client private key and CSR
			const command = `openssl req -newkey rsa:2048 -nodes -keyout ${clientKeyPath} -out ${clientDir}/client.csr -subj "/CN=${org_id}"`
			execSync(command);
		
			// Sign client certificate using the CA key and certificate
			const signCommand = `openssl x509 -req -in ${clientDir}/client.csr -CA ${caCertPath} -CAkey ${caKeyPath} -CAcreateserial -out ${clientCertPath} -passin pass:${cert_password} -days 365`;
			execSync(signCommand);

			const pfxCommand = `openssl pkcs12 -export -out ${clientPfxCertPath} -inkey ${clientKeyPath} -in ${clientCertPath} -passout pass:${cert_password}`;
			execSync(pfxCommand);
			
			console.log(`Client certificate generated successfully for ${org_id}.`);

			return {
				"status_code":200,
				"message": null,
				"data":null
			};

        } catch (error) {
          console.error(`Failed to generate client certificate for ${org_id}:`, error.message);
        }
	}

    private getClientCertContent(org_id:string):string{
        try{
            const clientCertPath:string = `./cert/org-certificates/${org_id}/client.pfx`;
            const clientDir:string = `./cert/org-certificates/${org_id}`;
            if (!fs.existsSync(clientDir)) {
                console.log(`Certificate doesn't exists for client ${org_id}`);
                const certPassword = `EX0-${org_id.substring(org_id.length - 4)}`;
                this.generateOrganizationCertificate(org_id,certPassword)
            }

            const clientCert = fs.readFileSync(clientCertPath);
            const clientCertBase64 = clientCert.toString('base64');
            return clientCertBase64;
        }
        catch(error){
            console.error(`Failed to read client cert content ${error}`);
        }
    }

    private getRootCertificate():string{
		try{
			const rootCertPath:string = `./cert/ca/ca.crt`;
            const rootCertContent = fs.readFileSync(rootCertPath);
            const rootCertBase64 = rootCertContent.toString('base64');
			return rootCertBase64;
		}
		catch(error){
			console.error(`Failed to read root certificate content ${error}`)
		}
	}
}