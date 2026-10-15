using System;
using System.Collections.Generic;

namespace PhoneBook
{
    public class CompareByName : IComparer<Note>
    {
        public int Compare(Note x, Note y)
        {
            return string.Compare(x.Name, y.Name);
        }
    }
}
