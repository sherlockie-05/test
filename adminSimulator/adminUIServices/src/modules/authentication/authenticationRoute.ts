import { Router } from "express";
import { authenticationController } from "./authenticationController";

const router: Router = Router();
const AuthenticationController = new authenticationController();

router.post("/login",AuthenticationController.userLogin);
router.get("/details/:org_id",AuthenticationController.getUserDetails);

export const authenticationRoute:Router = router;