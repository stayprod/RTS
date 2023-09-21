using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using realAdviceTriggerSystemAPI.Models;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LayoutController : ControllerBase
    {
        private readonly IConfiguration _config;
        public LayoutController(IConfiguration config)
        {
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
                return new JsonResult(exp);
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
                return new JsonResult(exp);
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
                return new JsonResult(exp);
            }
        }
    }
}
