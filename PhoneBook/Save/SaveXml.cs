using PhoneBook;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Xml;

namespace PhoneBook.Save
{
    public class SaveXml : ISave
    {
        public void Save(List<Note> notes, string fileName)
        {
            XmlTextWriter textWriter = new XmlTextWriter(fileName, Encoding.UTF8);
            textWriter.WriteStartDocument();
            textWriter.WriteStartElement("Notes");
            textWriter.WriteEndElement();
            textWriter.Close();

            XmlDocument document = new XmlDocument();
            document.Load(fileName);

            int i = 0;
            foreach (Note x in notes)
            {
                XmlElement element = document.CreateElement("Note");
                document.DocumentElement.AppendChild(element);
                XmlAttribute attribute = document.CreateAttribute("id");
                attribute.Value = i.ToString();
                element.Attributes.Append(attribute);

                XmlNode lastnameElem = document.CreateElement("Lastname");
                lastnameElem.InnerText = x.LastName;
                element.AppendChild(lastnameElem);

                XmlNode nameElem = document.CreateElement("Name");
                nameElem.InnerText = x.Name;
                element.AppendChild(nameElem);

                XmlNode patronymicElem = document.CreateElement("Patronymic");
                patronymicElem.InnerText = x.Patronymic;
                element.AppendChild(patronymicElem);

                XmlNode streetElem = document.CreateElement("Street");
                streetElem.InnerText = x.Street;
                element.AppendChild(streetElem);

                XmlNode houseElem = document.CreateElement("House");
                houseElem.InnerText = x.House.ToString();
                element.AppendChild(houseElem);

                XmlNode flatElem = document.CreateElement("Flat");
                flatElem.InnerText = x.Flat.ToString();
                element.AppendChild(flatElem);

                XmlNode phoneElem = document.CreateElement("Phone");
                phoneElem.InnerText = x.Phone;
                element.AppendChild(phoneElem);

                i++;
            }
            document.Save(fileName);
        }
    }
}