import nodemailer from 'nodemailer';

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: `"Novothon Platform" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error };
  }
};

// OTP verification email template
export const sendOTPVerificationEmail = async (userEmail: string, userName: string, otp: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Verify Your Email</h1>
        <p style="color: #666; font-size: 16px;">Hello ${userName},</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">Complete Your Registration</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Please verify your email address using the verification code below:
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
          <div style="background: #4F46E5; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; display: inline-block; font-family: monospace; letter-spacing: 8px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 10px;">
            This code expires in 5 minutes
          </p>
        </div>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
        <p style="color: #856404; margin: 0; font-size: 14px;">
          <strong>Security Note:</strong> Never share this code with anyone. Our team will never ask for your verification code.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account with us, please ignore this email.
        </p>
        <p style="color: #666; font-size: 14px;">
          Need help? Contact us at support@novothonplatform.com
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: userEmail,
    subject: '🔐 Verify Your Email - Complete Your Novothon Platform Registration',
    html,
  });
};

// Welcome email template
export const sendWelcomeEmail = async (userEmail: string, userName: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Welcome to Novothon Platform!</h1>
        <p style="color: #666; font-size: 16px;">Hello ${userName},</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">Account Successfully Created!</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Your email has been verified and your account is now active. You can start participating in hackathons, joining teams, and showcasing your projects!
        </p>
      </div>
      
      <div style="margin: 30px 0;">
        <h3 style="color: #333; margin-bottom: 15px;">What You Can Do Now:</h3>
        <ul style="color: #666; line-height: 1.6; padding-left: 20px;">
          <li>Join exciting hackathons and coding competitions</li>
          <li>Connect with talented developers and build teams</li>
          <li>Submit and showcase your innovative projects</li>
          <li>Complete your profile to increase visibility</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
           style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Go to Dashboard
        </a>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Need help? Contact us at support@novothonplatform.com
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: userEmail,
    subject: '🎉 Welcome to Novothon Platform - Your Account is Ready!',
    html,
  });
};

// Team invitation email template
export const sendTeamInvitationEmail = async (
  inviteeEmail: string, 
  inviterName: string, 
  teamName: string,
  hackathonName: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Team Invitation</h1>
        <p style="color: #666; font-size: 16px;">You've been invited to join a team</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">${inviterName} wants you to join their team!</h2>
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Team:</strong> ${teamName}</p>
          <p style="margin: 5px 0;"><strong>Hackathon:</strong> ${hackathonName}</p>
          <p style="margin: 5px 0;"><strong>Invited by:</strong> ${inviterName}</p>
        </div>
        <p style="color: #666; line-height: 1.6;">
          Join this team to collaborate on an exciting hackathon project and work together to build something amazing!
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
           style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Accept Invitation
        </a>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          This invitation will expire in 7 days.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: inviteeEmail,
    subject: `Team Invitation: Join ${teamName} for ${hackathonName}`,
    html,
  });
};

// Hackathon update email template
export const sendHackathonUpdateEmail = async (
  userEmail: string,
  userName: string,
  hackathonName: string,
  updateMessage: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Hackathon Update</h1>
        <p style="color: #666; font-size: 16px;">Hello ${userName},</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">${hackathonName} - Important Update</h2>
        <div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p style="color: #666; line-height: 1.6; margin: 0;">
            ${updateMessage}
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" 
           style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          View Hackathon Details
        </a>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          Stay updated with the latest hackathon news and announcements.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: userEmail,
    subject: `Hackathon Update: ${hackathonName}`,
    html,
  });
};

// Password reset email template
export const sendPasswordResetEmail = async (
  userEmail: string,
  userName: string,
  resetToken: string
) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Password Reset Request</h1>
        <p style="color: #666; font-size: 16px;">Hello ${userName},</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">Reset Your Password</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
          We received a request to reset your password. Click the button below to create a new password.
        </p>
        <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Security Note:</strong> This link will expire in 1 hour for your security.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          If you didn't request this password reset, please ignore this email.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: userEmail,
    subject: 'Password Reset Request - Novothon Platform',
    html,
  });
};

// OTP email template for password reset
export const sendOTPEmail = async (userEmail: string, userName: string, otp: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin-bottom: 10px;">Password Reset OTP</h1>
        <p style="color: #666; font-size: 16px;">Hello ${userName},</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">Reset Your Password</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Use the following 6-digit code to reset your password:
        </p>
        
        <div style="text-align: center; margin: 20px 0;">
          <div style="background: #4F46E5; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; display: inline-block; font-family: monospace; letter-spacing: 8px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 10px;">
            This code expires in 5 minutes
          </p>
        </div>
      </div>
      
      <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
        <p style="color: #856404; margin: 0; font-size: 14px;">
          <strong>Security Note:</strong> Never share this code with anyone. Our team will never ask for your OTP.
        </p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #666; font-size: 14px;">
          If you didn't request a password reset, please ignore this email.
        </p>
        <p style="color: #666; font-size: 14px;">
          Need help? Contact us at support@novothonplatform.com
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: userEmail,
    subject: '🔐 Password Reset OTP - Novothon Platform',
    html,
  });
};
