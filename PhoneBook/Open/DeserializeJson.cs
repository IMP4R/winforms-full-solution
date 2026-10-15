using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace PhoneBook.Open
{
    public class DeserializeJson : IOpen
    {
        public List<Note> OpenFile(string fileName)
        {
            string s = File.ReadAllText(fileName);
            return JsonSerializer.Deserialize<List<Note>>(s);
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
