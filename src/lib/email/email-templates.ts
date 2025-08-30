export interface EmailTemplate {
    subject: string;
    html: string;
    text: string;
}

export interface EmailTemplateData {
    [key: string]: any;
}

export class EmailTemplates {
    private static baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    private static appName = 'Event Hive';

    /**
     * Welcome email template
     */
    static welcome(data: {
        firstName?: string;
        email: string;
        verificationToken: string;
    }): EmailTemplate {
        const firstName = data.firstName || 'User';
        const verificationLink = `${this.baseUrl}/auth/verify-email?token=${data.verificationToken}`;

        return {
            subject: `Welcome to ${this.appName} - Verify Your Email`,
            html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ${this.appName}</title>
        <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
        <h1>🎉 Welcome to ${this.appName}</h1>
        </div>
        <div class="content">
        <h2>Hello ${firstName}!</h2>
        <p>Welcome to ${this.appName}, your ultimate platform for discovering amazing events and managing seamless event experiences.</p>
        
        <p>To get started, please verify your email address by clicking the button below:</p>
        
        <a href="${verificationLink}" class="button">Verify Email Address</a>
        
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        
        <p>Once verified, you'll be able to:</p>
        <ul>
          <li>Discover and book tickets for exciting events</li>
          <li>Manage your bookings and download tickets</li>
          <li>Receive event reminders and updates</li>
          <li>Earn loyalty points and enjoy exclusive discounts</li>
          <li>Create and manage your own events (for organizers)</li>
        </ul>
        
        <p>This verification link will expire in 24 hours for security reasons.</p>
        </div>
        <div class="footer">
        <p>If you didn't create an account with ${this.appName}, please ignore this email.</p>
        <p>© 2025 ${this.appName}. All rights reserved.</p>
        </div>
      </body>
      </html>
      `,
            text: `
  Welcome to ${this.appName}!

  Hello ${firstName},

  Welcome to ${this.appName}, your ultimate platform for discovering amazing events and managing seamless event experiences.

  To get started, please verify your email address by visiting this link:
  ${verificationLink}

  Once verified, you'll be able to:
  - Discover and book tickets for exciting events
  - Manage your bookings and download tickets
  - Receive event reminders and updates
  - Earn loyalty points and enjoy exclusive discounts
  - Create and manage your own events (for organizers)

  This verification link will expire in 24 hours for security reasons.

  If you didn't create an account with ${this.appName}, please ignore this email.

  © 2025 ${this.appName}. All rights reserved.
      `,
        };
    }

    /**
     * Email verification template
     */
    static emailVerification(data: {
        firstName?: string;
        verificationToken: string;
    }): EmailTemplate {
        const firstName = data.firstName || 'User';
        const verificationLink = `${this.baseUrl}/verify-email?token=${data.verificationToken}`;

        return {
            subject: `Verify Your Email Address - ${this.appName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Verify Your Email</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Please verify your email address to complete your ${this.appName} account setup.</p>
            
            <a href="${verificationLink}" class="button">Verify Email Address</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            
            <p>This verification link will expire in 24 hours for security reasons.</p>
          </div>
          <div class="footer">
            <p>If you didn't request this verification, please ignore this email.</p>
            <p>© 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
            text: `
Verify Your Email - ${this.appName}

Hello ${firstName},

Please verify your email address to complete your ${this.appName} account setup.

Verification link: ${verificationLink}

This verification link will expire in 24 hours for security reasons.

If you didn't request this verification, please ignore this email.

© 2025 ${this.appName}. All rights reserved.
      `,
        };
    }

    /**
     * Password reset template
     */
    static passwordReset(data: {
        firstName?: string;
        resetToken: string;
    }): EmailTemplate {
        const firstName = data.firstName || 'Citizen';
        const resetLink = `${this.baseUrl}/reset-password?token=${data.resetToken}`;

        return {
            subject: `Reset Your Password - ${this.appName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
            .warning { background: #fbbf24; color: #92400e; padding: 15px; border-radius: 6px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔒 Reset Your Password</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>We received a request to reset your password for your ${this.appName} account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This password reset link will expire in 1 hour for your security.
            </div>
            
            <p>If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.</p>
          </div>
          <div class="footer">
            <p>For security reasons, this link will expire in 1 hour.</p>
            <p>© 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
            text: `
Reset Your Password - ${this.appName}

Hello ${firstName},

We received a request to reset your password for your ${this.appName} account.

Reset your password by visiting this link: ${resetLink}

⚠️ Security Notice: This password reset link will expire in 1 hour for your security.

If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.

© 2025 ${this.appName}. All rights reserved.
      `,
        };
    }

    /**
     * Password changed confirmation template
     */
    static passwordChanged(data: {
        firstName?: string;
        email: string;
    }): EmailTemplate {
        const firstName = data.firstName || 'Citizen';

        return {
            subject: `Password Changed Successfully - ${this.appName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
            .security-notice { background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Password Updated</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Your password for ${this.appName} has been successfully changed.</p>
            
            <div class="security-notice">
              <strong>🔐 Security Information:</strong>
              <ul>
                <li>Account: ${data.email}</li>
                <li>Changed at: ${new Date().toLocaleString()}</li>
                <li>All existing sessions have been logged out for security</li>
              </ul>
            </div>
            
            <p>If you made this change, no further action is required.</p>
            
            <p><strong>If you didn't change your password:</strong></p>
            <ul>
              <li>Your account may have been compromised</li>
              <li>Please reset your password immediately</li>
              <li>Contact our support team if you need assistance</li>
            </ul>
          </div>
          <div class="footer">
            <p>If you have any concerns about your account security, please contact support.</p>
            <p>© 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
            text: `
Password Updated - ${this.appName}

Hello ${firstName},

Your password for ${this.appName} has been successfully changed.

🔐 Security Information:
- Account: ${data.email}
- Changed at: ${new Date().toLocaleString()}
- All existing sessions have been logged out for security

If you made this change, no further action is required.

If you didn't change your password:
- Your account may have been compromised
- Please reset your password immediately
- Contact our support team if you need assistance

© 2025 ${this.appName}. All rights reserved.
      `,
        };
    }

    /**
     * Ticket delivery template
     */
    static ticketDelivery(data: {
        firstName?: string;
        eventTitle: string;
        bookingNumber: string;
        eventDate: string;
        eventVenue: string;
        items: { name: string; quantity: number }[];
        downloadLink?: string;
    }): EmailTemplate {
        const firstName = data.firstName || 'Attendee';
        const itemsHtml = data.items
            .map(
                (i) =>
                    `<li><strong>${i.name}</strong> &times; ${i.quantity}</li>`,
            )
            .join('');

        return {
            subject: `Your Tickets for ${data.eventTitle}`,
            html: `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.5;color:#111} .card{background:#f8fafc;padding:24px;border-radius:8px} .header{background:#2563eb;color:#fff;padding:16px 24px;border-radius:8px 8px 0 0} .items li{margin:4px 0} .download a{display:inline-block;margin-top:16px;background:#2563eb;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none}</style></head><body><div class="header"><h2>Your Ticket Confirmation</h2></div><div class="card"><p>Hi ${firstName},</p><p>Your booking <strong>${data.bookingNumber}</strong> for <strong>${data.eventTitle}</strong> is confirmed.</p><p><strong>Date:</strong> ${data.eventDate}<br/><strong>Venue:</strong> ${data.eventVenue}</p><p><strong>Tickets:</strong></p><ul class="items">${itemsHtml}</ul><p>The PDF ticket with QR code is attached. Please present it at entry.</p>${data.downloadLink ? `<p class="download"><a href="${data.downloadLink}">Download Ticket PDF</a></p>` : ''}<p>See you at the event!</p><p style="font-size:12px;color:#555">If you didn't make this booking contact support.</p></div></body></html>`,
            text: `Hi ${firstName},\nYour booking ${data.bookingNumber} for ${data.eventTitle} is confirmed.\nDate: ${data.eventDate}\nVenue: ${data.eventVenue}\nTickets:\n${data.items.map((i) => `- ${i.name} x ${i.quantity}`).join('\n')}\nYour PDF ticket with QR code is attached.${data.downloadLink ? ` Download: ${data.downloadLink}` : ''}`,
        };
    }

    private static getStatusColor(status: string): string {
        switch (status.toUpperCase()) {
            case 'REPORTED':
                return '#6b7280';
            case 'ACKNOWLEDGED':
                return '#2563eb';
            case 'IN_PROGRESS':
                return '#f59e0b';
            case 'RESOLVED':
                return '#059669';
            case 'CLOSED':
                return '#374151';
            case 'DUPLICATE':
                return '#8b5cf6';
            case 'INVALID':
                return '#dc2626';
            default:
                return '#6b7280';
        }
    }
}
