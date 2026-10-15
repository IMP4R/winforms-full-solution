namespace PhoneBook
{
    partial class SearchPhoneForm
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

        private System.Windows.Forms.Label lblPhone;
        private System.Windows.Forms.MaskedTextBox PhoneMaskedTextBox;
        private System.Windows.Forms.Button SearchButton;
        private System.Windows.Forms.Button CloseButton;
        private System.Windows.Forms.Label lblResults;
        private System.Windows.Forms.TextBox ResultsTextBox;

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.lblPhone = new System.Windows.Forms.Label();
            this.PhoneMaskedTextBox = new System.Windows.Forms.MaskedTextBox();
            this.SearchButton = new System.Windows.Forms.Button();
            this.CloseButton = new System.Windows.Forms.Button();
            this.lblResults = new System.Windows.Forms.Label();
            this.ResultsTextBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();

            // 
            // lblPhone
            // 
            this.lblPhone.Location = new System.Drawing.Point(20, 20);
            this.lblPhone.Size = new System.Drawing.Size(100, 23);
            this.lblPhone.Name = "lblPhone";
            this.lblPhone.TabIndex = 0;
            this.lblPhone.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.lblPhone.Text = "Телефон";
            // 
            // PhoneMaskedTextBox
            // 
            this.PhoneMaskedTextBox.Location = new System.Drawing.Point(130, 18);
            this.PhoneMaskedTextBox.Size = new System.Drawing.Size(250, 23);
            this.PhoneMaskedTextBox.Name = "PhoneMaskedTextBox";
            this.PhoneMaskedTextBox.TabIndex = 0;
            this.PhoneMaskedTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.PhoneMaskedTextBox.Mask = "(999) 000-000";
            // 
            // SearchButton
            // 
            this.SearchButton.Location = new System.Drawing.Point(40, 55);
            this.SearchButton.Size = new System.Drawing.Size(120, 32);
            this.SearchButton.Name = "SearchButton";
            this.SearchButton.TabIndex = 1;
            this.SearchButton.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.SearchButton.Text = "Найти";
            this.SearchButton.Click += new System.EventHandler(this.SearchButton_Click);
            // 
            // CloseButton
            // 
            this.CloseButton.Location = new System.Drawing.Point(260, 55);
            this.CloseButton.Size = new System.Drawing.Size(120, 32);
            this.CloseButton.Name = "CloseButton";
            this.CloseButton.TabIndex = 2;
            this.CloseButton.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.CloseButton.Text = "Закрыть";
            this.CloseButton.Click += new System.EventHandler(this.CloseButton_Click);
            // 
            // lblResults
            // 
            this.lblResults.Location = new System.Drawing.Point(150, 100);
            this.lblResults.Size = new System.Drawing.Size(150, 20);
            this.lblResults.Name = "lblResults";
            this.lblResults.TabIndex = 0;
            this.lblResults.Font = new System.Drawing.Font("Segoe UI", 14F);
            this.lblResults.Text = "Результаты поиска";
            // 
            // ResultsTextBox
            // 
            this.ResultsTextBox.Location = new System.Drawing.Point(40, 125);
            this.ResultsTextBox.Size = new System.Drawing.Size(340, 120);
            this.ResultsTextBox.Name = "ResultsTextBox";
            this.ResultsTextBox.TabIndex = 3;
            this.ResultsTextBox.Font = new System.Drawing.Font("Segoe UI", 12F);
            this.ResultsTextBox.Multiline = true;
            this.ResultsTextBox.ReadOnly = true;
            this.ResultsTextBox.ScrollBars = System.Windows.Forms.ScrollBars.Both;

            // 
            // SearchPhoneForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(450, 260);
            this.Name = "SearchPhoneForm";
            this.Text = "Поиск по телефону";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Controls.Add(this.lblPhone);
            this.Controls.Add(this.PhoneMaskedTextBox);
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
