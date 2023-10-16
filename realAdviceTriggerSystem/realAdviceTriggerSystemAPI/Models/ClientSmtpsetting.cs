using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemAPI.Models;

public partial class ClientSmtpsetting
{
    public int Settingid { get; set; }

    public int? Clientid { get; set; }

    public int? Officeid { get; set; }

    public int? WhiseClientid { get; set; }

    public int? WhiseOfficeid { get; set; }

    public string? EmailProvider { get; set; }

    public string? UserName { get; set; }

    public string? Password { get; set; }

    public string? ImapServer { get; set; }

    public string? Port { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public sbyte? SslSetting { get; set; }
}
