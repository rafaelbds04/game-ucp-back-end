import { Router } from "express";
import UserController from "./App/controllers/UserController";
import SessionController from "./App/controllers/SessionController";
import PostController from "./App/controllers/PostController";

const routes = Router();


routes.get('/session', SessionController.create); //to add recapcha 
routes.delete('/session', SessionController.delete);

routes.post('/users', UserController.create);//GENERAL to add recapcha 


routes.get('/users', UserController.index); // List of accounts ADMIN
routes.get('/user/:id', UserController.show); //Show account infos  GENERAL - LOGGEDIN PLAYER(Control) - ADMIN 
// routes.get('/user/:id/edit', UserController.edit); //Show edit form for an account
routes.put('/user/:id', UserController.update); //Update an account LOGGEDIN PLAYER(Control) - ADMIN 
routes.delete('/user/:id', UserController.destroy); //Delete an account  ADMIN 

routes.get('/feed', PostController.index) //GENERAL
routes.post('/posts', PostController.create); //ADMIN 
routes.get('/post/:id', PostController.show) // GENERAL
routes.put('/post/:id', PostController.update); //ADMIN
routes.delete('/post/:id', PostController.destroy); //ADMIN
//Todo: comment route

export default routes;