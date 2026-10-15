using System;
using System.Collections.Generic;

namespace PhoneBook
{
    public class CompareByPatronymic : IComparer<Note>
    {
        public int Compare(Note x, Note y)
        {
            return string.Compare(x.Patronymic, y.Patronymic);
        }
    }
}
