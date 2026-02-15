import { getOrderById } from './orders';

interface EmailProvider {
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}

// SendGrid implementation
class SendGridProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn('SendGrid API key not configured');
      return;
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.EMAIL_FROM || 'noreply@frametale.com' },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.statusText}`);
    }
  }
}

// Resend implementation
class ResendProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('Resend API key not configured');
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'noreply@frametale.com',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.statusText}`);
    }
  }
}

// Console logger for development
class ConsoleProvider implements EmailProvider {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    console.log('\n=== EMAIL ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html}`);
    console.log('=============\n');
  }
}

// Get the appropriate email provider
function getEmailProvider(): EmailProvider {
  if (process.env.SENDGRID_API_KEY) {
    return new SendGridProvider();
  }
  if (process.env.RESEND_API_KEY) {
    return new ResendProvider();
  }
  return new ConsoleProvider();
}

const emailProvider = getEmailProvider();

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  try {
    const order = await getOrderById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const itemsList = order.items
      .map(
        item =>
          `<li>${item.productName} × ${item.quantity} - $${item.totalPrice.toFixed(2)}</li>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: #fff; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Order!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${order.customerName},</p>
            <p>We've received your order and we're getting it ready. You'll receive a shipping confirmation email with tracking information once your order ships.</p>
            
            <div class="order-details">
              <h2>Order #${order.orderNumber}</h2>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
              
              <h3>Items:</h3>
              <ul>${itemsList}</ul>
              
              <table style="width: 100%; margin-top: 15px;">
                <tr>
                  <td><strong>Subtotal:</strong></td>
                  <td align="right">$${order.subtotal.toFixed(2)}</td>
                </tr>
                ${order.discount > 0 ? `
                <tr>
                  <td><strong>Discount:</strong></td>
                  <td align="right">-$${order.discount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td><strong>Shipping:</strong></td>
                  <td align="right">$${order.shipping.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Tax:</strong></td>
                  <td align="right">$${order.tax.toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #000;">
                  <td><strong>Total:</strong></td>
                  <td align="right"><strong>$${order.amount.toFixed(2)}</strong></td>
                </tr>
              </table>
              
              ${order.shippingAddress ? `
              <h3>Shipping Address:</h3>
              <p>
                ${order.shippingAddress.fullName}<br>
                ${order.shippingAddress.addressLine1}<br>
                ${order.shippingAddress.addressLine2 ? `${order.shippingAddress.addressLine2}<br>` : ''}
                ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
                ${order.shippingAddress.country}
              </p>
              ` : ''}
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.orderNumber}" class="button">View Order Status</a>
            </center>
            
            <p>If you have any questions, please contact us at ${process.env.EMAIL_FROM || 'support@frametale.com'}</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Frametale. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await emailProvider.sendEmail(
      order.customerEmail,
      `Order Confirmation - ${order.orderNumber}`,
      html
    );
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

export async function sendShippingNotificationEmail(orderId: string): Promise<void> {
  try {
    const order = await getOrderById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: #fff; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .tracking-box { background: #fff; padding: 20px; margin: 20px 0; text-align: center; border-radius: 5px; }
          .button { display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Order Has Shipped!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${order.customerName},</p>
            <p>Great news! Your order #${order.orderNumber} has been shipped and is on its way to you.</p>
            
            ${order.trackingNumber ? `
            <div class="tracking-box">
              <h3>Tracking Information</h3>
              <p><strong>Tracking Number:</strong><br>${order.trackingNumber}</p>
              ${order.trackingUrl ? `
                <a href="${order.trackingUrl}" class="button">Track Your Package</a>
              ` : ''}
            </div>
            ` : ''}
            
            <p>You can also check your order status at any time:</p>
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.orderNumber}" class="button">View Order Status</a>
            </center>
            
            <p>Thank you for choosing Frametale!</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Frametale. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await emailProvider.sendEmail(
      order.customerEmail,
      `Your Order Has Shipped - ${order.orderNumber}`,
      html
    );
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    throw error;
  }
}
