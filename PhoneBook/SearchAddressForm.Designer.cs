namespace PhoneBook
{
    partial class SearchAddressForm
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

        private System.Windows.Forms.Label lblStreet;
        private System.Windows.Forms.Label lblHouse;
        private System.Windows.Forms.Label lblFlat;
        private System.Windows.Forms.TextBox StreetTextBox;
        private System.Windows.Forms.NumericUpDown HouseNumericUpDown;
        private System.Windows.Forms.NumericUpDown FlatNumericUpDown;
        private System.Windows.Forms.Button SearchButton;
        private System.Windows.Forms.Button CloseButton;
        private System.Windows.Forms.Label lblResults;
        private System.Windows.Forms.TextBox ResultsTextBox;

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.lblStreet = new System.Windows.Forms.Label();
            this.lblHouse = new System.Windows.Forms.Label();
            this.lblFlat = new System.Windows.Forms.Label();
            this.StreetTextBox = new System.Windows.Forms.TextBox();
            this.HouseNumericUpDown = new System.Windows.Forms.NumericUpDown();
            this.FlatNumericUpDown = new System.Windows.Forms.NumericUpDown();
            this.SearchButton = new System.Windows.Forms.Button();
            this.CloseButton = new System.Windows.Forms.Button();
            this.lblResults = new System.Windows.Forms.Label();
            this.ResultsTextBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();

            // 
            // lblStreet
            // 
            this.lblStreet.Location = new System.Drawing.Point(20, 20);
            this.lblStreet.Size = new System.Drawing.Size(100, 23);
            this.lblStreet.Name = "lblStreet";
            this.lblStreet.TabIndex = 0;
            this.lblStreet.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.lblStreet.Text = "Улица";
            // 
            // lblHouse
            // 
            this.lblHouse.Location = new System.Drawing.Point(20, 55);
            this.lblHouse.Size = new System.Drawing.Size(100, 23);
            this.lblHouse.Name = "lblHouse";
            this.lblHouse.TabIndex = 0;
            this.lblHouse.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.lblHouse.Text = "Дом";
            // 
            // lblFlat
            // 
            this.lblFlat.Location = new System.Drawing.Point(20, 90);
            this.lblFlat.Size = new System.Drawing.Size(100, 23);
            this.lblFlat.Name = "lblFlat";
            this.lblFlat.TabIndex = 0;
            this.lblFlat.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.lblFlat.Text = "Квартира";
            // 
            // StreetTextBox
            // 
            this.StreetTextBox.Location = new System.Drawing.Point(130, 18);
            this.StreetTextBox.Size = new System.Drawing.Size(250, 23);
            this.StreetTextBox.Name = "StreetTextBox";
            this.StreetTextBox.TabIndex = 0;
            this.StreetTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            // 
            // HouseNumericUpDown
            // 
            this.HouseNumericUpDown.Location = new System.Drawing.Point(130, 53);
            this.HouseNumericUpDown.Size = new System.Drawing.Size(250, 23);
            this.HouseNumericUpDown.Name = "HouseNumericUpDown";
            this.HouseNumericUpDown.TabIndex = 1;
            this.HouseNumericUpDown.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.HouseNumericUpDown.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            this.HouseNumericUpDown.Maximum = new decimal(new int[] { 500, 0, 0, 0 });
            this.HouseNumericUpDown.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // FlatNumericUpDown
            // 
            this.FlatNumericUpDown.Location = new System.Drawing.Point(130, 88);
            this.FlatNumericUpDown.Size = new System.Drawing.Size(250, 23);
            this.FlatNumericUpDown.Name = "FlatNumericUpDown";
            this.FlatNumericUpDown.TabIndex = 2;
            this.FlatNumericUpDown.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.FlatNumericUpDown.Minimum = new decimal(new int[] { 1, 0, 0, 0 });
            this.FlatNumericUpDown.Maximum = new decimal(new int[] { 500, 0, 0, 0 });
            this.FlatNumericUpDown.Value = new decimal(new int[] { 1, 0, 0, 0 });
            // 
            // SearchButton
            // 
            this.SearchButton.Location = new System.Drawing.Point(40, 120);
            this.SearchButton.Size = new System.Drawing.Size(120, 32);
            this.SearchButton.Name = "SearchButton";
            this.SearchButton.TabIndex = 3;
            this.SearchButton.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.SearchButton.Text = "Найти";
            this.SearchButton.Click += new System.EventHandler(this.SearchButton_Click);
            // 
            // CloseButton
            // 
            this.CloseButton.Location = new System.Drawing.Point(260, 120);
            this.CloseButton.Size = new System.Drawing.Size(120, 32);
            this.CloseButton.Name = "CloseButton";
            this.CloseButton.TabIndex = 4;
            this.CloseButton.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.CloseButton.Text = "Закрыть";
            this.CloseButton.Click += new System.EventHandler(this.CloseButton_Click);
            // 
            // lblResults
            // 
            this.lblResults.Location = new System.Drawing.Point(150, 160);
            this.lblResults.Size = new System.Drawing.Size(150, 20);
            this.lblResults.Name = "lblResults";
            this.lblResults.TabIndex = 0;
            this.lblResults.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.lblResults.Text = "Результаты поиска";
            // 
            // ResultsTextBox
            // 
            this.ResultsTextBox.Location = new System.Drawing.Point(40, 185);
            this.ResultsTextBox.Size = new System.Drawing.Size(340, 120);
            this.ResultsTextBox.Name = "ResultsTextBox";
            this.ResultsTextBox.TabIndex = 5;
            this.ResultsTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.ResultsTextBox.Multiline = true;
            this.ResultsTextBox.ReadOnly = true;
            this.ResultsTextBox.ScrollBars = System.Windows.Forms.ScrollBars.Both;

            // 
            // SearchAddressForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(450, 320);
            this.Name = "SearchAddressForm";
            this.Text = "Поиск по адресу";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Controls.Add(this.lblStreet);
            this.Controls.Add(this.lblHouse);
            this.Controls.Add(this.lblFlat);
            this.Controls.Add(this.StreetTextBox);
            this.Controls.Add(this.HouseNumericUpDown);
            this.Controls.Add(this.FlatNumericUpDown);
            this.Controls.Add(this.SearchButton);
            this.Controls.Add(this.CloseButton);
            this.Controls.Add(this.lblResults);
            this.Controls.Add(this.ResultsTextBox);


            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion
    }
}
