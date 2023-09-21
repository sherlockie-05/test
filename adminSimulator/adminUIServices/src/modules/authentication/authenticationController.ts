import { Request,Response } from "express";
import { authenticationUtlis } from "./authenticationUtlis";

export class authenticationController{
    private AuthenticationUtlis =  new authenticationUtlis();

    public userLogin = (req:Request,res:Response)=>{
        try{
            const result = this.AuthenticationUtlis.userLogin(req.body);
            res.send(result);
        }
        catch(error){
            console.error("User login failed",error.message);
        }
    };

    public getUserDetails = (req:Request,res:Response)=>{
        try{
            const result = this.AuthenticationUtlis.getUserDetails(req.params.org_id);
            res.send(result);
        }
        catch(error){
            console.error("Failed to fetch user details",error.message);
        }
    }

}