import * as fs from 'fs';
export class authenticationUtlis{
  
    public userLogin(loginDetails:any){
        try{
            const clients = this.readClientsDetail();
            for(let index = 0;index<clients.length;index++){
                if(clients[index].name == loginDetails.name && clients[index].password == loginDetails.password){
                    const allOrganizationSmartLinkNodes = this.readSmartLinksDetail();
                    for(let i = 0;i<allOrganizationSmartLinkNodes.length;i++){
                        if(clients[index].org_id == allOrganizationSmartLinkNodes[i].org_id)
                            return {
                                "status_code": 200,
                                "message": null,
                                "data": JSON.stringify(allOrganizationSmartLinkNodes[i])    
                            }
                    }
                    var clientDetail = {
                        org_id : clients[index].org_id,
                        org_name : clients[index].org_name
                    }
                    return {
                        "status_code": 200,
                        "message": null,
                        "data": JSON.stringify(clientDetail)
                    }
                }
            }
            return {
                "status_code": 200,
                "message": null,
                "data": JSON.stringify("User doesn't exists")
            }
        }
        catch(error){
            console.error(`User login failed ${error}`);
        }
    }

    public getUserDetails(org_id:any){
        try{
            const clients = this.readClientsDetail();
            let clientDetails = "User details is not available";

            clients.find(client => {
                if(org_id == client.org_id)
                    clientDetails = client
            });

            return {
                "status_code": 200,
                "message": null,
                "data": JSON.stringify(clientDetails)
            }
        }
        catch(error){
            console.error(`Failed to fetch user details ${error}`);
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
}