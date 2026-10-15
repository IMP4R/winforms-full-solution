using PhoneBook;
using System;
using System.Collections.Generic;
using System.IO;

namespace PhoneBook.Open
{
    public class OpenTxt : IOpen
    {
        public List<Note> OpenFile(string fileName)
        {
            var notes = new List<Note>();
            using (StreamReader sr = new StreamReader(fileName))
            {
                while (!sr.EndOfStream)
                {
                    var rec = new Note();
                    rec.LastName = sr.ReadLine();
                    rec.Name = sr.ReadLine();
                    rec.Patronymic = sr.ReadLine();
                    rec.Street = sr.ReadLine();
                    rec.House = Convert.ToUInt16(sr.ReadLine());
                    rec.Flat = Convert.ToUInt16(sr.ReadLine());
                    rec.Phone = sr.ReadLine();
                    notes.Add(rec);
                }
            }
            return notes;
        }

        public List<Note> AddFromFile(string fileName, List<Note> existing)
        {
            var newNotes = OpenFile(fileName);
            foreach (var note in newNotes)
            {
                if (!existing.Contains(note))
                    existing.Add(note);
            }
            return existing;
        }
    }
}
