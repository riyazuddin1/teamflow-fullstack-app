import dns from "dns/promises";
import nodemailer from "nodemailer";

const toBool = (value, fallback = false) => {
  if (typeof value !== "string") return fallback;
  return value.toLowerCase() === "true";
};

const getSmtpConfig = async () => {
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const resolved = await dns.lookup(host, { family: 4 });

  return {
    host: resolved.address,
    port: Number(process.env.SMTP_PORT || 465),
    secure: toBool(process.env.SMTP_SECURE, true),
    auth: {
      user: (process.env.SMTP_USER || "").trim(),
      pass: (process.env.SMTP_PASS || "").trim()
    },
    tls: {
      servername: host
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000
  };
};

export const verifySmtpTransport = async () => {
  try {
    const config = await getSmtpConfig();
    const transporter = nodemailer.createTransport(config);
    await transporter.verify();
    console.log("SMTP verify success:", `${config.host}:${config.port}`, `secure=${config.secure}`);
    return true;
  } catch (error) {
    console.error("SMTP verify error:", error.message);
    return false;
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendWithRetry = async (transporter, mailOptions, maxAttempts = 3) => {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      lastError = error;
      console.error(`SMTP send attempt ${attempt}/${maxAttempts} failed:`, error.message);
      if (attempt < maxAttempts) {
        await sleep(attempt * 1000);
      }
    }
  }
  throw lastError;
};

export const sendVerificationEmail = async ({ to, otpCode }) => {
  try {
    const config = await getSmtpConfig();
    const transporter = nodemailer.createTransport(config);
    const from = (process.env.SMTP_FROM || process.env.SMTP_USER || "").trim();

    const html = `
  <div style="font-family:Inter,Arial,sans-serif;background:#0b1020;padding:28px;color:#e2e8f0;">
    <div style="max-width:560px;margin:0 auto;border:1px solid #243047;background:rgba(15,23,42,0.92);border-radius:14px;padding:28px;">
      <h1 style="margin:0 0 8px;font-size:24px;color:#a5b4fc;">TeamFlow</h1>
      <p style="margin:0 0 18px;color:#cbd5e1;font-size:15px;">Verify Your TeamFlow Account</p>
      <p style="margin:0 0 16px;color:#cbd5e1;line-height:1.6;">Use the following one-time password to verify your account. This code expires in <b>5 minutes</b>.</p>
      <div style="margin:20px 0;padding:14px;border-radius:10px;background:#111b35;border:1px solid #3b4a75;text-align:center;">
        <span style="font-size:34px;letter-spacing:8px;font-weight:700;color:#60a5fa;">${otpCode}</span>
      </div>
      <p style="margin:14px 0 0;color:#94a3b8;font-size:13px;">If you did not request this verification, you can safely ignore this email.</p>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Need help? Reply to this email and our support team will assist you.</p>
    </div>
  </div>`;

    await sendWithRetry(transporter, {
      from,
      to,
      subject: "Verify Your TeamFlow Account",
      html
    });
    return true;
  } catch (error) {
    console.error("SMTP send error:", error.message);
    const err = new Error("Unable to send OTP email right now. Please try again.");
    err.statusCode = 502;
    throw err;
  }
};
