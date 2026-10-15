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
    public partial class MainForm : Form
    {

        private List<Note> PhoneNote;
        private int current;
        private bool changed;
        private ISave saveBehavior;
        private IOpen openBehavior;

        public MainForm()
        {
            InitializeComponent();

            PhoneNote = new List<Note>();
            current = -1;
            changed = false;
        }

        private void PrintElement()
        {
            if ((current >= 0) && (current < PhoneNote.Count))
            {
                var MyRecord = PhoneNote[current];
                LastNameTextBox.Text = MyRecord.LastName;
                NameTextBox.Text = MyRecord.Name;
                PatronymicTextBox.Text = MyRecord.Patronymic;
                PhoneMaskedTextBox.Text = MyRecord.Phone;
                StreetTextBox.Text = MyRecord.Street;
                HouseNumericUpDown.Value = MyRecord.House;
                FlatNumericUpDown.Value = MyRecord.Flat;
            }
            else
            {
                LastNameTextBox.Text = "";
                NameTextBox.Text = "";
                PatronymicTextBox.Text = "";
                PhoneMaskedTextBox.Text = "";
                StreetTextBox.Text = "";
                HouseNumericUpDown.Value = 1;
                FlatNumericUpDown.Value = 1;
            }
            NumberToolStripStatusLabel.Text = (current + 1).ToString();
            QuantityToolStripStatusLabel.Text = (PhoneNote.Count).ToString();
        }

        private void PreviousButton_Click(object sender, EventArgs e)
        {
            if (current <= 0)
            {
                MessageBox.Show("Предыдущей записи не существует!", "Ошибка");
                return;
            }
            current--;
            PrintElement();
        }

        private void NextButton_Click(object sender, EventArgs e)
        {
            if (current >= PhoneNote.Count - 1)
            {
                MessageBox.Show("Следующей записи не существует!", "Ошибка");
                return;
            }
            current++;
            PrintElement();
        }

        private void добавитьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var MyRecord = new Note();
            var r = (new AddForm(MyRecord, AddOrEdit.Add)).ShowDialog();
            if (r == DialogResult.OK)
            {
                if (PhoneNote.Contains(MyRecord))
                {
                    MessageBox.Show("Такая запись уже существует!", "Ошибка");
                    return;
                }
                current = PhoneNote.Count;
                PhoneNote.Add(MyRecord);
                changed = true;
                PrintElement();
            }
        }

        private void изменитьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if ((current < 0) || (current >= PhoneNote.Count))
            {
                MessageBox.Show("Нет записей для изменения!", "Ошибка");
                return;
            }
            var MyRecord = PhoneNote[current];
            var r = (new AddForm(MyRecord, AddOrEdit.Edit)).ShowDialog();
            if (r == DialogResult.OK)
            {
                PhoneNote[current] = MyRecord;
                changed = true;
                PrintElement();
            }
        }

        private void удалитьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if ((current < 0) || (current >= PhoneNote.Count))
            {
                MessageBox.Show("Нет записей для удаления!", "Ошибка");
                return;
            }
            PhoneNote.RemoveAt(current);
            if (current >= PhoneNote.Count)
                current = PhoneNote.Count - 1;
            changed = true;
            PrintElement();
        }

        private void открытьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (changed)
            {
                var result = MessageBox.Show("Сохранить изменения?", "Внимание", MessageBoxButtons.YesNoCancel);
                if (result == DialogResult.Yes)
                {
                    var sr = saveFileDialog1.ShowDialog();
                    if (sr == DialogResult.OK)
                    {
                        saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);
                        if (saveBehavior != null)
                        {
                            saveBehavior.Save(PhoneNote, saveFileDialog1.FileName);
                            changed = false;
                        }
                    }
                    else
                    {
                        return;
                    }
                }
                else if (result == DialogResult.Cancel)
                {
                    return;
                }
            }
            var r = openFileDialog1.ShowDialog();
            if (r == DialogResult.OK)
            {
                openBehavior = OpenCreater.Create(openFileDialog1.FileName);
                if (openBehavior == null) return;
                PhoneNote = openBehavior.OpenFile(openFileDialog1.FileName);
                if (PhoneNote.Count == 0)
                    current = -1;
                else
                    current = 0;
                changed = false;
                PrintElement();
            }
        }

        private void сохранитьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var r = saveFileDialog1.ShowDialog();
            if (r == DialogResult.OK)
            {
                saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);
                if (saveBehavior == null) return;
                saveBehavior.Save(PhoneNote, saveFileDialog1.FileName);
                changed = false;
            }
        }

        private void добавитьИзФайлаToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (changed)
            {
                var result = MessageBox.Show("Сохранить изменения?", "Внимание", MessageBoxButtons.YesNoCancel);
                if (result == DialogResult.Yes)
                {
                    var sr = saveFileDialog1.ShowDialog();
                    if (sr == DialogResult.OK)
                    {
                        saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);
                        if (saveBehavior != null)
                        {
                            saveBehavior.Save(PhoneNote, saveFileDialog1.FileName);
                            changed = false;
                        }
                    }
                    else
                    {
                        return;
                    }
                }
                else if (result == DialogResult.Cancel)
                {
                    return;
                }
            }
            var r = openFileDialog1.ShowDialog();
            if (r == DialogResult.OK)
            {
                openBehavior = OpenCreater.Create(openFileDialog1.FileName);
                if (openBehavior == null) return;
                PhoneNote = openBehavior.AddFromFile(openFileDialog1.FileName, PhoneNote);
                if (PhoneNote.Count > 0)
                    current = PhoneNote.Count - 1;
                changed = true;
                PrintElement();
            }
        }

        private void поискПоФИОToolStripMenuItem_Click(object sender, EventArgs e)
        {
            (new SearchNameForm(PhoneNote)).ShowDialog();
        }

        private void поискПоАдресуToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SearchAddressForm _Search = new SearchAddressForm(PhoneNote);
            _Search.ShowDialog();
        }

        private void поискПоТелефонуToolStripMenuItem_Click(object sender, EventArgs e)
        {
            SearchPhoneForm _Search = new SearchPhoneForm(PhoneNote);
            _Search.ShowDialog();
        }

        private void сортироватьПоФамилииToolStripMenuItem_Click(object sender, EventArgs e)
        {
            PhoneNote.Sort((x, y) => x.LastName.CompareTo(y.LastName));
            if (PhoneNote.Count > 0)
                current = 0;
            PrintElement();
        }

        private void сортироватьПоИмениToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByName());
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоОтчествуToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByPatronymic());
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоУлицеToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByStreet());
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоДомуToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByHouse());
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоКвартиреToolStripMenuItem_Click(object sender, EventArgs e)
        {
            PhoneNote.Sort((x, y) => x.Flat - y.Flat);
            if (PhoneNote.Count > 0)
                current = 0;
            PrintElement();
        }

        private void сортироватьПоТелефонуToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByPhone());
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоФамилииDescToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByLastName());
                PhoneNote.Reverse();
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоИмениDescToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByName());
                PhoneNote.Reverse();
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоОтчествуDescToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByPatronymic());
                PhoneNote.Reverse();
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоУлицеDescToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByStreet());
                PhoneNote.Reverse();
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоДомуDescToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByHouse());
                PhoneNote.Reverse();
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоКвартиреDescToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByFlat());
                PhoneNote.Reverse();
                current = 0;
                PrintElement();
            }
        }

        private void сортироватьПоТелефонуDescToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (PhoneNote.Count > 0)
            {
                PhoneNote.Sort(new CompareByPhone());
                PhoneNote.Reverse();
                current = 0;
                PrintElement();
            }
        }

        private void MainForm_FormClosing(object sender, EventArgs e)
        {
            if (changed)
            {
                var r = MessageBox.Show("Сохранить изменения?", "Телефонный справочник", MessageBoxButtons.YesNo);
                if (r == DialogResult.Yes)
                {
                    var sr = saveFileDialog1.ShowDialog();
                    if (sr == DialogResult.OK)
                    {
                        saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);
                        if (saveBehavior != null)
                            saveBehavior.Save(PhoneNote, saveFileDialog1.FileName);
                    }
                }
            }
        }
    }
}
