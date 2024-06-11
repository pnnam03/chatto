import { EMAIL } from "#configs";
import { VERIFICATION_CODE_EXPIRATION_DURATION } from "#constants";
import nodemailer from "nodemailer";

export const sendMail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL.ADDRESS,
      pass: EMAIL.PASSWORD,
    },
  });

  const expiryTime = `${VERIFICATION_CODE_EXPIRATION_DURATION} minutes`;
  const mailOptions = {
    from: EMAIL.ADDRESS,
    to: email,
    subject: "Welcome",
    html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333">
    <div
      class="container"
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      "
    >
      <div class="message" style="margin-top: 20px">
        <p>Dear ${email},</p>
        <p>Your verification code is:</p>
        <p
          class="code"
          style="
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-top: 20px;
          "
        >
          ${verificationCode}
        </p>
        <p>
          Please use this code to verify your email address. This code will
          expire in ${expiryTime}.
        </p>
        <p>If you didn't request this code, you can ignore this email.</p>
      </div>
    </div>
  </body>`,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      // console.log("Email sent:", info.response);
    }
  });
};
