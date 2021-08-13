const Router = require("express").Router();
const postControllers = require("../controllers/post.controllers");

Router.post("/create",postControllers.create_post);
Router.delete("/delete-post",postControllers.delete_post)
Router.get("/get-feed",postControllers.get_feed);
Router.get("/get-post",postControllers.get_each_post)
module.exports = Router;