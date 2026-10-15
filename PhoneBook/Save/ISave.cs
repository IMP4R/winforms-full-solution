using PhoneBook;
using System;
using System.Collections.Generic;

namespace PhoneBook.Save
{
    public interface ISave
    {
        void Save(List<Note> notes, string fileName);
    }
}
