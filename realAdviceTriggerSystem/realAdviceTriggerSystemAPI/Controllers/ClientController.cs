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
                                   from _admin in cl_ad.DefaultIfEmpty()
                                   from _off in cl_of.DefaultIfEmpty()
                                   select ( new {
                                        client = c,
                                        admin = _admin,
                                        office = _off
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
