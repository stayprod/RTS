using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using realAdviceTriggerSystemAPI.Models;
using realAdviceTriggerSystemAPI.Repository;
using System.Drawing;
using System.Runtime.Intrinsics.Arm;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PimcoreSettingsController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public PimcoreSettingsController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
            _config = config;
        }

        [HttpGet]
        [Route("GetPimcoreDetail")]
        public JsonResult GetPimcoreDetail(int whiseOfficeId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<PimcoreSetting>? _pimcore = con.PimcoreSettings.Where(c => c.WhiseOfficeid == whiseOfficeId).ToList();
                    return new JsonResult(_pimcore);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpPost]
        [Route("SavePimcoreSetting")]
        public JsonResult SavePimcoreSetting(List<PimcoreSetting> pimcore)
        {
            try
            {
                List<PimcoreSetting> _finalPimSetting = new List<PimcoreSetting>();
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    foreach(var pimObj in pimcore)
                    {
                        var _pimcore = (from p in con.PimcoreSettings where p.PimcoreSettingid == pimObj.PimcoreSettingid select p).SingleOrDefault();
                        //con.PimcoreSettings.Where(t => t.PimcoreSettingid == pimObj.PimcoreSettingid).FirstOrDefault();

                        if (_pimcore != null)
                        {
                            var settingId = _pimcore.PimcoreSettingid;
                            var fname = _pimcore.FirstName == pimObj.FirstName ? _pimcore.FirstName : pimObj.FirstName;
                            var lname = _pimcore.LastName == pimObj.LastName ? _pimcore.LastName : pimObj.LastName;
                            var loginId = _pimcore.LoginId == pimObj.LoginId ? _pimcore.LoginId : pimObj.LoginId;

                            _pimcore.Officeid = pimObj.Officeid;
                            _pimcore.PimcoreSettingid = settingId;
                            _pimcore.FirstName = fname;
                            _pimcore.LastName = lname;
                            _pimcore.LoginId = loginId;
                            con.SaveChanges();
                        }
                        else
                        {
                            pimObj.CreatedOn = DateTime.Now;
                            con.PimcoreSettings.Add(pimObj);
                            con.SaveChanges();
                        }
                        _finalPimSetting.Add(pimObj);
                    }

                    return new JsonResult(_finalPimSetting);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpDelete]
        [Route("DeletePimcoreSetting")]
        public JsonResult DeletePimcoreSetting(List<PimcoreSetting> pimcore)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {

                    foreach (var item in pimcore)
                    {
                        PimcoreSetting setting = con.PimcoreSettings.Where(d => d.PimcoreSettingid == item.PimcoreSettingid).First();
                        con.PimcoreSettings.Remove(setting);
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
