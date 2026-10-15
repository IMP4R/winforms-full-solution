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
    public partial class SearchPhoneForm : Form
    {

        private List<Note> PhoneNote;

        public SearchPhoneForm(List<Note> _PhoneNote)
        {
            InitializeComponent();
            PhoneNote = _PhoneNote;
            PhoneNote = _PhoneNote;
        }


        private void SearchButton_Click(object sender, EventArgs e)
        {
            ResultsTextBox.Text = "";
            int i = 0;
            for (var __i = 0; __i < PhoneNote.Count; __i++)
            {
                var MyRecord = PhoneNote[__i];
                if (MyRecord.Phone.Contains(PhoneMaskedTextBox.Text))
                {
                    i++;
                    ResultsTextBox.Text = ResultsTextBox.Text +
                    i + ". " + MyRecord.LastName + " " + MyRecord.Name + " " + MyRecord.Patronymic +
                    " — " + MyRecord.Street + ", д." + MyRecord.House + ", кв." + MyRecord.Flat +
                    ", тел." + MyRecord.Phone + "\r\n";
                }
            }
            if (i == 0)
                ResultsTextBox.Text = "Записей, удовлетворяющих поставленным условиям, в списке абонентов нет!";
        }

        private void CloseButton_Click(object sender, EventArgs e)
        {
            Close();
        }
    }
}
