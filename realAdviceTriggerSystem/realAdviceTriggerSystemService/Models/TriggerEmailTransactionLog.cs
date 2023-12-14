using System;
using System.Collections.Generic;

namespace realAdviceTriggerSystemService.Models;

public partial class TriggerEmailTransactionLog
{
    public int EmailTransactionLogId { get; set; }

    public int TriggerType { get; set; }

    public int CalendarEventId { get; set; }

    public DateTime TransactionDate { get; set; }

    public string? Error { get; set; }

    public string? Status { get; set; }

    public ulong? EmailOpened { get; set; }

    public ulong? LinkClicked { get; set; }

    public string? ClientName { get; set; }

    public int ClientId { get; set; }

    public string? OfficeName { get; set; }

    public int OfficeId { get; set; }

    public int? UserId { get; set; }

    public DateTime? AppointmentStartDate { get; set; }

    public DateTime? AppointmentEndDate { get; set; }

    public int? ContactId { get; set; }

    public int? EstateId { get; set; }
}
