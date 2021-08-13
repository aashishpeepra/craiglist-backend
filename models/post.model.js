const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Post = new Schema({
    title:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    reachEmail:{
        type:Boolean,
        default:true
    },
    phone:{
        number:String,
        extension:String,
        name:String
    },
    hasNumber:{
        type:Boolean,
        default:false
    },
    location:{
        street:String,
        crossStreet:String,
        city:String
    },
    hasLocation:{
        type:Boolean,
        default:false
    },
    product:{

    },
    extra:{

    },
    maskedEmail:String,
    hasPaid:{
        type:Boolean,
        default:false
    },
    deleteCode:String,
    price:Number,
    coords:{
        latitude:Number,
        longitude:Number
    },
    images:[String],
    postType:[String],
    category:[String],
    subCategory:[String]
},{timestamps:true})

module.exports = mongoose.model("post",Post)