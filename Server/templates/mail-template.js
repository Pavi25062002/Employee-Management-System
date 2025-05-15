const websiteName = process.env.WEBSITE_NAME || 'Book Keeping';

class MailTemplate{
    forgotPassword = (name,otp) =>
    {
        const subject = `Recover your ${websiteName} password`;
        const text = `Hey ${name}😎\nHow is your day? It will be fantastic I guess!😁\nDid you forgot your password! Don't worry we are here to help you.\nUse this OTP (One Time Password) to choose a new one. \n\n ${otp} \n\n If you didn't make this request, you can safely ignore this email :)`;
        return {subject,text};
    }

    // 🆕 Task Assigned
 taskAssigned = (name, taskTitle, deadline, priority) => {
  const subject = `📌 New Task Assigned in ${websiteName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #2c3e50;">📌 New Task Assigned</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>You’ve been assigned a new task:</p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td><strong>📝 Task Title:</strong></td><td>${taskTitle}</td></tr>
        <tr><td><strong>📅 Deadline:</strong></td><td>${deadline}</td></tr>
        <tr><td><strong>⚠️ Priority:</strong></td><td>${priority}</td></tr>
      </table>
      <p style="margin-top: 20px;">Please check your dashboard and get started.</p>
      <p>Best regards,<br><strong>${websiteName} Team</strong></p>
    </div>
  `;
  return { subject, html };
};


  // 🔄 Extension Request Notification to Admin
extensionRequest = (adminName, employeeName, taskTitle, newDeadline, reason) => {
  const subject = `🔁 Extension Requested for Task: ${taskTitle}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #d35400;">🔁 Task Extension Request</h2>
      <p>Hello <strong>${adminName}</strong>,</p>
      <p><strong>${employeeName}</strong> has requested an extension for the task titled "<strong>${taskTitle}</strong>".</p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td><strong>📅 New Deadline:</strong></td><td>${newDeadline}</td></tr>
        <tr><td><strong>📝 Reason:</strong></td><td>${reason}</td></tr>
      </table>
      <p style="margin-top: 20px;">Please review the request in your admin dashboard.</p>
      <p>Regards,<br><strong>${websiteName} System</strong></p>
    </div>
  `;
  return { subject, html };
};


  // ✅ Task Completed Notification to Admin
 taskCompleted = (adminName, taskTitle, employeeName) => {
  const subject = `✅ Task Completed: ${taskTitle}`;
  const html = `  
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #27ae60;">✅ Task Completion Notification</h2>
      <p>Hello <strong>${adminName}</strong>,</p>
      <p>The task titled "<strong>${taskTitle}</strong>" has been marked as <strong>completed</strong> by <strong>${employeeName}</strong>.</p>
      <p>Please review and mark it as closed if it meets the criteria.</p>
      <p>Thanks,<br><strong>${websiteName} System</strong></p>
    </div>
  `;
  return { subject, html };
};


  // ⏰ Due Date Reminder
  dueDateReminder = (name, taskTitle, deadline) => {
    const subject = `⏳ Reminder: Task "${taskTitle}" Due Soon`;
    const text = `Hey ${name},\n\nJust a friendly reminder that your task "${taskTitle}" is due on ${deadline}.\n\nPlease make sure to update your progress if you haven't already.\n\nYou’ve got this! 💪\n\n- ${websiteName} Bot`;
    return { subject, text };
  };

  // 🔑 Forgot Password (already in your example)
  forgotPassword = (name, otp) => {
    const subject = `Recover your ${websiteName} password`;
    const text = `Hey ${name}😎\nHow is your day? It will be fantastic I guess!😁\nDid you forget your password? Don't worry, we are here to help you.\nUse this OTP to reset your password:\n\n🔐 ${otp}\n\nIf you didn’t make this request, you can safely ignore this email 🙂`;
    return { subject, text };
  };

}

module.exports = new MailTemplate();