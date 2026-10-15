using PhoneBook;
using System;
using System.Collections.Generic;
using System.IO;
using System.Xml.Serialization;

namespace PhoneBook.Save
{
    public class SaveXml : ISave
    {
        public void Save(List<Note> notes, string fileName)
        {
            var xs = new XmlSerializer(typeof(List<Note>));
            var fs = new FileStream(fileName, FileMode.Create);
            xs.Serialize(fs, notes);
            fs.Close();
        }
    }
}
