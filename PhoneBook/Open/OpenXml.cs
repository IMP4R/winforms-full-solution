using PhoneBook;
using System;
using System.Collections.Generic;
using System.Xml;

namespace PhoneBook.Open
{
    public class OpenXml : IOpen
    {
        public List<Note> OpenFile(string fileName)
        {
            List<Note> notes = new List<Note>();
            try
            {
                XmlDocument xDoc = new XmlDocument();
                xDoc.Load(fileName);
                XmlElement xRoot = xDoc.DocumentElement;
                foreach (XmlElement xnode in xRoot)
                {
                    Note node = new Note();
                    foreach (XmlNode cnode in xnode.ChildNodes)
                    {
                        if (cnode.Name == "Lastname") node.LastName = cnode.InnerText;
                        if (cnode.Name == "Name") node.Name = cnode.InnerText;
                        if (cnode.Name == "Patronymic") node.Patronymic = cnode.InnerText;
                        if (cnode.Name == "Street") node.Street = cnode.InnerText;
                        if (cnode.Name == "House") node.House = Convert.ToUInt16(cnode.InnerText);
                        if (cnode.Name == "Flat") node.Flat = Convert.ToUInt16(cnode.InnerText);
                        if (cnode.Name == "Phone") node.Phone = cnode.InnerText;
                    }
                    notes.Add(node);
                }
            }
            catch (Exception)
            {
                System.Windows.Forms.MessageBox.Show("xml файла не существует");
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