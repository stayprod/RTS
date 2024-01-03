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
                    Layout? _layout = con.Layouts.Where(c => c.Layoutid == layoutId && c.Active == 1).FirstOrDefault();
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
        [Route("GetLayoutsByClients")]
        public JsonResult GetLayoutsByClients(int clientId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<Layout>? _layouts = con.Layouts.Where(c => c.Clientid == clientId && c.Active == 1).ToList();
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
                    Layout? _layout = con.Layouts.Where(l => l.Layoutid == layout.Layoutid).FirstOrDefault();
                    if(_layout != null)
                    {
                        _layout.LayoutDetail = layout.LayoutDetail;
                        _layout.LayoutName = layout.LayoutName;
                        con.SaveChanges();
                    }
                    else
                    {
                        layout.CreatedOn = DateTime.Now;
                        con.Layouts.Add(layout);
                        con.SaveChanges();
                    }
                    return new JsonResult(layout);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteLayout")]
        public JsonResult DeleteLayout(int layoutId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<OfficeTrigger>? _triggers = con.OfficeTriggers.Where(c => c.Layoutid == layoutId).ToList();
                    if (_triggers.Count == 0)
                    {
                        Layout _layoutToRemove = con.Layouts.Where(d => d.Layoutid == layoutId).First();
                        if (_layoutToRemove != null)
                        {
                            _layoutToRemove.Active = 0;
                            //con.Layouts.Remove(_layoutToRemove);
                            con.SaveChanges();
                        }
                        return new JsonResult("Layout successfully deleted.");
                    }
                    else
                    {
                        return new JsonResult(_triggers);
                    }

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
