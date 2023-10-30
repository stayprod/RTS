using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using realAdviceTriggerSystemAPI.Models;
using realAdviceTriggerSystemAPI.Repository;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public OfficeController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
            _config = config;
        }

        [HttpGet]
        [Route("GetOfficeDetail")]
        public JsonResult GetOfficeDetail(int whiseOfficeId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    Office? _office = con.Offices.Where(c => c.WhiseOfficeid == whiseOfficeId).FirstOrDefault();
                    return new JsonResult(_office);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
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

                    Office? _office = con.Offices.Where(t => t.Officeid == office.Officeid).FirstOrDefault();

                    if (_office != null)
                    {
                        _office.CrmDetail = office.CrmDetail;
                        _office.UniqueKey = office.UniqueKey;
                        _office.SmtpSettingid = office.SmtpSettingid;
                        con.SaveChanges();
                    }
                    else
                    {
                        office.CreatedOn = DateTime.Now;
                        con.Offices.Add(office);
                        con.SaveChanges();
                    }

                    return new JsonResult(office);
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
