namespace PhoneBook
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        private System.Windows.Forms.Label lblLastName;
        private System.Windows.Forms.Label lblName;
        private System.Windows.Forms.Label lblPatronymic;
        private System.Windows.Forms.Label lblStreet;
        private System.Windows.Forms.Label lblHouse;
        private System.Windows.Forms.Label lblFlat;
        private System.Windows.Forms.Label lblPhone;
        private System.Windows.Forms.TextBox LastNameTextBox;
        private System.Windows.Forms.TextBox NameTextBox;
        private System.Windows.Forms.TextBox PatronymicTextBox;
        private System.Windows.Forms.TextBox StreetTextBox;
        private System.Windows.Forms.NumericUpDown HouseNumericUpDown;
        private System.Windows.Forms.NumericUpDown FlatNumericUpDown;
        private System.Windows.Forms.MaskedTextBox PhoneMaskedTextBox;
        private System.Windows.Forms.Button PreviousButton;
        private System.Windows.Forms.Button NextButton;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.StatusStrip statusStrip1;
        private System.Windows.Forms.OpenFileDialog openFileDialog1;
        private System.Windows.Forms.SaveFileDialog saveFileDialog1;
        private System.Windows.Forms.ToolStripMenuItem абонентToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem добавитьToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem изменитьToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem удалитьToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem файлToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem открытьToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сохранитьToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem добавитьИзФайлаToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem поискToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem поискПоФИОToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem поискПоАдресуToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem поискПоТелефонуToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортировкаToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоФамилииToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоИмениToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоОтчествуToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоУлицеToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоДомуToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоКвартиреToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоТелефонуToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоФамилииDescToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоИмениDescToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоОтчествуDescToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоУлицеDescToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоДомуDescToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоКвартиреDescToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem сортироватьПоТелефонуDescToolStripMenuItem;
        private System.Windows.Forms.ToolStripStatusLabel Quantity_ToolStripStatusLabel;
        private System.Windows.Forms.ToolStripStatusLabel QuantityToolStripStatusLabel;
        private System.Windows.Forms.ToolStripStatusLabel Number_ToolStripStatusLabel;
        private System.Windows.Forms.ToolStripStatusLabel NumberToolStripStatusLabel;

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.lblLastName = new System.Windows.Forms.Label();
            this.lblName = new System.Windows.Forms.Label();
            this.lblPatronymic = new System.Windows.Forms.Label();
            this.lblStreet = new System.Windows.Forms.Label();
            this.lblHouse = new System.Windows.Forms.Label();
            this.lblFlat = new System.Windows.Forms.Label();
            this.lblPhone = new System.Windows.Forms.Label();
            this.LastNameTextBox = new System.Windows.Forms.TextBox();
            this.NameTextBox = new System.Windows.Forms.TextBox();
            this.PatronymicTextBox = new System.Windows.Forms.TextBox();
            this.StreetTextBox = new System.Windows.Forms.TextBox();
            this.HouseNumericUpDown = new System.Windows.Forms.NumericUpDown();
            this.FlatNumericUpDown = new System.Windows.Forms.NumericUpDown();
            this.PhoneMaskedTextBox = new System.Windows.Forms.MaskedTextBox();
            this.PreviousButton = new System.Windows.Forms.Button();
            this.NextButton = new System.Windows.Forms.Button();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.statusStrip1 = new System.Windows.Forms.StatusStrip();
            this.openFileDialog1 = new System.Windows.Forms.OpenFileDialog();
            this.saveFileDialog1 = new System.Windows.Forms.SaveFileDialog();
            this.абонентToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.добавитьToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.изменитьToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.удалитьToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.файлToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.открытьToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сохранитьToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.добавитьИзФайлаToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.поискToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.поискПоФИОToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.поискПоАдресуToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.поискПоТелефонуToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортировкаToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоФамилииToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоИмениToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоОтчествуToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоУлицеToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоДомуToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоКвартиреToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоТелефонуToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоФамилииDescToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоИмениDescToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоОтчествуDescToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоУлицеDescToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоДомуDescToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоКвартиреDescToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.сортироватьПоТелефонуDescToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.Quantity_ToolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.QuantityToolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.Number_ToolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.NumberToolStripStatusLabel = new System.Windows.Forms.ToolStripStatusLabel();
            this.SuspendLayout();

            // 
            // lblLastName
            // 
            this.lblLastName.Location = new System.Drawing.Point(20, 48);
            this.lblLastName.Size = new System.Drawing.Size(100, 30);
            this.lblLastName.Name = "lblLastName";
            this.lblLastName.TabIndex = 0;
            this.lblLastName.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.lblLastName.Text = "Фамилия";
            // 
            // lblName
            // 
            this.lblName.Location = new System.Drawing.Point(20, 85);
            this.lblName.Size = new System.Drawing.Size(100, 30);
            this.lblName.Name = "lblName";
            this.lblName.TabIndex = 0;
            this.lblName.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.lblName.Text = "Имя";
            // 
            // lblPatronymic
            // 
            this.lblPatronymic.Location = new System.Drawing.Point(20, 120);
            this.lblPatronymic.Size = new System.Drawing.Size(100, 30);
            this.lblPatronymic.Name = "lblPatronymic";
            this.lblPatronymic.TabIndex = 0;
            this.lblPatronymic.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.lblPatronymic.Text = "Отчество";
            // 
            // lblStreet
            // 
            this.lblStreet.Location = new System.Drawing.Point(20, 155);
            this.lblStreet.Size = new System.Drawing.Size(100, 30);
            this.lblStreet.Name = "lblStreet";
            this.lblStreet.TabIndex = 0;
            this.lblStreet.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.lblStreet.Text = "Улица";
            // 
            // lblHouse
            // 
            this.lblHouse.Location = new System.Drawing.Point(20, 190);
            this.lblHouse.Size = new System.Drawing.Size(100, 30);
            this.lblHouse.Name = "lblHouse";
            this.lblHouse.TabIndex = 0;
            this.lblHouse.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.lblHouse.Text = "Дом";
            // 
            // lblFlat
            // 
            this.lblFlat.Location = new System.Drawing.Point(20, 225);
            this.lblFlat.Size = new System.Drawing.Size(100, 30);
            this.lblFlat.Name = "lblFlat";
            this.lblFlat.TabIndex = 0;
            this.lblFlat.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.lblFlat.Text = "Квартира";
            // 
            // lblPhone
            // 
            this.lblPhone.Location = new System.Drawing.Point(20, 260);
            this.lblPhone.Size = new System.Drawing.Size(100, 30);
            this.lblPhone.Name = "lblPhone";
            this.lblPhone.TabIndex = 0;
            this.lblPhone.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.lblPhone.Text = "Телефон";
            // 
            // LastNameTextBox
            // 
            this.LastNameTextBox.Location = new System.Drawing.Point(140, 48);
            this.LastNameTextBox.Size = new System.Drawing.Size(180, 30);
            this.LastNameTextBox.Name = "LastNameTextBox";
            this.LastNameTextBox.TabIndex = 2;
            this.LastNameTextBox.Enabled = false;
            this.LastNameTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.LastNameTextBox.MaxLength = 25;
            // 
            // NameTextBox
            // 
            this.NameTextBox.Location = new System.Drawing.Point(140, 84);
            this.NameTextBox.Size = new System.Drawing.Size(180, 30);
            this.NameTextBox.Name = "NameTextBox";
            this.NameTextBox.TabIndex = 3;
            this.NameTextBox.Enabled = false;
            this.NameTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.NameTextBox.MaxLength = 25;
            // 
            // PatronymicTextBox
            // 
            this.PatronymicTextBox.Location = new System.Drawing.Point(140, 118);
            this.PatronymicTextBox.Size = new System.Drawing.Size(180, 30);
            this.PatronymicTextBox.Name = "PatronymicTextBox";
            this.PatronymicTextBox.TabIndex = 4;
            this.PatronymicTextBox.Enabled = false;
            this.PatronymicTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.PatronymicTextBox.MaxLength = 25;
            // 
            // StreetTextBox
            // 
            this.StreetTextBox.Location = new System.Drawing.Point(140, 153);
            this.StreetTextBox.Size = new System.Drawing.Size(180, 30);
            this.StreetTextBox.Name = "StreetTextBox";
            this.StreetTextBox.TabIndex = 5;
            this.StreetTextBox.Enabled = false;
            this.StreetTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.StreetTextBox.MaxLength = 40;
            // 
            // HouseNumericUpDown
            // 
            this.HouseNumericUpDown.Location = new System.Drawing.Point(140, 188);
            this.HouseNumericUpDown.Size = new System.Drawing.Size(180, 30);
            this.HouseNumericUpDown.Name = "HouseNumericUpDown";
            this.HouseNumericUpDown.TabIndex = 6;
            this.HouseNumericUpDown.Enabled = false;
            this.HouseNumericUpDown.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.HouseNumericUpDown.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            this.HouseNumericUpDown.Maximum = new decimal(new int[] { 500, 0, 0, 0 });
            this.HouseNumericUpDown.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // FlatNumericUpDown
            // 
            this.FlatNumericUpDown.Location = new System.Drawing.Point(140, 223);
            this.FlatNumericUpDown.Size = new System.Drawing.Size(180, 30);
            this.FlatNumericUpDown.Name = "FlatNumericUpDown";
            this.FlatNumericUpDown.TabIndex = 7;
            this.FlatNumericUpDown.Enabled = false;
            this.FlatNumericUpDown.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.FlatNumericUpDown.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            this.FlatNumericUpDown.Maximum = new decimal(new int[] { 500, 0, 0, 0 });
            this.FlatNumericUpDown.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // PhoneMaskedTextBox
            // 
            this.PhoneMaskedTextBox.Location = new System.Drawing.Point(140, 258);
            this.PhoneMaskedTextBox.Size = new System.Drawing.Size(180, 30);
            this.PhoneMaskedTextBox.Name = "PhoneMaskedTextBox";
            this.PhoneMaskedTextBox.TabIndex = 8;
            this.PhoneMaskedTextBox.Enabled = false;
            this.PhoneMaskedTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.PhoneMaskedTextBox.Mask = "(999) 000-0000";
            // 
            // PreviousButton
            // 
            this.PreviousButton.Location = new System.Drawing.Point(160, 305);
            this.PreviousButton.Size = new System.Drawing.Size(40, 35);
            this.PreviousButton.Name = "PreviousButton";
            this.PreviousButton.TabIndex = 0;
            this.PreviousButton.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.PreviousButton.Text = "<";
            this.PreviousButton.Click += new System.EventHandler(this.PreviousButton_Click);
            // 
            // NextButton
            // 
            this.NextButton.Location = new System.Drawing.Point(210, 305);
            this.NextButton.Size = new System.Drawing.Size(40, 35);
            this.NextButton.Name = "NextButton";
            this.NextButton.TabIndex = 1;
            this.NextButton.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.NextButton.Text = ">";
            this.NextButton.Click += new System.EventHandler(this.NextButton_Click);
            // 
            // menuStrip1
            // 
            this.menuStrip1.Size = new System.Drawing.Size(0, 24);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.TabIndex = 0;
            this.menuStrip1.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.абонентToolStripMenuItem.Name = "абонентToolStripMenuItem";
            this.абонентToolStripMenuItem.Text = "Абонент";
            this.добавитьToolStripMenuItem.Name = "добавитьToolStripMenuItem";
            this.добавитьToolStripMenuItem.Text = "Добавить";
            this.добавитьToolStripMenuItem.Click += new System.EventHandler(this.добавитьToolStripMenuItem_Click);
            this.изменитьToolStripMenuItem.Name = "изменитьToolStripMenuItem";
            this.изменитьToolStripMenuItem.Text = "Изменить";
            this.изменитьToolStripMenuItem.Click += new System.EventHandler(this.изменитьToolStripMenuItem_Click);
            this.удалитьToolStripMenuItem.Name = "удалитьToolStripMenuItem";
            this.удалитьToolStripMenuItem.Text = "Удалить";
            this.удалитьToolStripMenuItem.Click += new System.EventHandler(this.удалитьToolStripMenuItem_Click);
            this.абонентToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] { this.добавитьToolStripMenuItem, this.изменитьToolStripMenuItem, this.удалитьToolStripMenuItem });
            this.файлToolStripMenuItem.Name = "файлToolStripMenuItem";
            this.файлToolStripMenuItem.Text = "Файл";
            this.открытьToolStripMenuItem.Name = "открытьToolStripMenuItem";
            this.открытьToolStripMenuItem.Text = "Открыть";
            this.открытьToolStripMenuItem.Click += new System.EventHandler(this.открытьToolStripMenuItem_Click);
            this.сохранитьToolStripMenuItem.Name = "сохранитьToolStripMenuItem";
            this.сохранитьToolStripMenuItem.Text = "Сохранить";
            this.сохранитьToolStripMenuItem.Click += new System.EventHandler(this.сохранитьToolStripMenuItem_Click);
            this.добавитьИзФайлаToolStripMenuItem.Name = "добавитьИзФайлаToolStripMenuItem";
            this.добавитьИзФайлаToolStripMenuItem.Text = "Добавить из файла";
            this.добавитьИзФайлаToolStripMenuItem.Click += new System.EventHandler(this.добавитьИзФайлаToolStripMenuItem_Click);
            this.файлToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] { this.открытьToolStripMenuItem, this.сохранитьToolStripMenuItem, this.добавитьИзФайлаToolStripMenuItem });
            this.поискToolStripMenuItem.Name = "поискToolStripMenuItem";
            this.поискToolStripMenuItem.Text = "Поиск";
            this.поискПоФИОToolStripMenuItem.Name = "поискПоФИОToolStripMenuItem";
            this.поискПоФИОToolStripMenuItem.Text = "Поиск по ФИО";
            this.поискПоФИОToolStripMenuItem.Click += new System.EventHandler(this.поискПоФИОToolStripMenuItem_Click);
            this.поискПоАдресуToolStripMenuItem.Name = "поискПоАдресуToolStripMenuItem";
            this.поискПоАдресуToolStripMenuItem.Text = "Поиск по адресу";
            this.поискПоАдресуToolStripMenuItem.Click += new System.EventHandler(this.поискПоАдресуToolStripMenuItem_Click);
            this.поискПоТелефонуToolStripMenuItem.Name = "поискПоТелефонуToolStripMenuItem";
            this.поискПоТелефонуToolStripMenuItem.Text = "Поиск по телефону";
            this.поискПоТелефонуToolStripMenuItem.Click += new System.EventHandler(this.поискПоТелефонуToolStripMenuItem_Click);
            this.поискToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] { this.поискПоФИОToolStripMenuItem, this.поискПоАдресуToolStripMenuItem, this.поискПоТелефонуToolStripMenuItem });
            this.сортировкаToolStripMenuItem.Name = "сортировкаToolStripMenuItem";
            this.сортировкаToolStripMenuItem.Text = "Сортировка";
            this.сортироватьПоФамилииToolStripMenuItem.Name = "сортироватьПоФамилииToolStripMenuItem";
            this.сортироватьПоФамилииToolStripMenuItem.Text = "Сортировать по фамилии";
            this.сортироватьПоФамилииToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоФамилииToolStripMenuItem_Click);
            this.сортироватьПоИмениToolStripMenuItem.Name = "сортироватьПоИмениToolStripMenuItem";
            this.сортироватьПоИмениToolStripMenuItem.Text = "Сортировать по имени";
            this.сортироватьПоИмениToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоИмениToolStripMenuItem_Click);
            this.сортироватьПоОтчествуToolStripMenuItem.Name = "сортироватьПоОтчествуToolStripMenuItem";
            this.сортироватьПоОтчествуToolStripMenuItem.Text = "Сортировать по отчеству";
            this.сортироватьПоОтчествуToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоОтчествуToolStripMenuItem_Click);
            this.сортироватьПоУлицеToolStripMenuItem.Name = "сортироватьПоУлицеToolStripMenuItem";
            this.сортироватьПоУлицеToolStripMenuItem.Text = "Сортировать по улице";
            this.сортироватьПоУлицеToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоУлицеToolStripMenuItem_Click);
            this.сортироватьПоДомуToolStripMenuItem.Name = "сортироватьПоДомуToolStripMenuItem";
            this.сортироватьПоДомуToolStripMenuItem.Text = "Сортировать по дому";
            this.сортироватьПоДомуToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоДомуToolStripMenuItem_Click);
            this.сортироватьПоКвартиреToolStripMenuItem.Name = "сортироватьПоКвартиреToolStripMenuItem";
            this.сортироватьПоКвартиреToolStripMenuItem.Text = "Сортировать по квартире";
            this.сортироватьПоКвартиреToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоКвартиреToolStripMenuItem_Click);
            this.сортироватьПоТелефонуToolStripMenuItem.Name = "сортироватьПоТелефонуToolStripMenuItem";
            this.сортироватьПоТелефонуToolStripMenuItem.Text = "Сортировать по телефону";
            this.сортироватьПоТелефонуToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоТелефонуToolStripMenuItem_Click);
            this.сортироватьПоФамилииDescToolStripMenuItem.Name = "сортироватьПоФамилииDescToolStripMenuItem";
            this.сортироватьПоФамилииDescToolStripMenuItem.Text = "Сортировать по фамилии (убыв.)";
            this.сортироватьПоФамилииDescToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоФамилииDescToolStripMenuItem_Click);
            this.сортироватьПоИмениDescToolStripMenuItem.Name = "сортироватьПоИмениDescToolStripMenuItem";
            this.сортироватьПоИмениDescToolStripMenuItem.Text = "Сортировать по имени (убыв.)";
            this.сортироватьПоИмениDescToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоИмениDescToolStripMenuItem_Click);
            this.сортироватьПоОтчествуDescToolStripMenuItem.Name = "сортироватьПоОтчествуDescToolStripMenuItem";
            this.сортироватьПоОтчествуDescToolStripMenuItem.Text = "Сортировать по отчеству (убыв.)";
            this.сортироватьПоОтчествуDescToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоОтчествуDescToolStripMenuItem_Click);
            this.сортироватьПоУлицеDescToolStripMenuItem.Name = "сортироватьПоУлицеDescToolStripMenuItem";
            this.сортироватьПоУлицеDescToolStripMenuItem.Text = "Сортировать по улице (убыв.)";
            this.сортироватьПоУлицеDescToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоУлицеDescToolStripMenuItem_Click);
            this.сортироватьПоДомуDescToolStripMenuItem.Name = "сортироватьПоДомуDescToolStripMenuItem";
            this.сортироватьПоДомуDescToolStripMenuItem.Text = "Сортировать по дому (убыв.)";
            this.сортироватьПоДомуDescToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоДомуDescToolStripMenuItem_Click);
            this.сортироватьПоКвартиреDescToolStripMenuItem.Name = "сортироватьПоКвартиреDescToolStripMenuItem";
            this.сортироватьПоКвартиреDescToolStripMenuItem.Text = "Сортировать по квартире (убыв.)";
            this.сортироватьПоКвартиреDescToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоКвартиреDescToolStripMenuItem_Click);
            this.сортироватьПоТелефонуDescToolStripMenuItem.Name = "сортироватьПоТелефонуDescToolStripMenuItem";
            this.сортироватьПоТелефонуDescToolStripMenuItem.Text = "Сортировать по телефону (убыв.)";
            this.сортироватьПоТелефонуDescToolStripMenuItem.Click += new System.EventHandler(this.сортироватьПоТелефонуDescToolStripMenuItem_Click);
            this.сортировкаToolStripMenuItem.DropDownItems.AddRange(new System.Windows.Forms.ToolStripItem[] { this.сортироватьПоФамилииToolStripMenuItem, this.сортироватьПоИмениToolStripMenuItem, this.сортироватьПоОтчествуToolStripMenuItem, this.сортироватьПоУлицеToolStripMenuItem, this.сортироватьПоДомуToolStripMenuItem, this.сортироватьПоКвартиреToolStripMenuItem, this.сортироватьПоТелефонуToolStripMenuItem, this.сортироватьПоФамилииDescToolStripMenuItem, this.сортироватьПоИмениDescToolStripMenuItem, this.сортироватьПоОтчествуDescToolStripMenuItem, this.сортироватьПоУлицеDescToolStripMenuItem, this.сортироватьПоДомуDescToolStripMenuItem, this.сортироватьПоКвартиреDescToolStripMenuItem, this.сортироватьПоТелефонуDescToolStripMenuItem });
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { this.абонентToolStripMenuItem, this.файлToolStripMenuItem, this.поискToolStripMenuItem, this.сортировкаToolStripMenuItem });
            // 
            // statusStrip1
            // 
            this.statusStrip1.Size = new System.Drawing.Size(360, 22);
            this.statusStrip1.Name = "statusStrip1";
            this.statusStrip1.TabIndex = 0;
            this.statusStrip1.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.statusStrip1.Dock = System.Windows.Forms.DockStyle.Bottom;
            this.Quantity_ToolStripStatusLabel.Name = "Quantity_ToolStripStatusLabel";
            this.Quantity_ToolStripStatusLabel.Text = "Количество записей";
            this.Quantity_ToolStripStatusLabel.BorderSides = System.Windows.Forms.ToolStripStatusLabelBorderSides.All;
            this.Quantity_ToolStripStatusLabel.BorderStyle = System.Windows.Forms.Border3DStyle.SunkenOuter;
            this.QuantityToolStripStatusLabel.Name = "QuantityToolStripStatusLabel";
            this.QuantityToolStripStatusLabel.Text = "0";
            this.QuantityToolStripStatusLabel.BorderSides = System.Windows.Forms.ToolStripStatusLabelBorderSides.All;
            this.QuantityToolStripStatusLabel.BorderStyle = System.Windows.Forms.Border3DStyle.SunkenOuter;
            this.QuantityToolStripStatusLabel.AutoSize = false;
            this.QuantityToolStripStatusLabel.Size = new System.Drawing.Size(30, 17);
            this.Number_ToolStripStatusLabel.Name = "Number_ToolStripStatusLabel";
            this.Number_ToolStripStatusLabel.Text = "Номер записи";
            this.Number_ToolStripStatusLabel.BorderSides = System.Windows.Forms.ToolStripStatusLabelBorderSides.All;
            this.Number_ToolStripStatusLabel.BorderStyle = System.Windows.Forms.Border3DStyle.SunkenOuter;
            this.NumberToolStripStatusLabel.Name = "NumberToolStripStatusLabel";
            this.NumberToolStripStatusLabel.Text = "0";
            this.NumberToolStripStatusLabel.BorderSides = System.Windows.Forms.ToolStripStatusLabelBorderSides.All;
            this.NumberToolStripStatusLabel.BorderStyle = System.Windows.Forms.Border3DStyle.SunkenOuter;
            this.NumberToolStripStatusLabel.AutoSize = false;
            this.NumberToolStripStatusLabel.Size = new System.Drawing.Size(30, 17);
            this.statusStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] { this.Quantity_ToolStripStatusLabel, this.QuantityToolStripStatusLabel, this.Number_ToolStripStatusLabel, this.NumberToolStripStatusLabel });
            // 
            // openFileDialog1
            // 
            this.openFileDialog1.Filter = "Текстовые файлы (*.txt)|*.txt|XML файлы (*.xml)|*.xml|Бинарные файлы (*.dat)|*.dat|JSON файлы (*.json)|*.json";
            // 
            // saveFileDialog1
            // 
            this.saveFileDialog1.Filter = "Текстовые файлы (*.txt)|*.txt|XML файлы (*.xml)|*.xml|Бинарные файлы (*.dat)|*.dat|JSON файлы (*.json)|*.json";

            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(360, 380);
            this.Name = "MainForm";
            this.Text = "Телефонный справочник";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.MainForm_FormClosing);
            this.Controls.Add(this.lblLastName);
            this.Controls.Add(this.lblName);
            this.Controls.Add(this.lblPatronymic);
            this.Controls.Add(this.lblStreet);
            this.Controls.Add(this.lblHouse);
            this.Controls.Add(this.lblFlat);
            this.Controls.Add(this.lblPhone);
            this.Controls.Add(this.LastNameTextBox);
            this.Controls.Add(this.NameTextBox);
            this.Controls.Add(this.PatronymicTextBox);
            this.Controls.Add(this.StreetTextBox);
            this.Controls.Add(this.HouseNumericUpDown);
            this.Controls.Add(this.FlatNumericUpDown);
            this.Controls.Add(this.PhoneMaskedTextBox);
            this.Controls.Add(this.PreviousButton);
            this.Controls.Add(this.NextButton);
            this.Controls.Add(this.menuStrip1);
            this.Controls.Add(this.statusStrip1);
            this.MainMenuStrip = this.menuStrip1;

            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion
    }
}
