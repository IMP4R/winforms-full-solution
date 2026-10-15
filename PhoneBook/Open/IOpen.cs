using PhoneBook;
using System;
using System.Collections.Generic;

namespace PhoneBook.Open
{
    public interface IOpen
    {
        List<Note> OpenFile(string fileName);
        List<Note> AddFromFile(string fileName, List<Note> existing);
    }
}
