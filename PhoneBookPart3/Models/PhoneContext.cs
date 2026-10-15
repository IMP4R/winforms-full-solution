using Microsoft.EntityFrameworkCore;
using PhoneBookPart3.Models;

namespace PhoneBookPart3.Models
{
    public class PhoneContext : DbContext
    {
        public DbSet<Phonebook> Phonebooks { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Server=localhost; Database=phone; username=postgres; password=postgres; persist security info=true");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Phonebook>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Lastname).IsRequired().HasMaxLength(30);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(30);
                entity.Property(e => e.Patronymic).HasMaxLength(30);
                entity.Property(e => e.Street).IsRequired().HasMaxLength(60);
                entity.Property(e => e.House).IsRequired().HasColumnType("decimal(4, 0)");
                entity.Property(e => e.Flat).HasColumnType("decimal(4, 0)");
                entity.Property(e => e.Phone).HasMaxLength(10);

                entity.ToTable(t =>
                {
                    t.HasCheckConstraint("CK_Phonebook_Phone", "phone ~ '^\\d{10}$'");
                    t.HasCheckConstraint("CK_Phonebook_House", "house > 0");
                    t.HasCheckConstraint("CK_Phonebook_Flat", "flat > 0");
                });
            });
        }
    }
}
