using System.Windows.Forms;
using System.Collections.Generic;
using PhoneBookPart3.Models;

namespace PhoneBookPart3
{
    public partial class SearchNameForm : Form
    {
        private IList<Phonebook> Phonebooks;

        public SearchNameForm(IList<Phonebook> _Phonebooks)
        {
            InitializeComponent();
            Phonebooks = _Phonebooks;
        }

        private void SearchButton_Click(object sender, EventArgs e)
        {
            ResultsTextBox.Text = "";
            var i = 0;
            for (var idx = 0; idx < Phonebooks.Count; idx++) {
                var MyRecord = Phonebooks[idx];
                if (MyRecord.Lastname.Contains(LastNameTextBox.Text) &&
                    MyRecord.Name.Contains(NameTextBox.Text) &&
                    (MyRecord.Patronymic ?? "").Contains(PatronymicTextBox.Text)) {
                    i++;
                    ResultsTextBox.Text = ResultsTextBox.Text + i + ". " + MyRecord.Lastname + " " + MyRecord.Name + " " + MyRecord.Patronymic + " — " + MyRecord.Street + ", д." + MyRecord.House + ", кв." + MyRecord.Flat + ", тел." + MyRecord.Phone + "\r\n";
                }
            }
            if (i == 0) {
                ResultsTextBox.Text = "Записей не найдено";
            }
            Close();
        }
    }
}
