const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'perezbenzif@gmail.com',
    pass: 'your-app-specific-password-here',
  },
});

app.post('/api/request-demo', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ error: 'Email is required' });
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
    res
      .status(200)
      .json({ message: 'Demo request sent successfully' });
  } catch (error) {
    console.error('Error sending demo request:', error);
    res
      .status(500)
      .json({ error: 'Failed to send demo request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
