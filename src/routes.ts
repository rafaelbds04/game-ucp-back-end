import { Router } from "express";
import UserController from "./App/controllers/UserController";
import SessionController from "./App/controllers/SessionController";
import PostController from "./App/controllers/PostController";

import { auth } from './App/middlewares/auth';

const routes = Router();


routes.get('/session', SessionController.create); //to add recapcha 
routes.delete('/session', SessionController.delete);

routes.post('/users', UserController.create);//GENERAL to add recapcha 


routes.get('/users', auth("ADMIN"), UserController.index); // List of accounts ADMIN
routes.get('/user/:id', auth("USER"), UserController.show); //Show account infos  GENERAL - LOGGEDIN PLAYER(Control) - ADMIN 
routes.put('/user/:id', auth("USER"), UserController.update); //Update an account LOGGEDIN PLAYER(Control) - ADMIN 
routes.delete('/user/:id', auth("ADMIN"), UserController.destroy); //Delete an account  ADMIN 
//Todo: Recovery route

routes.get('/feed', PostController.index) //GENERAL
routes.post('/posts', auth("ADMIN"), PostController.create); //ADMIN 
routes.get('/post/:id', PostController.show) // GENERAL
routes.put('/post/:id', auth("ADMIN"), PostController.update); //ADMIN
routes.delete('/post/:id', auth("ADMIN"), PostController.destroy); //ADMIN
//Todo: comment route

export default routes;