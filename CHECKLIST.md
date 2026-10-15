# Чеклист несоответствий с методичкой

*Последнее обновление: 2026-06-01*
*Статус: 100% закрыто — все пункты реализованы, 35/35 тестов проходят*

### Последние исправления
- **C# whitespace accumulation fixed** — `dedentBlock()` в server.js + `dotnet format` автоформатирование после каждого POST
- **Runtime `invokeHandler` form resolution** — `_findFormForHandler()` вместо blind `top.form`, исправлено `PrintElement is not defined` при модальных диалогах
- **Runtime multi-arg `ShowDialog`** — поддержка нескольких constructor params (AddForm: MyRecord + MyType)
- **Preset regenerated** — `PrintElement2` → `PrintElement`, чистые handler bodies

## Часть 1 — Базовый справочник

### UI / Компоненты
- [x] **C1-1**: TextBox MaxLength: LastName=25, Name=25, Patronymic=25, Street=40
- [x] **C1-2**: StatusLabel AutoSize=False, Size.Width=30 для QuantityToolStripStatusLabel и NumberToolStripStatusLabel
- [x] **C1-3**: SearchNameForm StartPosition=CenterParent (не CenterScreen)

### Формы / Конструкторы
- [x] **C1-4**: SearchNameForm конструктор: `SearchNameForm(List<Note> _PhoneNote)` с параметром
- [x] **C1-5**: enum AddOrEdit { Add, Edit } — перечисление для режима формы
- [x] **C1-6**: AddForm конструктор: `AddForm(Note _MyRecord, AddOrEdit MyType)`
- [x] **C1-7**: AddForm меняет Text и AddButton.Text в зависимости от AddOrEdit
- [x] **C1-8**: MainForm добавление: `new AddForm(MyRecord, AddOrEdit.Add)`
- [x] **C1-9**: MainForm изменение: `new AddForm(MyRecord, AddOrEdit.Edit)`, предзаполнение полей из MyRecord

### XML (Упражнение 2)
- [x] **C1-10**: XML сохранение через XmlTextWriter/XmlDocument (ручной XML), не XmlSerializer
- [x] **C1-11**: XML загрузка через XmlDocument.Load + XmlElement/XmlNode обход

### Поиск (Задание 6)
- [x] **C1-12**: Поиск по адресу (улица, дом, квартира) — пункт меню и обработчик + SearchAddressForm
- [x] **C1-13**: Поиск по телефону — пункт меню и обработчик + SearchPhoneForm
- [x] **C1-14**: SearchNameForm текст при пустом результате: "Записей, удовлетворяющих поставленным условиям, в списке абонентов нет!"

### Сортировка (Задания 7-8)
- [x] **C1-15**: CompareByName : IComparer<Note>
- [x] **C1-16**: CompareByPatronymic : IComparer<Note>
- [x] **C1-17**: CompareByStreet : IComparer<Note>
- [x] **C1-18**: CompareByHouse : IComparer<Note>
- [x] **C1-19**: CompareByPhone : IComparer<Note>
- [x] **C1-20**: Сортировка по убыванию по фамилии
- [x] **C1-21**: Сортировка по убыванию по имени
- [x] **C1-22**: Сортировка по убыванию по отчеству
- [x] **C1-23**: Сортировка по убыванию по улице
- [x] **C1-24**: Сортировка по убыванию по дому
- [x] **C1-25**: Сортировка по убыванию по квартире
- [x] **C1-26**: Сортировка по убыванию по телефону

## Часть 2 — Strategy + Сериализация

- [x] **C2-1**: SaveXml через ручной XmlDocument (не XmlSerializer) — SaveXml.cs переделан
- [x] **C2-2**: OpenXml через ручной XmlDocument (не XmlSerializer) — OpenXml.cs переделан
- [x] **C2-3**: `[XmlElement("Notes")]` атрибут на поле PhoneNote в MainForm
- [x] **C2-4**: Вопрос "Зачем два интерфейса?" — ответ в REPORT.md

## Часть 3 — EF Core + PostgreSQL

- [x] **C3-1**: Найти и описать шаблон Одиночка (Singleton) — PhoneContext?
- [x] **C3-2**: Найти и описать шаблон Строитель (Builder) — Phonebook { Id=... }
- [x] **C3-3**: Объединение БД+файлы — стратегия переключения в REPORT.md

## Инфраструктура

- [x] **INF-1**: Обновить preset (presets/phonebook.js) — новые формы, меню, обработчики, enum
- [x] **INF-2**: Обновить .Designer.cs файлы — SearchNameForm CloseButton
- [x] **INF-3**: Round-trip стабилен без .winforms.json — синхронизация через C#↔JS transpilers
- [x] **INF-4**: Обновить тесты test-full-suite.mjs — 35/35 passed
- [x] **INF-5**: dotnet build 0 errors, 0 warnings (PhoneBook); 0 errors, 2 NU1903 warnings (PhoneBookPart3)
- [x] **INF-6**: Playwright 35/35 passed
- [x] **INF-7**: Bidirectional transpilers (C#→JS и JS→C#) — стабильны
- [x] **INF-8**: Multiple constructor params round-trip — AddForm(Note, AddOrEdit)
- [x] **INF-9**: Диалог "Сохранить изменения?" перед открытием файла (changed=true) — `открытьToolStripMenuItem_Click` и `добавитьИзФайлаToolStripMenuItem_Click`
- [x] **INF-10**: Убраны лишние пункты меню (открытьXml/Bin/Json, сохранитьXml/Bin/Json) — один "Открыть" и один "Сохранить" с фильтром по расширению
