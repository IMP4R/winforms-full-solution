using PhoneBook;
using System;
using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;

namespace PhoneBook.Open
{
    public class OpenXml : IOpen
    {
        public List<Note> OpenFile(string fileName)
        {
            var xs = new XmlSerializer(typeof(List<Note>));
            var fs = new FileStream(fileName, FileMode.Open);
            var notes = (List<Note>)xs.Deserialize(fs);
            fs.Close();
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
