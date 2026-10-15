using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace PhoneBook.Save
{
    public class SerializeJson : ISave
    {
        public void Save(List<Note> notes, string fileName)
        {
            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };
            string json = JsonSerializer.Serialize(notes, options);
            File.WriteAllText(fileName, json);
        }
    }
}
