using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
//using MySqlX.XDevAPI;
using realAdviceTriggerSystemAPI.Models;
using realAdviceTriggerSystemAPI;
using realAdviceTriggerSystemAPI.Repository;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public AdminController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
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
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
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
                        _admin.LegalName = admin.LegalName;
                        _admin.VatNumber = admin.VatNumber;
                        _admin.BankName = admin.BankName;
                        _admin.AccountNumber = admin.AccountNumber;
                        _admin.Bic = admin.Bic;
                        _admin.Iban = admin.Iban;
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
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }
    }
}
