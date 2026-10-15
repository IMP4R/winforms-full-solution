using System;
using System.IO;

namespace PhoneBook.Save
{
    public class SaveCreater
    {
        public static ISave Create(string fileName)
        {
            string ext = Path.GetExtension(fileName).ToLower();
            if (ext == ".txt")
                return new SaveTxt();
            else if (ext == ".xml")
                return new SaveXml();
            else if (ext == ".dat")
                return new SerializeBin();
            else if (ext == ".json")
                return new SerializeJson();
            else
                return null;
        }
    }
}
