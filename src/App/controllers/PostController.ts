import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default {

    async create(req: Request, resp: Response, next: NextFunction) {
        try {
            const { user_id, title, content, titleImage = '' } = req.body;

            const result = await prisma.post.create(
                {
                    data: {
                        content,
                        title,
                        titleImage,
                        user: {
                            connect: {
                                id: user_id
                            }
                        }
                    }
                }
            )

            resp.status(201).send(result);

        } catch (error) {
            next(error);
        }

    },

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1 } = req.query;

            const result = await prisma.post.findMany({
                take: 10,
                skip: (<number>page - 1) * 10,
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return res.send(result);
        } catch (error) {
            next(error);
        }
    },

    async update(req: Request, res: Response, next: NextFunction) {
        
        try {
            const { id } = req.params
            const { user_id, title, content, titleImage = '' } = req.body;

            const postExist = await prisma.post.count({ where: { id: Number(id) } })
            if (!postExist) return res.status(404).send({ error: { message: 'This post to update does not exist.', type: 'record.not.exist' } });

            const result = await prisma.post.update({
                where: {
                    id: Number(id)
                },
                data: {
                    content,
                    title,
                    titleImage,
                    user: {
                        connect: {
                            id: user_id
                        }
                    }
                }

            })

            return res.send(result);

        } catch (error) {
            next(error)
        }
    },

    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const postExist = await prisma.post.count({ where: { id: Number(id) } })
            if (!postExist) return res.status(404).send({ error: { message: 'This post does not exist.', type: 'record.not.exist' } });

            const result = await prisma.post.findOne({
                where: {
                    id: Number(id)
                }
            })
            

            return res.send(result);
        } catch (error) {
            next(error);
        }
    },

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const postExist = await prisma.post.count({ where: { id: Number(id) } })
            if (!postExist) return res.status(404).send({ error: { message: 'This post to delete does not exist.', type: 'record.not.exist' } });

            const result = await prisma.post.delete({ where: { id: Number(id) }})

            return res.send(result);

        } catch (error) {
            next(error);
        }
    }

}