import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required.' },
        { status: 400 },
      )
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email provider
      auth: {
        user: process.env.NEXT_PUBLIC_GOOGLE_EMAIL_USERNAME, // Use environment variable for email
        pass: process.env.NEXT_PUBLIC_GOOGLE_EMAIL_PASSWORD, // Use App Password or secure credentials
      },
    })

    // Send email
    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: process.env.RECEIVER_EMAIL || 'stemjam.ai@gmail.com', // Receiver email
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from ${name} (${email}):\n\n${message}`,
    })

    // Success response
    return NextResponse.json(
      { success: true, message: 'Email sent successfully!' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Failed to send email:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email. Please try again later.',
      },
      { status: 500 },
    )
  }
}
