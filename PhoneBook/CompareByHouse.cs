using System;
using System.Collections.Generic;

namespace PhoneBook
{
    public class CompareByHouse : IComparer<Note>
    {
        public int Compare(Note x, Note y)
        {
            return x.House.CompareTo(y.House);
        }
    }
}
