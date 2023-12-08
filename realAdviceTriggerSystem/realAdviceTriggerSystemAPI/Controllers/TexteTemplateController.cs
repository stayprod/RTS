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
    public class TexteTemplateController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public TexteTemplateController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
            _config = config;
        }

        [HttpGet]
        [Route("GetTexteTemplateById")]
        public JsonResult GetTexteTemplateById(int templateId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    TexteTemplate? _layout = con.TexteTemplates.Where(c => c.TemplateId == templateId).FirstOrDefault();
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
        [Route("GetTexteTemplatesByClient")]
        public JsonResult GetTexteTemplatesByClient(int clientId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<TexteTemplate>? _layouts = con.TexteTemplates.Where(c => c.CreatedbyClientId == clientId).ToList();
                    return new JsonResult(_layouts);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpGet]
        [Route("GetTexteTemplatesByOffice")]
        public JsonResult GetTexteTemplatesByOffice(int officeId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<TexteTemplate>? _layouts = con.TexteTemplates.Where(c => c.CreatedbyOfficeId == officeId).ToList();
                    return new JsonResult(_layouts);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpGet]
        [Route("GetAllTexteTemplates")]
        public JsonResult GetAllTexteTemplates()
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<TexteTemplate>? _layouts = con.TexteTemplates.ToList();
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
        [Route("SaveTexteTemplate")]
        public JsonResult SaveTexteTemplate(TexteTemplate texteTemplate)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    texteTemplate.CreatedOn = DateTime.Now;
                    con.TexteTemplates.Add(texteTemplate);
                    con.SaveChanges();
                    return new JsonResult(texteTemplate);
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
