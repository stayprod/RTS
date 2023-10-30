using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemAPI.Models;

public partial class User
{
    public int Userid { get; set; }

    public string? UserName { get; set; }

    public string? UserEmail { get; set; }

    public string? UserPassword { get; set; }

    public string? UserIp { get; set; }

    public string? UserCountry { get; set; }

    public string? UserCity { get; set; }

    public string? UserState { get; set; }

    public string? UserStreet { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? UpdateOn { get; set; }

    public ulong? Status { get; set; }
}
