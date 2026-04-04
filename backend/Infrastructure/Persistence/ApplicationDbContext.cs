using Domain.Entites;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ApplicationUser>(entity =>
        {
            //entity.ToTable("Users");

            entity.Property(x => x.FirstName)
                .HasMaxLength(15)
                .IsRequired();

            entity.Property(x => x.LastName)
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(x => x.IsActive)
                .IsRequired();

            entity.Property(x => x.RefreshToken)
                .HasMaxLength(500);
        });

        builder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(x => x.Type)
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .IsRequired();
        });

        builder.Entity<Transaction>(entity =>
        {
            entity.ToTable("transactions");
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title)
                .HasMaxLength(150)
                .IsRequired();

            entity.Property(x => x.Description)
                .HasMaxLength(500);

            entity.Property(x => x.Amount)
                .HasColumnType("numeric(18,2)")
                .IsRequired();

            entity.Property(x => x.TransactionType)
                .IsRequired();

            entity.Property(x => x.OcurredAt)
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .IsRequired();

            entity.HasOne<Category>()
                .WithMany()
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<SavingsGoal>(entity =>
        {
            entity.ToTable("savings_goals");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name)
                .HasMaxLength(120)
                .IsRequired();

            entity.Property(x => x.TargetAmount)
                .HasColumnType("numeric(18,2)")
                .IsRequired();

            entity.Property(x => x.CurrentAmount)
                .HasColumnType("numeric(18,2)")
                .IsRequired();

            entity.Property(x => x.CreatedAt)
                .IsRequired();
        });
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<SavingsGoal> SavingsGoals { get; set; }

}
