import nodemailer from "nodemailer";

/**
 * Helper to get configured email transporter or fallback
 */
const getTransporter = () => {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST;
  const port = process.env.EMAIL_PORT || process.env.SMTP_PORT || 587;
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
  }

  return null;
};

/**
 * Send an email or simulate in dev mode
 */
const sendMail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || '"InterviewIQ Notifications" <notifications@interviewiq.com>';

  if (transporter) {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    return { success: true, messageId: info.messageId, simulated: false };
  }

  // Console logging fallback for development when SMTP credentials are not configured
  console.log("\n=======================================================");
  console.log(" 📧 [SIMULATED EMAIL NOTIFICATION DISPATCH]");
  console.log(` TO:      ${to}`);
  console.log(` FROM:    ${from}`);
  console.log(` SUBJECT: ${subject}`);
  console.log("-------------------------------------------------------");
  console.log(` BODY:\n${text || html}`);
  console.log("=======================================================\n");

  return { success: true, simulated: true };
};

/**
 * Send a test email notification to user
 */
export const sendTestNotificationEmail = async ({ to, name }) => {
  const subject = "InterviewIQ - Test Notification Email";
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #6366f1; margin: 0;">InterviewIQ</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Smart AI Interview Practice</p>
      </div>
      <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px;">
        <h3 style="color: #0f172a; margin-top: 0;">Hello ${name || "Candidate"}, 👋</h3>
        <p style="color: #334155; line-height: 1.6;">
          This is a test notification from <strong>InterviewIQ</strong>. Your email notification settings are working perfectly!
        </p>
        <p style="color: #334155; line-height: 1.6;">
          You will receive updates about upcoming mock interviews, feedback reports, and weekly practice summaries based on your settings.
        </p>
      </div>
      <div style="margin-top: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
        <p>InterviewIQ Team &copy; ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;
  const text = `Hello ${name || "Candidate"},\n\nThis is a test notification from InterviewIQ. Your email notification settings are working perfectly!\n\nInterviewIQ Team`;

  return await sendMail({ to, subject, html, text });
};

/**
 * Send an interview reminder email
 */
export const sendInterviewReminderEmail = async ({ to, name, sessionTitle, scheduledTime }) => {
  const subject = `Reminder: Upcoming Interview Practice - ${sessionTitle || "Mock Session"}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #6366f1;">Interview IQ Practice Reminder</h2>
      <p>Hi ${name || "there"},</p>
      <p>This is a reminder for your upcoming interview practice session: <strong>${sessionTitle}</strong>.</p>
      ${scheduledTime ? `<p>Scheduled for: <strong>${scheduledTime}</strong></p>` : ""}
      <p>Ready to excel? Log in to your dashboard to begin your practice!</p>
    </div>
  `;
  return await sendMail({ to, subject, html, text: `Reminder for ${sessionTitle}` });
};

/**
 * Send weekly progress report email
 */
export const sendWeeklyProgressEmail = async ({ to, name, stats }) => {
  const subject = "Your Weekly InterviewIQ Progress Summary 📈";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #6366f1;">Weekly Progress Report</h2>
      <p>Hi ${name || "Candidate"},</p>
      <p>Here is a summary of your interview prep this week:</p>
      <ul>
        <li>Completed Interviews: <strong>${stats?.completedInterviews || 0}</strong></li>
        <li>Average Score: <strong>${stats?.averageScore || 0}%</strong></li>
        <li>Current Streak: <strong>${stats?.streak || 0} days</strong></li>
      </ul>
      <p>Keep up the great momentum!</p>
    </div>
  `;
  return await sendMail({ to, subject, html, text: `Weekly Progress Summary: ${stats?.completedInterviews || 0} interviews completed.` });
};

export default {
  sendTestNotificationEmail,
  sendInterviewReminderEmail,
  sendWeeklyProgressEmail,
};
