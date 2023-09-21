using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemAPI.Models;

public partial class Office
{
    public int Officeid { get; set; }

    public int? Clientid { get; set; }

    public int? WhiseOfficeid { get; set; }

    public string? CommercialName { get; set; }

    public string? CrmDetail { get; set; }

    public string? UniqueKey { get; set; }

    public string? OfficeImg { get; set; }

    public DateTime? CreatedOn { get; set; }
}
