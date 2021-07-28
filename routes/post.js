const Router = require("express").Router();
const postControllers = require("../controllers/post.controllers");

Router.post("/create",postControllers.create_post);

module.exports = Router;