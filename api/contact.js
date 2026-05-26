module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Email service is not configured' });
    }

    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const body = req.body || {};
    const fname = String(body.fname || '').trim();
    const lname = String(body.lname || '').trim();
    const email = String(body.email || '').trim();
    const org = String(body.org || '').trim();
    const service = String(body.service || '').trim();
    const message = String(body.message || '').trim();

    if (!fname || !lname || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    function esc(s) {
      return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    const { data, error } = await resend.emails.send({
      from: 'Stadi Website <onboarding@resend.dev>',
      to: 'hello@stadilytics.com',
      replyTo: email,
      subject: `New enquiry from ${fname} ${lname}${org ? ` (${org})` : ''}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(fname)} ${esc(lname)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(email)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Organisation</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(org) || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${esc(service) || 'Not specified'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;">${esc(message).replace(/\n/g, '<br>')}</td></tr>
        </table>
      `,
    });

    if (error) {
      console.error('Resend error:', JSON.stringify(error));
      return res.status(500).json({ error: error.message || 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Function error:', err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
};
