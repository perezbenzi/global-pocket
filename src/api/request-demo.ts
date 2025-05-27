import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'perezbenzif@gmail.com',
    pass: 'your-app-specific-password-here',
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response('Email is required', {
        status: 400,
      });
    }

    const mailOptions = {
      from: 'perezbenzif@gmail.com',
      to: 'perezbenzif@gmail.com',
      subject: 'New Demo Request - Global Pocket',
      html: `
        <h2>New Demo Request</h2>
        <p>A new user has requested a demo of Global Pocket.</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response('Demo request sent successfully', {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending demo request:', error);
    return new Response('Failed to send demo request', {
      status: 500,
    });
  }
}
