import {Router} from 'express';
import { certificateController } from './certificateController';

const router:Router = Router();
const CertificateController: certificateController = new certificateController();

router.get("/",CertificateController.getCertificate);
router.get("/client",CertificateController.getClientCertificate);
router.post("/",CertificateController.generateOrganizationCertificate);
router.get("/root",CertificateController.downloadRootCertificate);
router.get("/:org_id",CertificateController.downloadCertificate);

export const certificateRoute:Router = router;