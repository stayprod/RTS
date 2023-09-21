using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemAPI.Models;

public partial class AdminDetail
{
    public int Adminid { get; set; }

    public int Clientid { get; set; }

    public string LegalName { get; set; } = null!;

    public string VatNumber { get; set; } = null!;

    public string BankName { get; set; } = null!;

    public string AccountNumber { get; set; } = null!;

    public string Bic { get; set; } = null!;

    public string Iban { get; set; } = null!;
}
