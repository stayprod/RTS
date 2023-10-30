using realAdviceTriggerSystemAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace realAdviceTriggerSystemAPI.Repository
{
   public interface IJWTManagerRepository
    {
        //List<Users> GetUser();
        Token Authenticate(User users);
    }
}
