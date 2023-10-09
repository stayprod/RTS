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


        [HttpGet]
        [Route("GetAllTriggersByOffice")]
        public JsonResult GetAllTriggersByOffice(int officeId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<OfficeTrigger>? _officeTriggers = con.OfficeTriggers.Where(c => c.Officeid == officeId).ToList();
                    return new JsonResult(_officeTriggers);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }

        [HttpGet]
        [Route("GetAllTriggers")]
        public JsonResult GetAllTriggers()
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<OfficeTrigger>? _officeTriggers = con.OfficeTriggers.ToList();
                    return new JsonResult(_officeTriggers);
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

                    OfficeTrigger? _trigger = con.OfficeTriggers.Where(t => t.OfficeTriggerid == officeTrigger.OfficeTriggerid).FirstOrDefault();

                    if (_trigger != null)
                    {
                        _trigger.Officeid = officeTrigger.Officeid;
                        _trigger.Layoutid = officeTrigger.Layoutid;
                        _trigger.TriggerName = officeTrigger.TriggerName;
                        _trigger.KeyMoment = officeTrigger.KeyMoment;
                        _trigger.UpdatedOn = DateTime.Now;
                        _trigger.TriggerType = officeTrigger.TriggerType;
                        _trigger.DurationType = officeTrigger.DurationType;
                        _trigger.DurationValue = officeTrigger.DurationValue;
                        _trigger.TargetParticipant1 = officeTrigger.TargetParticipant1;
                        _trigger.CTarget1 = officeTrigger.CTarget1;
                        _trigger.Language = officeTrigger.Language;
                        _trigger.Texte = officeTrigger.Texte;
                        _trigger.AppointmentType = officeTrigger.AppointmentType;
                        _trigger.TransactionType = officeTrigger.TransactionType;
                        _trigger.TransactionStatus = officeTrigger.TransactionStatus;
                        con.SaveChanges();
                    }
                    else
                    {
                        officeTrigger.CreatedOn = DateTime.Now;
                        officeTrigger.UpdatedOn = DateTime.Now;
                        con.OfficeTriggers.Add(officeTrigger);
                        con.SaveChanges();
                    }

                    return new JsonResult(officeTrigger);
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }

        [HttpDelete]
        [Route("DeleteTrigger")]
        public JsonResult DeleteTrigger(int triggerId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {

                    OfficeTrigger _triggerToRemove = con.OfficeTriggers.Where(d => d.OfficeTriggerid == triggerId).First();
                    if(_triggerToRemove != null)
                    {
                        con.OfficeTriggers.Remove(_triggerToRemove);
                        con.SaveChanges();
                    }
                    return new JsonResult("");
                }
            }
            catch (Exception exp)
            {
                return new JsonResult(exp);
            }
        }
    }
}
