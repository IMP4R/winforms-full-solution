namespace PhoneBook
{
    public class CompareByFlat : IComparer<Note>
    {

        public int Compare(Note x, Note y)
        {






























            return x.Flat.CompareTo(y.Flat);






























        }
    }
}
