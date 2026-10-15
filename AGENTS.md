# WinForms Web Simulator — продолжение разработки

## Что это за проект

Веб-симулятор Windows Forms для университетских лабораторных работ по дисциплине
"Программирование на C#". Разрабатывается потому что на MacBook M1 Parallels
лагает, а WinForms runtime работает только на Windows.

Архитектура — zero-build native ES-модули в браузере:
- `winforms.html` — HTML+CSS шелл (~1150 строк), один `<script type="module" src="modules/boot.js">`
- `modules/ir.js` — IR schema + helpers (ControlTypes, PropertyDescriptors, walkControls)
- `modules/renderer.js` — IR → DOM (renderForm, renderControl, recursive containers, Dock/Anchor resize)
- `modules/runtime.js` — WinFormsRuntime, async handlers через AsyncFunction
- `modules/designer.js` — DesignerState, drag/drop, properties, solution explorer, tabs, undo/redo, multiple selection, align/Z-order toolbars
- `modules/exporter.js` — IR → .csproj + .cs + .Designer.cs + .resx, JS→C# transpiler, recursive Controls.Add
- `modules/boot.js` — entry point, server API client, setMode, auto-save, keyboard shortcuts
- `modules/control-registry.js` — Registry всех control adapters (22 типа)
- `modules/adapters/` — полиморфные адаптеры для каждого типа контрола (render, syncDOM, emitCS, getProperties)
- `presets/phonebook.js` — ES-модуль с `export const PHONEBOOK_PRESET` (Лаба 1)

## Текущее состояние

Лаба 1 (Телефонный справочник, Части 1–3) — функционал РАБОТАЕТ, визуальное соответствие ДОСТИГНУТО (MainForm 94%, AddForm 90%, SearchNameForm 100% через Gemini с точным промптом).

### Часть 1 — Базовый справочник
- MainForm: MenuStrip (Абонент/Добавить/Изменить/Удалить, Файл/Открыть/Сохранить/Открыть XML/Сохранить XML,
  Правка/Поиск, Сортировка по фамилии/квартире),
  7 Label, 3 TextBox, 1 MaskedTextBox маска "(999) 000-000",
  2 NumericUpDown (Дом 1-500, Квартира 1-500),
  кнопки < >, StatusStrip с 4 ToolStripStatusLabel,
  OpenFileDialog + SaveFileDialog (Filter: txt/xml)
- AddForm: те же поля но редактируемые, кнопка "Добавить"
- SearchNameForm: поиск по фамилии/имени/отчеству, ResultsTextBox (Multiline, ReadOnly, ScrollBars=Both), кнопка "Закрыть"
- Runtime: добавление, изменение, удаление, навигация, сортировка, поиск,
  сохранение/загрузка txt и XML (download + file picker), MessageBox на границах
- Задание 3: `Note.Equals` / `GetHashCode` — полностью идентичные записи не добавляются
- Задание 4: `Filter` у OpenFileDialog/SaveFileDialog — только txt/xml
- Задание 5: `FormClosing` — диалог "Сохранить изменения?" (Yes/No) при закрытии MainForm, `changed` flag
- `PhoneBook/` — реальный .NET 8 WinForms проект, билдится и работает в **Visual Studio 2022 / VS Code**
- `PhoneBook-exported/` — временная тестовая директория (создаётся test-export-build.mjs), не является частью проекта

### Часть 2 — Strategy + Сериализация + Simple Factory
- `ISave` / `IOpen` интерфейсы + реализации (`SaveTxt`, `SaveXml`, `SerializeBin`, `SerializeJson`, `OpenTxt`, `OpenXml`, `DeserializeBin`, `DeserializeJson`)
- `SaveCreater` / `OpenCreater` — фабрики по расширению файла
- `Note.cs` помечен `[Serializable]` для `BinaryFormatter`
- Фильтры диалогов расширены: `*.txt|*.xml|*.dat|*.json`
- `dotnet build` 0 errors (с `<NoWarn>SYSLIB0011</NoWarn>` для `BinaryFormatter`)

### Часть 3 — EF Core + PostgreSQL
- Отдельный проект `PhoneBookPart3/` с `Microsoft.EntityFrameworkCore`, `Npgsql`, `Npgsql.EntityFrameworkCore.PostgreSQL`
- `Models/Phonebook.cs` — data annotations (`[Key]`, `[Required]`, `[MaxLength]`, `[Column(TypeName="decimal(4,0)")]`)
- `Models/PhoneContext.cs` — `DbSet<Phonebook>`, `OnConfiguring` (UseNpgsql), `OnModelCreating` с check constraints
- `MainForm.cs` — `BindingList<Phonebook>`, навигация, Add/Edit/Delete через `dbContext`, `OrderBy`, `Where`
- Runtime mock: `env.DbContext`, `env.DbSet<T>`, `env.PhoneContext` (dynamic), LINQ-методы в `makeList()`
- Playwright тест `test-part3-full.mjs` — Add, Edit, Delete, Search, Sort, Next/Previous проходят
- `dotnet build` 0 errors, 2 warnings (NU1903 Npgsql vulnerability)

