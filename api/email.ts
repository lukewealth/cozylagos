import { Resend } from 'resend';
import { addSecurityHeaders, checkRateLimit } from '../src/lib/middleware';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  addSecurityHeaders(res);

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const rateCheck = checkRateLimit(req, 10, 60000);
    if (!rateCheck.allowed) {
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    const { type, to, guestName, bookingData } = req.body;

    if (!to || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields: type, to' });
    }

    if (type === 'booking_confirmation') {
      const { reference, listingTitle, checkIn, checkOut, totalAmount, services, experiences } = bookingData || {};

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F8;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                      <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 2px;">COZY LAGOS</h1>
                        <p style="color: #ffffff; margin: 8px 0 0 0; font-size: 14px; opacity: 0.8;">Luxury Hospitality</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px;">
                        <div style="text-align: center; margin-bottom: 32px;">
                          <div style="width: 64px; height: 64px; background-color: #D1FAE5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                            <span style="font-size: 32px;">&#10003;</span>
                          </div>
                          <h2 style="color: #1a1a1a; margin: 0 0 8px 0; font-size: 24px;">Booking Request Received!</h2>
                          <p style="color: #666; margin: 0; font-size: 14px;">Thank you, ${guestName || 'Valued Guest'}</p>
                        </div>

                        <div style="background-color: #FAF9F8; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                          <h3 style="color: #1a1a1a; margin: 0 0 16px 0; font-size: 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px;">Booking Details</h3>
                          ${reference ? `<p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Reference:</strong> <span style="color: #1a1a1a;">${reference}</span></p>` : ''}
                          ${listingTitle ? `<p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Property:</strong> <span style="color: #1a1a1a;">${listingTitle}</span></p>` : ''}
                          ${checkIn ? `<p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Check-in:</strong> <span style="color: #1a1a1a;">${checkIn}</span></p>` : ''}
                          ${checkOut ? `<p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Check-out:</strong> <span style="color: #1a1a1a;">${checkOut}</span></p>` : ''}
                          ${totalAmount ? `<p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Total:</strong> <span style="color: #D4AF37; font-weight: 700; font-size: 18px;">&#8358;${Number(totalAmount).toLocaleString()}</span></p>` : ''}
                        </div>

                        ${services && services.length > 0 ? `
                        <div style="background-color: #FAF9F8; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                          <h3 style="color: #1a1a1a; margin: 0 0 12px 0; font-size: 16px;">VIP Services</h3>
                          <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                            ${services.map((s: string) => `<li style="margin: 4px 0;">${s}</li>`).join('')}
                          </ul>
                        </div>
                        ` : ''}

                        ${experiences && experiences.length > 0 ? `
                        <div style="background-color: #FAF9F8; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                          <h3 style="color: #1a1a1a; margin: 0 0 12px 0; font-size: 16px;">Experiences</h3>
                          <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                            ${experiences.map((e: string) => `<li style="margin: 4px 0;">${e}</li>`).join('')}
                          </ul>
                        </div>
                        ` : ''}

                        <div style="background-color: #FFF9E6; border: 1px solid #D4AF37; border-radius: 12px; padding: 20px; text-align: center;">
                          <p style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">What happens next?</p>
                          <p style="margin: 0; color: #666; font-size: 13px; line-height: 1.6;">
                            Our concierge team will review your request and reach out via WhatsApp within 10 minutes to confirm availability and finalize your booking.
                          </p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #1a1a1a; padding: 24px; text-align: center;">
                        <p style="color: #D4AF37; margin: 0 0 8px 0; font-size: 12px; font-weight: 600; letter-spacing: 1px;">COZY LAGOS</p>
                        <p style="color: #999; margin: 0; font-size: 12px;">Luxury Hospitality in Lagos, Nigeria</p>
                        <p style="color: #666; margin: 12px 0 0 0; font-size: 11px;">
                          <a href="https://cozylagos.com" style="color: #D4AF37; text-decoration: none;">Website</a> &bull;
                          <a href="tel:+2348064305782" style="color: #D4AF37; text-decoration: none;">+234 806 430 5782</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: 'Cozy Lagos <bookings@cozylagos.com>',
        to: [to],
        subject: `Booking Confirmation - ${reference || 'Cozy Lagos'}`,
        html: htmlContent,
      });

      return res.status(200).json({ success: true, data: result });
    }

    if (type === 'sp_notification') {
      const { spName, listingTitle, guestName: guest, checkIn, checkOut, totalAmount } = bookingData || {};

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF9F8;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF9F8; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px; text-align: center;">
                        <h1 style="color: #D4AF37; margin: 0; font-size: 24px;">New Booking Request</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 32px;">
                        <p style="color: #1a1a1a; font-size: 16px; margin: 0 0 24px 0;">Hello ${spName || 'Partner'},</p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                          You have a new booking request for your property. Please review the details below:
                        </p>
                        <div style="background-color: #FAF9F8; border-radius: 12px; padding: 20px;">
                          <p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Property:</strong> ${listingTitle || 'N/A'}</p>
                          <p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Guest:</strong> ${guest || 'N/A'}</p>
                          <p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Check-in:</strong> ${checkIn || 'N/A'}</p>
                          <p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Check-out:</strong> ${checkOut || 'N/A'}</p>
                          <p style="margin: 8px 0; color: #666; font-size: 14px;"><strong>Total:</strong> <span style="color: #D4AF37; font-weight: 700;">&#8358;${Number(totalAmount || 0).toLocaleString()}</span></p>
                        </div>
                        <p style="color: #666; font-size: 14px; margin: 24px 0 0 0;">Please log in to your dashboard to accept or decline this request.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `;

      const result = await resend.emails.send({
        from: 'Cozy Lagos <notifications@cozylagos.com>',
        to: [to],
        subject: `New Booking Request - ${listingTitle || 'Cozy Lagos'}`,
        html: htmlContent,
      });

      return res.status(200).json({ success: true, data: result });
    }

    return res.status(400).json({ success: false, message: 'Unknown email type' });
  } catch (error: any) {
    console.error('Email API error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
}
