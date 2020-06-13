import { environment } from '../utils/environment';
import express, { Request, Response, RequestHandler, NextFunction } from 'express';
import routes from '../routes';

const app = express();


export default () => {

    //TODO: Add cors
    app.use(express.json());
    app.use('/app', routes);

    //Cath all
    app.use((error: any, req: Request, resp: Response, next: NextFunction) => {
        resp.status(error.status || 500);
        resp.json( { error: { message: error.message } });
    })

    app.listen(environment.server.port)
    console.log(`Server is running on port: ${environment.server.port}`)

}
