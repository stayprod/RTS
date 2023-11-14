using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemService.Models;

public partial class OfficeTrigger
{
    public int OfficeTriggerid { get; set; }

    public int? Officeid { get; set; }

    public int? Layoutid { get; set; }

    public string? TriggerName { get; set; }

    public string? KeyMoment { get; set; }

    public string? TriggerType { get; set; }

    public string? DurationType { get; set; }

    public int? DurationValue { get; set; }

    public string? TargetParticipant1 { get; set; }

    public string? CTarget1 { get; set; }

    public string? TargetParticipant2 { get; set; }

    public string? CTarget2 { get; set; }

    public string? Language { get; set; }

    public string? FrenchSubject { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? UpdatedOn { get; set; }

    public string? AppointmentType { get; set; }

    public string? TransactionType { get; set; }

    public string? TransactionStatus { get; set; }

    public int? WhiseOfficeid { get; set; }

    public int? WhiseClientid { get; set; }

    public string? SurveyLink { get; set; }

    public string? EnglishSubject { get; set; }

    public string? TexteEnglish { get; set; }

    public string? TexteFrench { get; set; }

    public string? DutchSubject { get; set; }

    public string? TexteDutch { get; set; }

    public string? ContactPreference { get; set; }
}
