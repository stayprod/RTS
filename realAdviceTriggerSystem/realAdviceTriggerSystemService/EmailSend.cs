using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using realAdviceTriggerSystemService;
//using realAdviceTriggerSystemAPI.Models;
using realAdviceTriggerSystemService.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace realAdviceTriggerSystemService
{
    public class EmailSend
    {

        public bool emailSend(string ToEmail, string Subject, string Message, OfficeSmtpsetting settings, bool IsBodyHtml = true)
        {
            bool status = false;
            try
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
                EmailSetting emailSettings = configuration.GetSection("EmailSettings").Get<EmailSetting>();

                string HostAddress = settings.ImapServer;
                string FormEmailId = settings.EmailProvider;
                string CC = emailSettings.BCC;
                string BCC = emailSettings.BCC;
                string Password = settings.Password;
                string Port = settings.Port.ToString();
                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(FormEmailId);
                mailMessage.Subject = Subject;
                mailMessage.Body = Message;
                mailMessage.IsBodyHtml = IsBodyHtml;
                mailMessage.To.Add(new MailAddress(ToEmail));// (SenderEmail));
                if (CC != "")
                {
                    mailMessage.CC.Add(new MailAddress(CC));// (SenderEmail));
                }
                string[] CCId = BCC.Split(',');
                foreach (string BCCEmail in CCId)
                {
                    mailMessage.Bcc.Add(new MailAddress(BCCEmail)); //Adding Multiple CC email Id  
                }

                SmtpClient smtp = new SmtpClient();
                smtp.Host = HostAddress;
                smtp.EnableSsl = false;
                NetworkCredential networkCredential = new NetworkCredential();
                networkCredential.UserName = mailMessage.From.Address;
                networkCredential.Password = Password;
                smtp.UseDefaultCredentials = false;  // Enter seders User name and password  
                smtp.Credentials = networkCredential;
                smtp.Port = Convert.ToInt32(Port);
                smtp.Send(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                Worker.ExceptionsLog("Error while sending email using SMTP setting contact email address is:" + ToEmail + "  and the exception is " + ex.Message);
                Worker.LogMessage("Error while sending email using SMTP setting contact email address is:" + ToEmail + "  and the exception is " + ex.Message);
                return status;
            }
        }

    }
}
