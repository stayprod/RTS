using System;
using TriggerService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Options;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace TriggerService.Models
{
    public partial class EmailWorkerServiceContext : DbContext
    {
        public EmailWorkerServiceContext()
        {
        }

        public EmailWorkerServiceContext(DbContextOptions<EmailWorkerServiceContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Client> Clients { get; set; }
        public virtual DbSet<History> Historys { get; set; }
        public virtual DbSet<Settings> Settings { get; set; }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            if (!optionsBuilder.IsConfigured)
            {
                IConfigurationRoot configuration = new ConfigurationBuilder()
                  .SetBasePath(Directory.GetCurrentDirectory())
                  .AddJsonFile("appsettings.json")
                  .Build();
                string connectionString = configuration.GetConnectionString("DefaultConnection");
                optionsBuilder.UseMySql(connectionString, mySqlOptions =>
                {
                    mySqlOptions.ServerVersion(new Version(8, 0, 26), ServerType.MySql);
                });
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<Client>(entity =>
            {
                entity.HasKey(e => e.ClientId);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Email).HasMaxLength(50);
                entity.Property(e => e.Message).HasMaxLength(150);
            });
            modelBuilder.Entity<Settings>(entity =>
            {
                entity.HasKey(e => e.SettingId);

                entity.Property(e => e.KeyMoment).HasMaxLength(50);

                entity.Property(e => e.TypeOfTransect).HasMaxLength(50);
                entity.Property(e => e.TemplEmail).HasMaxLength(200);
                entity.Property(e => e.RemindTempl).HasMaxLength(200);

                entity.Property(e => e.SMSTemplate).HasMaxLength(200);
                entity.Property(e => e.RemindTemplate).HasMaxLength(200);
                entity.Property(e => e.onEventCreated).HasColumnType("datetime");
                entity.Property(e => e.EmailTime).HasColumnType("datetime");
            });

            modelBuilder.Entity<History>(entity =>
            {
                entity.HasKey(e => e.HistoryId);

                entity.Property(e => e.Date).HasColumnType("datetime");

            });


            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
