using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using System.Xml.Serialization;
using PhoneBook.Save;
using PhoneBook.Open;

namespace PhoneBook
{
    public partial class AddForm : Form
    {
        public Note MyRecord;
        private AddOrEdit MyType;

        public AddForm(Note _MyRecord, AddOrEdit _MyType)
        {
            InitializeComponent();
            MyRecord = _MyRecord;
            MyType = _MyType;
            MyType = _MyType;
        }


        private void AddButton_Click(object sender, EventArgs e)
        {
            MyRecord.LastName = LastNameTextBox.Text;
            MyRecord.Name = NameTextBox.Text;
            MyRecord.Patronymic = PatronymicTextBox.Text;
            MyRecord.Phone = PhoneMaskedTextBox.Text;
            MyRecord.Street = StreetTextBox.Text;
            MyRecord.House = Convert.ToUInt16(HouseNumericUpDown.Value);
            MyRecord.Flat = Convert.ToUInt16(FlatNumericUpDown.Value);
            DialogResult = DialogResult.OK;
            Close();
        }
    }
}
