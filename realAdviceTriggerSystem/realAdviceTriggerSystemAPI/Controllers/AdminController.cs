using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySqlX.XDevAPI;
using realAdviceTriggerSystemAPI.Models;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IConfiguration _config;
        public AdminController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        [Route("GetAdminDetail")]
        public JsonResult GetAdminDetail(int clientId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    AdminDetail? _admin = con.AdminDetails.Where(a => a.Clientid == clientId).FirstOrDefault();
                    return new JsonResult(_admin);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }

        [HttpPost]
        [Route("SaveAdminDetail")]
        public JsonResult SaveAdminDetail(AdminDetail admin)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    AdminDetail? _admin = con.AdminDetails.Where(a => a.Clientid == admin.Clientid).FirstOrDefault();
                    if(_admin != null)
                    {
                        admin.Adminid = _admin.Adminid;
                        con.SaveChanges();
                    }
                    else
                    {
                        con.AdminDetails.Add(admin);
                        con.SaveChanges();
                    }

                    return new JsonResult(admin);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }
    }
}
