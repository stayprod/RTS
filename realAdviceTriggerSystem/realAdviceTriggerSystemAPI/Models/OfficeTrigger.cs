using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemAPI.Models;

public partial class OfficeTrigger
{
    public int OfficeTriggerid { get; set; }

    public int Officeid { get; set; }

    public string TriggerName { get; set; } = null!;

    public string KeyMoment { get; set; } = null!;

    public string TriggerType { get; set; } = null!;

    public string DurationType { get; set; } = null!;

    public int DurationValue { get; set; }

    public string? TargetParticipant1 { get; set; }

    public string? CTarget1 { get; set; }

    public string? TargetParticipant2 { get; set; }

    public string? CTarget2 { get; set; }
}
