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
                    TexteTemplate? _texteTemplate = con.TexteTemplates.Where(t => t.TemplateId == texteTemplate.TemplateId).FirstOrDefault();

                    if (_texteTemplate != null)
                    {
                 
                        _texteTemplate.EnglishSubject = texteTemplate.EnglishSubject;
                        _texteTemplate.EnglishTexte = texteTemplate.EnglishTexte;
                        _texteTemplate.DutchSubject = texteTemplate.DutchSubject;
                        _texteTemplate.DutchTexte = texteTemplate.DutchTexte;
                        _texteTemplate.FrenchSubject = texteTemplate.FrenchSubject;
                        _texteTemplate.FrenchTexte = texteTemplate.FrenchTexte;
                        _texteTemplate.TemplateName = texteTemplate.TemplateName;
                         con.SaveChanges();
                    } else
                    {
                        texteTemplate.CreatedOn = DateTime.Now;
                        con.TexteTemplates.Add(texteTemplate);
                        con.SaveChanges();
                    }

                   
                    return new JsonResult(texteTemplate);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteTexteTemplate")]
        public JsonResult DeleteTexteTemplate(int templateId)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    List<OfficeTrigger>? _triggers = con.OfficeTriggers.Where(c => c.TexteTemplateId == templateId).ToList();
                    if (_triggers == null)
                    {
                        TexteTemplate _templateToRemove = con.TexteTemplates.Where(d => d.TemplateId == templateId).First();
                        if (_templateToRemove != null)
                        {
                            con.TexteTemplates.Remove(_templateToRemove);
                            con.SaveChanges();
                        }
                        return new JsonResult("Texte template successfully deleted.");
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
