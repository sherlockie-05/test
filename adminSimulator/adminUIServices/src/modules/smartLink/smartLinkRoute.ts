import { Router } from "express";
import { smartLinkController } from "./smartLinkController";

const router:Router = Router();
const SmartLinkController:smartLinkController = new smartLinkController();

router.get("/healthcheck",SmartLinkController.healthcheck);
router.get("/installer",SmartLinkController.getLatestInstaller);
router.post("/installer",SmartLinkController.updateLatestInstaller);
router.get("/:id/version",SmartLinkController.getCurrentSoftwareVersionInstalled);
router.put("/version",SmartLinkController.updateCurrentSoftwareVersionInstalled);

router.get("/downloadurl",SmartLinkController.getSoftwareDownloadUrl);
router.post("/downloadconfig",SmartLinkController.downloadNodeConfiguration);

router.put("/:id/status",SmartLinkController.updateStatus)
router.get("/:id/status",SmartLinkController.checkStatus)

router.post("/",SmartLinkController.createSmartLink);
router.put("/",SmartLinkController.updateSmartLink);
router.delete("/:id",SmartLinkController.deleteSmartLink);
router.post("/:id/connection",SmartLinkController.createConnection);
router.put("/:id/connection",SmartLinkController.updateConnection);
router.delete("/:id/connection/:conn_id",SmartLinkController.deleteConnection);
router.get("/:id/connection",SmartLinkController.getAllConnections);
router.get("/",SmartLinkController.getAllSmartLinkNodes);
router.get("/:id/configuration",SmartLinkController.getSmartLinkNode);
router.post("/notify",SmartLinkController.notifyUpdateConfiguration);


export const smartLinkRoute:Router = router;