const stripe = require("stripe")(process.env.STRIPE_KEY);
const Post = require("../models/post.model");
const { find_element } = require("../helpers/findElement");
const httpError = require("../models/http-error");
const {paymentSuccess} = require("../helpers/mailgun");

exports.PAYMENT_ACCEPTED = async (req,res,next)=>{
    const {id,paymentIntent} = req.body;

    let find_post = await find_element({ _id: id }, Post);
    if (!find_post)
      return next(
        new httpError(
          "Can't find the id " + id,
          "The post you are looking for can't be found ",
          404
        )
      );
    const verify = await stripe.paymentIntents.retrieve(paymentIntent.id)
   
    if(verify.status !== "succeeded")
    {
        return next(new httpError("payment wasn't successful","payment wasn't successful",403));
    }
    else if(verify.receipt_email !== find_post.email)
        return next(new httpError("unauthorized action","unauthorized action",403));
    
    //reaches here if everything went well
    find_post.hasPaid = true;
    try{
        await find_post.save();
    }catch(err){
        return next(new httpError(err,"Can't update your order. Contact the owner with the debited slip",500));
    }
    try{
        paymentSuccess({title:find_post.title,email:find_post.email})
    }catch(err){
        console.error(err,"while sending payment success email.",500);
    }
    res.sendStatus(200);




}

exports.CREATE_SESSION = async (req, res, next) => {
    const { id } = req.body;
    let find_post = await find_element({ _id: id }, Post);
    if (!find_post)
      return next(
        new httpError(
          "Can't find the id " + id,
          "The post you are looking for can't be found ",
          404
        )
      );
    if(find_post.hasPaid)  return next(new httpError("user has already paid","user has already paid for this posting",400))
    let paymentIntent;
    const customerObject = {
        name:find_post.title,
        email:find_post.email,
        address:{
            line1:find_post.pincode,
            postal_code:find_post.pincode.toString(),
            city:find_post.city,
            state:"NY",
            country:"US"
        }
    }
  
    const customer = await stripe.customers.create(customerObject)
 
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: (find_post.price || find_post.subCategory.length*45 || 45) * 100,
        currency: "usd",
        description:"this payment is for the posting of job at kaiserlist.",
        customer:customer.id,
        receipt_email:find_post.email,
        shipping:{
            name:customerObject.name,
            address:customerObject.address
        }
      });
    } catch (err) {
      return next(new httpError(err,"Can't create Payment intent. Try again!", 500));
    }
  
    res.status(201).json({ status:"ok",data :{clientSecret: paymentIntent.client_secret ,posting:find_post,client:customerObject}});
  };

// exports.CREATE_SESSION = async (req, res, next) => {
//   const { id } = req.body;
//   let find_post = await find_element({ _id: id }, Post);
//   if (!find_post)
//     return next(
//       new httpError(
//         "Can't find the id " + id,
//         "The post you are looking for can't be found ",
//         404
//       )
//     );
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: find_post.title + " || " + find_post.id,
//             },
//             unit_amount:
//               find_post.price || find_post.subCategory.length * 45 || 45,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.WEBSITE_URL}/checkout-success?id=${find_post.id}`,
//       cancel_url: `${process.env.WEBSITE_URL}/checkout-failure?id=${find_post.id}`,
//     });
//     console.log(session)
//     res
//       .status(200)
//       .json({
//         status: "ok",
//         data: { url: session.id, email: find_post.email },
//       });
//   } catch (err) {
//     return next(
//       new httpError(err, "while creating a new checkout session " + id, 500)
//     );
//   }
// };
