import { execSync } from 'child_process';
import * as fs from 'fs';
import path = require('path');
const { readdir } = require('fs/promises');

export class certificateUtlis{

    public async getCertificate(org_id:string):Promise<genericResponseModel>{
		try{
			const certificateDir = `./cert/org-certificate/${org_id}`;
			const name = 'client.pfx'
			const matchedFiles = [];
			const files = await readdir(certificateDir);

			for (const file of files) {
				const filename = path.parse(file).name;
				if (filename === name) {
					matchedFiles.push(file);
				}
			}

			const certificate = fs.readFileSync(path.join(certificateDir,matchedFiles[0]));
			return {
				"status_code": 200 ,
				"message":null,
				"data": JSON.stringify({
					certificate_format:path.extname(matchedFiles[0]),
					certificate_content: certificate.toString()
				})
			   }
		}
		catch(error){
			console.error(`Failed to get certificate content ${error}`);
		}
	}

	public generateOrganizationCertificate(org_id: string, cert_password: string):genericResponseModel {
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

	public downloadCertificate(org_id:string){
		try{
			const clientCertPath:string = `./cert/org-certificates/${org_id}/client.pfx`;
			const certificateContent = fs.readFileSync(clientCertPath);
			return certificateContent;
		}
		catch(error){
			console.error(`Failed to download organization certificate ${error}`);
		}
	}

	public downloadRootCertificate(){
		try{
			const clientCertPath:string = `./cert/ca/ca.crt`;
			const certificateContent = fs.readFileSync(clientCertPath);
			return certificateContent;
		}
		catch(error){
			console.error(`Failed to download root certificate ${error}`)
		}
	}

	public getClientCertificate():Object{
		try{
			const caCertPath:string = './cert/ca/ca.crt';
			const clientKeyPath:string = `./cert/ca/client.key`;
        	const clientCertPath:string = `./cert/ca/client.pem`;
			const caCertContent = fs.readFileSync(caCertPath);
			const clientKeyContent = fs.readFileSync(clientKeyPath);
			const clientCertContent = fs.readFileSync(clientCertPath);
			return {
				"status_code": 200,
                "message":null,
				"data":{
					ca:caCertContent,
					key:clientKeyContent,
					pem:clientCertContent
				}
			}
		}
		catch(error){
			console.error(`Failed to get client certificates ${error}`)
		}
	}
}