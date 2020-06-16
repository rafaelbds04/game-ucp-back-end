import { Request as defaultRequest, Response, NextFunction, RequestHandler, request, } from 'express';
import { PrismaClient, userSelect } from '@prisma/client'
import * as jwt from '../security/tokenParser';

export interface AuthRequest extends defaultRequest {
    user?: {
        id: number;
        username: string;
        admin: number;
    }
}

const prisma = new PrismaClient();

export enum Role {
    GUEST = -1,
    USER = 0,
    MODERATOR = 4,
    ADMIN = 5
}


/**
 * This is equivalent to:
 * type RoleStrings = 'GUEST' | 'USER' | 'MODERATOR' | 'ADMIN';
 */
type RoleStrings = keyof typeof Role;

export const auth: (authorized: RoleStrings) => RequestHandler = (authorized) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const authorizedRole = Role[authorized];
        const authorization = req.headers.authorization;

        //if this route is opened and the user isn't logged
        if (!authorization && authorizedRole === Role.GUEST) return next();
        //if this route is private and the user isn't send the authorization header
        if (!authorization) return res.status(401).send({ error: { message: 'No authorization header set' } })

        try {
            const [, token] = authorization?.split(' ')!;
            const payload: any = await jwt.verify(token);

            const result = await prisma.user.findOne({
                where: { id: Number(payload.user) },
                select: { id: true, username: true, admin: true }
            })

            if (!result) { return res.status(401).send({ error: { message: `User not find` } }) }

            const { id, username, admin } = result!;

            if (!(admin! >= authorizedRole)) { return res.status(401).send({ error: { message: `Permission denied. Required role: ${authorized}` } }) }

            req.user = { id, username, admin };

            next();
        } catch (error) {
            return res.send(error);
        }

    }
}

