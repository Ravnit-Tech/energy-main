const brand = {
  orange: "#f97316",
  dark:   "#0f172a",
  card:   "#1e293b",
  border: "#334155",
  text:   "#e2e8f0",
  muted:  "#94a3b8",
};

const base = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>e-Nergy</title>
</head>
<body style="margin:0;padding:0;background:${brand.dark};font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${brand.dark};padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo bar -->
          <tr>
            <td style="padding:0 0 28px 0;text-align:center;">
              <span style="font-size:26px;font-weight:900;color:${brand.orange};letter-spacing:-1px;">e<span style="color:#fff;">-Nergy</span></span>
              <p style="margin:6px 0 0;font-size:11px;color:${brand.muted};text-transform:uppercase;letter-spacing:2px;">Nigerian Fuel Distribution Platform</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:${brand.card};border:1px solid ${brand.border};border-radius:16px;padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;color:${brand.muted};">
                You received this email because you have an account on e-Nergy.<br/>
                If you didn't request this, you can safely ignore it.
              </p>
              <p style="margin:12px 0 0;font-size:11px;color:#475569;">
                &copy; ${new Date().getFullYear()} e-Nergy. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();

export function verifyEmailTemplate({ name, code, expiresMinutes = 30 }: {
  name: string;
  code: string;
  expiresMinutes?: number;
}): { subject: string; html: string } {
  return {
    subject: `${code} — Your e-Nergy verification code`,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff;">Verify your email</h1>
      <p style="margin:0 0 28px;font-size:14px;color:${brand.muted};">Hi ${name}, enter this code to activate your account.</p>

      <div style="background:${brand.dark};border:2px solid ${brand.orange};border-radius:12px;padding:28px;text-align:center;margin:0 0 28px;">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:${brand.orange};text-transform:uppercase;letter-spacing:3px;">Verification Code</p>
        <p style="margin:0;font-size:42px;font-weight:900;color:#fff;letter-spacing:12px;font-family:monospace;">${code}</p>
        <p style="margin:12px 0 0;font-size:12px;color:${brand.muted};">Expires in ${expiresMinutes} minutes</p>
      </div>

      <p style="margin:0;font-size:13px;color:${brand.muted};line-height:1.6;">
        Copy this code and paste it into the verification screen in your browser.
        Do not share this code with anyone.
      </p>
    `),
  };
}

export function resetPasswordTemplate({ name, resetUrl, expiresMinutes = 30 }: {
  name: string;
  resetUrl: string;
  expiresMinutes?: number;
}): { subject: string; html: string } {
  return {
    subject: "Reset your e-Nergy password",
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff;">Reset your password</h1>
      <p style="margin:0 0 28px;font-size:14px;color:${brand.muted};">
        Hi ${name}, we received a request to reset your e-Nergy password.
        Click the button below to choose a new one.
      </p>

      <div style="text-align:center;margin:0 0 28px;">
        <a href="${resetUrl}"
          style="display:inline-block;background:${brand.orange};color:#fff;font-size:15px;font-weight:700;
                 padding:14px 36px;border-radius:10px;text-decoration:none;letter-spacing:0.3px;">
          Reset Password
        </a>
      </div>

      <p style="margin:0 0 12px;font-size:12px;color:${brand.muted};line-height:1.6;">
        Or paste this link into your browser:
      </p>
      <p style="margin:0 0 24px;font-size:11px;color:#64748b;word-break:break-all;">${resetUrl}</p>

      <div style="border-top:1px solid ${brand.border};padding-top:20px;">
        <p style="margin:0;font-size:12px;color:${brand.muted};">
          This link expires in <strong style="color:#fff;">${expiresMinutes} minutes</strong>.
          If you didn't request a password reset, your account is safe — no action is needed.
        </p>
      </div>
    `),
  };
}

export function supplyRequestStatusTemplate({ name, requestId, product, status, adminNote }: {
  name: string;
  requestId: string;
  product: string;
  status: string;
  adminNote?: string;
}): { subject: string; html: string } {
  const isApproved = status === "Approved";
  const statusColor = isApproved ? "#22c55e" : status === "Pending" ? "#f59e0b" : "#ef4444";

  return {
    subject: `Supply request ${requestId} — ${status}`,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff;">Supply Request Update</h1>
      <p style="margin:0 0 28px;font-size:14px;color:${brand.muted};">Hi ${name}, your supply request has been updated.</p>

      <div style="background:${brand.dark};border:1px solid ${brand.border};border-radius:10px;padding:20px;margin:0 0 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ["Request ID",  requestId],
            ["Product",     product],
            ["Status",      `<span style="color:${statusColor};font-weight:700;">${status}</span>`],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:5px 0;font-size:13px;color:${brand.muted};width:120px;">${k}</td>
              <td style="padding:5px 0;font-size:13px;color:#fff;">${v}</td>
            </tr>
          `).join("")}
        </table>
        ${adminNote ? `
          <div style="border-top:1px solid ${brand.border};margin-top:12px;padding-top:12px;">
            <p style="margin:0;font-size:12px;color:${brand.muted};">Admin note: <span style="color:#e2e8f0;">${adminNote}</span></p>
          </div>
        ` : ""}
      </div>

      <p style="margin:0;font-size:13px;color:${brand.muted};">
        Log in to your dashboard to view the full details of your supply request.
      </p>
    `),
  };
}

export function paymentConfirmedTemplate({ name, amount, reference, type }: {
  name: string;
  amount: string;
  reference: string;
  type: string;
}): { subject: string; html: string } {
  return {
    subject: `Payment confirmed — ${reference}`,
    html: base(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#fff;">Payment Confirmed</h1>
      <p style="margin:0 0 28px;font-size:14px;color:${brand.muted};">Hi ${name}, we've received your payment.</p>

      <div style="background:${brand.dark};border:2px solid #22c55e;border-radius:12px;padding:24px;text-align:center;margin:0 0 28px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#22c55e;text-transform:uppercase;letter-spacing:2px;">Amount Paid</p>
        <p style="margin:0;font-size:36px;font-weight:900;color:#fff;">${amount}</p>
        <p style="margin:8px 0 0;font-size:12px;color:${brand.muted};">${type} · Ref: ${reference}</p>
      </div>

      <p style="margin:0;font-size:13px;color:${brand.muted};">
        Your payment has been recorded. Log in to your dashboard to view your transaction history.
      </p>
    `),
  };
}
