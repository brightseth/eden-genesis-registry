import { Resend } from 'resend'

// Only initialize Resend if API key is provided
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  // If no Resend API key, just log and return (for development/demo)
  if (!resend) {
    console.log('Email would be sent to:', to)
    console.log('Subject:', subject)
    return { id: 'mock-email-id' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Eden Genesis <hello@eden.art>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Failed to send email:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Email send error:', error)
    throw error
  }
}

export function getMagicLinkEmail(inviteToken: string, roleTarget: string) {
  const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`
  
  return {
    subject: 'Your Eden Genesis Cohort Invitation',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Eden Genesis Cohort</h1>
            </div>
            <div class="content">
              <p>You've been invited to join the Eden Genesis Cohort as a <strong>${roleTarget}</strong>.</p>
              <p>Click the button below to complete your onboarding:</p>
              <a href="${magicLink}" class="button">Complete Onboarding</a>
              <p style="color: #666; font-size: 14px;">Or copy this link: ${magicLink}</p>
              <p>This link will expire in 7 days.</p>
            </div>
            <div class="footer">
              <p>Eden Art | Building the future of AI creativity</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}

export function getApplicationConfirmationEmail(applicantName: string, track: string) {
  return {
    subject: 'Application Received - Eden Genesis Cohort',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Received</h1>
            </div>
            <div class="content">
              <p>Hi ${applicantName},</p>
              <p>We've received your application for the <strong>${track}</strong> track in the Eden Genesis Cohort.</p>
              <p>Our team will review your application and get back to you within 3-5 business days.</p>
              <p>Thank you for your interest in Eden!</p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}