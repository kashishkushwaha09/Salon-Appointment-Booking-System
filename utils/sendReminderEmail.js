const SibApiV3Sdk = require('sib-api-v3-sdk');
module.exports=async(email,details)=>{
    try {
        var defaultClient = SibApiV3Sdk.ApiClient.instance;
        var apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.MAILING_API_KEY;
    
        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    
        const sender = {
          email: process.env.MY_EMAIL,
          name: 'Khushboo Kachhi'
        };
    
        const receivers = [{ email }];
    
        const response = await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: 'Appointment Reminder!',
          htmlContent: `
           <h2>Hello ${details.name},</h2>
<p>This is a friendly reminder for your appointment:</p>
<ul>
  <li><strong>Service:</strong>${details.serviceName}</li>
  <li><strong>Staff:</strong>${details.staffName}</li>
  <li><strong>Date:</strong>${details.date}</li>
  <li><strong>Time:</strong>${details.time}</li>
</ul>
<p>Looking forward to seeing you!</p>
          `
        });
    
        console.log('Email sent:', response);
      } catch (err) {
        console.log('Failed to send email:', err.message);
      }
}
//  await sendReminderEmail(appt.User.email, {
//         name: appt.User.name,
//         serviceName: appt.Service.name,
//         staffName: appt.Staff.name,
//         date: appt.date,
//         time: `${appt.startTime} - ${appt.endTime}`
//       });