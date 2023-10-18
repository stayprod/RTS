using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace realAdviceTriggerSystemAPI.Models;

public partial class RealadviceTriggeringSystemContext : DbContext
{
    public RealadviceTriggeringSystemContext()
    {
    }

    public RealadviceTriggeringSystemContext(DbContextOptions<RealadviceTriggeringSystemContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AdminDetail> AdminDetails { get; set; }

    public virtual DbSet<Client> Clients { get; set; }

    public virtual DbSet<Layout> Layouts { get; set; }

    public virtual DbSet<Office> Offices { get; set; }

    public virtual DbSet<OfficeSmtpsetting> OfficeSmtpsettings { get; set; }

    public virtual DbSet<OfficeTrigger> OfficeTriggers { get; set; }

    public virtual DbSet<PimcoreSetting> PimcoreSettings { get; set; }

    public virtual DbSet<RtsEmailLog> RtsEmailLogs { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySQL("server=localhost; port=3306; database=realadvice-triggering-system; user=pimcore_user; password=eezahtech*1;Persist Security Info=False;Connect Timeout=300;ConvertZeroDateTime=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AdminDetail>(entity =>
        {
            entity.HasKey(e => e.Adminid).HasName("PRIMARY");

            entity.ToTable("admin_detail");

            entity.Property(e => e.Adminid)
                .HasColumnType("int(11)")
                .HasColumnName("adminid");
            entity.Property(e => e.AccountNumber)
                .HasMaxLength(100)
                .HasDefaultValueSql("'0'")
                .HasColumnName("account_number");
            entity.Property(e => e.BankName)
                .HasMaxLength(500)
                .HasDefaultValueSql("'0'")
                .HasColumnName("bank_name");
            entity.Property(e => e.Bic)
                .HasMaxLength(100)
                .HasDefaultValueSql("'0'")
                .HasColumnName("bic");
            entity.Property(e => e.Clientid)
                .HasColumnType("int(11)")
                .HasColumnName("clientid");
            entity.Property(e => e.Iban)
                .HasMaxLength(100)
                .HasDefaultValueSql("'0'")
                .HasColumnName("iban");
            entity.Property(e => e.LegalName)
                .HasMaxLength(500)
                .HasDefaultValueSql("'0'")
                .HasColumnName("legal_name");
            entity.Property(e => e.VatNumber)
                .HasMaxLength(500)
                .HasDefaultValueSql("'0'")
                .HasColumnName("vat_number");
        });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(e => e.Clientid).HasName("PRIMARY");

            entity.ToTable("clients");

            entity.Property(e => e.Clientid)
                .HasColumnType("int(11)")
                .HasColumnName("clientid");
            entity.Property(e => e.ActivationStatus)
                .HasMaxLength(100)
                .HasColumnName("activation_status");
            entity.Property(e => e.BoxNumber)
                .HasColumnType("text")
                .HasColumnName("box_number");
            entity.Property(e => e.City)
                .HasColumnType("text")
                .HasColumnName("city");
            entity.Property(e => e.Comments)
                .HasColumnType("text")
                .HasColumnName("comments");
            entity.Property(e => e.CommercialName)
                .HasMaxLength(500)
                .HasColumnName("commercial_name");
            entity.Property(e => e.Country)
                .HasColumnType("text")
                .HasColumnName("country");
            entity.Property(e => e.CrmDetail)
                .HasColumnType("text")
                .HasColumnName("crm_detail");
            entity.Property(e => e.Email)
                .HasColumnType("text")
                .HasColumnName("email");
            entity.Property(e => e.Logo)
                .HasMaxLength(500)
                .HasColumnName("logo");
            entity.Property(e => e.North)
                .HasColumnType("text")
                .HasColumnName("north");
            entity.Property(e => e.PhoneNumber)
                .HasColumnType("text")
                .HasColumnName("phone_number");
            entity.Property(e => e.Street)
                .HasColumnType("text")
                .HasColumnName("street");
            entity.Property(e => e.Website)
                .HasColumnType("text")
                .HasColumnName("website");
            entity.Property(e => e.WhiseClientid)
                .HasColumnType("int(20)")
                .HasColumnName("whise_clientid");
            entity.Property(e => e.ZipCode)
                .HasColumnType("text")
                .HasColumnName("zip_code");
        });

