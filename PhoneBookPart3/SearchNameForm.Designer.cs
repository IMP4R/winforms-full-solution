namespace PhoneBookPart3
{
    partial class SearchNameForm
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
        private System.Windows.Forms.TextBox LastNameTextBox;
        private System.Windows.Forms.TextBox NameTextBox;
        private System.Windows.Forms.TextBox PatronymicTextBox;
        private System.Windows.Forms.Button SearchButton;
        private System.Windows.Forms.Label lblResults;
        private System.Windows.Forms.TextBox ResultsTextBox;

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.lblLastName = new System.Windows.Forms.Label();
            this.lblName = new System.Windows.Forms.Label();
            this.lblPatronymic = new System.Windows.Forms.Label();
            this.LastNameTextBox = new System.Windows.Forms.TextBox();
            this.NameTextBox = new System.Windows.Forms.TextBox();
            this.PatronymicTextBox = new System.Windows.Forms.TextBox();
            this.SearchButton = new System.Windows.Forms.Button();
            this.lblResults = new System.Windows.Forms.Label();
            this.ResultsTextBox = new System.Windows.Forms.TextBox();
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
            // LastNameTextBox
            // 
            this.LastNameTextBox.Location = new System.Drawing.Point(130, 18);
            this.LastNameTextBox.Size = new System.Drawing.Size(350, 23);
            this.LastNameTextBox.Name = "LastNameTextBox";
            this.LastNameTextBox.TabIndex = 0;
            this.LastNameTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            // 
            // NameTextBox
            // 
            this.NameTextBox.Location = new System.Drawing.Point(130, 53);
            this.NameTextBox.Size = new System.Drawing.Size(350, 23);
            this.NameTextBox.Name = "NameTextBox";
            this.NameTextBox.TabIndex = 1;
            this.NameTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            // 
            // PatronymicTextBox
            // 
            this.PatronymicTextBox.Location = new System.Drawing.Point(130, 88);
            this.PatronymicTextBox.Size = new System.Drawing.Size(350, 23);
            this.PatronymicTextBox.Name = "PatronymicTextBox";
            this.PatronymicTextBox.TabIndex = 2;
            this.PatronymicTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            // 
            // SearchButton
            // 
            this.SearchButton.Location = new System.Drawing.Point(20, 120);
            this.SearchButton.Size = new System.Drawing.Size(120, 32);
            this.SearchButton.Name = "SearchButton";
            this.SearchButton.TabIndex = 3;
            this.SearchButton.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.SearchButton.Text = "Найти";
            this.SearchButton.Click += new System.EventHandler(this.SearchButton_Click);
            // 
            // lblResults
            // 
            this.lblResults.Location = new System.Drawing.Point(20, 160);
            this.lblResults.Size = new System.Drawing.Size(150, 20);
            this.lblResults.Name = "lblResults";
            this.lblResults.TabIndex = 0;
            this.lblResults.Font = new System.Drawing.Font("Tahoma", 12F, System.Drawing.FontStyle.Bold);
            this.lblResults.Text = "Результаты поиска";
            // 
            // ResultsTextBox
            // 
            this.ResultsTextBox.Location = new System.Drawing.Point(20, 185);
            this.ResultsTextBox.Size = new System.Drawing.Size(460, 100);
            this.ResultsTextBox.Name = "ResultsTextBox";
            this.ResultsTextBox.TabIndex = 4;
            this.ResultsTextBox.Font = new System.Drawing.Font("Tahoma", 9F);
            this.ResultsTextBox.Multiline = true;
            this.ResultsTextBox.ReadOnly = true;
            this.ResultsTextBox.ScrollBars = System.Windows.Forms.ScrollBars.Both;

            // 
            // SearchNameForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(500, 300);
            this.Name = "SearchNameForm";
            this.Text = "Поиск абонента";
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterParent;
            this.Controls.Add(this.lblLastName);
            this.Controls.Add(this.lblName);
            this.Controls.Add(this.lblPatronymic);
            this.Controls.Add(this.LastNameTextBox);
            this.Controls.Add(this.NameTextBox);
            this.Controls.Add(this.PatronymicTextBox);
            this.Controls.Add(this.SearchButton);
            this.Controls.Add(this.lblResults);
            this.Controls.Add(this.ResultsTextBox);


            this.ResumeLayout(false);
            this.PerformLayout();
        }

        #endregion
    }
}
