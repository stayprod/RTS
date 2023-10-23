using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using realAdviceTriggerSystemAPI.Models;
using System.Drawing;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IConfiguration _config;
        public ClientController(IConfiguration config)
        {
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
                string filePath = @"E:\LogFile.txt";

                using (StreamWriter writer = new StreamWriter(filePath, true))
                {
                    writer.WriteLine("-----------------------------------------------------------------------------");
                    writer.WriteLine("Date : " + DateTime.Now.ToString());
                    writer.WriteLine();

                    while (exp != null)
                    {
                        writer.WriteLine(exp.GetType().FullName);
                        writer.WriteLine("Message : " + exp.Message);
                        writer.WriteLine("StackTrace : " + exp.StackTrace);
                    }
                }
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
            }
            catch (Exception exp)
            {
                return new JsonResult(exp.Message);
            }
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
                return new JsonResult(exp.Message);
            }
        }
    }
}
