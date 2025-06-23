const SibApiV3Sdk = require('sib-api-v3-sdk');
module.exports=async(email,subject,htmlContent)=>{
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
          subject:subject,
          htmlContent:htmlContent
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