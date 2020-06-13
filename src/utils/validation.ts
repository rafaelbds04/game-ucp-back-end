import * as Joi from '@hapi/joi';
import { join } from '@prisma/client';



function validateUserCreate(data: any) {
    return Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).max(100).required(),
        repeat_password: Joi.ref('password'),
        email: Joi.string().email().required()
    }).validate(data);
}

function validateUser(data: any) {
    return Joi.object({
        username: Joi.string().min(3).max(30),
        password: Joi.string().min(8).max(100),
        repeat_password: Joi.ref('password'),
        email: Joi.string().email(),
        id: Joi.number()
    }).validate(data);
}

function validatePagination(data: any) {
    return Joi.object({
        page: Joi.number(),
        pagesize: Joi.number().max(100)
    }).validate(data);
}



// validateUpdate() => {
//     Joi.object({
//         username: Joi.string().alphanum().min(3).max(30).required(),
//         password: Joi.string().min(8).max(100),
//         repeat_password: Joi.ref('password'),
//         email: Joi.string().email()
//     })
// }

export { validateUserCreate, validateUser, validatePagination } 