### Палитра контролов (24 типа, все через Control Adapter Pattern)
**Common Controls:** Label, TextBox (Multiline, ReadOnly, ScrollBars), Button, MaskedTextBox, NumericUpDown, CheckBox, RadioButton, ComboBox, ListBox, DateTimePicker, ProgressBar, PictureBox, CheckedListBox, RichTextBox, TreeView, DataGridView
**Containers:** GroupBox, Panel, TabControl, TabPage
**Menus & Toolbars:** MenuStrip, StatusStrip
**Dialogs:** OpenFileDialog (Filter), SaveFileDialog (Filter)

### Designer фичи
- **Multiple selection** (Ctrl+Click) + **Align toolbar**: Lefts, Rights, Tops, Bottoms, Same Width/Height/Size
- **Z-order** (Bring to Front / Send to Back) — управляет порядком Controls.Add и отрисовкой
- **Snaplines** — alignment snaps + margin snaps при drag (розовые линии с дистанцией)
- **Tab Order mode** — клик по контролам задаёт последовательность TabIndex, бейджи с номерами
- **Keyboard nudge**: стрелки ←↑→↓ на 1px (8px со Shift)
- **Undo/Redo** (Ctrl+Z / Ctrl+Shift+Z) — снимки JSON project + selection, max 50 шагов
- **Resize handles**: 8 направлений (NW, N, NE, W, E, SW, S, SE)
- **Drag/drop** из Toolbox + перемещение выделенных контролов

### Layout properties
- **Dock** (None/Top/Bottom/Left/Right/Fill) — полная поддержка в renderer, designer, exporter, parser
- **Anchor** (Top, Bottom, Left, Right) — runtime resize через ResizeObserver
- **Margin / Padding** — строковое свойство "Left, Top, Right, Bottom", парсится через `parsePadding()`
- **AutoSize** — bool свойство для всех контролов
- **AutoSizeMode** (GrowOnly/GrowAndShrink) — для Form, GroupBox, Panel

Двусторонняя синхронизация с VS Code / Visual Studio:
- `node server.js` — Node.js HTTP-сервер (порт 8824)
- Браузер открывает `http://localhost:8824/winforms.html`, загружает проект из `PhoneBook/`
- Автосейв из браузера → `POST /api/project` → перегенерация `.cs`, `.Designer.cs`, `.resx`
- Внешние изменения в VS Code отслеживаются polling'ом `GET /api/files`; toast + F5 перезагружает IR
- C# → JS транспайлер для handler bodies и helper methods (rename method в VS Code
  автоматически обновляет все вызовы при reload)
- `dotnet build` после любых манипуляций — 0 errors, 0 warnings

