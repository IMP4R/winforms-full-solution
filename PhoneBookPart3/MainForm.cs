using System;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using PhoneBookPart3.Models;

namespace PhoneBookPart3
{
    public partial class MainForm : Form
    {
        private PhoneContext? dbContext;
        private BindingList<Phonebook> phonebooks;
        private int currentIndex;
        private bool changed;

        public MainForm()
        {
            InitializeComponent();
            phonebooks = new BindingList<Phonebook>();
            currentIndex = 0;
            changed = false;
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            dbContext = new PhoneContext();
            dbContext.Phonebooks.Load();
            phonebooks = dbContext.Phonebooks.Local.ToBindingList();
            if (phonebooks.Count > 0)
            {
                currentIndex = 0;
                ShowRecord();
            }
            else
            {
                ClearFields();
            }
            UpdateStatus();
        }

        private void ShowRecord()
        {
            if (currentIndex < 0 || currentIndex >= phonebooks.Count) return;
            var p = phonebooks[currentIndex];
            LastNameTextBox.Text = p.Lastname;
            NameTextBox.Text = p.Name;
            PatronymicTextBox.Text = p.Patronymic ?? "";
            StreetTextBox.Text = p.Street;
            HouseNumericUpDown.Value = p.House;
            FlatNumericUpDown.Value = p.Flat ?? 0;
            PhoneMaskedTextBox.Text = p.Phone ?? "";
        }

        private void ClearFields()
        {
            LastNameTextBox.Text = "";
            NameTextBox.Text = "";
            PatronymicTextBox.Text = "";
            StreetTextBox.Text = "";
            HouseNumericUpDown.Value = 1;
            FlatNumericUpDown.Value = 1;
            PhoneMaskedTextBox.Text = "";
        }

        private void UpdateStatus()
        {
            if (phonebooks.Count > 0)
            {
                NumberToolStripStatusLabel.Text = (currentIndex + 1).ToString();
                QuantityToolStripStatusLabel.Text = phonebooks.Count.ToString();
            }
            else
            {
                NumberToolStripStatusLabel.Text = "0";
                QuantityToolStripStatusLabel.Text = "0";
            }
        }

        private void PreviousButton_Click(object sender, EventArgs e)
        {
            if (currentIndex > 0)
            {
                currentIndex--;
                ShowRecord();
                UpdateStatus();
            }
            else
            {
                MessageBox.Show("Первая запись", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void NextButton_Click(object sender, EventArgs e)
        {
            if (currentIndex < phonebooks.Count - 1)
            {
                currentIndex++;
                ShowRecord();
                UpdateStatus();
            }
            else
            {
                MessageBox.Show("Последняя запись", "Ошибка", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void добавитьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var MyRecord = new Phonebook();
            var r = (new AddForm(MyRecord)).ShowDialog();
            if (r == DialogResult.OK)
            {
                MyRecord.Id = phonebooks.Count > 0 ? phonebooks.Max(x => x.Id) + 1 : 1;
                dbContext?.Add(MyRecord);
                dbContext?.SaveChanges();
                phonebooks.Add(MyRecord);
                currentIndex = phonebooks.Count - 1;
                ShowRecord();
                UpdateStatus();
                changed = true;
            }
        }

        private void изменитьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (currentIndex < 0 || currentIndex >= phonebooks.Count) return;
            var MyRecord = phonebooks[currentIndex];
            var r = (new AddForm(MyRecord)).ShowDialog();
            if (r == DialogResult.OK)
            {
                dbContext?.SaveChanges();
                ShowRecord();
                UpdateStatus();
                changed = true;
            }
        }

        private void удалитьToolStripMenuItem_Click(object sender, EventArgs e)
        {
            if (currentIndex < 0 || currentIndex >= phonebooks.Count) return;
            if (MessageBox.Show("Удалить запись?", "Подтверждение", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
            {
                var p = phonebooks[currentIndex];
                dbContext?.Remove(p);
                dbContext?.SaveChanges();
                phonebooks.RemoveAt(currentIndex);
                if (currentIndex >= phonebooks.Count) currentIndex = phonebooks.Count - 1;
                if (currentIndex >= 0) ShowRecord();
                else ClearFields();
                UpdateStatus();
                changed = true;
            }
        }

        private void открытьToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void сохранитьToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void открытьXmlToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void сохранитьXmlToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void открытьBinToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void сохранитьBinToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void открытьJsonToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void сохранитьJsonToolStripMenuItem_Click(object sender, EventArgs e) { }
        private void добавитьИзФайлаToolStripMenuItem_Click(object sender, EventArgs e) { }

        private void поискToolStripMenuItem_Click(object sender, EventArgs e)
        {
            (new SearchNameForm(phonebooks)).ShowDialog();
        }

        private void сортироватьПоФамилииToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var sorted = phonebooks.OrderBy(x => x.Lastname).ToList();
            if (sorted.Count > 0)
            {
                currentIndex = 0;
                ShowRecord();
                UpdateStatus();
            }
        }

        private void сортироватьПоКвартиреToolStripMenuItem_Click(object sender, EventArgs e)
        {
            var sorted = phonebooks.OrderBy(x => x.Flat).ToList();
            if (sorted.Count > 0)
            {
                currentIndex = 0;
                ShowRecord();
                UpdateStatus();
            }
        }

        private void MainForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (changed)
            {
                var res = MessageBox.Show("Сохранить изменения?", "Закрытие", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
                if (res == DialogResult.Yes)
                {
                    dbContext?.SaveChanges();
                }
            }
        }
    }
}
