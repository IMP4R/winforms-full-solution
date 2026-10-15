using System;
using System.IO;

namespace PhoneBook.Open
{
    public class OpenCreater
    {
        public static IOpen Create(string fileName)
        {
            string ext = Path.GetExtension(fileName).ToLower();
            if (ext == ".txt")
                return new OpenTxt();
            else if (ext == ".xml")
                return new OpenXml();
            else if (ext == ".dat")
                return new DeserializeBin();
            else if (ext == ".json")
                return new DeserializeJson();
            else
                return null;
        }
    }
}
