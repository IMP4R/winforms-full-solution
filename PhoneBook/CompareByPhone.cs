using System;
using System.Collections.Generic;

namespace PhoneBook
{
    public class CompareByPhone : IComparer<Note>
    {
        public int Compare(Note x, Note y)
        {
            return string.Compare(x.Phone, y.Phone);
        }
    }
}
