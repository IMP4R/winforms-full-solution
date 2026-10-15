using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PhoneBookPart3.Models
{
    public partial class Phonebook
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        public string Lastname { get; set; } = null!;

        [Required]
        [MaxLength(30)]
        public string Name { get; set; } = null!;

        [MaxLength(30)]
        public string? Patronymic { get; set; }

        [Required]
        [MaxLength(60)]
        public string Street { get; set; } = null!;

        [Required]
        [Column(TypeName = "decimal(4, 0)")]
        public decimal House { get; set; }

        [Column(TypeName = "decimal(4, 0)")]
        public decimal? Flat { get; set; }

        [MaxLength(10)]
        public string? Phone { get; set; }
    }
}
