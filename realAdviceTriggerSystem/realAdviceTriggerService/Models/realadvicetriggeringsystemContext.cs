using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace realAdviceTriggerSystemService.Models
{
    public partial class realadvicetriggeringsystemContext : DbContext
    {
        public realadvicetriggeringsystemContext()
        {
        }

        public realadvicetriggeringsystemContext(DbContextOptions<realadvicetriggeringsystemContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AdminDetail> AdminDetail { get; set; }
        public virtual DbSet<Clients> Clients { get; set; }
        public virtual DbSet<Layouts> Layouts { get; set; }
        public virtual DbSet<OfficeTriggers> OfficeTriggers { get; set; }
        public virtual DbSet<Offices> Offices { get; set; }
        public virtual DbSet<PimcoreSetting> PimcoreSetting { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("server=localhost;port=3306;database=realadvice-triggering-system;user=pimcore_user;password=eezahtech*1;persist security info=False;connect timeout=300;convertzerodatetime=True", x => x.ServerVersion("10.4.6-mariadb"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AdminDetail>(entity =>
            {
                entity.HasKey(e => e.Adminid)
                    .HasName("PRIMARY");

                entity.ToTable("admin_detail");

                entity.Property(e => e.Adminid)
                    .HasColumnName("adminid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.AccountNumber)
                    .IsRequired()
                    .HasColumnName("account_number")
                    .HasColumnType("varchar(100)")
                    .HasDefaultValueSql("'''0'''")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.BankName)
                    .IsRequired()
                    .HasColumnName("bank_name")
                    .HasColumnType("varchar(500)")
                    .HasDefaultValueSql("'''0'''")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Bic)
                    .IsRequired()
                    .HasColumnName("bic")
                    .HasColumnType("varchar(100)")
                    .HasDefaultValueSql("'''0'''")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Clientid)
                    .HasColumnName("clientid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Iban)
                    .IsRequired()
                    .HasColumnName("iban")
                    .HasColumnType("varchar(100)")
                    .HasDefaultValueSql("'''0'''")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.LegalName)
                    .IsRequired()
                    .HasColumnName("legal_name")
                    .HasColumnType("varchar(500)")
                    .HasDefaultValueSql("'''0'''")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.VatNumber)
                    .IsRequired()
                    .HasColumnName("vat_number")
                    .HasColumnType("varchar(500)")
                    .HasDefaultValueSql("'''0'''")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");
            });

            modelBuilder.Entity<Clients>(entity =>
            {
                entity.HasKey(e => e.Clientid)
                    .HasName("PRIMARY");

                entity.ToTable("clients");

                entity.Property(e => e.Clientid)
                    .HasColumnName("clientid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.ActivationStatus)
                    .HasColumnName("activation_status")
                    .HasColumnType("varchar(100)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.BoxNumber)
                    .HasColumnName("box_number")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.City)
                    .HasColumnName("city")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Comments)
                    .HasColumnName("comments")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.CommercialName)
                    .HasColumnName("commercial_name")
                    .HasColumnType("varchar(500)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Country)
                    .HasColumnName("country")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.CrmDetail)
                    .HasColumnName("crm_detail")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Logo)
                    .HasColumnName("logo")
                    .HasColumnType("varchar(500)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.North)
                    .HasColumnName("north")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.PhoneNumber)
                    .HasColumnName("phone_number")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Street)
                    .HasColumnName("street")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Website)
                    .HasColumnName("website")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.WhiseClientid)
                    .HasColumnName("whise_clientid")
                    .HasColumnType("int(20)");

                entity.Property(e => e.ZipCode)
                    .HasColumnName("zip_code")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");
            });

            modelBuilder.Entity<Layouts>(entity =>
            {
                entity.HasKey(e => e.Layoutid)
                    .HasName("PRIMARY");

                entity.ToTable("layouts");

                entity.Property(e => e.Layoutid)
                    .HasColumnName("layoutid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Clientid)
                    .HasColumnName("clientid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.CreatedOn)
                    .HasColumnName("created_on")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.LayoutDetail)
                    .HasColumnName("layout_detail")
                    .HasColumnType("varchar(60000)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.LayoutName)
                    .HasColumnName("layout_name")
                    .HasColumnType("varchar(60)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Officeid)
                    .HasColumnName("officeid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");
            });

            modelBuilder.Entity<OfficeTriggers>(entity =>
            {
                entity.HasKey(e => e.OfficeTriggerid)
                    .HasName("PRIMARY");

                entity.ToTable("office_triggers");

                entity.Property(e => e.OfficeTriggerid)
                    .HasColumnName("office_triggerid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.AppointmentType)
                    .HasColumnName("appointment_type")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.CTarget1)
                    .HasColumnName("c_target_1")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.CTarget2)
                    .HasColumnName("c_target_2")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.CreatedOn)
                    .HasColumnName("created_on")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.DurationType)
                    .HasColumnName("duration_type")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.DurationValue)
                    .HasColumnName("duration_value")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.KeyMoment)
                    .HasColumnName("key_moment")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Language)
                    .HasColumnName("language")
                    .HasColumnType("varchar(50)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Layoutid)
                    .HasColumnName("layoutid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.Officeid)
                    .HasColumnName("officeid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.TargetParticipant1)
                    .HasColumnName("target_participant_1")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.TargetParticipant2)
                    .HasColumnName("target_participant_2")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Texte)
                    .HasColumnName("texte")
                    .HasColumnType("text")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.TransactionStatus)
                    .HasColumnName("transaction_status")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.TransactionType)
                    .HasColumnName("transaction_type")
                    .HasColumnType("varchar(45)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.TriggerName)
                    .HasColumnName("trigger_name")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.TriggerType)
                    .HasColumnName("trigger_type")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.UpdatedOn)
                    .HasColumnName("updated_on")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("'NULL'");
            });

            modelBuilder.Entity<Offices>(entity =>
            {
                entity.HasKey(e => e.Officeid)
                    .HasName("PRIMARY");

                entity.ToTable("offices");

                entity.Property(e => e.Officeid)
                    .HasColumnName("officeid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.Clientid)
                    .HasColumnName("clientid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.CommercialName)
                    .HasColumnName("commercial_name")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.CreatedOn)
                    .HasColumnName("created_on")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.CrmDetail)
                    .HasColumnName("crm_detail")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.OfficeImg)
                    .HasColumnName("office_img")
                    .HasColumnType("varchar(500)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.UniqueKey)
                    .HasColumnName("unique_key")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.WhiseOfficeid)
                    .HasColumnName("whise_officeid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");
            });

            modelBuilder.Entity<PimcoreSetting>(entity =>
            {
                entity.ToTable("pimcore_setting");

                entity.Property(e => e.PimcoreSettingid)
                    .HasColumnName("pimcore_settingid")
                    .HasColumnType("int(11)");

                entity.Property(e => e.CreatedOn)
                    .HasColumnName("created_on")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.FirstName)
                    .HasColumnName("first_name")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.LastName)
                    .HasColumnName("last_name")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.LoginId)
                    .HasColumnName("login_id")
                    .HasColumnType("varchar(200)")
                    .HasDefaultValueSql("'NULL'")
                    .HasCharSet("latin1")
                    .HasCollation("latin1_swedish_ci");

                entity.Property(e => e.Officeid)
                    .HasColumnName("officeid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");

                entity.Property(e => e.WhiseOfficeid)
                    .HasColumnName("whise_officeid")
                    .HasColumnType("int(11)")
                    .HasDefaultValueSql("'NULL'");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
