using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using realAdviceTriggerSystemAPI.Models;
using realAdviceTriggerSystemAPI.Repository;
using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public ClientController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
            _config = config;
        }

        [HttpGet]
        [Route("GetClientDetail")]
        public JsonResult GetClientDetail(int clientId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    Client? _client = con.Clients.Where(c => c.WhiseClientid == clientId).FirstOrDefault();
                    return new JsonResult(_client);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpPost]
        [Route("SaveClientDetail")]
        public JsonResult SaveClientDetail(Client client)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    Client? _client = con.Clients.Where(c => c.Clientid == client.Clientid).FirstOrDefault();

                    if (_client != null)
                    {
                        _client.ActivationStatus = client.ActivationStatus;
                        _client.BoxNumber = client.BoxNumber;
                        _client.City = client.City;
                        _client.Comments = client.Comments;
                        _client.CommercialName = client.CommercialName;
                        _client.Country = client.Country;
                        _client.CrmDetail = client.CrmDetail;
                        _client.Email = client.Email;
                        _client.North = client.North;
                        _client.PhoneNumber = client.PhoneNumber;
                        _client.Street = client.Street;
                        _client.Website = client.Website;
                        _client.ZipCode = client.ZipCode;
                        con.SaveChanges();
                    }
                    else
                    {
                        con.Clients.Add(client);
                        con.SaveChanges();
                    }

                    return new JsonResult(client);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpGet]
        [Route("GetAllClientsDetail")]
        public JsonResult GetAllClientsDetail()
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<Client> clients = con.Clients.ToList();
                    List<AdminDetail> admindetails = con.AdminDetails.ToList();
                    List<Office> offices = con.Offices.ToList();
                    List<OfficeTrigger> triggers = con.OfficeTriggers.ToList();

                    var _clients = from c in clients
                                   join ad in admindetails on c.Clientid equals ad.Clientid into cl_ad
                                   join o in offices on c.Clientid equals o.Clientid into cl_of
                                   join t in triggers on c.WhiseClientid equals t.WhiseClientid into of_triggers
                                   select ( new {
                                        client = c,
                                        admin = cl_ad,
                                        office = cl_of,
                                        triggers = of_triggers
                                   });

                    return new JsonResult(_clients);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpPost]
        [Route("SaveSMTPSettings")]
        public JsonResult SaveSMTPSettings(OfficeSmtpsetting smtpObj)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    if (ValidateNewSMTPSettings("abid.mahmood8@gmail.com", "Validate new client SMTP Settings", "Validate new client SMTP Settings", smtpObj, true))
                    {

                        OfficeSmtpsetting? _smtpSetting = con.OfficeSmtpsettings.Where(c => c.Settingid == smtpObj.Settingid).FirstOrDefault();

                        if (_smtpSetting != null)
                        {
                            _smtpSetting.Clientid = smtpObj.Clientid;
                            _smtpSetting.Officeid = smtpObj.Officeid;
                            _smtpSetting.WhiseClientid = smtpObj.WhiseClientid;
                            _smtpSetting.WhiseOfficeid = smtpObj.WhiseOfficeid;
                            _smtpSetting.EmailProvider = smtpObj.EmailProvider;
                            _smtpSetting.UserName = smtpObj.UserName;
                            _smtpSetting.Password = smtpObj.Password;
                            _smtpSetting.ImapServer = smtpObj.ImapServer;
                            _smtpSetting.Port = smtpObj.Port;
                            _smtpSetting.SslSetting = smtpObj.SslSetting;
                            _smtpSetting.UpdatedOn = DateTime.Now;
                            con.SaveChanges();
                        }
                        else
                        {
                            smtpObj.CreatedOn = DateTime.Now;
                            smtpObj.UpdatedOn = DateTime.Now;
                            con.OfficeSmtpsettings.Add(smtpObj);
                            con.SaveChanges();
                        }

                        return new JsonResult(smtpObj);
                    }
                    else
                    {
                        return new JsonResult("SMTP Settings invalid");
                    }
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        private bool ValidateNewSMTPSettings(string ToEmail, string Subject, string Message, OfficeSmtpsetting settings, bool IsBodyHtml = true)
        {
            bool status = false;
            try
            {
                string HostAddress = settings.ImapServer;
                string FormEmailId = settings.EmailProvider;
                string Password = settings.Password;
                string Port = settings.Port.ToString();
                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(FormEmailId);
                mailMessage.Subject = Subject;
                mailMessage.Body = Message;
                mailMessage.IsBodyHtml = IsBodyHtml;
                mailMessage.To.Add(new MailAddress(ToEmail));// (SenderEmail));
                
                SmtpClient smtp = new SmtpClient();
                smtp.Host = HostAddress;
                smtp.EnableSsl = Convert.ToBoolean(settings.SslSetting);
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
                //Worker.ExceptionsLog("Error while sending email using SMTP setting contact email address is:" + ToEmail + "  and the exception is " + ex.Message);
                //Worker.LogMessage("Error while sending email using SMTP setting contact email address is:" + ToEmail + "  and the exception is " + ex.Message);
                return status;
            }
            /*
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    OfficeSmtpsetting? _client = con.OfficeSmtpsettings.Where(c => c.Officeid == officeid).FirstOrDefault();
                    return new JsonResult(_client);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }*/
            /*
            try
            {
                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(FormEmailId);
                mailMessage.Subject = "Validate new client SMTP Settings";
                mailMessage.Body = "Validate new client SMTP Settings";
                mailMessage.IsBodyHtml = true;// IsBodyHtml;
                mailMessage.To.Add(new MailAddress(ToEmail));// (SenderEmail));
                
                SmtpClient smtp = new SmtpClient();
                smtp.Host = HostAddress; // take from user
                smtp.EnableSsl = false; // take from user
                NetworkCredential networkCredential = new NetworkCredential();
                networkCredential.UserName = mailMessage.From.Address; // take from user
                networkCredential.Password = Password; // take from user
                smtp.UseDefaultCredentials = false;  // Enter seders User name and password  
                smtp.Credentials = networkCredential;
                smtp.Port = Convert.ToInt32(Port);  // take from user
                smtp.Send(mailMessage);
                return true;
                //smtpClient.Send(new mailmessage("test@test.com", "test@test.com", "test", "test"));

                //return string.Empty;
            }
            catch (SmtpFailedRecipientException)
            {
                return string.Empty;
            }
            catch (Exception ex)
            {
                return string.Format("SMTP server connection test failed: {0}", ex.InnerException != null ? ex.InnerException.Message : ex.Message);
            }
            return true;*/
        }

        [HttpGet]
        [Route("GetSMTPDetail")]
        public JsonResult GetSMTPDetail(int officeid)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    OfficeSmtpsetting? _client = con.OfficeSmtpsettings.Where(c => c.Officeid == officeid).FirstOrDefault();
                    return new JsonResult(_client);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }
    }
}
