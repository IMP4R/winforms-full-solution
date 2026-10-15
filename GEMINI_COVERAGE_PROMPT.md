# Оценка покрытия тестами — Лаба 1 (Телефонный справочник)

## Контекст
Это веб-симулятор Windows Forms (.NET 8 C#) для университетской лабораторной работы. Есть 3 части:
- Часть 1: Базовый справочник (List<Note>, формы, файлы txt/xml)
- Часть 2: Strategy + Сериализация (ISave/IOpen, BinaryFormatter, XmlSerializer, JsonSerializer, Simple Factory)
- Часть 3: EF Core + PostgreSQL (DbContext, LINQ, CRUD)

## Часть 1. Текст заданий из методички

### Задание (Упражнение 1)
Создать приложение "Телефонный справочник" со списком абонентов. Функции:
- Добавление абонента через AddForm
- Просмотр записей (навигация < >)
- Изменение записи
- Удаление записи
- Сохранение в текстовый файл
- Загрузка из текстового файла
- Сохранение в XML файл
- Загрузка из XML файла
- Поиск по параметру
- Сортировка списка

### Задания для самостоятельного выполнения (Часть 1)
1. Обработка ошибки перехода на предыдущую запись (current == 0)
2. Обработка ошибки перехода на следующую запись (current == Count - 1)
3. **Equals/GetHashCode** — полностью идентичные записи не добавляются
4. Фильтр диалогов OpenFileDialog/SaveFileDialog — только *.txt, *.xml
5. **FormClosing** — диалог "Сохранить изменения?" при закрытии MainForm

### Задание (Упражнение 2)
- Считывание из текстового файла и XML файла
- Сохранение в текстовый файл и XML файл

## Часть 2. Текст заданий из методички

### Задание 0
Сгенерировать диаграмму классов по проекту Части 1.

### Задание 1 — Strategy
Реализовать паттерн Strategy для:
- Сохранения данных в файл (SaveTxt, SaveXml)
- Открытия данных из файла (OpenTxt, OpenXml) — предыдущие данные стираются
- **Добавление данных из файла** — предыдущие данные остаются, добавляются только новые

Интерфейсы:
- `ISave` — метод `Save(List<Note> notes, String fileName)`
- `IOpen` — методы для создания нового списка и добавления из файла

### Задание 2 — Сериализация
- Бинарная сериализация через `BinaryFormatter` (SaveBin / OpenBin)
- XML сериализация через `XmlSerializer` (SaveXml2 / OpenXml2)
- JSON сериализация через `System.Text.Json` (SaveJson / OpenJson)
- Класс `Note` помечен `[Serializable]`
- Фильтры диалогов расширены: `*.txt|*.xml|*.dat|*.json`

### Задание 3
Сгенерировать диаграмму классов по проекту со Стратегией.

### Задание 4 — Simple Factory
- `OpenCreater` — фабрика создания IOpen по расширению файла
- `SaveCreater` — фабрика создания ISave по расширению файла
- Вся логика выбора расширения вынесена из класса формы

### Задание 5
Сгенерировать диаграмму классов по проекту с Фабрикой.

## Часть 3. Текст заданий из методички

### Шаг 1
Создать БД phone на PostgreSQL, таблицу phonebook с constraints:
- id int primary key
- lastname varchar(30) not null
- name varchar(30) not null
- patronymic varchar(30)
- street varchar(60) not null
- house decimal(4,0), > 0
- flat decimal(4,0), > 0
- phone varchar(10), regex ^\d{10}$
- check constraints на house, flat, phone

### Шаг 2-3
Создать проект Windows Forms, установить NuGet пакеты EF Core + Npgsql, сгенерировать модели через scaffold-dbcontext.

### Шаг 4
Дописать класс-модели атрибутами: `[Key]`, `[Required]`, `[MaxLength]`, `[Column(TypeName="decimal(4,0)")]`.

### Шаг 5
Исследовать `OnModelCreating`, добавить check constraints в сущности.

### Шаг 6
Создать интерфейс аналогично Части 1 (MainForm с навигацией, Add/Edit/Delete).

### Шаг 7
Добавить код:
- `MainForm_Load` — загрузка данных через `dbContext.Phonebooks.Load()`
- `buttonNext_Click` — LINQ `.Where(b => b.Id == X).ToArray()`
- `buttonPr_Click` — LINQ `.OrderBy(b => b.Id).ToArray()`
- `buttonSave_Click` — `dbContext.Add()` + `SaveChanges()`
- Полный CRUD: просмотр всех полей, создание, редактирование, удаление

### Шаг 8
- Диаграмма классов с типами и параметрами
- Найти шаблоны: Одиночка, Строитель
- Ответ: как объединить с предыдущими частями (БД + файлы)

### Отчет
- Диаграммы классов (Часть 1, 2-Strategy, 2-Factory, Часть 3)
- Описание программных решений и преимуществ
- Ответы на вопросы из Части 2
- Код приложений Части 2 и Части 3

---

## Имеющиеся тесты (test-full-suite.mjs)

Ниже список всех тестовых функций с кратким описанием что они проверяют:

### Часть 1 — Базовый функционал
1. **testPresetLoad** — Загрузка preset, заголовок формы "Телефонный справочник", переключение в Runtime mode
2. **testPart1AddAndNavigate** — Добавление 2 записей через AddForm, навигация < >, проверка полей MainForm
3. **testPart1EditDelete** — Редактирование записи (Абонент → Изменить), удаление записи (Абонент → Удалить), проверка Count
4. **testPart1SearchSort** — Поиск по фамилии (Правка → Поиск по ФИО), открытие SearchNameForm, сортировка по квартире/фамилии
5. **testPart1FormClosing** — FormClosing диалог при закрытии MainForm с изменениями (MessageBox Yes/No)
6. **testPart1StatusStrip** — Проверка что StatusStrip показывает "Количество записей" и "Номер записи"

### Часть 2 — Strategy + Factory
7. **testPart2Strategy** — Проверка что handler `сохранитьToolStripMenuItem_Click` использует `saveBehavior.Save()` (Strategy pattern)
8. **testPart2SaveCreaterFactory** — Проверка что handler `открытьToolStripMenuItem_Click` вызывает `OpenCreater.Create()` (Factory pattern)
9. **testPart2JsonSerializerRoundTrip** — Проверка что JsonSerializer сериализует и десериализует список (Note → JSON → Note)
10. **testPart2AppendStrategy** — Проверка существования handler'а для "Добавить из файла" (AddFromFile без стирания существующих данных)
11. **testPart2BinaryFormatterRoundTrip** — Классы SerializeBin/DeserializeBin + атрибут [Serializable] на Note
12. **testPart2XmlSerializerRoundTrip** — Классы SaveXml/OpenXml (custom XML + XmlSerializer)

### Часть 3 — EF Core
13. **testPart3Full** — Полный цикл Part 3: DbContext mock, Add, Edit, Delete, Search, Sort, Next/Previous
14. **testPart3LinqOrderBy** — Проверка что runtime поддерживает `.OrderBy(b => b.Field)` для сортировки
15. **testPart3LinqWhere** — Проверка что runtime поддерживает `.Where(b => b.Field == value)` для поиска

### Инфраструктура / Designer
16. **testExportRoundTrip** — Экспорт C# проекта, `dotnet build` 0 errors
17. **testUndoRedo** — Undo/Redo: property change, delete, move
18. **testDesignRuntimeSeparation** — TextBox selection в design mode, НЕТ selection в runtime mode
19. **testNewControls** — ListBox и GroupBox рендерятся в designer
20. **testWin95Borders** — CSS классические Win95 границы: sunken у TextBox, outset у Button
21. **testKeyboardNudge** — Стрелки ←↑→↓ двигают выделенный контрол на 1px (8px со Shift)
22. **testPropertyInspectorChange** — Изменение свойства в Property Inspector обновляет DOM
23. **testMultipleSelection** — Ctrl+Click multi-select, Align toolbar (Lefts, Rights, Tops, Bottoms)
24. **testTabOrderMode** — Tab Order mode: клик присваивает TabIndex, бейджи с номерами
25. **testUndoDepth** — Undo depth limit (max 50 шагов), старые снимки вытесняются
26. **testDockLayoutDom** — Dock=Top/Bottom/Left/Right/Fill корректно применяется в DOM
27. **testMaskedTextBoxPlaceholder** — MaskedTextBox показывает маску `(___) ___-____` без предзаполненных цифр
28. **testZOrderBringToFront** — BringToFront/SendToBack меняет DOM order (z-index)
29. **testPart1DuplicateDetection** — Note.Equals / GetHashCode: идентичные записи не добавляются, показывается MessageBox "Такая запись уже существует!"
30. **testPart1FormClosingNo** — FormClosing handler существует, проверяет changed flag, использует YesNo кнопки. При changed=false форма закрывается без диалога.
31. **testPart1NavigationBounds** — Границы навигации: кнопка `<` на первой записи (current==0) и `>` на последней (current==Count-1) показывают ошибки
32. **testPart2FileDialogFiltersExpanded** — Фильтры диалогов расширены: *.txt|*.xml|*.dat|*.json
33. **testPart1FileDialogFilters** — Фильтры диалогов Части 1: *.txt|*.xml
34. **testPart3EfCoreAttributes** — Проект PhoneBookPart3/ существует (проверка через reflection в реальном C#)
35. **testPart3EfCoreFluentApiConstraints** — Check constraints в OnModelCreating (house>0, flat>0, phone regex)

### Все 35 тестов проходят (0 failures)

---

## Запрос Gemini

Ты — эксперт по тестированию программного обеспечения. Оцени покрытие тестами лабораторной работы "Телефонный справочник" (3 части).

Для каждой части (Часть 1, Часть 2, Часть 3) оцени:
1. **Покрытие обязательного функционала** (что требует методичка) — оценка 0-100%
2. **Покрытие дополнительных заданий** (Equals/GetHashCode, FormClosing, фильтры диалогов) — оценка 0-100%
3. **Покрытие инфраструктуры** (экспорт, undo, designer фичи) — оценка 0-100%

Для каждого критерия:
- Что требуется по методичке
- Какой тест это проверяет (если есть)
- Что НЕ покрыто тестами (пробелы)
- Рекомендации какие тесты добавить

Формат ответа:

```
## Часть 1 — Покрытие: XX%
### Обязательный функционал: X/10 пунктов
[список]
### Дополнительные задания: X/5 пунктов  
[список]
### Пробелы:
- [что не покрыто]
### Рекомендации:
- [какой тест добавить]

## Часть 2 — Покрытие: XX%
...

## Часть 3 — Покрытие: XX%
...

## Итоговая оценка: XX%
## Приоритет добавления тестов:
1. [самый важный]
2. [второй]
...
```
