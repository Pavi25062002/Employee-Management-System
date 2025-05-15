const transport = require('../configs/mail-config');
const mailTemplate = require('../templates/mail-template');
const smtpAuthUser = process.env.SMTP_AUTH_USER || 'socialcodia@gmail.com';

class MailService{


    sendForgotPasswordMail = async (name,email,otp) =>
    {
        const {subject,text} = mailTemplate.forgotPassword(name,otp);
        return await this.sendMail(email,subject,text);
    }

    
  // 🆕 Task Assigned
  sendTaskAssignedMail = async (name, email, taskTitle, deadline, priority) => {
    const { subject, html } = mailTemplate.taskAssigned(name, taskTitle, deadline, priority);
    return await this.sendMail(email, subject, html);
  };

  // 🔄 Extension Request to Admin
  sendExtensionRequestMail = async (adminName, adminEmail, employeeName, taskTitle, newDeadline, reason) => {
    const { subject, html } = mailTemplate.extensionRequest(adminName, employeeName, taskTitle, newDeadline, reason);
    return await this.sendMail(adminEmail, subject, html);
  };

  // ✅ Task Completed Notification
  sendTaskCompletedMail = async (adminName, adminEmail, taskTitle, employeeName) => {
    const { subject, html } = mailTemplate.taskCompleted(adminName, taskTitle, employeeName);
    return await this.sendMail(adminEmail, subject, html);
  };



    sendMail  = async (to,subject,html) =>
    {
        const mailOption = {
            from:smtpAuthUser,
            to,
            subject,
            html
        }

        await transport.sendMail(mailOption,(err,info)=>
        {
            console.log(err);
            console.log(info);
        })

    }

}

module.exports = new MailService();