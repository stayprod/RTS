using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using realAdviceTriggerSystemAPI.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace realAdviceTriggerSystemAPI.Repository
{
    public class JWTManagerRepository : IJWTManagerRepository
    {
        private readonly IConfiguration iconfiguration;
        public JWTManagerRepository(IConfiguration iconfiguration)
        {
            this.iconfiguration = iconfiguration;
        }
        public Token Authenticate(User user)
        {

            // Else we generate JSON Web Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes(iconfiguration["JWT:Key"]);

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(iconfiguration["JWT:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.Email, user.UserEmail)
                }),
                Expires = DateTime.Now.AddHours(1),
                SigningCredentials = credentials
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            Token _token = new Token();
            _token.TokenValue = tokenHandler.WriteToken(token);
            _token.ExpiryDateTime = tokenDescriptor.Expires;
;            return _token;

        }

    }
}
