using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemAPI.Models;

public partial class TexteTemplate
{
    public int TemplateId { get; set; }

    public string TemplateName { get; set; } = null!;

    public string EnglishSubject { get; set; } = null!;

    public string? EnglishTexte { get; set; }

    public string? FrenchSubject { get; set; }

    public string? FrenchTexte { get; set; }

    public string? DutchSubject { get; set; }

    public string? DutchTexte { get; set; }

    public int? CreatedbyOfficeId { get; set; }

    public int? CreatedbyClientId { get; set; }

    public DateTime CreatedOn { get; set; }

    public ulong Active { get; set; }
}
