const mailgun = require("../utils/mailgun-config");
const path = require("path");
const config = require("../config");

exports.paymentSuccess = (data) =>{
  const emailData = {
    from:process.env.MAILGUN_FROM,
    to:data.email,
    subject:`Successful payment for posting ✅`,
    html:`
    <html>
    <h1> Congratulations, ${data.title} is now on Kaiserlist. </h1>
    <p>The posting will stop showing up after 30 days. </p>
    <span>The previous email have link to delete your hosting</span>
    <h5>Have a great day</h5>
    <h6>Team Kaiser list </h6>
    </html>`
  }
  mailgun.messages().send(emailData, (error, body) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log(body);
  });
}

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
                    <a href="${
                      config.frontend + "checkout?id=" + data.id
                    }">Pay for your hosting now</a>
                </li>
                <li>
                    <a href="${
                      config.frontend +
                      "delete?id=" +
                      data.id +
                      "&deleteCode=" +
                      data.deleteCode +
                      "&email=" +
                      data.email
                    }">Delete Posting</a>
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
