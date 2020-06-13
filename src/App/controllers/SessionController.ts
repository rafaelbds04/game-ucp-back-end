import { Request, Response } from 'express';

export default {

    create: (req: Request, resp: Response) => {
        resp.send('Session create end-point')
    },

    delete: (req: Request, resp: Response) => {
        resp.send('Session delete end-point')
    }

} 