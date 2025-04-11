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
    const text = `Hey ${name},\n\nYou’ve been assigned a new task titled "${taskTitle}".\n\n📅 Deadline: ${deadline}\n⚠️ Priority: ${priority}\n\nPlease check your dashboard and start working on it.\n\nBest,\n${websiteName} Team`;
    return { subject, text };
  };

  // 🔄 Extension Request Notification to Admin
  extensionRequest = (adminName, employeeName, taskTitle, newDeadline, reason) => {
    const subject = `🔁 Extension Requested for Task: ${taskTitle}`;
    const text = `Hi ${adminName},\n\n${employeeName} has requested an extension for the task "${taskTitle}".\n\n📅 New Requested Deadline: ${newDeadline}\n📝 Reason: ${reason}\n\nPlease review this request in your admin dashboard.\n\nRegards,\n${websiteName} System`;
    return { subject, text };
  };

  // ✅ Task Completed Notification to Admin
  taskCompleted = (adminName, taskTitle, employeeName) => {
    const subject = `✅ Task Completed: ${taskTitle}`;
    const text = `Hello ${adminName},\n\nThe task titled "${taskTitle}" has been marked as completed by ${employeeName}.\n\nPlease verify and mark it as closed if it meets the completion criteria.\n\nThanks,\n${websiteName} System`;
    return { subject, text };
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