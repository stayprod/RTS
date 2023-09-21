using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using realAdviceTriggerSystemAPI.Models;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeTriggerController : ControllerBase
    {
        private readonly IConfiguration _config;
        public OfficeTriggerController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        [Route("GetOfficeTriggerDetail")]
        public JsonResult GetOfficeTriggerDetail(int officeId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    OfficeTrigger? _officeTrigger = con.OfficeTriggers.Where(c => c.Officeid == officeId).FirstOrDefault();
                    return new JsonResult(_officeTrigger);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }

        [HttpPost]
        [Route("SaveOfficeTriggerDetail")]
        public JsonResult SaveOfficeTriggerDetail(OfficeTrigger officeTrigger)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    con.OfficeTriggers.Add(officeTrigger);
                    con.SaveChanges();
                    return new JsonResult(officeTrigger);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }
    }
}
