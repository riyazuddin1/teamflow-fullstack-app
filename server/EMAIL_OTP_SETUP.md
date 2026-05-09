# TeamFlow Email OTP Setup

TeamFlow uses Gmail SMTP with Nodemailer to send account verification OTP emails.

## Render-Compatible SMTP Configuration

Use these values:

- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=465
- SMTP_SECURE=true
- SMTP_USER=teamflow.workspace@gmail.com
- SMTP_PASS=djfugvzrnrmfldvw
- SMTP_FROM="TeamFlow <teamflow.workspace@gmail.com>"

## Why 465 + secure true

Render deployments can face timeout issues with STARTTLS handshakes on 587. Using SSL on 465 is more stable for this deployment profile.

## Production-safe fallback behavior

If SMTP/email provider is temporarily unavailable:

- Backend does NOT crash
- Signup still creates the user
- API returns warning: "OTP email service temporarily unavailable."
- Frontend stays responsive and shows non-blocking warning toast
- Users can retry resend OTP once mail provider recovers

## Local / Render checks

1. Confirm `SMTP_*` env vars are present in Render service settings.
2. Deploy and check startup logs for `SMTP transporter verified`.
3. Test signup and verify OTP email arrives.
4. If timeout occurs, retry resend OTP and check warnings/logs.

## Troubleshooting

- Ensure outbound SMTP is not blocked by provider/network.
- Verify Gmail account/app-password validity.
- Check backend logs for retry attempts and SMTP error messages.
- Confirm no extra spaces in SMTP values.

## Security notes

- OTP expires in 5 minutes.
- OTP is single-use.
- Resend invalidates previous OTP.
- Auth remains JWT-based after successful verification.
