using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemService.Models;

public partial class Layout
{
    public int Layoutid { get; set; }

    public int? Officeid { get; set; }

    public int? Clientid { get; set; }

    public string? LayoutName { get; set; }

    public string? LayoutDetail { get; set; }

    public DateTime? CreatedOn { get; set; }
}
