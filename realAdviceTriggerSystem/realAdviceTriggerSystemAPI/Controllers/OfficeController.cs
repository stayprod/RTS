using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using realAdviceTriggerSystemAPI.Models;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeController : ControllerBase
    {
        private readonly IConfiguration _config;
        public OfficeController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        [Route("GetOfficeDetail")]
        public JsonResult GetOfficeDetail(int officeId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    Office? _office = con.Offices.Where(c => c.WhiseOfficeid == officeId).FirstOrDefault();
                    return new JsonResult(_office);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }

        [HttpPost]
        [Route("SaveOfficeDetail")]
        public JsonResult SaveOfficeDetail(Office office)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    con.Offices.Add(office);
                    con.SaveChanges();
                    return new JsonResult(office);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }
    }
}
