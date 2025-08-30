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
        const firstName = data.firstName || 'Citizen';
        const verificationLink = `${this.baseUrl}/verify-email?token=${data.verificationToken}`;

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
            <h1>🏙️ Welcome to ${this.appName}</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Thank you for joining ${this.appName}, the platform that empowers citizens to report and track local civic issues.</p>
            
            <p>To get started, please verify your email address by clicking the button below:</p>
            
            <a href="${verificationLink}" class="button">Verify Email Address</a>
            
            <p>Or copy and paste this link into your browser:</p>
            <p><a href="${verificationLink}">${verificationLink}</a></p>
            
            <p>Once verified, you'll be able to:</p>
            <ul>
              <li>Report civic issues in your neighborhood</li>
              <li>Track the status of your reports</li>
              <li>View and flag issues reported by other citizens</li>
              <li>Receive notifications about issue updates</li>
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

Thank you for joining ${this.appName}, the platform that empowers citizens to report and track local civic issues.

To get started, please verify your email address by visiting this link:
${verificationLink}

Once verified, you'll be able to:
- Report civic issues in your neighborhood
- Track the status of your reports
- View and flag issues reported by other citizens
- Receive notifications about issue updates

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
     * Account locked template
     */
    static accountLocked(data: {
        firstName?: string;
        email: string;
        reason: string;
    }): EmailTemplate {
        const firstName = data.firstName || 'Citizen';

        return {
            subject: `Account Security Alert - ${this.appName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Locked</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
            .alert { background: #dc2626; color: white; padding: 15px; border-radius: 6px; margin: 15px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚨 Account Security Alert</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            
            <div class="alert">
              <strong>Your ${this.appName} account has been temporarily locked</strong>
            </div>
            
            <p><strong>Account:</strong> ${data.email}</p>
            <p><strong>Reason:</strong> ${data.reason}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            
            <p>For security reasons, your account access has been temporarily restricted. This helps protect your account and our community.</p>
            
            <p><strong>What to do next:</strong></p>
            <ul>
              <li>Wait 15-30 minutes before trying to log in again</li>
              <li>Ensure you're using the correct credentials</li>
              <li>If the issue persists, contact our support team</li>
            </ul>
          </div>
          <div class="footer">
            <p>If you believe this is an error, please contact our support team.</p>
            <p>© 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
            text: `
Account Security Alert - ${this.appName}

Hello ${firstName},

🚨 Your ${this.appName} account has been temporarily locked

Account: ${data.email}
Reason: ${data.reason}
Time: ${new Date().toLocaleString()}

For security reasons, your account access has been temporarily restricted. This helps protect your account and our community.

What to do next:
- Wait 15-30 minutes before trying to log in again
- Ensure you're using the correct credentials
- If the issue persists, contact our support team

If you believe this is an error, please contact our support team.

© 2025 ${this.appName}. All rights reserved.
      `,
        };
    }

    /**
     * Issue status update notification template
     */
    static issueStatusUpdate(data: {
        firstName?: string;
        issueTitle: string;
        issueId: string;
        oldStatus: string;
        newStatus: string;
        comment?: string;
        updaterName?: string;
        updaterRole: string;
    }): EmailTemplate {
        const firstName = data.firstName || 'Citizen';
        const issueLink = `${this.baseUrl}/issues/${data.issueId}`;
        const statusColor = this.getStatusColor(data.newStatus);

        return {
            subject: `Issue Update: ${data.issueTitle} - ${this.appName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Issue Status Update</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .status-update { background: white; border-left: 4px solid ${statusColor}; padding: 20px; margin: 20px 0; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 Issue Status Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Your reported issue has been updated:</p>
            
            <div class="status-update">
              <h3>${data.issueTitle}</h3>
              <p><strong>Status changed from:</strong> <span class="status-badge" style="background: #6b7280;">${data.oldStatus.replace('_', ' ')}</span></p>
              <p><strong>New status:</strong> <span class="status-badge">${data.newStatus.replace('_', ' ')}</span></p>
              
              ${
                  data.comment
                      ? `
              <p><strong>Update comment:</strong></p>
              <p style="background: #f1f5f9; padding: 15px; border-radius: 6px; font-style: italic;">"${data.comment}"</p>
              `
                      : ''
              }
              
              <p><strong>Updated by:</strong> ${data.updaterName || 'Admin'} (${data.updaterRole})</p>
              <p><strong>Updated at:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <a href="${issueLink}" class="button">View Issue Details</a>
            
            <p>Thank you for helping make your community better by reporting civic issues!</p>
          </div>
          <div class="footer">
            <p>You can manage your notification preferences in your account settings.</p>
            <p>© 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
            text: `
Issue Status Update - ${this.appName}

Hello ${firstName},

Your reported issue has been updated:

Issue: ${data.issueTitle}
Status changed from: ${data.oldStatus.replace('_', ' ')}
New status: ${data.newStatus.replace('_', ' ')}

${data.comment ? `Update comment: "${data.comment}"` : ''}

Updated by: ${data.updaterName || 'Admin'} (${data.updaterRole})
Updated at: ${new Date().toLocaleString()}

View issue details: ${issueLink}

Thank you for helping make your community better by reporting civic issues!

© 2025 ${this.appName}. All rights reserved.
      `,
        };
    }

    /**
     * Issue resolved notification template
     */
    static issueResolved(data: {
        firstName?: string;
        issueTitle: string;
        issueId: string;
        comment?: string;
        updaterName?: string;
        updaterRole: string;
        resolvedAt: Date;
    }): EmailTemplate {
        const firstName = data.firstName || 'Citizen';
        const issueLink = `${this.baseUrl}/issues/${data.issueId}`;

        return {
            subject: `Issue Resolved: ${data.issueTitle} - ${this.appName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Issue Resolved</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
            .resolution-box { background: white; border: 2px solid #059669; padding: 20px; margin: 20px 0; border-radius: 6px; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .celebration { font-size: 48px; text-align: center; margin: 20px 0; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Issue Resolved!</h1>
          </div>
          <div class="content">
            <div class="celebration">🎉</div>
            <h2>Great news, ${firstName}!</h2>
            <p>Your reported issue has been successfully resolved:</p>
            
            <div class="resolution-box">
              <h3>${data.issueTitle}</h3>
              <p><strong>Resolved by:</strong> ${data.updaterName || 'Admin'} (${data.updaterRole})</p>
              <p><strong>Resolved at:</strong> ${data.resolvedAt.toLocaleString()}</p>
              
              ${
                  data.comment
                      ? `
              <p><strong>Resolution notes:</strong></p>
              <p style="background: #f1f5f9; padding: 15px; border-radius: 6px; font-style: italic;">"${data.comment}"</p>
              `
                      : ''
              }
            </div>
            
            <a href="${issueLink}" class="button">View Resolution Details</a>
            
            <p>Thank you for being an active citizen and helping improve your community! Your report made a difference.</p>
            
            <p>We encourage you to continue reporting issues you encounter to help keep your neighborhood in great condition.</p>
          </div>
          <div class="footer">
            <p>© 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
            text: `
Issue Resolved! - ${this.appName}

Great news, ${firstName}!

Your reported issue has been successfully resolved:

Issue: ${data.issueTitle}
Resolved by: ${data.updaterName || 'Admin'} (${data.updaterRole})
Resolved at: ${data.resolvedAt.toLocaleString()}

${data.comment ? `Resolution notes: "${data.comment}"` : ''}

View resolution details: ${issueLink}

Thank you for being an active citizen and helping improve your community! Your report made a difference.

We encourage you to continue reporting issues you encounter to help keep your neighborhood in great condition.

© 2025 ${this.appName}. All rights reserved.
      `,
        };
    }

    /**
     * Issue flagged notification template (for admin/moderators)
     */
    static issueFlagged(data: {
        issueTitle: string;
        issueId: string;
        reporterName?: string;
        flagCount: number;
        flagReason: string;
        flagComment?: string;
        flaggerName?: string;
    }): EmailTemplate {
        const issueLink = `${this.baseUrl}/admin/issues/${data.issueId}`;

        return {
            subject: `Issue Flagged: ${data.issueTitle} - ${this.appName}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Issue Flagged</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fef2f2; padding: 30px; border-radius: 0 0 8px 8px; }
            .flag-box { background: white; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 6px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .priority { background: #fbbf24; color: #92400e; padding: 10px; border-radius: 6px; margin: 10px 0; text-align: center; font-weight: bold; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚩 Issue Flagged for Review</h1>
          </div>
          <div class="content">
            <h2>Moderation Alert</h2>
            
            ${data.flagCount >= 5 ? '<div class="priority">⚠️ HIGH PRIORITY - Multiple flags received</div>' : ''}
            
            <p>An issue has been flagged and requires moderator review:</p>
            
            <div class="flag-box">
              <h3>${data.issueTitle}</h3>
              <p><strong>Reported by:</strong> ${data.reporterName || 'Anonymous'}</p>
              <p><strong>Total flags:</strong> ${data.flagCount}</p>
              <p><strong>Flag reason:</strong> ${data.flagReason}</p>
              <p><strong>Flagged by:</strong> ${data.flaggerName || 'Anonymous'}</p>
              
              ${
                  data.flagComment
                      ? `
              <p><strong>Flag comment:</strong></p>
              <p style="background: #f1f5f9; padding: 15px; border-radius: 6px; font-style: italic;">"${data.flagComment}"</p>
              `
                      : ''
              }
            </div>
            
            <a href="${issueLink}" class="button">Review Issue</a>
            
            <p>Please review this issue promptly and take appropriate action if necessary.</p>
          </div>
          <div class="footer">
            <p>This is an automated notification for moderators.</p>
            <p>© 2025 ${this.appName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
            text: `
Issue Flagged for Review - ${this.appName}

Moderation Alert

${data.flagCount >= 5 ? '⚠️ HIGH PRIORITY - Multiple flags received' : ''}

An issue has been flagged and requires moderator review:

Issue: ${data.issueTitle}
Reported by: ${data.reporterName || 'Anonymous'}
Total flags: ${data.flagCount}
Flag reason: ${data.flagReason}
Flagged by: ${data.flaggerName || 'Anonymous'}

${data.flagComment ? `Flag comment: "${data.flagComment}"` : ''}

Review issue: ${issueLink}

Please review this issue promptly and take appropriate action if necessary.

© 2025 ${this.appName}. All rights reserved.
      `,
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
