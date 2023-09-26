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
                return new JsonResult(exp);
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
                    Client? _client = con.Clients.Where(c => c.WhiseClientid == client.WhiseClientid).FirstOrDefault();

                    if (_client != null)
                    {
                        client.Clientid = _client.Clientid;
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
                return new JsonResult(exp);
            }
        }

        [HttpPost]
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

                    var _clients = from c in clients
                                   join ad in admindetails on c.Clientid equals ad.Clientid into cl_ad
                                   join o in offices on c.Clientid equals o.Clientid into cl_of
                                   select ( new {
                                        client = c,
                                        admin = cl_ad,
                                        office = cl_of
                                   });

                    return new JsonResult(_clients);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }
    }
}
