using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemAPI.Models;

public partial class RtsEmailLog
{
    public int OfficeTriggerid { get; set; }

    public string? Email { get; set; }

    public int? WhiseOfficeid { get; set; }

    public int? WhiseClientid { get; set; }
}
