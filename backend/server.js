const express = require('express');
const cors = require('cors');

const app = express();
// Render assigns a dynamic port via process.env.PORT, defaulting to 10000 if not found
const PORT = process.env.PORT || 10000; 

// Middleware
app.use(cors()); // Allows your frontend domain to make requests to this server
app.use(express.json()); // Parses the incoming JSON in req.body

// The endpoint your frontend will call (e.g., https://your-render-app.onrender.com/send-email)
app.post('/send-email', async (req, res) => {
  const { name, email, phone, project_type, message } = req.body;

  try {
    // Node 18+ has built-in fetch. Render uses Node 18+ by default.
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY 
      },
      body: JSON.stringify({
        sender: { email: "echelonglobaltech@gmail.com", name: "ECHELON Website" }, 
        to: [{ email: "echelonglobaltech@gmail.com", name: "ECHELON Team" }],
        replyTo: { email: email, name: name },
        subject: `New Enquiry: ${project_type.toUpperCase()} — ${name}`,
        htmlContent: `
          <h3>New Project Enquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Level:</strong> ${project_type}</p>
          <p><strong>Brief:</strong><br/> ${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      const errorData = await response.json();
      console.error("BREVO REJECTED THE EMAIL:", errorData); 
      return res.status(response.status).json({ error: errorData });
    }
  } catch (error) {
    console.error("SERVER CRASHED:", error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
