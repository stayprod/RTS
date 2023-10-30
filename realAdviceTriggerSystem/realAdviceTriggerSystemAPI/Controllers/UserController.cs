using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using realAdviceTriggerSystemAPI.Models;
using realAdviceTriggerSystemAPI.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace realAdviceTriggerSystemAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IJWTManagerRepository jWTManagerRepository;
        private readonly IConfiguration _config;
        private ExceptionWriter _exceptionWriter = new ExceptionWriter();
        public UserController(IJWTManagerRepository jWTManagerRepository, IConfiguration config)
        {
            this.jWTManagerRepository = jWTManagerRepository;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("AuthenticateUser")]
        public IActionResult AuthenticateUser(User usersdata)
        {
            try
            {
                using (var con = new RealadviceTriggeringSystemContext())
                {
                    User? userByEmail = con.Users.Where(u => u.UserEmail == usersdata.UserEmail).FirstOrDefault(); //

                    if (userByEmail == null)
                    {
                        return Content("Account doesn't exist with this email"); /*"Invalid email";*/
                    }

                    User? userByPassword = con.Users.Where(u => u.UserEmail == usersdata.UserEmail && u.UserPassword == usersdata.UserPassword).FirstOrDefault(); //

                    if (userByPassword == null)
                    {
                        return Content("Wrong Password"); /*"Invalid email";*/
                    }
                    Token token = jWTManagerRepository.Authenticate(userByPassword);
                    token.User = userByPassword;

                    return Ok(token);
                }
            }
            catch (Exception exp)
            {
                _exceptionWriter.WriteException(exp);
                return new JsonResult(exp.Message);
            }

        }

        public static string Encrypt(string input, string key)
        {
            byte[] inputArray = UTF8Encoding.UTF8.GetBytes(input);
            TripleDESCryptoServiceProvider tripleDES = new TripleDESCryptoServiceProvider();
            tripleDES.Key = UTF8Encoding.UTF8.GetBytes(key);
            tripleDES.Mode = CipherMode.ECB;
            tripleDES.Padding = PaddingMode.PKCS7;
            ICryptoTransform cTransform = tripleDES.CreateEncryptor();
            byte[] resultArray = cTransform.TransformFinalBlock(inputArray, 0, inputArray.Length);
            tripleDES.Clear();
            return Convert.ToBase64String(resultArray, 0, resultArray.Length);
        }

        public static string Decrypt(string input, string key)
        {
            try
            {
                byte[] inputArray = Convert.FromBase64String(input);
                TripleDESCryptoServiceProvider tripleDES = new TripleDESCryptoServiceProvider();
                tripleDES.Key = UTF8Encoding.UTF8.GetBytes(key);
                tripleDES.Mode = CipherMode.ECB;
                tripleDES.Padding = PaddingMode.PKCS7;
                ICryptoTransform cTransform = tripleDES.CreateDecryptor();
                byte[] resultArray = cTransform.TransformFinalBlock(inputArray, 0, inputArray.Length);
                tripleDES.Clear();
                return UTF8Encoding.UTF8.GetString(resultArray);
            }
            catch (Exception expObj)
            {
                return "false";
            }
        }
    }
}
