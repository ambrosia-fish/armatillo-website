// API route for handling contact form submissions
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get form data from request body
  const { name, email, message } = req.body;
  
  // Validate form data
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create email transporter
  // Note: You'll need to set these environment variables in your Vercel dashboard
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: true, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Prepare email content
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Armatillo Contact Form" <${process.env.EMAIL_USER}>`,
    to: 'josef@feztech.io',
    subject: `New contact from ${name} via Armatillo website`,
    text: `
      Name: ${name}
      Email: ${email}
      
      Message:
      ${message}
    `,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Return error response
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
