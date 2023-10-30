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
    public class LayoutController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public LayoutController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
            _config = config;
        }

        [HttpGet]
        [Route("GetLayoutById")]
        public JsonResult GetLayoutById(int layoutId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    Layout? _layout = con.Layouts.Where(c => c.Layoutid == layoutId).FirstOrDefault();
                    return new JsonResult(_layout);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpGet]
        [Route("GetLayoutsByOffice")]
        public JsonResult GetLayoutsByOffice(int officeId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<Layout>? _layouts = con.Layouts.Where(c => c.Officeid == officeId).ToList();
                    return new JsonResult(_layouts);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpPost]
        [Route("SaveOfficeLayout")]
        public JsonResult SaveOfficeLayout(Layout layout)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    layout.CreatedOn = DateTime.Now;
                    con.Layouts.Add(layout);
                    con.SaveChanges();
                    return new JsonResult(layout);
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
