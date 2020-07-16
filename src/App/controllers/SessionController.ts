import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'

import * as jwt from '../security/tokenParser';
import { validateUser } from '../../utils/validation';

const prisma = new PrismaClient();

export default {

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const [hashType, hash] = req.headers.authorization?.split(' ')!;
            const [username, password ] = Buffer.from(hash, 'base64').toString().split(':')

            //Validade inputed values
            const { error } = validateUser({ username, password });
            if (error) return res.status(400).send({ error: { message: error.details[0] } });

            const userExist = await prisma.user.count({ where: { username } })
            if (!userExist) return res.status(500).send({ error: { message: 'This user does not exist.', type: 'user.not.exist' } });

            const result = await prisma.user.findOne({
                where: {
                    username
                },
                select: {
                    id: true,
                    password: true,
                    username: true,
                    kills: true,
                    deaths: true,
                    wonedDuels: true,
                    lostDuels: true,
                    skin: true,
                    level: true
                }
            })

            if (!result) return res.status(401).send({ error: { message: 'Unauthorized' } });

            const { password: validPassword, ...userAccount } = result;

            if (!(password === validPassword)) return res.status(401).send({ error: { message: 'Unauthorized', type: 'user.not.match' } });

            const token = jwt.sign({ user: result.id })

            res.send({ user: userAccount, token });

        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, resp: Response, next: NextFunction) => {
        resp.send('Session delete end-point')
    }

} 