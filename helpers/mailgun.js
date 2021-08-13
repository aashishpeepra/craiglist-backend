const mailgun = require("../utils/mailgun-config");
const path = require("path");
const config = require("../config");
exports.verifyMail = (data) => {
    let files = [];
    files = files.map((each) =>
      path.join(path.resolve("./"), "Assets//svg//" + each)
    );
    const emailData = {
      from: process.env.MAILGUN_FROM,
      to: data.email,
      subject: "Here's your new Posting",
      html: `
        <html>
            <h1>This email is regarding ${data.title} posting on craiglist </h1>
            <h4>Pay to get this ad posted </h4>
            <ul>
                <li>
                    <a href="${config.frontend+"pay/"+data.id}">Pay Now</a>
                </li>
                <li>
                    <a href="${config.frontend+"delete?id="+data.id+"&deleteCode="+data.deleteCode+"&email="+data.email}">Delete Posting</a>
                </li>
            </ul>
        </html>
      `,
      inline: files,
    };
    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        console.log(error);
        return;
      }
      console.log(body);
    });
  };