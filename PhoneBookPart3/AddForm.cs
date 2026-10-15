using System.Windows.Forms;
using PhoneBookPart3.Models;

namespace PhoneBookPart3
{
    public partial class AddForm : Form
    {
        public Phonebook MyRecord;

        public AddForm(Phonebook _MyRecord)
        {
            InitializeComponent();
            MyRecord = _MyRecord;
        }

        private void AddButton_Click(object sender, EventArgs e)
        {
            MyRecord.Lastname = LastNameTextBox.Text;
            MyRecord.Name = NameTextBox.Text;
            MyRecord.Patronymic = PatronymicTextBox.Text;
            MyRecord.Street = StreetTextBox.Text;
            MyRecord.House = HouseNumericUpDown.Value;
            MyRecord.Flat = FlatNumericUpDown.Value > 0 ? FlatNumericUpDown.Value : null;
            MyRecord.Phone = PhoneMaskedTextBox.Text;
            Close();
        }
    }
}
