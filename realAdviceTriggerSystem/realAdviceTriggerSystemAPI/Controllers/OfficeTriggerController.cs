using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using realAdviceTriggerSystemAPI.Models;
using realAdviceTriggerSystemAPI.Repository;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeTriggerController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public OfficeTriggerController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
            _config = config;
        }

        [HttpGet]
        [Route("GetOfficeTriggerDetail")]
        public JsonResult GetOfficeTriggerDetail(int triggerId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    OfficeTrigger? _officeTrigger = con.OfficeTriggers.Where(c => c.OfficeTriggerid == triggerId).FirstOrDefault();
                    return new JsonResult(_officeTrigger);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpGet]
        [Route("GetAllEmailsTransactionLog")]
        public JsonResult GetAllEmailsTransactionLog()
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<RtsEmailLog>? _rtsEmailsTransactionLog = con.RtsEmailLogs.ToList();
                    return new JsonResult(_rtsEmailsTransactionLog);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpGet]
        [Route("GetAllTriggersEmailsTransactionLog")]
        public JsonResult GetAllTriggersEmailsTransactionLog()
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<TriggerEmailTransactionLog>? _rtsEmailsTransactionLog = con.TriggerEmailTransactionLogs.ToList();
                    return new JsonResult(_rtsEmailsTransactionLog);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
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
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
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
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
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
                        _trigger.AppointmentType = officeTrigger.AppointmentType;
                        _trigger.TransactionType = officeTrigger.TransactionType;
                        _trigger.TransactionStatus = officeTrigger.TransactionStatus;
                        _trigger.WhiseOfficeid = officeTrigger.WhiseOfficeid;
                        _trigger.WhiseClientid = officeTrigger.WhiseClientid;
                        _trigger.SurveyLink = officeTrigger.SurveyLink;
                        _trigger.TexteEnglish = officeTrigger.TexteEnglish;
                        _trigger.TexteFrench = officeTrigger.TexteFrench;
                        _trigger.TexteDutch = officeTrigger.TexteDutch;
                        _trigger.ContactPreference = officeTrigger.ContactPreference;
                        _trigger.EnglishSubject = officeTrigger.EnglishSubject;
                        _trigger.FrenchSubject = officeTrigger.FrenchSubject;
                        _trigger.DutchSubject = officeTrigger.DutchSubject;
                        _trigger.TexteTemplateId = officeTrigger.TexteTemplateId;
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
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpPost]
        [Route("UpdateTriggersLayout")]
        public JsonResult UpdateTriggersLayout(List<OfficeTrigger> _trigger)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    foreach(var trigger in _trigger)
                    {
                        OfficeTrigger _triggerToUpdate = con.OfficeTriggers.Where(d => d.OfficeTriggerid == trigger.OfficeTriggerid).First();
                        if (_triggerToUpdate != null)
                        {
                            _triggerToUpdate.Layoutid = trigger.Layoutid;
                            con.SaveChanges();
                        }
                    }
                    return new JsonResult("Triggers layout updated successfully");
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpPost]
        [Route("UpdateTriggersTexteTemplate")]
        public JsonResult UpdateTriggersTexteTemplate(List<OfficeTrigger> _trigger)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    foreach (var trigger in _trigger)
                    {
                        OfficeTrigger _triggerToUpdate = con.OfficeTriggers.Where(d => d.OfficeTriggerid == trigger.OfficeTriggerid).First();
                        if (_triggerToUpdate != null)
                        {
                            _triggerToUpdate.TexteTemplateId = trigger.TexteTemplateId;
                            con.SaveChanges();
                        }
                    }
                    return new JsonResult("Triggers texte template updated successfully");
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
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
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }
    }
}
