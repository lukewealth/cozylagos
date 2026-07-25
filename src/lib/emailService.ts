import { Resend } from 'resend';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Resend Webhook Handler
export default async function handler(req: any, res: any) {
  const { method } = req;

  try {
    if (method === 'POST') {
      const event = req.body;

      // Handle different webhook events
      switch (event.type) {
        case 'email.sent':
          console.log('Email sent successfully:', event.data?.email_id);
          break;

        case 'email.delivered':
          console.log('Email delivered:', event.data?.email_id);
          break;

        case 'email.bounced':
          console.error('Email bounced:', event.data?.email_id);
          // Handle bounce - mark user email as invalid
          break;

        case 'email.complained':
          console.error('Email complaint:', event.data?.email_id);
          // Handle complaint - unsubscribe user
          break;

        case 'email.opened':
          console.log('Email opened:', event.data?.email_id);
          break;

        case 'email.clicked':
          console.log('Email link clicked:', event.data?.email_id);
          break;

        default:
          console.log('Unknown webhook event:', event.type);
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const emailService = {
  sendOTP: async (email: string, otp: string, userName?: string) => {
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CozyLagos Verification Code</title>
</head>

<body style="margin:0;padding:0;background:#F8F6F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1F2937;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F3;padding:40px 20px;">
<tr>
<td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #ECECEC;box-shadow:0 8px 40px rgba(0,0,0,.05);">

    <tr>
        <td align="center" style="padding:48px 40px 24px;">
            <img src="https://cozylagos.com/logo.png" width="150" alt="CozyLagos" style="display:block;border:0;max-width:150px;">
            <div style="height:24px;"></div>
            <h1 style="margin:0;font-size:32px;font-weight:700;color:#1F2937;">Welcome to CozyLagos</h1>
            <p style="margin:18px 0 0;font-size:16px;line-height:28px;color:#6B7280;">
                Experience premium stays, curated adventures and unforgettable moments across Lagos.
            </p>
        </td>
    </tr>

    <tr>
        <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8FA;border:1px solid #ECECEC;border-radius:18px;">
                <tr>
                    <td align="center" style="padding:40px;">
                        <p style="margin:0;font-size:15px;color:#6B7280;">Your verification code</p>
                        <div style="height:18px;"></div>
                        <div style="font-size:42px;font-weight:700;letter-spacing:12px;color:#111827;font-family:monospace;">${otp}</div>
                        <div style="height:20px;"></div>
                        <p style="margin:0;color:#6B7280;font-size:15px;line-height:26px;">
                            This code expires in <strong style="color:#111827;">10 minutes</strong>.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>

    <tr>
        <td style="padding:40px;">
            <p style="margin:0;font-size:16px;line-height:30px;color:#4B5563;">
                Hi there 👋<br><br>
                Thank you for joining <strong>CozyLagos</strong>.<br><br>
                We're excited to help you discover luxury apartments, unforgettable experiences, and the very best of Lagos.<br><br>
                Enter the verification code above to securely activate your account.
            </p>
        </td>
    </tr>

    <tr>
        <td style="padding:32px 40px;background:#FAFAFA;border-top:1px solid #ECECEC;">
            <p style="margin:0;font-size:14px;line-height:24px;color:#6B7280;">
                Sent with ❤️ from <strong style="color:#111827;">hello@cozylagos.com</strong>
            </p>
            <div style="height:12px;"></div>
            <p style="margin:0;font-size:13px;line-height:24px;color:#9CA3AF;">
                If you didn't request this verification code, you can safely ignore this email.
            </p>
            <div style="height:24px;"></div>
            <p style="margin:0;font-size:12px;color:#9CA3AF;">© 2026 CozyLagos. All rights reserved.</p>
        </td>
    </tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;

    try {
      const { data, error } = await resend.emails.send({
        from: 'CozyLagos <hello@cozylagos.com>',
        to: [email],
        subject: 'Your CozyLagos Verification Code',
        html: htmlTemplate,
      });

      if (error) {
        console.error('Failed to send OTP email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  sendWelcomeEmail: async (email: string, userName: string, userRole: string) => {
    const roleLabel = userRole === 'service_provider' ? 'Service Provider' : 'Guest';
    
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to CozyLagos</title>
</head>
<body style="margin:0;padding:0;background:#F8F6F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1F2937;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F3;padding:40px 20px;">
<tr>
<td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #ECECEC;box-shadow:0 8px 40px rgba(0,0,0,.05);">
    <tr>
        <td align="center" style="padding:48px 40px 24px;">
            <img src="https://cozylagos.com/logo.png" width="150" alt="CozyLagos" style="display:block;border:0;max-width:150px;">
            <div style="height:24px;"></div>
            <h1 style="margin:0;font-size:32px;font-weight:700;color:#1F2937;">Welcome, ${userName}!</h1>
            <p style="margin:18px 0 0;font-size:16px;line-height:28px;color:#6B7280;">
                Your ${roleLabel} account has been successfully created.
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding:40px;">
            <p style="margin:0;font-size:16px;line-height:30px;color:#4B5563;">
                Hi ${userName} 👋<br><br>
                Thank you for joining <strong>CozyLagos</strong> as a ${roleLabel}.<br><br>
                ${userRole === 'service_provider' 
                  ? 'You can now start listing your properties and services to reach thousands of guests looking for premium experiences in Lagos.'
                  : 'You can now explore luxury apartments, curated experiences, and the very best of Lagos has to offer.'}<br><br>
                We're excited to have you on board!
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding:32px 40px;background:#FAFAFA;border-top:1px solid #ECECEC;">
            <p style="margin:0;font-size:14px;line-height:24px;color:#6B7280;">
                Sent with ❤️ from <strong style="color:#111827;">hello@cozylagos.com</strong>
            </p>
            <div style="height:24px;"></div>
            <p style="margin:0;font-size:12px;color:#9CA3AF;">© 2026 CozyLagos. All rights reserved.</p>
        </td>
    </tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

    try {
      const { data, error } = await resend.emails.send({
        from: 'CozyLagos <hello@cozylagos.com>',
        to: [email],
        subject: `Welcome to CozyLagos, ${userName}!`,
        html: htmlTemplate,
      });

      if (error) {
        console.error('Failed to send welcome email:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  },

  sendBookingConfirmation: async (email: string, bookingDetails: any) => {
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmation - CozyLagos</title>
</head>
<body style="margin:0;padding:0;background:#F8F6F3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1F2937;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F6F3;padding:40px 20px;">
<tr>
<td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #ECECEC;box-shadow:0 8px 40px rgba(0,0,0,.05);">
    <tr>
        <td align="center" style="padding:48px 40px 24px;">
            <img src="https://cozylagos.com/logo.png" width="150" alt="CozyLagos" style="display:block;border:0;max-width:150px;">
            <div style="height:24px;"></div>
            <h1 style="margin:0;font-size:32px;font-weight:700;color:#1F2937;">Booking Confirmed!</h1>
            <p style="margin:18px 0 0;font-size:16px;line-height:28px;color:#6B7280;">
                Your reservation has been successfully confirmed.
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding:40px;">
            <p style="margin:0;font-size:16px;line-height:30px;color:#4B5563;">
                Hi ${bookingDetails.guestName} 👋<br><br>
                Great news! Your booking at <strong>${bookingDetails.listingTitle}</strong> has been confirmed.<br><br>
                <strong>Check-in:</strong> ${bookingDetails.checkIn}<br>
                <strong>Check-out:</strong> ${bookingDetails.checkOut}<br>
                <strong>Total Amount:</strong> ₦${bookingDetails.totalAmount?.toLocaleString()}<br><br>
                We look forward to hosting you!
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding:32px 40px;background:#FAFAFA;border-top:1px solid #ECECEC;">
            <p style="margin:0;font-size:14px;line-height:24px;color:#6B7280;">
                Sent with ❤️ from <strong style="color:#111827;">hello@cozylagos.com</strong>
            </p>
            <div style="height:24px;"></div>
            <p style="margin:0;font-size:12px;color:#9CA3AF;">© 2026 CozyLagos. All rights reserved.</p>
        </td>
    </tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

    try {
      const { data, error } = await resend.emails.send({
        from: 'CozyLagos <hello@cozylagos.com>',
        to: [email],
        subject: `Booking Confirmed - ${bookingDetails.listingTitle}`,
        html: htmlTemplate,
      });

      if (error) {
        console.error('Failed to send booking confirmation:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      console.error('Email service error:', error);
      return { success: false, error: error.message };
    }
  }
};
