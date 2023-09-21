import { Router,Request,Response } from 'express';
import { authenticationRoute } from './modules/authentication/authenticationRoute';
import { smartLinkRoute} from './modules/smartLink/smartLinkRoute'
import { certificateRoute } from './modules/certificate/certificateRoute';

export class Routes{
    protected basePath: string;
    constructor(NODE_ENV: string) {
        switch (NODE_ENV) {
          case "production":
            this.basePath = "/app/dist";
            break;
          case "development":
            this.basePath = "/app/public";
            break;
        }
      }
    public path() {
        const router = Router();
        router.use("/user",authenticationRoute);
        router.use("/smartlink/certificate",certificateRoute);
        router.use("/smartlink",smartLinkRoute);
        return router;
    }
}