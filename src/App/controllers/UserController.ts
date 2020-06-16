import { Request, Response, NextFunction, } from 'express';
import { AuthRequest, Role } from '../middlewares/auth';
import { PrismaClient, userSelect } from '@prisma/client'

import * as jwt from '../security/tokenParser';
import { validateUserCreate, validateUser, validatePagination } from '../../utils/validation';


const prisma = new PrismaClient()


export default {

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password } = req.body;

            //Validate inputed datas
            const { error } = validateUserCreate(req.body);
            if (error) return res.status(400).send({ error: { message: error.details[0] } });

            //Check if this email already used before
            const emailExist = await prisma.user.count({ where: { email } })
            if (emailExist) return res.status(400).send({ error: { message: 'This email already used', type: 'email.exist' } });

            //Check if this username already used before
            const usernameExist = await prisma.user.count({ where: { username } })
            if (usernameExist) return res.status(400).send({ error: { message: 'This username already used', type: 'username.exist' } });

            const result = await prisma.user.create({
                data: {
                    username,
                    email,
                    password
                },
                select: {
                    id: true
                }
            })

            const token = jwt.sign({ user: result.id });

            return res.status(201).send({ message: 'Account created successfully!', result, token })

        } catch (error) {
            next(error);
        }


    },



    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, pagesize = 10 } = req.params;

            //Validade inputed values in query params
            const { error } = validatePagination(req.query);
            if (error) return res.status(400).send({ error: { message: error.details[0] } });

            const pagination = {
                page: Number(page),
                pagesize: Number(pagesize)
            }

            //Make a prisma request
            const result = await prisma.user.findMany({
                take: pagination.pagesize,
                skip: (pagination.page - 1) * pagination.pagesize,
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            });

            //Count total of data
            const count = await prisma.user.count();
            res.header('X-Total-Count', [`${count}`])

            return res.status(200).send(result);
        } catch (error) {
            next(error)
        }
    },

    //Update corrent account informations
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            //Validade inputed values in query params
            const { error } = validateUser({ ...req.params, ...req.body });
            if (error) return res.status(400).send({ error: { message: error.details[0] } });

            const userExist = await prisma.user.count({ where: { id: Number(id) } })
            if (!userExist) return res.status(500).send({ error: { message: 'This user does not exist.', type: 'record.not.exist' } });

            const result = await prisma.user.update({
                where: {
                    id: Number(id)
                },
                data: {
                    ...req.body
                },
                select: {
                    id: true
                }
            })

            return res.send(result)
        } catch (error) {
            next(error)
        }


    },

    async show(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            //Check if requested user is a logged user and if is an admin.
            let isRequestingUser: boolean = (<any>req).user.id === Number(id) ? true : false;
            let hasRoleToAcess: boolean = (<any>req).user.admin >= Role.ADMIN ? true : false

            //Validade inputed values in query params
            const { error } = validateUser(req.params);
            if (error) return res.status(400).send({ error: { message: error.details[0] } });

            const userExist = await prisma.user.count({ where: { id: Number(id) } })
            if (!userExist) return res.status(404).send({ error: { message: 'This user does not exist.', type: 'record.not.exist' } });

            let select: userSelect = {
                id: true,
                username: true,
                kills: true,
                deaths: true,
                wonedDuels: true,
                lostDuels: true,
                skin: true,
                level: true
            }

            select = isRequestingUser || hasRoleToAcess ? { ...select, money: true, Donacion: true, email: true, vip: true, isBanned: true } : select

            const result = await prisma.user.findOne({
                where: {
                    id: Number(id)
                },
                select
            })

            return res.send(result);
        } catch (error) {
            next(error);
        }
    },

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const { error } = validateUser(req.params);
            if (error) return res.status(400).send({ error: { message: error.details[0] } });

            const userExist = await prisma.user.count({ where: { id: Number(id) } })
            if (!userExist) return res.status(500).send({ error: { message: 'This user to delete does not exist.', type: 'record.not.exist' } });

            const result = await prisma.user.delete({ where: { id: Number(id) } })


            return res.send(result);

        } catch (error) {
            next(error);
        }
    }

}