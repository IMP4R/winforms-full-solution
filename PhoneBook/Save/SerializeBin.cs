using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace PhoneBook.Save
{
    public class SerializeBin : ISave
    {
        public void Save(List<Note> notes, string fileName)
        {
            var formatter = new BinaryFormatter();
            var stream = new FileStream(fileName, FileMode.Create, FileAccess.Write, FileShare.None);
            formatter.Serialize(stream, notes);
            stream.Close();
        }
    }
}
