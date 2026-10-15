using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace PhoneBook.Open
{
    public class DeserializeBin : IOpen
    {
        public List<Note> OpenFile(string fileName)
        {
            var formatter = new BinaryFormatter();
            using (FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate))
            {
                return (List<Note>)formatter.Deserialize(fs);
            }
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
