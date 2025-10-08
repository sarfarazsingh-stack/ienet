import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const EMAIL_FROM = process.env.EMAIL_FROM!;
const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Send a generic email
 */
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw error;
  }
}

/**
 * Send contact request email to alumni with Accept/Decline links
 */
export async function sendContactRequestEmail(
  alumniEmail: string,
  alumniName: string,
  studentName: string,
  message: string,
  requestId: string
) {
  const acceptToken = jwt.sign(
    { requestId, decision: 'accepted' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const declineToken = jwt.sign(
    { requestId, decision: 'declined' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const acceptUrl = `${NEXTAUTH_URL}/api/contact-requests/${requestId}/decision?token=${acceptToken}`;
  const declineUrl = `${NEXTAUTH_URL}/api/contact-requests/${requestId}/decision?token=${declineToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 30px; }
          .message { background: white; padding: 20px; border-left: 4px solid #1e40af; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; margin: 10px 5px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .accept { background: #10b981; color: white; }
          .decline { background: #ef4444; color: white; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Connection Request</h1>
          </div>
          <div class="content">
            <p>Hi ${alumniName},</p>
            <p>A student from IE University would like to connect with you:</p>
            
            <div class="message">
              <strong>From:</strong> ${studentName}<br>
              <strong>Message:</strong><br>
              ${message}
            </div>

            <p><strong>Would you like to accept this introduction?</strong></p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${acceptUrl}" class="button accept">✓ Accept</a>
              <a href="${declineUrl}" class="button decline">✗ Decline</a>
            </div>

            <p style="font-size: 12px; color: #6b7280;">
              If you accept, your contact information will be shared according to your privacy preferences.
              These links expire in 7 days.
            </p>
          </div>
          <div class="footer">
            <p>© 2025 IE Alumni Connect | IE University</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail(alumniEmail, `Connection request from ${studentName}`, html);
}

/**
 * Send invite email for new alumni (from CSV upload)
 */
export async function sendInviteEmail(
  email: string,
  name: string,
  onboardingToken: string
) {
  const onboardingUrl = `${NEXTAUTH_URL}/onboarding?token=${onboardingToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; }
          .button { display: inline-block; padding: 14px 28px; background: #1e40af; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to IE Alumni Connect!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>You've been invited to join IE Alumni Connect, a platform where IE University students can discover and connect with alumni like you.</p>
            
            <p><strong>Help the next generation:</strong></p>
            <ul>
              <li>Share your career journey</li>
              <li>Provide guidance to current students</li>
              <li>Control what information you share</li>
            </ul>

            <p style="text-align: center;">
              <a href="${onboardingUrl}" class="button">Complete Your Profile</a>
            </p>

            <p style="font-size: 12px; color: #6b7280;">
              This link expires in 30 days. Your information will only be visible to students if you opt in.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail(email, 'Join IE Alumni Connect', html);
}

/**
 * Send decision notification to student
 */
export async function sendContactDecisionEmail(
  studentEmail: string,
  alumniName: string,
  decision: 'accepted' | 'declined',
  contactInfo?: { email?: string; phone?: string }
) {
  const html = decision === 'accepted'
    ? `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10b981;">✓ Connection Accepted!</h2>
            <p>${alumniName} has accepted your connection request.</p>
            ${contactInfo?.email ? `<p><strong>Email:</strong> ${contactInfo.email}</p>` : ''}
            ${contactInfo?.phone ? `<p><strong>Phone:</strong> ${contactInfo.phone}</p>` : ''}
            <p>You can now reach out to them directly. Good luck!</p>
          </div>
        </body>
      </html>
    `
    : `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Connection Request Update</h2>
            <p>${alumniName} is unable to connect at this time.</p>
            <p>Don't be discouraged—keep exploring other alumni who might be able to help!</p>
          </div>
        </body>
      </html>
    `;

  await sendEmail(
    studentEmail,
    decision === 'accepted' ? 'Connection Accepted!' : 'Connection Request Update',
    html
  );
}