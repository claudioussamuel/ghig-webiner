import { transporter } from "./nodemailer";
import { NextRequest, NextResponse } from "next/server";

interface RegistrationData {
  surname: string;
  otherNames: string;
  email: string;
  phone: string;
  price: string;
  role: string;
}

function generateInvoiceEmail(data: RegistrationData) {
  return {
    html: `
      <body style="background: #f7f7fa; font-family: 'Segoe UI', Arial, sans-serif; color: #222;">
        <table align="center" width="100%" style="max-width: 600px; background: #fff; border-radius: 12px; box-shadow: 0 4px 24px rgba(80,0,120,0.08); overflow: hidden; margin: 40px auto;">
          <tr>
            <td style="background: linear-gradient(90deg, #7c3aed 0%, #f472b6 100%); padding: 32px 0; text-align: center;">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" width="64" style="border-radius: 50%; box-shadow: 0 2px 8px #0001; margin-bottom: 12px;" alt="Webinar" />
              <h1 style="color: #fff; font-size: 2rem; margin: 0;">Thank You for Registering!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 32px 16px 32px;">
              <h2 style="color: #7c3aed; margin-top: 0;">Webinar Registration Invoice</h2>
              <p style="font-size: 1.1rem;">Hi <b>${data.surname} ${data.otherNames}</b>,</p>
              <p style="margin-bottom: 24px;">Thank you for registering for our upcoming webinar! We are excited to have you join us.<br/>Below are your registration details:</p>
              <table width="100%" style="background: #f3f0fa; border-radius: 8px; padding: 16px; font-size: 1rem;">
                <tr><td style="padding: 8px 0;"><b>Name:</b></td><td>${data.surname} ${data.otherNames}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Email:</b></td><td>${data.email}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Phone:</b></td><td>${data.phone}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Role:</b></td><td>${data.role}</td></tr>
                <tr><td style="padding: 8px 0;"><b>Price:</b></td><td>${data.price}</td></tr>
              </table>
              <p style="margin: 32px 0 0 0; color: #555;">We look forward to seeing you at the webinar. If you have any questions, feel free to reply to this email.<br/><br/>Best regards,<br/><b>The Webinar Team</b></p>
            </td>
          </tr>
          <tr>
            <td style="background: #f3f0fa; text-align: center; padding: 16px; color: #7c3aed; font-size: 0.95rem; border-top: 1px solid #eee;">
              &copy; ${new Date().getFullYear()} Webinar | All rights reserved.
            </td>
          </tr>
        </table>
      </body>
    `,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { surname, otherNames, email, phone, price, role } = body;
    if (!surname || !otherNames || !email || !phone || !price || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const mailOptions = {
      to: email,
      subject: `Webinar Registration Confirmation` ,
      from: `Webinar Team <${process.env.NEXT_PUBLIC_EMAIL}>`,
      text: `Thank you for registering for the webinar!`,
      ...generateInvoiceEmail({ surname, otherNames, email, phone, price, role }),
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Invoice email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: `Failed to send invoice: ${error}` }, { status: 500 });
  }
}