        modelBuilder.Entity<Layout>(entity =>
        {
            entity.HasKey(e => e.Layoutid).HasName("PRIMARY");

            entity.ToTable("layouts");

            entity.Property(e => e.Layoutid)
                .HasColumnType("int(11)")
                .HasColumnName("layoutid");
            entity.Property(e => e.Clientid)
                .HasColumnType("int(11)")
                .HasColumnName("clientid");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.LayoutDetail)
                .HasColumnType("varchar(60000)")
                .HasColumnName("layout_detail");
            entity.Property(e => e.LayoutName)
                .HasMaxLength(60)
                .HasColumnName("layout_name");
            entity.Property(e => e.Officeid)
                .HasColumnType("int(11)")
                .HasColumnName("officeid");
        });

        modelBuilder.Entity<Office>(entity =>
        {
            entity.HasKey(e => e.Officeid).HasName("PRIMARY");

            entity.ToTable("offices");

            entity.Property(e => e.Officeid)
                .HasColumnType("int(11)")
                .HasColumnName("officeid");
            entity.Property(e => e.Clientid)
                .HasColumnType("int(11)")
                .HasColumnName("clientid");
            entity.Property(e => e.CommercialName)
                .HasMaxLength(200)
                .HasColumnName("commercial_name");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.CrmDetail)
                .HasMaxLength(200)
                .HasColumnName("crm_detail");
            entity.Property(e => e.OfficeImg)
                .HasMaxLength(500)
                .HasColumnName("office_img");
            entity.Property(e => e.SmtpSettingid)
                .HasColumnType("int(11)")
                .HasColumnName("smtp_settingid");
            entity.Property(e => e.UniqueKey)
                .HasMaxLength(200)
                .HasColumnName("unique_key");
            entity.Property(e => e.WhiseOfficeid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_officeid");
        });

        modelBuilder.Entity<OfficeSmtpsetting>(entity =>
        {
            entity.HasKey(e => e.Settingid).HasName("PRIMARY");

            entity.ToTable("office_smtpsettings");

            entity.Property(e => e.Settingid)
                .HasColumnType("int(11)")
                .HasColumnName("settingid");
            entity.Property(e => e.Clientid)
                .HasColumnType("int(11)")
                .HasColumnName("clientid");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.EmailProvider)
                .HasColumnType("text")
                .HasColumnName("email_provider");
            entity.Property(e => e.ImapServer)
                .HasColumnType("text")
                .HasColumnName("imap_server");
            entity.Property(e => e.Officeid)
                .HasColumnType("int(11)")
                .HasColumnName("officeid");
            entity.Property(e => e.Password)
                .HasColumnType("text")
                .HasColumnName("password");
            entity.Property(e => e.Port)
                .HasColumnType("text")
                .HasColumnName("port");
            entity.Property(e => e.SslSetting)
                .HasColumnType("tinyint(4)")
                .HasColumnName("ssl_setting");
            entity.Property(e => e.UpdatedOn)
                .HasColumnType("datetime")
                .HasColumnName("updated_on");
            entity.Property(e => e.UserName)
                .HasColumnType("text")
                .HasColumnName("user_name");
            entity.Property(e => e.WhiseClientid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_clientid");
            entity.Property(e => e.WhiseOfficeid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_officeid");
        });

        modelBuilder.Entity<OfficeTrigger>(entity =>
        {
            entity.HasKey(e => e.OfficeTriggerid).HasName("PRIMARY");

            entity.ToTable("office_triggers");

            entity.Property(e => e.OfficeTriggerid)
                .HasColumnType("int(11)")
                .HasColumnName("office_triggerid");
            entity.Property(e => e.AppointmentType)
                .HasMaxLength(45)
                .HasColumnName("appointment_type");
            entity.Property(e => e.CTarget1)
                .HasColumnType("text")
                .HasColumnName("c_target_1");
            entity.Property(e => e.CTarget2)
                .HasColumnType("text")
                .HasColumnName("c_target_2");
            entity.Property(e => e.ContactPreference)
                .HasColumnType("text")
                .HasColumnName("contact_preference");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.DurationType)
                .HasMaxLength(200)
                .HasColumnName("duration_type");
            entity.Property(e => e.DurationValue)
                .HasColumnType("int(11)")
                .HasColumnName("duration_value");
            entity.Property(e => e.KeyMoment)
                .HasMaxLength(200)
                .HasColumnName("key_moment");
            entity.Property(e => e.Language)
                .HasMaxLength(50)
                .HasColumnName("language");
            entity.Property(e => e.Layoutid)
                .HasColumnType("int(11)")
                .HasColumnName("layoutid");
            entity.Property(e => e.Officeid)
                .HasColumnType("int(11)")
                .HasColumnName("officeid");
            entity.Property(e => e.SurveyLink)
                .HasColumnType("text")
                .HasColumnName("survey_link");
            entity.Property(e => e.TargetParticipant1)
                .HasColumnType("text")
                .HasColumnName("target_participant_1");
            entity.Property(e => e.TargetParticipant2)
                .HasColumnType("text")
                .HasColumnName("target_participant_2");
            entity.Property(e => e.TexteDutch)
                .HasColumnType("text")
                .HasColumnName("texte_dutch");
            entity.Property(e => e.TexteEnglish)
                .HasColumnType("text")
                .HasColumnName("texte_english");
            entity.Property(e => e.TexteFrench)
                .HasColumnType("text")
                .HasColumnName("texte_french");
            entity.Property(e => e.TransactionStatus)
                .HasMaxLength(45)
                .HasColumnName("transaction_status");
            entity.Property(e => e.TransactionType)
                .HasMaxLength(45)
                .HasColumnName("transaction_type");
            entity.Property(e => e.TriggerName)
                .HasMaxLength(200)
                .HasColumnName("trigger_name");
            entity.Property(e => e.TriggerType)
                .HasMaxLength(200)
                .HasColumnName("trigger_type");
            entity.Property(e => e.UpdatedOn)
                .HasColumnType("datetime")
                .HasColumnName("updated_on");
            entity.Property(e => e.WhiseClientid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_clientid");
            entity.Property(e => e.WhiseOfficeid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_officeid");
        });

        modelBuilder.Entity<PimcoreSetting>(entity =>
        {
            entity.HasKey(e => e.PimcoreSettingid).HasName("PRIMARY");

            entity.ToTable("pimcore_setting");

            entity.Property(e => e.PimcoreSettingid)
                .HasColumnType("int(11)")
                .HasColumnName("pimcore_settingid");
            entity.Property(e => e.CreatedOn)
                .HasColumnType("datetime")
                .HasColumnName("created_on");
            entity.Property(e => e.FirstName)
                .HasMaxLength(200)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(200)
                .HasColumnName("last_name");
            entity.Property(e => e.LoginId)
                .HasMaxLength(200)
                .HasColumnName("login_id");
            entity.Property(e => e.Officeid)
                .HasColumnType("int(11)")
                .HasColumnName("officeid");
            entity.Property(e => e.WhiseOfficeid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_officeid");
        });

        modelBuilder.Entity<RtsEmailLog>(entity =>
        {
            entity.HasKey(e => e.OfficeTriggerid).HasName("PRIMARY");

            entity.ToTable("rts_email_log");

            entity.Property(e => e.OfficeTriggerid)
                .HasColumnType("int(11)")
                .HasColumnName("office_triggerid");
            entity.Property(e => e.Email)
                .HasMaxLength(45)
                .HasColumnName("email");
            entity.Property(e => e.WhiseClientid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_clientid");
            entity.Property(e => e.WhiseOfficeid)
                .HasColumnType("int(11)")
                .HasColumnName("whise_officeid");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
