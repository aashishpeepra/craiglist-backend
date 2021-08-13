const httpError = require("../models/http-error");
const Post = require("../models/post.model");
const crypto = require("crypto");
const { find_element } = require("../helpers/findElement");
const { verifyMail } = require("../helpers/mailgun");

exports.create_post = async (req, res, next) => {
  const {
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
    category,
    subCategory,
  } = req.body;
  console.log(req.body);
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
    category,
    subCategory,
  };
  if (hasLocation) PostObject["location"] = req.location;
  if (hasNumber) PostObject["phone"] = req.phone;
  PostObject["deleteCode"] = crypto.randomBytes(32).toString("hex");
  PostObject["maskedEmail"] = crypto.randomBytes(16).toString("hex");
  const newPost = new Post(PostObject);
  try {
    await newPost.save();
  } catch (err) {
    return next(new httpError(err, "while trying to create a new post", 500));
  }
  newPost["id"] = newPost._id;
  verifyMail(newPost);
  res.status(200).json({ status: "ok", data: PostObject });
};

exports.delete_post = async (req, res, next) => {
  const { id, deleteCode, email } = req.query;
  console.log("deleting posting", req.headers, dreq.query);
  let selectedPost = await find_element({ _id: id }, Post);
  if (!selectedPost)
    return next(
      new httpError(
        `Deleting post with ${id} id `,
        "deleting a post which doesn't exists",
        404
      )
    );
  if (selectedPost.deleteCode === deleteCode && selectedPost.email === email) {
    try {
      await Post.deleteOne({ _id: id });
    } catch (err) {
      return next(new httpError(err, `Can't delete ${id} post`, 500));
    }
    res.sendStatus(204);
    return;
  }
  res.sendStatus(403);
};

exports.get_feed = async (req, res, next) => {
  let { category, subCategory } = req.query;
  if (!category) {
    return next(
      new httpError("Pass a valid category", "pass a valid category", 400)
    );
  }
  category = category.split(",");
  if (subCategory) subCategory = subCategory.split(",").map(each=>{
    if(each.indexOf(" ")!=-1){
      each = each.replace(" ","+")
    }
    return each
  });
  let perPage = 20;
  let page = Math.max(0, parseInt(req.query.page));
  let data;
  console.log(category, subCategory);
  // query["hasPaid"]=  true;
  let finalQuery = [
    {
      category: { $in: category },
    },
  ];
  if (subCategory) {
    finalQuery.push({
      subCategory: { $in: subCategory || [] },
    });
  }
  try {
    data = await Post.find({
      $and: finalQuery,
    })
      .limit(perPage)
      .skip(perPage * page)
      .sort({ created_at: -1 });
  } catch (err) {
    return next(new httpError(err, "Can't get the feeds", 500));
  }
  res.status(200).json({ status: "ok", data });
};


exports.get_each_post = async (req,res,next)=>{
  let {id} = req.query;
  console.log(id)
  if(!id){
    return next(new httpError("Pass a valid id","Pass a valid id",400));
  }
  let findPost = await find_element({_id:id},Post);
  if(!findPost) return next(new httpError("Can't find posting","Can't find the posting you are looking for",404));
  res.status(200).json({status:"ok",data:findPost})
}