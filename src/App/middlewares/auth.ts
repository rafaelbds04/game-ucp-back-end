import { Request as defaultRequest, Response, NextFunction, RequestHandler, } from 'express';
import { PrismaClient, userSelect } from '@prisma/client'
import * as jwt from '../security/tokenParser';

export interface Request extends defaultRequest {
    user?: any
  }

const prisma = new PrismaClient();

export enum Role {
    GUEST = -1,
    USER = 0,
    ADMIN = 5
}


/**
 * This is equivalent to:
 * type RoleStrings = 'GUEST' | 'USER' | 'ADMIN';
 */
type RoleStrings = keyof typeof Role;

export const auth: (authorized: RoleStrings) => RequestHandler = (authorized) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authorizedRole = Role[authorized];
        const authorization = req.headers.authorization;

        if (!authorization && authorizedRole === Role.GUEST) return next();
        if (!authorization) return res.status(401).send({ error: { message: 'No authorization header set' } })

        try {
            const [, token] = authorization?.split(' ')!;
            const payload: any = await jwt.verify(token);

            const result = await prisma.user.findOne({
                where: { id: Number(payload.user) },
                select: { id: true, username: true, admin: true }
            })

            if(authorizedRole !== result?.admin) { return res.status(401).send({ error: { message: `Permission denied. Required rule: ${authorized}` }}) }

            req.user = result;

            next();
        } catch (error) {
            return res.send(error);
        }

    }
}

