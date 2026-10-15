namespace PhoneBookPart3
{
    partial class AddForm
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
        private System.Windows.Forms.Button AddButton;

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
            this.AddButton = new System.Windows.Forms.Button();
            this.SuspendLayout();

            // 
            // lblLastName
            // 
            this.lblLastName.Location = new System.Drawing.Point(20, 20);
            this.lblLastName.Size = new System.Drawing.Size(100, 30);
            this.lblLastName.Name = "lblLastName";
            this.lblLastName.TabIndex = 0;
            this.lblLastName.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblLastName.Text = "Фамилия";
            // 
            // lblName
            // 
            this.lblName.Location = new System.Drawing.Point(20, 55);
            this.lblName.Size = new System.Drawing.Size(100, 30);
            this.lblName.Name = "lblName";
            this.lblName.TabIndex = 0;
            this.lblName.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblName.Text = "Имя";
            // 
            // lblPatronymic
            // 
            this.lblPatronymic.Location = new System.Drawing.Point(20, 90);
            this.lblPatronymic.Size = new System.Drawing.Size(100, 30);
            this.lblPatronymic.Name = "lblPatronymic";
            this.lblPatronymic.TabIndex = 0;
            this.lblPatronymic.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblPatronymic.Text = "Отчество";
            // 
            // lblStreet
            // 
            this.lblStreet.Location = new System.Drawing.Point(20, 125);
            this.lblStreet.Size = new System.Drawing.Size(100, 30);
            this.lblStreet.Name = "lblStreet";
            this.lblStreet.TabIndex = 0;
            this.lblStreet.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblStreet.Text = "Улица";
            // 
            // lblHouse
            // 
            this.lblHouse.Location = new System.Drawing.Point(20, 160);
            this.lblHouse.Size = new System.Drawing.Size(100, 30);
            this.lblHouse.Name = "lblHouse";
            this.lblHouse.TabIndex = 0;
            this.lblHouse.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblHouse.Text = "Дом";
            // 
            // lblFlat
            // 
            this.lblFlat.Location = new System.Drawing.Point(20, 195);
            this.lblFlat.Size = new System.Drawing.Size(100, 30);
            this.lblFlat.Name = "lblFlat";
            this.lblFlat.TabIndex = 0;
            this.lblFlat.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblFlat.Text = "Квартира";
            // 
            // lblPhone
            // 
            this.lblPhone.Location = new System.Drawing.Point(20, 230);
            this.lblPhone.Size = new System.Drawing.Size(100, 30);
            this.lblPhone.Name = "lblPhone";
            this.lblPhone.TabIndex = 0;
            this.lblPhone.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblPhone.Text = "Телефон";
            // 
            // LastNameTextBox
            // 
            this.LastNameTextBox.Location = new System.Drawing.Point(120, 18);
            this.LastNameTextBox.Size = new System.Drawing.Size(230, 30);
            this.LastNameTextBox.Name = "LastNameTextBox";
            this.LastNameTextBox.TabIndex = 0;
            this.LastNameTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            this.LastNameTextBox.MaxLength = 25;
            // 
            // NameTextBox
            // 
            this.NameTextBox.Location = new System.Drawing.Point(120, 53);
            this.NameTextBox.Size = new System.Drawing.Size(230, 30);
            this.NameTextBox.Name = "NameTextBox";
            this.NameTextBox.TabIndex = 1;
            this.NameTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            this.NameTextBox.MaxLength = 25;
            // 
            // PatronymicTextBox
            // 
            this.PatronymicTextBox.Location = new System.Drawing.Point(120, 88);
            this.PatronymicTextBox.Size = new System.Drawing.Size(230, 30);
            this.PatronymicTextBox.Name = "PatronymicTextBox";
            this.PatronymicTextBox.TabIndex = 2;
            this.PatronymicTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            this.PatronymicTextBox.MaxLength = 25;
            // 
            // StreetTextBox
            // 
            this.StreetTextBox.Location = new System.Drawing.Point(120, 123);
            this.StreetTextBox.Size = new System.Drawing.Size(230, 30);
            this.StreetTextBox.Name = "StreetTextBox";
            this.StreetTextBox.TabIndex = 3;
            this.StreetTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            this.StreetTextBox.MaxLength = 40;
            // 
            // HouseNumericUpDown
            // 
            this.HouseNumericUpDown.Location = new System.Drawing.Point(120, 158);
            this.HouseNumericUpDown.Size = new System.Drawing.Size(230, 30);
            this.HouseNumericUpDown.Name = "HouseNumericUpDown";
            this.HouseNumericUpDown.TabIndex = 4;
            this.HouseNumericUpDown.Font = new System.Drawing.Font("Tahoma", 9F);
            this.HouseNumericUpDown.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            this.HouseNumericUpDown.Maximum = new decimal(new int[] { 500, 0, 0, 0 });
            this.HouseNumericUpDown.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // FlatNumericUpDown
            // 
            this.FlatNumericUpDown.Location = new System.Drawing.Point(120, 193);
            this.FlatNumericUpDown.Size = new System.Drawing.Size(230, 30);
            this.FlatNumericUpDown.Name = "FlatNumericUpDown";
            this.FlatNumericUpDown.TabIndex = 5;
            this.FlatNumericUpDown.Font = new System.Drawing.Font("Tahoma", 9F);
            this.FlatNumericUpDown.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            this.FlatNumericUpDown.Maximum = new decimal(new int[] { 500, 0, 0, 0 });
            this.FlatNumericUpDown.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // PhoneMaskedTextBox
            // 
            this.PhoneMaskedTextBox.Location = new System.Drawing.Point(120, 228);
            this.PhoneMaskedTextBox.Size = new System.Drawing.Size(230, 30);
            this.PhoneMaskedTextBox.Name = "PhoneMaskedTextBox";
            this.PhoneMaskedTextBox.TabIndex = 6;
            this.PhoneMaskedTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            this.PhoneMaskedTextBox.Mask = "(999) 000-0000";
            // 
            // AddButton
            // 
            this.AddButton.Location = new System.Drawing.Point(20, 280);
            this.AddButton.Size = new System.Drawing.Size(350, 40);
            this.AddButton.Name = "AddButton";
            this.AddButton.TabIndex = 7;
            this.AddButton.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.AddButton.Text = "Добавить";
            this.AddButton.Click += new System.EventHandler(this.AddButton_Click);

            // 
            // AddForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(390, 360);
            this.Name = "AddForm";
            this.Text = "Добавление абонента";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
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
            this.Controls.Add(this.AddButton);


            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion
    }
}
