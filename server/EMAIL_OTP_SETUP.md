# TeamFlow Email OTP Setup

TeamFlow uses Gmail SMTP with Nodemailer to send account verification OTP emails.

## Active SMTP Configuration

The project is configured to use:

- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=587
- SMTP_SECURE=false
- SMTP_USER=teamflow.workspace@gmail.com
- SMTP_FROM="TeamFlow <teamflow.workspace@gmail.com>"

## Gmail App Password

For Gmail SMTP, use an app password (not normal Gmail password) if required by account policy.

## Local Testing Steps

1. Start backend: `cd server && npm run dev`
2. Start frontend: `cd client && npm run dev`
3. Signup with a new email
4. Check inbox for OTP email
5. Enter OTP on `/verify-otp`
6. Complete verification and access dashboard

## Troubleshooting

- If OTP email does not arrive, check spam folder.
- Ensure SMTP host/port/secure values are unchanged.
- Check backend logs for SMTP authentication or connection errors.
- Ensure internet access allows SMTP outbound traffic.

## Security Notes

- OTP expires in 5 minutes.
- Resend endpoint throttles frequent requests.
- OTP is single-use and invalidated after successful verification.
