namespace PhoneBook
{
    public class CompareByLastName : IComparer<Note>
    {

        public int Compare(Note x, Note y)
        {






























            return string.Compare(x.LastName, y.LastName);






























        }
    }
}
