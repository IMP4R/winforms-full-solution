using System;

namespace PhoneBook
{
    [Serializable]
    public class Note
    {
        public string LastName;
        public string Name;
        public string Patronymic;
        public string Street;
        public ushort House;
        public ushort Flat;
        public string Phone;
        public override bool Equals(object obj)
        {

























            if (obj is Note other)
            {
                return LastName == other.LastName &&
                       Name == other.Name &&
                       Patronymic == other.Patronymic &&
                       Street == other.Street &&
                       House == other.House &&
                       Flat == other.Flat &&
                       Phone == other.Phone;
            }
            return false;

























        }

        public override int GetHashCode()
        {

























            return (LastName + Name + Patronymic + Street + Phone).GetHashCode() ^ House.GetHashCode() ^ Flat.GetHashCode();

























        }
    }
}
