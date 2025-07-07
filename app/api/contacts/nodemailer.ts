import nodemailer from "nodemailer";

const email = "webofficerbruno@gmail.com";
const pass = "pwmo sggt yvex xqvt";

export const transporter = nodemailer.createTransport(
    {
        service : 'gmail',       
        auth : {
            user:email,
            pass,
        }
    }
);
