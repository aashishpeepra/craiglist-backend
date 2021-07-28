const httpError = require("../models/http-error");
const Post = require("../models/post.model");
const crypto = require("crypto");
const {find_element} =  require("../helpers/findElement");
exports.create_post  = async (req,res,next)=>{
    const {title,pincode,city,description,extra,postType,coords,product,email,reachEmail,hasNumber,hasLocation,price,section,subSection} = req.body;
    const PostObject = {
        title,
        pincode,
        city,
        description,
        extra,
        postType,
        coords,
        product,
        email,
        reachEmail,
        hasNumber,
        hasLocation,
        price,
        section,
        subSection

    }
    if(hasLocation)
        PostObject["location"] = req.location;
    if(hasNumber)
        PostObject["phone"] = req.phone
    PostObject["deleteCode"] = crypto.randomBytes(32).toString("hex");
    PostObject["maskedEmail"] = crypto.randomBytes(16).toString("hex");
    const newPost = Post({
        PostObject
    })
    try{
        await newPost.save();
    }catch(err){
        return next(new httpError(err,"while trying to create a new post",500));
    }

    res.status(200).json({status:"ok",data:PostObject});
}

exports.delete_post = async (req,res,next)=>{
    const {id,deleteCode,email} = req.query;
    let selectedPost = find_element({_id:id},Post);
    if(!selectedPost) return next(new httpError(`Deleting post with ${id} id `,"deleting a post which doesn't exists",404))
    if(selectedPost.deleteCode === deleteCode && selectedPost.email === email)
    {
        try{
            await Post.deleteOne({_id:id});
        }catch(err){
            return next(new httpError(err,`Can't delete ${id} post`,500))
        }
        res.sendStatus(204);
    }
    res.sendStatus(403);
}

exports.get_feed = async (req,res,next)=>{
    const {section,subsection} = req.params;
    let perPage = 20;
    let page = Math.max(0,parseInt(req.query.page));
    let data;
    let query = {section};
    if(subsection)
        query["subSection"] = subsection;
    query["hasPaid"]=  true;
    try{
        data = await Post.find(query).limit(perPage).skip(perPage * page).sort({created_at:-1})
    }catch(err){
        return next(new httpError(err,"Can't get the feeds",500))
    }
    res.status(200).json({status:"ok",data});
}