using System;
using System.Collections.Generic;

namespace PhoneBook
{
    public class CompareByStreet : IComparer<Note>
    {
        public int Compare(Note x, Note y)
        {
            return string.Compare(x.Street, y.Street);
        }
    }
}
