export const PHONEBOOK_PRESET = {
  "projectName": "PhoneBook",
  "namespace": "PhoneBook",
  "startupForm": "MainForm",
  "forms": [
    {
      "id": "f_4dciga",
      "name": "AddForm",
      "type": "Form",
      "isMain": false,
      "props": {
        "Name": "AddForm",
        "Text": "Добавление абонента",
        "FormBorderStyle": "FixedSingle",
        "StartPosition": "CenterParent",
        "Size.Width": 390,
        "Size.Height": 360,
        "Location.X": 0,
        "Location.Y": 0,
        "TabIndex": 0,
        "Enabled": true,
        "Visible": true,
        "Font.Size": 9,
        "Font.Bold": false,
        "Font.Family": "Segoe UI"
      },
      "children": [
        {
          "id": "c_7z5gc5",
          "name": "lblLastName",
          "type": "Label",
          "props": {
            "Name": "lblLastName",
            "Location.X": 20,
            "Location.Y": 20,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Text": "Фамилия",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_lzfsbo",
          "name": "lblName",
          "type": "Label",
          "props": {
            "Name": "lblName",
            "Location.X": 20,
            "Location.Y": 55,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Text": "Имя",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_w0gnab",
          "name": "lblPatronymic",
          "type": "Label",
          "props": {
            "Name": "lblPatronymic",
            "Location.X": 20,
            "Location.Y": 90,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Text": "Отчество",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_nawxje",
          "name": "lblStreet",
          "type": "Label",
          "props": {
            "Name": "lblStreet",
            "Location.X": 20,
            "Location.Y": 125,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Text": "Улица",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_7729jj",
          "name": "lblHouse",
          "type": "Label",
          "props": {
            "Name": "lblHouse",
            "Location.X": 20,
            "Location.Y": 160,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Text": "Дом",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_15co52",
          "name": "lblFlat",
          "type": "Label",
          "props": {
            "Name": "lblFlat",
            "Location.X": 20,
            "Location.Y": 195,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Text": "Квартира",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_gagb3z",
          "name": "lblPhone",
          "type": "Label",
          "props": {
            "Name": "lblPhone",
            "Location.X": 20,
            "Location.Y": 230,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Text": "Телефон",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_ymcrcb",
          "name": "LastNameTextBox",
          "type": "TextBox",
          "props": {
            "Name": "LastNameTextBox",
            "Location.X": 120,
            "Location.Y": 18,
            "Size.Width": 260,
            "Size.Height": 30,
            "TabIndex": 0,
            "MaxLength": 25,
            "Enabled": true,
            "Visible": true,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_36porj",
          "name": "NameTextBox",
          "type": "TextBox",
          "props": {
            "Name": "NameTextBox",
            "Location.X": 120,
            "Location.Y": 53,
            "Size.Width": 260,
            "Size.Height": 30,
            "TabIndex": 1,
            "MaxLength": 25,
            "Enabled": true,
            "Visible": true,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_zogdap",
          "name": "PatronymicTextBox",
          "type": "TextBox",
          "props": {
            "Name": "PatronymicTextBox",
            "Location.X": 120,
            "Location.Y": 88,
            "Size.Width": 260,
            "Size.Height": 30,
            "TabIndex": 2,
            "MaxLength": 25,
            "Enabled": true,
            "Visible": true,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_lz8u1g",
          "name": "StreetTextBox",
          "type": "TextBox",
          "props": {
            "Name": "StreetTextBox",
            "Location.X": 120,
            "Location.Y": 123,
            "Size.Width": 260,
            "Size.Height": 30,
            "TabIndex": 3,
            "MaxLength": 40,
            "Enabled": true,
            "Visible": true,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_zthjcs",
          "name": "HouseNumericUpDown",
          "type": "NumericUpDown",
          "props": {
            "Name": "HouseNumericUpDown",
            "Location.X": 120,
            "Location.Y": 158,
            "Size.Width": 260,
            "Size.Height": 30,
            "TabIndex": 4,
            "Minimum": 1,
            "Maximum": 500,
            "Value": 1,
            "Enabled": true,
            "Visible": true,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_0aluz9",
          "name": "FlatNumericUpDown",
          "type": "NumericUpDown",
          "props": {
            "Name": "FlatNumericUpDown",
            "Location.X": 120,
            "Location.Y": 193,
            "Size.Width": 260,
            "Size.Height": 30,
            "TabIndex": 5,
            "Minimum": 1,
            "Maximum": 500,
            "Value": 1,
            "Enabled": true,
            "Visible": true,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_kkmnoq",
          "name": "PhoneMaskedTextBox",
          "type": "MaskedTextBox",
          "props": {
            "Name": "PhoneMaskedTextBox",
            "Location.X": 120,
            "Location.Y": 228,
            "Size.Width": 260,
            "Size.Height": 30,
            "TabIndex": 6,
            "Mask": "(999) 000-0000",
            "Enabled": true,
            "Visible": true,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_xey7gt",
          "name": "AddButton",
          "type": "Button",
          "props": {
            "Name": "AddButton",
            "Location.X": 20,
            "Location.Y": 280,
            "Size.Width": 350,
            "Size.Height": 40,
            "TabIndex": 7,
            "Font.Family": "Tahoma",
            "Font.Size": 12,
            "Font.Bold": true,
            "Text": "Добавить",
            "Enabled": true,
            "Visible": true
          },
          "events": {
            "Click": "h_dnq8j9"
          }
        }
      ],
      "fields": [
        {
          "type": "AddOrEdit",
          "name": "MyType",
          "init": "_MyType"
        }
      ],
      "events": {},
      "helperMethods": [],
      "publicFields": [
        {
          "type": "Note",
          "name": "MyRecord"
        }
      ],
      "constructorParam": [
        {
          "type": "Note",
          "name": "MyRecord"
        },
        {
          "type": "AddOrEdit",
          "name": "MyType"
        }
      ]
    },
    {
      "id": "f_xj75s6",
      "name": "MainForm",
      "type": "Form",
      "isMain": true,
      "props": {
        "Name": "MainForm",
        "Text": "Телефонный справочник",
        "FormBorderStyle": "FixedSingle",
        "StartPosition": "CenterScreen",
        "Size.Width": 360,
        "Size.Height": 380,
        "Location.X": 0,
        "Location.Y": 0,
        "TabIndex": 0,
        "Enabled": true,
        "Visible": true,
        "Font.Size": 9,
        "Font.Bold": false,
        "Font.Family": "Segoe UI"
      },
      "children": [
        {
          "id": "c_sk6tvm",
          "name": "lblLastName",
          "type": "Label",
          "props": {
            "Name": "lblLastName",
            "Location.X": 20,
            "Location.Y": 50,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "Фамилия",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_5v1l8m",
          "name": "lblName",
          "type": "Label",
          "props": {
            "Name": "lblName",
            "Location.X": 20,
            "Location.Y": 85,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "Имя",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_6m844t",
          "name": "lblPatronymic",
          "type": "Label",
          "props": {
            "Name": "lblPatronymic",
            "Location.X": 20,
            "Location.Y": 120,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "Отчество",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_bssgjg",
          "name": "lblStreet",
          "type": "Label",
          "props": {
            "Name": "lblStreet",
            "Location.X": 20,
            "Location.Y": 155,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "Улица",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_4ylq2c",
          "name": "lblHouse",
          "type": "Label",
          "props": {
            "Name": "lblHouse",
            "Location.X": 20,
            "Location.Y": 190,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "Дом",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_c209pa",
          "name": "lblFlat",
          "type": "Label",
          "props": {
            "Name": "lblFlat",
            "Location.X": 20,
            "Location.Y": 225,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "Квартира",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_rh13r9",
          "name": "lblPhone",
          "type": "Label",
          "props": {
            "Name": "lblPhone",
            "Location.X": 20,
            "Location.Y": 260,
            "Size.Width": 100,
            "Size.Height": 30,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "Телефон",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_znsc19",
          "name": "LastNameTextBox",
          "type": "TextBox",
          "props": {
            "Name": "LastNameTextBox",
            "Location.X": 140,
            "Location.Y": 48,
            "Size.Width": 180,
            "Size.Height": 30,
            "TabIndex": 2,
            "Enabled": false,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "MaxLength": 25,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_q9cy5p",
          "name": "NameTextBox",
          "type": "TextBox",
          "props": {
            "Name": "NameTextBox",
            "Location.X": 140,
            "Location.Y": 84,
            "Size.Width": 180,
            "Size.Height": 30,
            "TabIndex": 3,
            "Enabled": false,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "MaxLength": 25,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_92ah1t",
          "name": "PatronymicTextBox",
          "type": "TextBox",
          "props": {
            "Name": "PatronymicTextBox",
            "Location.X": 140,
            "Location.Y": 118,
            "Size.Width": 180,
            "Size.Height": 30,
            "TabIndex": 4,
            "Enabled": false,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "MaxLength": 25,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_dp11pa",
          "name": "StreetTextBox",
          "type": "TextBox",
          "props": {
            "Name": "StreetTextBox",
            "Location.X": 140,
            "Location.Y": 153,
            "Size.Width": 180,
            "Size.Height": 30,
            "TabIndex": 5,
            "Enabled": false,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "MaxLength": 40,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_3g1aig",
          "name": "HouseNumericUpDown",
          "type": "NumericUpDown",
          "props": {
            "Name": "HouseNumericUpDown",
            "Location.X": 140,
            "Location.Y": 188,
            "Size.Width": 180,
            "Size.Height": 30,
            "TabIndex": 6,
            "Enabled": false,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Minimum": 1,
            "Maximum": 500,
            "Value": 1,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_q22dlg",
          "name": "FlatNumericUpDown",
          "type": "NumericUpDown",
          "props": {
            "Name": "FlatNumericUpDown",
            "Location.X": 140,
            "Location.Y": 223,
            "Size.Width": 180,
            "Size.Height": 30,
            "TabIndex": 7,
            "Enabled": false,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Minimum": 1,
            "Maximum": 500,
            "Value": 1,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_8f3dt0",
          "name": "PhoneMaskedTextBox",
          "type": "MaskedTextBox",
          "props": {
            "Name": "PhoneMaskedTextBox",
            "Location.X": 140,
            "Location.Y": 258,
            "Size.Width": 180,
            "Size.Height": 30,
            "TabIndex": 8,
            "Enabled": false,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Mask": "(999) 000-0000",
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_x1yxpx",
          "name": "PreviousButton",
          "type": "Button",
          "props": {
            "Name": "PreviousButton",
            "Location.X": 160,
            "Location.Y": 305,
            "Size.Width": 40,
            "Size.Height": 35,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": "<",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_zxu4aq"
          }
        },
        {
          "id": "c_mw12hy",
          "name": "NextButton",
          "type": "Button",
          "props": {
            "Name": "NextButton",
            "Location.X": 210,
            "Location.Y": 305,
            "Size.Width": 40,
            "Size.Height": 35,
            "TabIndex": 1,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Text": ">",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_wmqye6"
          }
        },
        {
          "id": "c_pred7e",
          "name": "menuStrip1",
          "type": "MenuStrip",
          "props": {
            "Name": "menuStrip1",
            "Size.Width": 0,
            "Size.Height": 24,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Location.X": 10,
            "Location.Y": 10,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {},
          "items": [
            {
              "Name": "абонентToolStripMenuItem",
              "Text": "Абонент",
              "events": {},
              "items": [
                {
                  "Name": "добавитьToolStripMenuItem",
                  "Text": "Добавить",
                  "events": {
                    "Click": "h_q5zzqf"
                  }
                },
                {
                  "Name": "изменитьToolStripMenuItem",
                  "Text": "Изменить",
                  "events": {
                    "Click": "h_xh4ddj"
                  }
                },
                {
                  "Name": "удалитьToolStripMenuItem",
                  "Text": "Удалить",
                  "events": {
                    "Click": "h_l65888"
                  }
                }
              ]
            },
            {
              "Name": "файлToolStripMenuItem",
              "Text": "Файл",
              "events": {},
              "items": [
                {
                  "Name": "открытьToolStripMenuItem",
                  "Text": "Открыть",
                  "events": {
                    "Click": "h_kkvc6i"
                  }
                },
                {
                  "Name": "сохранитьToolStripMenuItem",
                  "Text": "Сохранить",
                  "events": {
                    "Click": "h_ayvgyj"
                  }
                },
                {
                  "Name": "добавитьИзФайлаToolStripMenuItem",
                  "Text": "Добавить из файла",
                  "events": {
                    "Click": "h_zj9akf"
                  }
                }
              ]
            },
            {
              "Name": "поискToolStripMenuItem",
              "Text": "Поиск",
              "events": {},
              "items": [
                {
                  "Name": "поискПоФИОToolStripMenuItem",
                  "Text": "Поиск по ФИО",
                  "events": {
                    "Click": "h_uim7n0"
                  }
                },
                {
                  "Name": "поискПоАдресуToolStripMenuItem",
                  "Text": "Поиск по адресу",
                  "events": {
                    "Click": "h_lrjfkj"
                  }
                },
                {
                  "Name": "поискПоТелефонуToolStripMenuItem",
                  "Text": "Поиск по телефону",
                  "events": {
                    "Click": "h_c2sz3e"
                  }
                }
              ]
            },
            {
              "Name": "сортировкаToolStripMenuItem",
              "Text": "Сортировка",
              "events": {},
              "items": [
                {
                  "Name": "сортироватьПоФамилииToolStripMenuItem",
                  "Text": "Сортировать по фамилии",
                  "events": {
                    "Click": "h_ogthpj"
                  }
                },
                {
                  "Name": "сортироватьПоИмениToolStripMenuItem",
                  "Text": "Сортировать по имени",
                  "events": {
                    "Click": "h_k3iwmn"
                  }
                },
                {
                  "Name": "сортироватьПоОтчествуToolStripMenuItem",
                  "Text": "Сортировать по отчеству",
                  "events": {
                    "Click": "h_i7whks"
                  }
                },
                {
                  "Name": "сортироватьПоУлицеToolStripMenuItem",
                  "Text": "Сортировать по улице",
                  "events": {
                    "Click": "h_qg7hps"
                  }
                },
                {
                  "Name": "сортироватьПоДомуToolStripMenuItem",
                  "Text": "Сортировать по дому",
                  "events": {
                    "Click": "h_zh3xji"
                  }
                },
                {
                  "Name": "сортироватьПоКвартиреToolStripMenuItem",
                  "Text": "Сортировать по квартире",
                  "events": {
                    "Click": "h_zff7rn"
                  }
                },
                {
                  "Name": "сортироватьПоТелефонуToolStripMenuItem",
                  "Text": "Сортировать по телефону",
                  "events": {
                    "Click": "h_2j108r"
                  }
                },
                {
                  "Name": "сортироватьПоФамилииDescToolStripMenuItem",
                  "Text": "Сортировать по фамилии (убыв.)",
                  "events": {
                    "Click": "h_30je95"
                  }
                },
                {
                  "Name": "сортироватьПоИмениDescToolStripMenuItem",
                  "Text": "Сортировать по имени (убыв.)",
                  "events": {
                    "Click": "h_sogufz"
                  }
                },
                {
                  "Name": "сортироватьПоОтчествуDescToolStripMenuItem",
                  "Text": "Сортировать по отчеству (убыв.)",
                  "events": {
                    "Click": "h_fmhtcf"
                  }
                },
                {
                  "Name": "сортироватьПоУлицеDescToolStripMenuItem",
                  "Text": "Сортировать по улице (убыв.)",
                  "events": {
                    "Click": "h_t5v75t"
                  }
                },
                {
                  "Name": "сортироватьПоДомуDescToolStripMenuItem",
                  "Text": "Сортировать по дому (убыв.)",
                  "events": {
                    "Click": "h_4ojgly"
                  }
                },
                {
                  "Name": "сортироватьПоКвартиреDescToolStripMenuItem",
                  "Text": "Сортировать по квартире (убыв.)",
                  "events": {
                    "Click": "h_e2gd4q"
                  }
                },
                {
                  "Name": "сортироватьПоТелефонуDescToolStripMenuItem",
                  "Text": "Сортировать по телефону (убыв.)",
                  "events": {
                    "Click": "h_su9831"
                  }
                }
              ]
            }
          ],
          "children": []
        },
        {
          "id": "c_k0zulb",
          "name": "statusStrip1",
          "type": "StatusStrip",
          "props": {
            "Name": "statusStrip1",
            "Size.Width": 360,
            "Size.Height": 22,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Dock": "Bottom",
            "Location.X": 10,
            "Location.Y": 10,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {},
          "items": [
            {
              "Name": "Quantity_ToolStripStatusLabel",
              "Text": "Количество записей",
              "BorderSides": "All",
              "BorderStyle": "SunkenOuter",
              "events": {}
            },
            {
              "Name": "QuantityToolStripStatusLabel",
              "Text": "0",
              "BorderSides": "All",
              "BorderStyle": "SunkenOuter",
              "AutoSize": false,
              "Size.Width": 30,
              "Size.Height": 17,
              "events": {}
            },
            {
              "Name": "Number_ToolStripStatusLabel",
              "Text": "Номер записи",
              "BorderSides": "All",
              "BorderStyle": "SunkenOuter",
              "events": {}
            },
            {
              "Name": "NumberToolStripStatusLabel",
              "Text": "0",
              "BorderSides": "All",
              "BorderStyle": "SunkenOuter",
              "AutoSize": false,
              "Size.Width": 30,
              "Size.Height": 17,
              "events": {}
            }
          ]
        },
        {
          "id": "c_744tuv",
          "name": "openFileDialog1",
          "type": "OpenFileDialog",
          "props": {
            "Name": "openFileDialog1",
            "Filter": "Текстовые файлы (*.txt)|*.txt|XML файлы (*.xml)|*.xml|Бинарные файлы (*.dat)|*.dat|JSON файлы (*.json)|*.json",
            "Location.X": 10,
            "Location.Y": 10,
            "Size.Width": 0,
            "Size.Height": 0,
            "Enabled": true,
            "Visible": true,
            "TabIndex": 0,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        },
        {
          "id": "c_g1doaf",
          "name": "saveFileDialog1",
          "type": "SaveFileDialog",
          "props": {
            "Name": "saveFileDialog1",
            "Filter": "Текстовые файлы (*.txt)|*.txt|XML файлы (*.xml)|*.xml|Бинарные файлы (*.dat)|*.dat|JSON файлы (*.json)|*.json",
            "Location.X": 10,
            "Location.Y": 10,
            "Size.Width": 0,
            "Size.Height": 0,
            "Enabled": true,
            "Visible": true,
            "TabIndex": 0,
            "Font.Size": 9,
            "Font.Bold": false,
            "Font.Family": "Segoe UI"
          },
          "events": {}
        }
      ],
      "fields": [
        {
          "type": "List<Note>",
          "name": "PhoneNote",
          "init": "NewList()"
        },
        {
          "type": "int",
          "name": "current",
          "init": "-1"
        },
        {
          "type": "bool",
          "name": "changed",
          "init": "false"
        },
        {
          "type": "ISave",
          "name": "saveBehavior"
        },
        {
          "type": "IOpen",
          "name": "openBehavior"
        }
      ],
      "events": {
        "FormClosing": "h_vugjp1"
      },
      "helperMethods": [
        {
          "name": "PrintElement",
          "returnType": "void",
          "params": "",
          "body": "if ((state.current >= 0) && (state.current < state.PhoneNote.length))\n{\n    var MyRecord = state.PhoneNote[state.current];\n    LastNameTextBox.Text = MyRecord.LastName;\n    NameTextBox.Text = MyRecord.Name;\n    PatronymicTextBox.Text = MyRecord.Patronymic;\n    PhoneMaskedTextBox.Text = MyRecord.Phone;\n    StreetTextBox.Text = MyRecord.Street;\n    HouseNumericUpDown.Value = MyRecord.House;\n    FlatNumericUpDown.Value = MyRecord.Flat;\n}\nelse\n{\n    LastNameTextBox.Text = \"\";\n    NameTextBox.Text = \"\";\n    PatronymicTextBox.Text = \"\";\n    PhoneMaskedTextBox.Text = \"\";\n    StreetTextBox.Text = \"\";\n    HouseNumericUpDown.Value = 1;\n    FlatNumericUpDown.Value = 1;\n}\nNumberToolStripStatusLabel.Text = String(state.current + 1);\nQuantityToolStripStatusLabel.Text = String(state.PhoneNote.length);"
        }
      ],
      "publicFields": [],
      "constructorParam": null
    },
    {
      "id": "f_psbrxy",
      "name": "SearchAddressForm",
      "type": "Form",
      "isMain": false,
      "props": {
        "Name": "SearchAddressForm",
        "Text": "Поиск по адресу",
        "FormBorderStyle": "FixedSingle",
        "StartPosition": "CenterParent",
        "Size.Width": 450,
        "Size.Height": 320,
        "Location.X": 0,
        "Location.Y": 0,
        "TabIndex": 0,
        "Enabled": true,
        "Visible": true,
        "Font.Size": 9,
        "Font.Bold": false,
        "Font.Family": "Segoe UI"
      },
      "children": [
        {
          "id": "c_gtk28m",
          "name": "lblStreet",
          "type": "Label",
          "props": {
            "Name": "lblStreet",
            "Location.X": 20,
            "Location.Y": 20,
            "Size.Width": 100,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Улица",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_vm2i0i",
          "name": "lblHouse",
          "type": "Label",
          "props": {
            "Name": "lblHouse",
            "Location.X": 20,
            "Location.Y": 55,
            "Size.Width": 100,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Дом",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_hq241t",
          "name": "lblFlat",
          "type": "Label",
          "props": {
            "Name": "lblFlat",
            "Location.X": 20,
            "Location.Y": 90,
            "Size.Width": 100,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Квартира",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_2f99v1",
          "name": "StreetTextBox",
          "type": "TextBox",
          "props": {
            "Name": "StreetTextBox",
            "Location.X": 130,
            "Location.Y": 18,
            "Size.Width": 250,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_9lx3a0",
          "name": "HouseNumericUpDown",
          "type": "NumericUpDown",
          "props": {
            "Name": "HouseNumericUpDown",
            "Location.X": 130,
            "Location.Y": 53,
            "Size.Width": 250,
            "Size.Height": 23,
            "TabIndex": 1,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Minimum": 1,
            "Maximum": 500,
            "Value": 1,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_y61wyc",
          "name": "FlatNumericUpDown",
          "type": "NumericUpDown",
          "props": {
            "Name": "FlatNumericUpDown",
            "Location.X": 130,
            "Location.Y": 88,
            "Size.Width": 250,
            "Size.Height": 23,
            "TabIndex": 2,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Minimum": 1,
            "Maximum": 500,
            "Value": 1,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_fxgzwt",
          "name": "SearchButton",
          "type": "Button",
          "props": {
            "Name": "SearchButton",
            "Location.X": 40,
            "Location.Y": 120,
            "Size.Width": 120,
            "Size.Height": 32,
            "TabIndex": 3,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Найти",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_ro42dg"
          }
        },
        {
          "id": "c_2odoca",
          "name": "CloseButton",
          "type": "Button",
          "props": {
            "Name": "CloseButton",
            "Location.X": 260,
            "Location.Y": 120,
            "Size.Width": 120,
            "Size.Height": 32,
            "TabIndex": 4,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Закрыть",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_gu8k18"
          }
        },
        {
          "id": "c_y51t01",
          "name": "lblResults",
          "type": "Label",
          "props": {
            "Name": "lblResults",
            "Location.X": 150,
            "Location.Y": 160,
            "Size.Width": 150,
            "Size.Height": 20,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Результаты поиска",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_bjqmdy",
          "name": "ResultsTextBox",
          "type": "TextBox",
          "props": {
            "Name": "ResultsTextBox",
            "Location.X": 40,
            "Location.Y": 185,
            "Size.Width": 340,
            "Size.Height": 120,
            "TabIndex": 5,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Multiline": true,
            "ReadOnly": true,
            "ScrollBars": "Both",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        }
      ],
      "fields": [
        {
          "type": "List<Note>",
          "name": "PhoneNote",
          "init": "_PhoneNote"
        }
      ],
      "events": {},
      "helperMethods": [],
      "publicFields": [],
      "constructorParam": {
        "type": "List<Note>",
        "name": "PhoneNote"
      }
    },
    {
      "id": "f_3zj03z",
      "name": "SearchNameForm",
      "type": "Form",
      "isMain": false,
      "props": {
        "Name": "SearchNameForm",
        "Text": "Поиск абонента",
        "FormBorderStyle": "FixedSingle",
        "StartPosition": "CenterParent",
        "Size.Width": 450,
        "Size.Height": 320,
        "Location.X": 0,
        "Location.Y": 0,
        "TabIndex": 0,
        "Enabled": true,
        "Visible": true,
        "Font.Size": 9,
        "Font.Bold": false,
        "Font.Family": "Segoe UI"
      },
      "children": [
        {
          "id": "c_7qt0ez",
          "name": "lblLastName",
          "type": "Label",
          "props": {
            "Name": "lblLastName",
            "Location.X": 20,
            "Location.Y": 20,
            "Size.Width": 100,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Фамилия",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_2669pf",
          "name": "lblName",
          "type": "Label",
          "props": {
            "Name": "lblName",
            "Location.X": 20,
            "Location.Y": 55,
            "Size.Width": 100,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Имя",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_cgwk2q",
          "name": "lblPatronymic",
          "type": "Label",
          "props": {
            "Name": "lblPatronymic",
            "Location.X": 20,
            "Location.Y": 90,
            "Size.Width": 100,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Отчество",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_j1ykqi",
          "name": "LastNameTextBox",
          "type": "TextBox",
          "props": {
            "Name": "LastNameTextBox",
            "Location.X": 130,
            "Location.Y": 18,
            "Size.Width": 250,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_tztbh6",
          "name": "NameTextBox",
          "type": "TextBox",
          "props": {
            "Name": "NameTextBox",
            "Location.X": 130,
            "Location.Y": 53,
            "Size.Width": 250,
            "Size.Height": 23,
            "TabIndex": 1,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_xh15cr",
          "name": "PatronymicTextBox",
          "type": "TextBox",
          "props": {
            "Name": "PatronymicTextBox",
            "Location.X": 130,
            "Location.Y": 88,
            "Size.Width": 250,
            "Size.Height": 23,
            "TabIndex": 2,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_tjyz9r",
          "name": "SearchButton",
          "type": "Button",
          "props": {
            "Name": "SearchButton",
            "Location.X": 150,
            "Location.Y": 120,
            "Size.Width": 120,
            "Size.Height": 32,
            "TabIndex": 3,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Найти",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_1x26l3"
          }
        },
        {
          "id": "c_vm20c1",
          "name": "CloseButton",
          "type": "Button",
          "props": {
            "Name": "CloseButton",
            "Location.X": 280,
            "Location.Y": 120,
            "Size.Width": 120,
            "Size.Height": 32,
            "TabIndex": 4,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Закрыть",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_fwdbkt"
          }
        },
        {
          "id": "c_fsytcn",
          "name": "lblResults",
          "type": "Label",
          "props": {
            "Name": "lblResults",
            "Location.X": 150,
            "Location.Y": 160,
            "Size.Width": 150,
            "Size.Height": 20,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Результаты поиска",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_zp2lhn",
          "name": "ResultsTextBox",
          "type": "TextBox",
          "props": {
            "Name": "ResultsTextBox",
            "Location.X": 40,
            "Location.Y": 185,
            "Size.Width": 340,
            "Size.Height": 120,
            "TabIndex": 4,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Multiline": true,
            "ReadOnly": true,
            "ScrollBars": "Both",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        }
      ],
      "fields": [
        {
          "type": "List<Note>",
          "name": "PhoneNote",
          "init": "_PhoneNote"
        }
      ],
      "events": {},
      "helperMethods": [],
      "publicFields": [],
      "constructorParam": {
        "type": "List<Note>",
        "name": "PhoneNote"
      }
    },
    {
      "id": "f_e5x5tq",
      "name": "SearchPhoneForm",
      "type": "Form",
      "isMain": false,
      "props": {
        "Name": "SearchPhoneForm",
        "Text": "Поиск по телефону",
        "FormBorderStyle": "FixedSingle",
        "StartPosition": "CenterParent",
        "Size.Width": 450,
        "Size.Height": 260,
        "Location.X": 0,
        "Location.Y": 0,
        "TabIndex": 0,
        "Enabled": true,
        "Visible": true,
        "Font.Size": 9,
        "Font.Bold": false,
        "Font.Family": "Segoe UI"
      },
      "children": [
        {
          "id": "c_5ol9at",
          "name": "lblPhone",
          "type": "Label",
          "props": {
            "Name": "lblPhone",
            "Location.X": 20,
            "Location.Y": 20,
            "Size.Width": 100,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Телефон",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_xj9kqm",
          "name": "PhoneMaskedTextBox",
          "type": "MaskedTextBox",
          "props": {
            "Name": "PhoneMaskedTextBox",
            "Location.X": 130,
            "Location.Y": 18,
            "Size.Width": 250,
            "Size.Height": 23,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Mask": "(999) 000-000",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_8ueaqp",
          "name": "SearchButton",
          "type": "Button",
          "props": {
            "Name": "SearchButton",
            "Location.X": 40,
            "Location.Y": 55,
            "Size.Width": 120,
            "Size.Height": 32,
            "TabIndex": 1,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Найти",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_j9hv8x"
          }
        },
        {
          "id": "c_w677rb",
          "name": "CloseButton",
          "type": "Button",
          "props": {
            "Name": "CloseButton",
            "Location.X": 260,
            "Location.Y": 55,
            "Size.Width": 120,
            "Size.Height": 32,
            "TabIndex": 2,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Закрыть",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {
            "Click": "h_6dzhyi"
          }
        },
        {
          "id": "c_11klp0",
          "name": "lblResults",
          "type": "Label",
          "props": {
            "Name": "lblResults",
            "Location.X": 150,
            "Location.Y": 100,
            "Size.Width": 150,
            "Size.Height": 20,
            "TabIndex": 0,
            "Font.Family": "Segoe UI",
            "Font.Size": 14,
            "Text": "Результаты поиска",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        },
        {
          "id": "c_n98s7n",
          "name": "ResultsTextBox",
          "type": "TextBox",
          "props": {
            "Name": "ResultsTextBox",
            "Location.X": 40,
            "Location.Y": 125,
            "Size.Width": 340,
            "Size.Height": 120,
            "TabIndex": 3,
            "Font.Family": "Segoe UI",
            "Font.Size": 12,
            "Multiline": true,
            "ReadOnly": true,
            "ScrollBars": "Both",
            "Enabled": true,
            "Visible": true,
            "Font.Bold": false
          },
          "events": {}
        }
      ],
      "fields": [
        {
          "type": "List<Note>",
          "name": "PhoneNote",
          "init": "_PhoneNote"
        }
      ],
      "events": {},
      "helperMethods": [],
      "publicFields": [],
      "constructorParam": {
        "type": "List<Note>",
        "name": "PhoneNote"
      }
    }
  ],
  "classes": [
    {
      "name": "CompareByFlat",
      "implements": "IComparer<Note>",
      "fields": [],
      "methods": [
        {
          "returnType": "int",
          "name": "Compare",
          "params": "Note x, Note y",
          "body": "return x.Flat.CompareTo(y.Flat);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "CompareByHouse",
      "implements": "IComparer<Note>",
      "fields": [],
      "methods": [
        {
          "returnType": "int",
          "name": "Compare",
          "params": "Note x, Note y",
          "body": "return x.House.CompareTo(y.House);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "CompareByLastName",
      "implements": "IComparer<Note>",
      "fields": [],
      "methods": [
        {
          "returnType": "int",
          "name": "Compare",
          "params": "Note x, Note y",
          "body": "return string.Compare(x.LastName, y.LastName);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "CompareByName",
      "implements": "IComparer<Note>",
      "fields": [],
      "methods": [
        {
          "returnType": "int",
          "name": "Compare",
          "params": "Note x, Note y",
          "body": "return string.Compare(x.Name, y.Name);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "CompareByPatronymic",
      "implements": "IComparer<Note>",
      "fields": [],
      "methods": [
        {
          "returnType": "int",
          "name": "Compare",
          "params": "Note x, Note y",
          "body": "return string.Compare(x.Patronymic, y.Patronymic);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "CompareByPhone",
      "implements": "IComparer<Note>",
      "fields": [],
      "methods": [
        {
          "returnType": "int",
          "name": "Compare",
          "params": "Note x, Note y",
          "body": "return string.Compare(x.Phone, y.Phone);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "CompareByStreet",
      "implements": "IComparer<Note>",
      "fields": [],
      "methods": [
        {
          "returnType": "int",
          "name": "Compare",
          "params": "Note x, Note y",
          "body": "return string.Compare(x.Street, y.Street);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "Note",
      "implements": "",
      "fields": [
        {
          "type": "string",
          "name": "LastName"
        },
        {
          "type": "string",
          "name": "Name"
        },
        {
          "type": "string",
          "name": "Patronymic"
        },
        {
          "type": "string",
          "name": "Street"
        },
        {
          "type": "ushort",
          "name": "House"
        },
        {
          "type": "ushort",
          "name": "Flat"
        },
        {
          "type": "string",
          "name": "Phone"
        }
      ],
      "methods": [
        {
          "returnType": "bool",
          "name": "Equals",
          "params": "object obj",
          "body": "if (obj is Note other)\n{\n    return LastName == other.LastName &&\n           Name == other.Name &&\n           Patronymic == other.Patronymic &&\n           Street == other.Street &&\n           House == other.House &&\n           Flat == other.Flat &&\n           Phone == other.Phone;\n}\nreturn false;",
          "override": true
        },
        {
          "returnType": "int",
          "name": "GetHashCode",
          "params": "",
          "body": "return (LastName + Name + Patronymic + Street + Phone).GetHashCode() ^ House.GetHashCode() ^ Flat.GetHashCode();",
          "override": true
        }
      ],
      "attributes": [
        "Serializable"
      ]
    },
    {
      "name": "DeserializeBin",
      "implements": "IOpen",
      "fields": [],
      "methods": [
        {
          "returnType": "List<Note>",
          "name": "OpenFile",
          "params": "string fileName",
          "body": "var formatter = new BinaryFormatter();\nusing (FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate))\n{\n    return (List<Note>)formatter.Deserialize(fs);\n}",
          "override": false
        },
        {
          "returnType": "List<Note>",
          "name": "AddFromFile",
          "params": "string fileName, List<Note> existing",
          "body": "var newNotes = OpenFile(fileName);\nforeach (var note in newNotes)\n{\n    if (!existing.Contains(note))\n        existing.Add(note);\n}\nreturn existing;",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "DeserializeJson",
      "implements": "IOpen",
      "fields": [],
      "methods": [
        {
          "returnType": "List<Note>",
          "name": "OpenFile",
          "params": "string fileName",
          "body": "string s = File.ReadAllText(fileName);\nreturn JsonSerializer.Deserialize<List<Note>>(s);",
          "override": false
        },
        {
          "returnType": "List<Note>",
          "name": "AddFromFile",
          "params": "string fileName, List<Note> existing",
          "body": "var newNotes = OpenFile(fileName);\nforeach (var note in newNotes)\n{\n    if (!existing.Contains(note))\n        existing.Add(note);\n}\nreturn existing;",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "IOpen",
      "implements": "",
      "fields": [],
      "methods": [
        {
          "returnType": "List<Note>",
          "name": "OpenFile",
          "params": "string fileName",
          "body": "",
          "override": false
        },
        {
          "returnType": "List<Note>",
          "name": "AddFromFile",
          "params": "string fileName, List<Note> existing",
          "body": "",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "OpenCreater",
      "implements": "",
      "fields": [],
      "methods": [],
      "attributes": []
    },
    {
      "name": "OpenTxt",
      "implements": "IOpen",
      "fields": [],
      "methods": [
        {
          "returnType": "List<Note>",
          "name": "OpenFile",
          "params": "string fileName",
          "body": "var notes = new List<Note>();\nusing (StreamReader sr = new StreamReader(fileName))\n{\n    while (!sr.EndOfStream)\n    {\n        var rec = new Note();\n        rec.LastName = sr.ReadLine();\n        rec.Name = sr.ReadLine();\n        rec.Patronymic = sr.ReadLine();\n        rec.Street = sr.ReadLine();\n        rec.House = Convert.ToUInt16(sr.ReadLine());\n        rec.Flat = Convert.ToUInt16(sr.ReadLine());\n        rec.Phone = sr.ReadLine();\n        notes.Add(rec);\n    }\n}\nreturn notes;",
          "override": false
        },
        {
          "returnType": "List<Note>",
          "name": "AddFromFile",
          "params": "string fileName, List<Note> existing",
          "body": "var newNotes = OpenFile(fileName);\nforeach (var note in newNotes)\n{\n    if (!existing.Contains(note))\n        existing.Add(note);\n}\nreturn existing;",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "OpenXml",
      "implements": "IOpen",
      "fields": [],
      "methods": [
        {
          "returnType": "List<Note>",
          "name": "OpenFile",
          "params": "string fileName",
          "body": "List<Note> notes = new List<Note>();\ntry\n{\n    XmlDocument xDoc = new XmlDocument();\n    xDoc.Load(fileName);\n    XmlElement xRoot = xDoc.DocumentElement;\n    foreach (XmlElement xnode in xRoot)\n    {\n        Note node = new Note();\n        foreach (XmlNode cnode in xnode.ChildNodes)\n        {\n            if (cnode.Name == \"Lastname\") node.LastName = cnode.InnerText;\n            if (cnode.Name == \"Name\") node.Name = cnode.InnerText;\n            if (cnode.Name == \"Patronymic\") node.Patronymic = cnode.InnerText;\n            if (cnode.Name == \"Street\") node.Street = cnode.InnerText;\n            if (cnode.Name == \"House\") node.House = Convert.ToUInt16(cnode.InnerText);\n            if (cnode.Name == \"Flat\") node.Flat = Convert.ToUInt16(cnode.InnerText);\n            if (cnode.Name == \"Phone\") node.Phone = cnode.InnerText;\n        }\n        notes.Add(node);\n    }\n}\ncatch (Exception)\n{\n    System.Windows.Forms.MessageBox.Show(\"xml файла не существует\");\n}\nreturn notes;",
          "override": false
        },
        {
          "returnType": "List<Note>",
          "name": "AddFromFile",
          "params": "string fileName, List<Note> existing",
          "body": "var newNotes = OpenFile(fileName);\nforeach (var note in newNotes)\n{\n    if (!existing.Contains(note))\n        existing.Add(note);\n}\nreturn existing;",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "ISave",
      "implements": "",
      "fields": [],
      "methods": [
        {
          "returnType": "void",
          "name": "Save",
          "params": "List<Note> notes, string fileName",
          "body": "",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "SaveCreater",
      "implements": "",
      "fields": [],
      "methods": [],
      "attributes": []
    },
    {
      "name": "SaveTxt",
      "implements": "ISave",
      "fields": [],
      "methods": [
        {
          "returnType": "void",
          "name": "Save",
          "params": "List<Note> notes, string fileName",
          "body": "using (StreamWriter sw = new StreamWriter(fileName))\n{\n    foreach (Note MyRecord in notes)\n    {\n        sw.WriteLine(MyRecord.LastName);\n        sw.WriteLine(MyRecord.Name);\n        sw.WriteLine(MyRecord.Patronymic);\n        sw.WriteLine(MyRecord.Street);\n        sw.WriteLine(MyRecord.House);\n        sw.WriteLine(MyRecord.Flat);\n        sw.WriteLine(MyRecord.Phone);\n    }\n}",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "SaveXml",
      "implements": "ISave",
      "fields": [],
      "methods": [
        {
          "returnType": "void",
          "name": "Save",
          "params": "List<Note> notes, string fileName",
          "body": "XmlTextWriter textWriter = new XmlTextWriter(fileName, Encoding.UTF8);\ntextWriter.WriteStartDocument();\ntextWriter.WriteStartElement(\"Notes\");\ntextWriter.WriteEndElement();\ntextWriter.Close();\n\nXmlDocument document = new XmlDocument();\ndocument.Load(fileName);\n\nint i = 0;\nforeach (Note x in notes)\n{\n    XmlElement element = document.CreateElement(\"Note\");\n    document.DocumentElement.AppendChild(element);\n    XmlAttribute attribute = document.CreateAttribute(\"id\");\n    attribute.Value = i.ToString();\n    element.Attributes.Append(attribute);\n\n    XmlNode lastnameElem = document.CreateElement(\"Lastname\");\n    lastnameElem.InnerText = x.LastName;\n    element.AppendChild(lastnameElem);\n\n    XmlNode nameElem = document.CreateElement(\"Name\");\n    nameElem.InnerText = x.Name;\n    element.AppendChild(nameElem);\n\n    XmlNode patronymicElem = document.CreateElement(\"Patronymic\");\n    patronymicElem.InnerText = x.Patronymic;\n    element.AppendChild(patronymicElem);\n\n    XmlNode streetElem = document.CreateElement(\"Street\");\n    streetElem.InnerText = x.Street;\n    element.AppendChild(streetElem);\n\n    XmlNode houseElem = document.CreateElement(\"House\");\n    houseElem.InnerText = x.House.ToString();\n    element.AppendChild(houseElem);\n\n    XmlNode flatElem = document.CreateElement(\"Flat\");\n    flatElem.InnerText = x.Flat.ToString();\n    element.AppendChild(flatElem);\n\n    XmlNode phoneElem = document.CreateElement(\"Phone\");\n    phoneElem.InnerText = x.Phone;\n    element.AppendChild(phoneElem);\n\n    i++;\n}\ndocument.Save(fileName);",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "SerializeBin",
      "implements": "ISave",
      "fields": [],
      "methods": [
        {
          "returnType": "void",
          "name": "Save",
          "params": "List<Note> notes, string fileName",
          "body": "var formatter = new BinaryFormatter();\nvar stream = new FileStream(fileName, FileMode.Create, FileAccess.Write, FileShare.None);\nformatter.Serialize(stream, notes);\nstream.Close();",
          "override": false
        }
      ],
      "attributes": []
    },
    {
      "name": "SerializeJson",
      "implements": "ISave",
      "fields": [],
      "methods": [
        {
          "returnType": "void",
          "name": "Save",
          "params": "List<Note> notes, string fileName",
          "body": "var options = new JsonSerializerOptions\n{\n    WriteIndented = true\n};\nstring json = JsonSerializer.Serialize(notes, options);\nFile.WriteAllText(fileName, json);",
          "override": false
        }
      ],
      "attributes": []
    }
  ],
  "handlers": {
    "h_dnq8j9": {
      "label": "AddButton_Click",
      "eventType": "Click",
      "body": "state.MyRecord.LastName = LastNameTextBox.Text;\nstate.MyRecord.Name = NameTextBox.Text;\nstate.MyRecord.Patronymic = PatronymicTextBox.Text;\nstate.MyRecord.Phone = PhoneMaskedTextBox.Text;\nstate.MyRecord.Street = StreetTextBox.Text;\nstate.MyRecord.House = parseInt(HouseNumericUpDown.Value);\nstate.MyRecord.Flat = parseInt(FlatNumericUpDown.Value);\nDialogResult = DialogResult.OK;\nClose();"
    },
    "h_zxu4aq": {
      "label": "PreviousButton_Click",
      "eventType": "Click",
      "body": "if (state.current <= 0)\n{\n    await MessageBox.Show(\"Предыдущей записи не существует!\", \"Ошибка\");\n    return;\n}\nstate.current--;\nPrintElement();"
    },
    "h_wmqye6": {
      "label": "NextButton_Click",
      "eventType": "Click",
      "body": "if (state.current >= state.PhoneNote.length - 1)\n{\n    await MessageBox.Show(\"Следующей записи не существует!\", \"Ошибка\");\n    return;\n}\nstate.current++;\nPrintElement();"
    },
    "h_q5zzqf": {
      "label": "добавитьToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "var MyRecord = NewNote();\nvar r = await ShowDialog(\"AddForm\", MyRecord, AddOrEdit.Add);\nif (r === DialogResult.OK)\n{\n    if (state.PhoneNote.includes(MyRecord))\n    {\n        await MessageBox.Show(\"Такая запись уже существует!\", \"Ошибка\");\n        return;\n    }\n    state.current = state.PhoneNote.length;\n    state.PhoneNote.Add(MyRecord);\n    state.changed = true;\n    PrintElement();\n}"
    },
    "h_xh4ddj": {
      "label": "изменитьToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if ((state.current < 0) || (state.current >= state.PhoneNote.length))\n{\n    await MessageBox.Show(\"Нет записей для изменения!\", \"Ошибка\");\n    return;\n}\nvar MyRecord = state.PhoneNote[state.current];\nvar r = await ShowDialog(\"AddForm\", MyRecord, AddOrEdit.Edit);\nif (r === DialogResult.OK)\n{\n    state.PhoneNote[state.current] = MyRecord;\n    state.changed = true;\n    PrintElement();\n}"
    },
    "h_l65888": {
      "label": "удалитьToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if ((state.current < 0) || (state.current >= state.PhoneNote.length))\n{\n    await MessageBox.Show(\"Нет записей для удаления!\", \"Ошибка\");\n    return;\n}\nstate.PhoneNote.RemoveAt(state.current);\nif (state.current >= state.PhoneNote.length)\n    state.current = state.PhoneNote.length - 1;\nstate.changed = true;\nPrintElement();"
    },
    "h_kkvc6i": {
      "label": "открытьToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.changed)\n{\n    var result = await MessageBox.Show(\"Сохранить изменения?\", \"Внимание\", 'YesNoCancel');\n    if (result === DialogResult.Yes)\n    {\n        var sr = await saveFileDialog1.ShowDialog();\n        if (sr === DialogResult.OK)\n        {\n            state.saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);\n            if (state.saveBehavior !== null)\n            {\n                state.saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n                state.changed = false;\n            }\n        }\n        else\n        {\n            return;\n        }\n    }\n    else if (result === DialogResult.Cancel)\n    {\n        return;\n    }\n}\nvar r = await openFileDialog1.ShowDialog();\nif (r === DialogResult.OK)\n{\n    state.openBehavior = OpenCreater.Create(openFileDialog1.FileName);\n    if (state.openBehavior === null) return;\n    state.PhoneNote = state.openBehavior.OpenFile(openFileDialog1.FileName);\n    if (state.PhoneNote.length === 0)\n        state.current = -1;\n    else\n        state.current = 0;\n    state.changed = false;\n    PrintElement();\n}"
    },
    "h_ayvgyj": {
      "label": "сохранитьToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "var r = await saveFileDialog1.ShowDialog();\nif (r === DialogResult.OK)\n{\n    state.saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);\n    if (state.saveBehavior === null) return;\n    state.saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n    state.changed = false;\n}"
    },
    "h_zj9akf": {
      "label": "добавитьИзФайлаToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.changed)\n{\n    var result = await MessageBox.Show(\"Сохранить изменения?\", \"Внимание\", 'YesNoCancel');\n    if (result === DialogResult.Yes)\n    {\n        var sr = await saveFileDialog1.ShowDialog();\n        if (sr === DialogResult.OK)\n        {\n            state.saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);\n            if (state.saveBehavior !== null)\n            {\n                state.saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n                state.changed = false;\n            }\n        }\n        else\n        {\n            return;\n        }\n    }\n    else if (result === DialogResult.Cancel)\n    {\n        return;\n    }\n}\nvar r = await openFileDialog1.ShowDialog();\nif (r === DialogResult.OK)\n{\n    state.openBehavior = OpenCreater.Create(openFileDialog1.FileName);\n    if (state.openBehavior === null) return;\n    state.PhoneNote = state.openBehavior.AddFromFile(openFileDialog1.FileName, state.PhoneNote);\n    if (state.PhoneNote.length > 0)\n        state.current = state.PhoneNote.length - 1;\n    state.changed = true;\n    PrintElement();\n}"
    },
    "h_uim7n0": {
      "label": "поискПоФИОToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "await ShowDialog(\"SearchNameForm\", state.PhoneNote);"
    },
    "h_lrjfkj": {
      "label": "поискПоАдресуToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "SearchAddressForm _Search = new SearchAddressForm(state.PhoneNote);\nawait _Search.ShowDialog();"
    },
    "h_c2sz3e": {
      "label": "поискПоТелефонуToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "SearchPhoneForm _Search = new SearchPhoneForm(state.PhoneNote);\nawait _Search.ShowDialog();"
    },
    "h_ogthpj": {
      "label": "сортироватьПоФамилииToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "state.PhoneNote.Sort((x, y) => x.LastName.localeCompare(y.LastName));\nif (state.PhoneNote.length > 0)\n    state.current = 0;\nPrintElement();"
    },
    "h_k3iwmn": {
      "label": "сортироватьПоИмениToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByName());\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_i7whks": {
      "label": "сортироватьПоОтчествуToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByPatronymic());\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_qg7hps": {
      "label": "сортироватьПоУлицеToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByStreet());\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_zh3xji": {
      "label": "сортироватьПоДомуToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByHouse());\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_zff7rn": {
      "label": "сортироватьПоКвартиреToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "state.PhoneNote.Sort((x, y) => x.Flat - y.Flat);\nif (state.PhoneNote.length > 0)\n    state.current = 0;\nPrintElement();"
    },
    "h_2j108r": {
      "label": "сортироватьПоТелефонуToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByPhone());\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_30je95": {
      "label": "сортироватьПоФамилииDescToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByLastName());\n    state.PhoneNote.Reverse();\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_sogufz": {
      "label": "сортироватьПоИмениDescToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByName());\n    state.PhoneNote.Reverse();\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_fmhtcf": {
      "label": "сортироватьПоОтчествуDescToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByPatronymic());\n    state.PhoneNote.Reverse();\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_t5v75t": {
      "label": "сортироватьПоУлицеDescToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByStreet());\n    state.PhoneNote.Reverse();\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_4ojgly": {
      "label": "сортироватьПоДомуDescToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByHouse());\n    state.PhoneNote.Reverse();\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_e2gd4q": {
      "label": "сортироватьПоКвартиреDescToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByFlat());\n    state.PhoneNote.Reverse();\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_su9831": {
      "label": "сортироватьПоТелефонуDescToolStripMenuItem_Click",
      "eventType": "Click",
      "body": "if (state.PhoneNote.length > 0)\n{\n    state.PhoneNote.Sort(new CompareByPhone());\n    state.PhoneNote.Reverse();\n    state.current = 0;\n    PrintElement();\n}"
    },
    "h_vugjp1": {
      "label": "MainForm_FormClosing",
      "eventType": "FormClosing",
      "body": "if (state.changed)\n{\n    var r = await MessageBox.Show(\"Сохранить изменения?\", \"Телефонный справочник\", 'YesNo');\n    if (r === DialogResult.Yes)\n    {\n        var sr = await saveFileDialog1.ShowDialog();\n        if (sr === DialogResult.OK)\n        {\n            state.saveBehavior = SaveCreater.Create(saveFileDialog1.FileName);\n            if (state.saveBehavior !== null)\n                state.saveBehavior.Save(state.PhoneNote, saveFileDialog1.FileName);\n        }\n    }\n}"
    },
    "h_ro42dg": {
      "label": "SearchButton_Click",
      "eventType": "Click",
      "body": "ResultsTextBox.Text = \"\";\nint i = 0;\nfor (var idx = 0; idx < state.PhoneNote.length; idx++)\n{\n    var MyRecord = state.PhoneNote[idx];\n    if (MyRecord.Street.includes(StreetTextBox.Text) &&\n    MyRecord.House === parseInt(HouseNumericUpDown.Value) &&\n    MyRecord.Flat === parseInt(FlatNumericUpDown.Value))\n    {\n        i++;\n        ResultsTextBox.Text = ResultsTextBox.Text +\n        i + \". \" + MyRecord.LastName + \" \" + MyRecord.Name + \" \" + MyRecord.Patronymic +\n        \" — \" + MyRecord.Street + \", д.\" + MyRecord.House + \", кв.\" + MyRecord.Flat +\n        \", тел.\" + MyRecord.Phone + \"\\r\\n\";\n    }\n}\nif (i === 0)\n    ResultsTextBox.Text = \"Записей, удовлетворяющих поставленным условиям, в списке абонентов нет!\";"
    },
    "h_gu8k18": {
      "label": "CloseButton_Click",
      "eventType": "Click",
      "body": "Close();"
    },
    "h_1x26l3": {
      "label": "SearchButton_Click",
      "eventType": "Click",
      "body": "ResultsTextBox.Text = \"\";\nvar i = 0;\nfor (var idx = 0; idx < state.PhoneNote.length; idx++)\n{\n    var MyRecord = state.PhoneNote[idx];\n    if (MyRecord.LastName.includes(LastNameTextBox.Text) &&\n    MyRecord.Name.includes(NameTextBox.Text) &&\n    MyRecord.Patronymic.includes(PatronymicTextBox.Text))\n    {\n        i++;\n        ResultsTextBox.Text = ResultsTextBox.Text + i + \". \" + MyRecord.LastName + \" \" + MyRecord.Name + \" \" + MyRecord.Patronymic + \" — \" + MyRecord.Street + \", д.\" + MyRecord.House + \", кв.\" + MyRecord.Flat + \", тел.\" + MyRecord.Phone + \"\\r\\n\";\n    }\n}\nif (i === 0)\n{\n    ResultsTextBox.Text = \"Записей, удовлетворяющих поставленным условиям, в списке абонентов нет!\";\n}"
    },
    "h_fwdbkt": {
      "label": "CloseButton_Click",
      "eventType": "Click",
      "body": "Close();"
    },
    "h_j9hv8x": {
      "label": "SearchButton_Click",
      "eventType": "Click",
      "body": "ResultsTextBox.Text = \"\";\nint i = 0;\nfor (var __i = 0; __i < state.PhoneNote.length; __i++)\n{\n    var MyRecord = state.PhoneNote[__i];\n    if (MyRecord.Phone.includes(PhoneMaskedTextBox.Text))\n    {\n        i++;\n        ResultsTextBox.Text = ResultsTextBox.Text +\n        i + \". \" + MyRecord.LastName + \" \" + MyRecord.Name + \" \" + MyRecord.Patronymic +\n        \" — \" + MyRecord.Street + \", д.\" + MyRecord.House + \", кв.\" + MyRecord.Flat +\n        \", тел.\" + MyRecord.Phone + \"\\r\\n\";\n    }\n}\nif (i === 0)\n    ResultsTextBox.Text = \"Записей, удовлетворяющих поставленным условиям, в списке абонентов нет!\";"
    },
    "h_6dzhyi": {
      "label": "CloseButton_Click",
      "eventType": "Click",
      "body": "Close();"
    }
  }
};