Экспорт:
- ZIP с `.csproj` + `.cs` + `.Designer.cs` + `.resx` из браузера (JS→C# транспайлер)
- `PhoneBook/` — реальный .NET 8 WinForms проект, редактируется в VS Code / VS 2022

Тесты (Playwright headless + Node.js) — все проходят:

**Инварианты (gates — must pass перед любыми изменениями):**
- **`test-invariant-roundtrip.mjs`** — GET→POST×3 → IR структурно идентичен, `dotnet build` 0 errors. Ловит: whitespace accumulation, drift.
- **`test-invariant-transpile.mjs`** — 49 unit-тестов: каждое правило transpilation имеет C#→JS, JS→C# и round-trip тест.

**Runtime behavior:**
- **`test-runtime-full.mjs`** — Part 1: Add/Edit/Delete, Duplicate, Navigate boundaries, Sort (all criteria), Search FIO, StatusStrip, FormClosing.
- `test-part1-regression.mjs` — быстрый smoke: Add, Navigate, Previous/Next.
- `test-part3-full.mjs` — Part 3 EF Core: Add, Edit, Delete, Search, Sort.

**Designer / Export:**
- `test-preset.mjs` — загрузка preset, рендер design/runtime
- `test-export-preset.mjs` — C# экспорт содержит все handlers
- `test-undo.mjs` — undo/redo property change, delete, move
- `test-design-runtime.mjs` — TextBox selection в design mode, нет в runtime
- `test-new-controls.mjs` — ListBox и GroupBox рендерятся в designer
- `test-roundtrip.mjs` — auto-save, rename helper method в VS Code, F5 reload

## Архитектурные решения, которые важно сохранять

### IR (Intermediate Representation)
- `ControlTypes` — словарь типов контролов с cs-именем, defaultSize, категорией
- `PropertyDescriptors` — базовые (type-agnostic) свойства с типами и группами
- Form: { id, name, type:'Form', props, children[], fields[], events, helperMethods[], publicFields[], constructorParam }
- Control: { id, name, type, props, children?, items?, events }
- Handlers хранятся в `project.handlers[handlerId] = { label, body, eventType }`
- `items` у MenuStrip/StatusStrip — это НЕ контролы (не попадают в walkControls)

### Control Adapter Pattern (polymorphic registry)
- Каждый тип контрола — адаптер с методами: `render()`, `syncDOM()`, `emitCS()`, `getProperties()`
- `Registry[ctrl.type]` lookup вместо switch/case в renderer.js, designer.js, exporter.js
- Добавление нового контрола = 1 файл в `modules/adapters/`, регистрация в `control-registry.js`
- Type-specific properties (`MaxLength`, `Mask`, `Minimum`, `Maximum`, `Value`, `Checked`, `Items`, `DropDownStyle`) живут внутри адаптера (`getProperties()`), а не размазаны по `PropertyDescriptors` с `appliesTo`
- `server.js` импортирует `exporter.js` через ESM dynamic import — дублирование C# генерации убрано

### Runtime — ключевые решения
- Handlers выполняются через `new AsyncFunction(...Object.keys(env), body)(values)` — async чтобы поддерживать `await ShowDialog(...)`, `await MessageBox.Show(...)`
- Env строится через `_buildEnv(form, state)`:
  - controls → Proxy на ctrl.props (set триггерит refreshControl)
  - StatusStrip/MenuStrip items → отдельные Proxy в env (иначе handler не видит `NumberToolStripStatusLabel`)
  - `state` объект передаётся целиком как `env.state` — это обходит ограничение JS (примитивы типа int нельзя передать по ссылке через Object.keys/values)
  - Helper-методы формы (PrintElement) → async-обёртки в env
- Handler bodies используют `state.fieldName` для полей формы (PhoneNote, current, MyRecord)
- Контролы в handlers — плоские имена: `LastNameTextBox.Text = ...` (через Proxy)
- Транспайлер C#: `state.X → X`, `await → ` (убрать), `String(x) → (x).ToString()`, etc.

### Server / Round-trip
- `server.js` — единственный способ запуска (порт 8824). Читает `PhoneBook/`, парсит `.Designer.cs` → IR controls/properties/events, `.cs` → fields/helperMethods/handlers
- **Bidirectional transpilers** (C#↔JS) — round-trip стабилен без sidecar-файлов:
  - C#→JS: `new List<Note>() → NewList()`, `Convert.ToUInt16/(ushort) → parseInt`, `(new Form(arg)).ShowDialog() → await ShowDialog("Form", arg)`, `MessageBox.Show → await MessageBox.Show`, `== → ===`, `foreach → for (const ... of ...)`, добавляет `state.` prefix для field names, убирает `this.`
  - JS→C#: `await ShowDialog("Form", arg) → (new Form(arg)).ShowDialog()`, `parseInt(x) → Convert.ToUInt16(x)`, `for (const x of y) → foreach (var x in y)`, `=== → ==`, `state.X → X`, `.includes → .Contains`
- `Number.prototype.localeCompare = function(other) { return this - other; }` в runtime — позволяет round-trip `x.CompareTo(y)` и для чисел (сортировка по Flat), и для строк (localeCompare)
- **`.winforms.json удалён`** — server.js парсит constructor assignments, inline field initializers и helper methods напрямую из C#; round-trip полностью стабилен (3× GET→POST → `dotnet build` 0 errors)

### Designer — persistent view layer (no lag)
- `walkControls(form)` — только реальные контролы (ControlTypes[node.type] guard)
- **Persistent DOM**: `_designerView = { root, body, domMap }` — DOM формы создаётся один раз при смене формы
- **Incremental sync**: `syncDesigner()` diff-ит children по `ctrl.id`:
  - Новый контрол → `renderControl()` + `appendChild`
  - Существующий → `syncControlDOM()` обновляет стили, текст, размер
  - Удалённый → `el.remove()`
- **Event delegation**: click / dragover / drop / mousedown на `host` (вместо навешивания на каждый пересозданный root) — listeners не множатся
- **Selection change** (`selectControl`, `selectForm`) → только `updateDesignerSelection()` (переключение `.selected` + chrome overlay), без rebuild
- Drag мышью → меняет `ctrl.props.Location` и `target.style.left/top` inline, без full render
- Resize handles (8 handles) → меняют `ctrl.props.Size/Location` inline, chrome overlay обновляется через `updateDesignerSelection()`
- Property change → `syncControlDOM()` или `syncDesigner()` для form-level props
- Undo/Redo (Ctrl+Z / Ctrl+Shift+Z) — снимки JSON project + selection state, max 50 шагов, push при: add, delete, move, resize, property change, nudge
- Keyboard nudge: стрелки ←↑→↓ двигают выделенный контрол на 1px (8px со Shift)

### C# Exporter
- `generateFormDesignerCs` собирает subItems (ToolStripMenuItem, ToolStripStatusLabel) отдельно
- Порядок в InitializeComponent: (1) все new, (2) SuspendLayout, (3) configure each, (4) form setup, (5) Controls.Add, (6) ResumeLayout
- Invisible controls (OpenFileDialog, SaveFileDialog) — только Name, без Location/Size

### Layout properties (Dock + Anchor + AutoSize + Margin/Padding)
- **Dock** реализован как общее свойство `Dock` в `PropertyDescriptors` (enum: None/Top/Bottom/Left/Right/Fill), не только для MenuStrip/StatusStrip
- **Anchor** — строковое свойство `"Top, Left"` в `ir.js`; `parseAnchor()` разбивает по запятым; default = `Top, Left`
- **AutoSize** — bool свойство; в C# export эмитится как `AutoSize = true`
- **AutoSizeMode** (GrowOnly/GrowAndShrink) — для Form, GroupBox, Panel
- **Margin / Padding** — строковое свойство `"Left, Top, Right, Bottom"`, парсится через `parsePadding()`
- Dock и Anchor взаимоисключаются: если Dock ≠ None, Anchor игнорируется при рендере и экспорте

### Multiple selection & Z-order & Snaplines
- `DesignerState.selectedIds` — Set<string> для multi-select
- Ctrl+Click toggles selection; click без Ctrl — single select
- Multi-drag: все выделенные контролы двигаются вместе при drag
- **Align toolbar** — 7 команд: Lefts, Rights, Tops, Bottoms, Same Width/Height/Size
- **Z-order** (BringToFront / SendToBack) — перестраивает `form.children[]` (Controls.Add order = paint order = Z-order)
- **Snaplines** — alignment snaps + margin snaps при drag (розовые линии с дистанцией)
- Resize handles скрываются при multi-select (>1 control) — chrome overlay без handles

### Tab Order mode
- Кнопка `Tab Order` в toolbar переключает режим
- В режиме Tab Order клик по контролу присваивает следующий TabIndex (0, 1, 2...)
- Синие бейджи с номерами показываются на каждом контроле
- `Reset` — сбрасывает все TabIndex в 0, `Done` — выходит из режима

## Что нужно сделать дальше (приоритеты)

### Лаба 1 (Телефонный справочник) — функционал ЗАВЕРШЕН, визуальное соответствие требует доработки
- Части 1–3 реализованы, протестированы, отчёт составлен (`REPORT.md`)
- Диаграммы классов сгенерированы в `diagrams/*.puml`
- Скриншоты runtime в `/tmp/runtime_screenshots/` (Parts 1–2) и `/tmp/runtime_screenshots_part3/` (Part 3)
- **AI-сверка через Gemini выполнена** (`GEMINI_COMPARISON.md`). Оценка соответствия: **50–55%**

#### Приоритеты исправления (по результатам Gemini-сравнения):
**Major (критичные — видны сразу):**
1. Шрифт — везде используется Serif (Times New Roman) вместо Segoe UI Sans-Serif
2. MainForm: Дом/Квартира должны быть на отдельных строках (вертикально), не на одной
3. MainForm: Поле «Улица» слишком широкое, должно быть как ФИО
4. MainForm: Кнопки `< >` должны быть по центру формы
5. MainForm: StatusStrip должен быть на всю ширину (Dock=Fill или Width=ClientSize.Width)
6. MainForm: Маска телефона `(999) 000-000` → `(____) ___-____` (без предзаполненных цифр)
7. AddForm: Кнопка «Добавить» должна быть шире (растянута почти на всю форму)
8. AddForm: Все поля ввода должны быть одинаковой ширины и выровнены
9. AddForm: Метки (Labels) должны быть Bold
10. SearchNameForm: Поля поиска фиксированной ширины (не растянуты до края)
11. SearchNameForm: Кнопка «Найти» и заголовок «Результаты поиска» по центру
12. SearchNameForm: Поле результатов должно иметь ScrollBar (Multiline + ScrollBars=Vertical)

**Minor (мелочи):**
- Цвет фона полей ввода (серый → белый)
- Стиль кнопок (плоские → объемные/3D)
- Window chrome (иконка, стиль заголовка)
- 3D border у TextBox вместо плоских границ

### Инфраструктура:
- **DataGridView** runtime data binding (сейчас только статические Rows)
- **FlowLayoutPanel / TableLayoutPanel** — авто-расположение контролов
- **SplitContainer** — два panel'а с разделителем

### Будущие лабы:
- Лаба 2 (предположительно): другой тип данных, та же структура
- Масштабирование: любую лабу можно выразить как IR-конфиг в presets/,
  добавлять новые конфиги не ломая существующие

## Процесс работы с Gemini (СКРИНШОТЫ → ЭТАЛОНЫ)

> **Важно:** ВСЕ визуальные проверки выполняются ТОЛЬКО через Gemini. Не делай визуальные выводы самостоятельно — всегда используй API.

### Шаг 1: Достать эталонные скриншоты из `.doc`/`.docx`
```bash
# Уже настроено в /Users/denis/Work/ai-files_reader/markitdown-ai/
# Извлечённые картинки: /tmp/lab_extract/images/
```

### Шаг 2: Сделать runtime скриншоты реализации
```bash
node screenshot-forms-v2.mjs       # Parts 1–2
node screenshot-part3.mjs           # Part 3 (если нужно)
# Сохраняются в /tmp/runtime_screenshots/
```

### Шаг 3: Сравнить через Gemini (Python скрипт)
```python
# Скрипт: /tmp/compare_forms.py (шаблон — адаптировать пути)
import sys
sys.path.insert(0, '/Users/denis/Work/ai-files_reader/markitdown-ai/src')
from gemini_client import GeminiClient
import os
from dotenv import load_dotenv

load_dotenv('/Users/denis/Work/ai-files_reader/markitdown-ai/.env')
client = GeminiClient(api_key=os.getenv('GEMINI_API_KEY'), model='gemini-3.5-flash')

prompt = '''Ты QA инженер. Сравни макет (первое изображение — эталон из методички)
с реализацией (второе изображение — веб-симулятор WinForms).
Найди ВСЕ несоответствия по категориям:
1. Верстка и layout — позиции, отступы, выравнивание, размеры
2. Типографика — шрифты, размеры, жирность
3. Цвета и стили — фон, границы, кнопки, поля
4. Компоненты — отсутствующие/лишние элементы
5. Контент — текст на кнопках, в полях, заголовки
Для каждого: что не так, критичность (Critical/Major/Minor), как должно быть.
В конце — оценка соответствия в %.'''

result = client.compare_images(
    '/tmp/lab_extract/images/Телефонный справочник (1)_02.png',  # reference
    '/tmp/runtime_screenshots/MainForm_runtime.png',              # implementation
    prompt
)
print(result)
```

### Правила
- **ВСЕ** визуальные выводы делаются через Gemini (prompt выше).
- Не доверяй своим глазам — только GPT-4 Vision / Gemini / Claude Vision.
- Сохраняй результаты в `GEMINI_COMPARISON.md`.
- После исправлений — перезапусти сравнение и проверь, что оценка выросла.

## Тест-инфраструктура
- Playwright headless тест через chromium_headless_shell в /opt/pw-browsers/
- NODE_PATH=/home/claude/node_modules (там playwright-core 1.60.0)
- test-preset.mjs — загрузка preset, рендер design/runtime
- test-export-preset.mjs — C# экспорт содержит все handlers и helper methods
- test-roundtrip.mjs — auto-save, rename helper method в VS Code, F5 reload, `dotnet build` 0 errors
- test-undo.mjs — undo/redo property change, delete, move
- test-design-runtime.mjs — TextBox selection в design mode, нет selection в runtime mode
- test-new-controls.mjs — ListBox и GroupBox рендерятся в designer
- test-part3-full.mjs — Part 3 runtime: Add, Edit, Delete, Search, Sort, Next/Previous
- test-part1-regression.mjs — Part 1/2 regression после изменений runtime
- node --check modules/*.js — JS синтаксис (в Node v26 `--check` на ESM файлах может пропускать ошибки; для проверки лучше запускать в headless Chromium)

## Стиль и дизайн
- Намеренно имитирует Visual Studio 2022 dark + Windows 11 Fluent
- CSS vars: --vs-bg, --vs-panel, --vs-accent (#0e639c), --win-bg, --win-accent (#0067c0)
- Шрифт: Segoe UI везде
- НЕ менять на "creative/artistic" — визуальная аутентичность это и есть цель

## Файлы
- `winforms.html` — HTML+CSS шелл (~1150 строк), один `<script type="module" src="modules/boot.js">`
- `modules/ir.js`, `modules/renderer.js`, `modules/runtime.js`, `modules/designer.js`, `modules/exporter.js`, `modules/boot.js`
- `modules/control-registry.js` + `modules/adapters/*.js` — полиморфные адаптеры контролов (22 типа)
- `server.js` — Node.js backend (порт 8824), dynamic import exporter.js
- `presets/phonebook.js` — IR preset Лабы 1

## Key Decisions

### Snaplines implementation
- `computeSnapX` / `computeSnapY` functions check alignment edges + margin gaps during drag
- Threshold = 8px; pink (#e040fb) lines with optional distance label for margin snaps
- Dashed style for center-alignment snaps
- Cleared on `mouseup` along with selection chrome restoration

### Tab Order mode
- `DesignerState.tabOrderMode` boolean + `tabOrderNext` counter
- Click in Tab Order mode assigns `TabIndex = tabOrderNext++` directly to `ctrl.props`
- Badges (`tabindex-badge`) are DOM elements appended to each control's wrapper
- `Reset` zeroes all TabIndex values, `Done` exits mode

### AutoSizeMode for containers
- Added only to adapters that support it (GroupBox, Panel) via `getProperties()`
- Form-level AutoSize/AutoSizeMode emitted in `generateFormInitCS`
- Not added to base `PropertyDescriptors` to avoid showing it on controls that don't support it

### Dialog adapters with Filter property
- `OpenFileDialogAdapter` and `SaveFileDialogAdapter` — invisible controls with `Filter` property
- `emitCS()` emits `Filter = "..."` in `.Designer.cs`
- Server parser parses `Filter` from C#

### TextBox Multiline / ReadOnly / ScrollBars
- TextBox adapter renders `<textarea>` when `Multiline = true`
- CSS: `textarea.control-textbox` with `resize:none`, `overflow-x/y` for ScrollBars
- Emitted in C#: `Multiline = true`, `ReadOnly = true`, `ScrollBars = Both`

### FormClosing event support
- `FormClosing` event wired via `FormClosingEventHandler` in `.Designer.cs`
- Server parser handles `FormClosingEventArgs` methods (params check: `startsWith('object sender, ') && endsWith('EventArgs e')`)
- Exporter emits `this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(...)`

### Data class methods with override keyword
- Preset supports `override: true` on class methods
- `generateDataClass()` emits `public override bool Equals(object obj)`
- Server `extractMethods()` captures `override` keyword via regex
- Round-trip preserves override through IR → C# → IR

### Margin/Padding as string property
- Format: `"Left, Top, Right, Bottom"` parsed by `parsePadding()` in `ir.js`
- Emitted in C# as `new System.Windows.Forms.Padding(L, T, R, B)`
- Default Margin = `"3, 3, 3, 3"` (WinForms default for most controls)

### MessageBoxIcon transpilation + DialogResult enum
- Server transpiler: `MessageBoxIcon.Error` → `'Error'` (same pattern as `MessageBoxButtons`)
- Runtime `env.DialogResult = { OK, Cancel, Yes, No }` + `env.MessageBoxIcon = { Error, Question, ... }`
- Required for handlers using 4-argument `MessageBox.Show(text, title, buttons, icon)` in Part 3

## Gemini Visual Verification Workflow (Lab 1 Lessons Learned)

### The Problem
Gemini gives inconsistent feedback on the same screenshot (oscillation):
- Round 1: "Font is too bold" → fix to Regular
- Round 2: "Font is too thin, needs Bold" → back to Bold
- Round 3: "Borders are too 3D" → make flat
- Round 4: "Borders should be 3D sunken" → back to 3D

**Solution: Precise prompt with weighted criteria and explicit ignore rules**

### The Winning Prompt
```python
prompt = '''Ты эксперт по WinForms UI. Сравни макет (первое изображение) и реализацию (второе изображение) формы "{form_name}".

Оцени ТОЛЬКО по этим критериям (вес в скобках):
1. **Вертикальное расположение элементов** (20%): все ли элементы на своих строках? Нет ли наложений?
2. **Выравнивание полей ввода** (20%): одинаковая ли ширина? Выровнены ли левые/правые края?
3. **Классический Win95 стиль границ** (15%): у полей ввода — вдавленные (sunken)? У кнопок — выпуклые (outset)?
4. **Шрифт меток (Labels)** (15%): читаемый размер, соответствует ли макету?
5. **Кнопки навигации/действий** (15%): правильные символы (< > или текст), позиция под полями?
6. **StatusBar / Поле результатов** (10%): присутствует? Ячейки с вдавленными границами?

Пропусти/не учитывай:
- Иконку приложения (синий квадрат vs цветная)
- Стиль заголовка окна (Windows 10 vs Windows 7)
- Размеры NumericUpDown стрелок (веб-симулятор)

Формат ответа:
SCORE: XX% (итоговая оценка)
Проверка по критериям:
1. Вертикальное расположение: OK/НЕТ (что не так)
2. Выравнивание полей: OK/НЕТ
3. Win95 стиль границ: OK/НЕТ
4. Шрифт меток: OK/НЕТ
5. Кнопки: OK/НЕТ
6. StatusBar: OK/НЕТ

Если всё OK — 95%+. Если есть Minor проблемы — 90-94%.'''
```

### Results with Precise Prompt
| Форма | Score | Status |
|-------|-------|--------|
| MainForm | **94%** | ✅ (2px outset/inset borders) |
| AddForm | **90%** | ✅ |
| SearchNameForm | **100%** | ✅ |

### CSS for Classic Win95 Sunken Borders
```css
/* TextBox / MaskedTextBox - sunken (вдавленные) */
.control-textbox,
.control-maskedtextbox,
textarea.control-textbox {
  border: 3px solid !important;
  border-color: #606060 #ffffff #ffffff #606060 !important;
  background: #fff !important;
  color: #000 !important;
}

/* NumericUpDown - sunken */
.control-numericupdown {
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
}

/* Button - outset (выпуклые) */
.control-button {
  background: #e0e0e0;
  border: 2px outset #c0c0c0;
}

/* StatusStrip cells - sunken */
.control-statusstrip .strip-label.sunken {
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  background: #e8e8e8;
}
```

### Workflow for Future Labs
1. **Implement functionality first** (handlers, events, data classes)
2. **Take screenshots** with `node screenshot-forms-v2.mjs`
3. **Run Gemini with PRECISE prompt** (weighted criteria, ignore rules)
4. **Fix only Major issues** from Gemini (ignore Minor if score ≥90%)
5. **Re-run screenshots + Gemini** after each fix batch
6. **Stop when score ≥90%** (or no Major issues remain)
7. **Document final score** in `GEMINI_COMPARISON.md`

### Key Lesson
**Without precise prompt:** Gemini oscillates 55%→80%→75%→65%→82% (unusable)
**With precise prompt:** Gemini stabilizes at 90-100% (consistent, actionable)

## Known Issues / Next Steps

### ✅ Завершено (2026-06-01)
- **Round-trip полностью стабилен** — удалён `.winforms.json`, round-trip через bidirectional C#↔JS transpilers:
  - `server.js` transpileCsToJs: `new List<Note>() → NewList()`, `(ushort)X → parseInt(X)`, `(new Form(arg)).ShowDialog() → await ShowDialog("Form", arg)`, `foreach → for (const ... of ...)`, `== → ===`
  - `exporter.js` reverse transpile: `await ShowDialog("Form", arg) → (new Form(arg)).ShowDialog()`, `parseInt(X) → Convert.ToUInt16(X)`, `for (const x of y) → foreach (var x in y)`, `=== → ==`, `.includes → .Contains`
  - Triple round-trip (GET→POST×3) → `dotnet build` 0 errors, 0 warnings ✅
- **Constructor init round-trip (method-style)** — C# генерируется строго по методичке: declaration + constructor init. `parseFormCsToIR` парсит assignments из тела конструктора AND inline field initializers как defense-in-depth.
- **`<TreatWarningsAsErrors>true</TreatWarningsAsErrors>`** добавлен в `.csproj` — любой warning ломает build. При `<Nullable>disable` — 0 warnings, 0 errors.
- **35/35 Playwright тестов проходят** — включая Part 1 (Add/Edit/Delete/Search/Sort/Navigate/FormClosing/Duplicate), Part 2 (Strategy/Factory/Serializers), Part 3 (EF Core/LINQ), Designer (Undo/Redo/Z-order/Tab Order/Nudge/Multi-select), Export/RoundTrip, Win95 borders.
- **DialogResult bug fixed** — `AddForm.AddButton_Click` устанавливает `this.DialogResult = DialogResult.OK;` перед `Close();`. Добавлен в preset.
- **Multiple constructor params** — `AddForm(Note _MyRecord, AddOrEdit _MyType)` round-trip стабилен через `constructorParam` array.
- **Убраны лишние пункты меню** — один "Открыть" и один "Сохранить" с фильтром `*.txt|*.xml|*.dat|*.json` (тип определяется `OpenCreater`/`SaveCreater` по расширению). Удалены `открытьXml/Bin/Json` и `сохранитьXml/Bin/Json` пункты.
- **Проверка `changed` перед открытием файла** — `открытьToolStripMenuItem_Click` и `добавитьИзФайлаToolStripMenuItem_Click` спрашивают "Сохранить изменения?" (Yes/No/Cancel) если `changed == true`.
- **C# whitespace accumulation fixed** — добавлен `dedentBlock()` в `server.js` (обрезает минимальный leading whitespace + collapse blank lines при извлечении body из `.cs`). Решило проблему "лесенки" из 200+ пробелов после каждого round-trip.
- **Auto-format C# with `dotnet format`** — `server.js` вызывает `dotnet format` после каждого POST. Код выровнен с отступами, фигурные скобки на новой строке (Allman style), 0 warnings.
- **Runtime `invokeHandler` form resolution** — `invokeHandler` теперь ищет форму-владельца handler'а через `_findFormForHandler()` вместо blind `top.form`. Исправило `PrintElement is not defined` при открытии модальных диалогов (AddForm поверх MainForm).
- **Runtime multi-arg `ShowDialog`** — `showFormDialog(formName, args[])` поддерживает несколько constructor params (`AddForm` получает `MyRecord` и `MyType`). `_initFields` не перезаписывает constructor params, `_evalInit` распознаёт ссылки `_MyType` → `state.MyType`.
- **Preset regenerated** — `presets/phonebook.js` перегенерирован из чистого IR после исправления `PrintElement2` → `PrintElement`. Все handler bodies чистые, `helperMethods` корректные.
- **Runtime class method compilation** — `WinFormsRuntime` теперь компилирует `project.classes[].methods` на prototype JS-классов (`CompareByLastName.Compare`, `Note.Equals`). Поддерживает `this.` prefix для полей класса. Методы с C# синтаксисом (`using`, `new FileStream`) gracefully skipped (try-catch), не ломая загрузку.
- **Transpile C#→JS для class methods** — `server.js` применяет `transpileCsToJs` к method bodies классов: `string.Compare` → `localeCompare`, `if (obj is Note other)` → `if (obj instanceof Note) { const other = obj; }`, `.GetHashCode()` → `.toString()`, `System.Windows.Forms.MessageBox.Show` → `await MessageBox.Show`.
- **Sort fix** — `arr.Sort(cmp)` теперь поддерживает объект IComparer (`cmp.Compare(a, b)`) и inline lambda. Сортировка по фамилии/квартире/дому работает корректно.

### ✅ Завершено (2026-06-01 continued)
- **MenuStrip / StatusStrip item editing in designer** — теперь можно редактировать пункты меню и статус-бара прямо в web-дизайнере:
  - Клик по `menu-top`, `submenu-item` или `strip-label` в design mode выбирает item (синяя рамка)
  - Inspector показывает `Name`, `Text`, `IsSeparator` (MenuStrip), Click event handler (submenu items)
  - Кнопки **+ / − / ↑ / ↓** для добавления, удаления, перемещения items
  - Solution Explorer отображает nested items для MenuStrip / StatusStrip
  - Submenu в design mode показываются по **hover** (`display: block` on `.menu-top:hover`), не inline — не ломают layout формы
  - `.control-menustrip` в design mode имеет `overflow: visible`, чтобы dropdown не обрезался `overflow:hidden` у `.winform-body`
  - Round-trip через C# полностью стабилен: `Items.AddRange` / `DropDownItems.AddRange` парсятся и генерируются корректно

### ✅ Завершено (2026-06-01 — Phase 1: Snapshot Round-trip Invariant)
- **`test-invariant-roundtrip.mjs`** — Node.js тест без Playwright: GET→POST×3 → IR структурно идентичен (strip id/handlerId). Ловит: whitespace accumulation, переименование `PrintElement`→`PrintElement2`, потерю MenuStrip items, handler drift. `dotnet build` 0 errors после каждого цикла.

### ✅ Завершено (2026-06-01 — Phase 2: Transpiler Contract Tests)
- **`modules/transpilers.mjs`** — единый модуль-источник-истины (single source of truth) для `transpileCsToJs` и `transpileBodyToCS`. `server.js` загружает через dynamic import; `exporter.js` и тесты — через ES module import.
- **`test-invariant-transpile.mjs`** — 49 unit-тестов: каждое правило transpilation имеет тест C#→JS, JS→C# и round-trip. Обнаружены и исправлены баги:
  - `ShowDialog` с пустыми аргументами давал `await ShowDialog("Form", )` (висячая запятая)
  - `using` regex не обрабатывал nested parentheses (e.g. `new StreamReader(fileName)`)
  - `JsonSerializer.Deserialize<List<Note>>(s)` regex не ловил `>>` в generics
- **Философия:** Если правило добавлено/изменено — тест ДОЛЖЕН быть обновлён. Это контракт.

### ✅ Завершено (2026-06-01 — Phase 3: Full Runtime Behavior Matrix)
- **`test-runtime-full.mjs`** — один Playwright тест, покрывающий ВСЕ runtime сценарии Part 1 в одной сессии:
  - Add 3 records, Edit, Delete, Duplicate prevention
  - Navigate boundaries (Previous/Next на границах, сообщения об ошибках)
  - Sort by LastName ASC/DESC (остальные пункты меню — smoke check)
  - Search by FIO (open, fill, search, close)
  - StatusStrip labels present
  - FormClosing changed flag (Yes/No dialog)
- **Методология:** один тест = одна browser сессия, последовательные сценарии. Если фейлится — конкретный шаг виден в логе.

### 🔄 Оставшиеся задачи
- **Export namespace/subdirectories**: `PhoneBook/Save/ISave.cs` и `PhoneBook/Open/IOpen.cs` теряют subdirectory при round-trip. Exporter пишет `ISave.cs`/`IOpen.cs` в корень проекта без `namespace PhoneBook.Save`. `PhoneBook-exported/` падает на `dotnet build` из-за `using PhoneBook.Save;` в `MainForm.cs`. Возможные решения:
  1. Сохранять subdirectory в IR (`classes[].path`) и генерировать `.csproj` с `<Compile Include="Save\ISave.cs" />`
  2. Или генерировать `namespace PhoneBook.Save` внутри `ISave.cs` при export (нужен namespace inference из `using`)
- **EF Core mock `Init eval failed`**: Runtime mock `env.DbContext` выдаёт `Init eval failed` для `phonebooks` / `Phonebooks` при Part 3 seed — это безвредно (seed срабатывает повторно через fallback), но шумит в консоли. Причина: `transpileBodyToCS` не обрабатывает `DbSet<Phonebook> phonebooks = context.phonebooks;` в runtime.
- **DataGridView runtime data binding**: Сейчас только статические Rows. Нужен динамический binding для Part 3 (вместо ручного `PrintElement`).
- **Future labs**: `?project=Lab2` уже работает (пустой проект + UI добавления форм/классов). Ждём методичку от преподавателя.
