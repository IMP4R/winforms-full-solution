/**
 * Shared transpiler functions for C# ↔ JS round-trip.
 *
 * This module is the SINGLE SOURCE OF TRUTH for all transpilation rules.
 * server.js and exporter.js both consume it; test-invariant-transpile.mjs
 * verifies every rule.
 *
 * Rules MUST be bidirectional where applicable (JS→C#→JS ≈ identity).
 */

function transpileCsToJs(body, fieldNames, controlNames) {
  let s = body;
  // Remove comments first (simple)
  s = s.replace(/\/\/.*$/gm, '');

  // (new FormName(args)).ShowDialog() -> await ShowDialog("FormName", args)
  s = s.replace(/\(new\s+(\w+)\(([^)]*)\)\)\.ShowDialog\(\)/g, (m, formName, args) => {
    const a = args.trim();
    return a ? `await ShowDialog("${formName}", ${a})` : `await ShowDialog("${formName}")`;
  });
  // (new FormName()).ShowDialog() -> await ShowDialog("FormName")
  s = s.replace(/\(new\s+(\w+)\(\)\)\.ShowDialog\(\)/g, 'await ShowDialog("$1")');

  // MessageBox.Show -> await MessageBox.Show
  s = s.replace(/(?:System\.Windows\.Forms\.)?MessageBox\.Show\(/g, 'await MessageBox.Show(');

  // .ShowDialog() for dialogs -> await ... .ShowDialog()
  s = s.replace(/(\w+)\.ShowDialog\(\)/g, 'await $1.ShowDialog()');

  // new List<Note>() -> NewList()
  s = s.replace(/new\s+List<Note>\(\)/g, 'NewList()');
  // new Note() -> NewNote()
  s = s.replace(/new\s+Note\(\)/g, 'NewNote()');
  // new Phonebook() -> NewPhonebook()
  s = s.replace(/new\s+Phonebook\(\)/g, 'NewPhonebook()');

  // int.Parse(...) / ushort.Parse / Convert.ToUInt16 / Convert.ToInt32 -> parseInt(...)
  s = s.replace(/int\.Parse\(([^)]+)\)/g, 'parseInt($1)');
  s = s.replace(/ushort\.Parse\(([^)]+)\)/g, 'parseInt($1)');
  s = s.replace(/Convert\.ToUInt16\(([^)]+)\)/g, 'parseInt($1)');
  s = s.replace(/Convert\.ToInt32\(([^)]+)\)/g, 'parseInt($1)');

  // (ushort)x -> parseInt(x) (same as Convert.ToUInt16)
  s = s.replace(/\(ushort\)([^;)&| ]+)/g, 'parseInt($1)');

  // .Contains(...) -> .includes(...) (arrays will use custom includes via makeList)
  s = s.replace(/\.Contains\(([^)]+)\)/g, '.includes($1)');
  // MessageBoxButtons.YesNo -> 'YesNo', etc.
  s = s.replace(/MessageBoxButtons\.(\w+)/g, "'$1'");
  // MessageBoxIcon.Error -> 'Error', etc.
  s = s.replace(/MessageBoxIcon\.(\w+)/g, "'$1'");

  // string.Compare(x, y) -> x.localeCompare(y)
  s = s.replace(/string\.Compare\(([^,]+),\s*([^)]+)\)/g, '$1.localeCompare($2)');

  // .CompareTo(...) -> .localeCompare(...) (runtime adds Number.prototype.localeCompare)
  s = s.replace(/(\w+)\.CompareTo\(([^)]+)\)/g, '$1.localeCompare($2)');

  // .GetHashCode() -> .toString() (JS runtime fallback)
  s = s.replace(/\.GetHashCode\(\)/g, '.toString()');

  // C# pattern matching: if (obj is Note other) { ... } -> if (obj instanceof Note) { const other = obj; ... }
  s = s.replace(/if\s*\(\s*(\w+)\s+is\s+(\w+)\s+(\w+)\s*\)\s*\{/g, 'if ($1 instanceof $2) { const $3 = $1;');

  // .ToString() -> String(...)
  s = s.replace(/\(([^)]+)\)\.ToString\(\)/g, 'String($1)');
  s = s.replace(/(\w+(?:\.\w+)*)\.ToString\(\)/g, 'String($1)');

  // == -> ===, != -> !== (avoid replacing already triple-equals)
  s = s.replace(/([^=!])==([^=])/g, '$1===$2');
  s = s.replace(/([^=!])!=([^=])/g, '$1!==$2');

  // this. -> remove (JS runtime uses bare control names via Proxy)
  s = s.replace(/\bthis\./g, '');

  // using(...) -> remove using wrapper, keep body (handles nested parens)
  s = s.replace(/using\s*\([\s\S]*?\)\s*\{/g, '{');

  // for (int i = 0; i < x.Count; i++) -> for (let i = 0; i < x.length; i++)
  s = s.replace(/for\s*\(\s*int\s+(\w+)\s*=\s*([^;]+);\s*\1\s*<\s*([^;]+);\s*\1\+\+\s*\)/g, 'for (let $1 = $2; $1 < $3; $1++)');
  // .Count -> .length (for lists/arrays in JS runtime)
  s = s.replace(/\.Count\b/g, '.length');
  // foreach (var x in y) -> for (const x of y)
  s = s.replace(/foreach\s*\(\s*var\s+(\w+)\s+in\s+([^)]+)\)/g, 'for (const $1 of $2)');
  // foreach (Type x in y) -> for (const x of y)
  s = s.replace(/foreach\s*\(\s*\w+\s+(\w+)\s+in\s+([^)]+)\)/g, 'for (const $1 of $2)');

  // typeof(List<Note>) -> "List<Note>"
  s = s.replace(/typeof\s*\(\s*List<Note>\s*\)/g, '"List<Note>"');

  // .ToLower() -> .toLowerCase()
  s = s.replace(/\.ToLower\(\)/g, '.toLowerCase()');

  // JsonSerializer.Deserialize<List<Note>>(s) -> JsonSerializer.Deserialize(s)
  s = s.replace(/JsonSerializer\.Deserialize<[\s\S]*?>\(([^)]+)\)/g, 'JsonSerializer.Deserialize($1)');

  // state. prefix for fields (not for controls)
  for (const fn of fieldNames || []) {
    const re = new RegExp(`\\b(?!state\\.)(${fn})\\b`, 'g');
    s = s.replace(re, `state.${fn}`);
  }

  return s.trim();
}

function transpileBodyToCS(jsBody) {
  let s = jsBody;
  // Remove `state.` prefix
  s = s.replace(/\bstate\./g, '');
  // Remove `await ` keyword
  s = s.replace(/\bawait\s+/g, '');
  // NewList() -> new List<Note>()
  s = s.replace(/\bNewList\s*\(\s*\)/g, 'new List<Note>()');
  // NewNote() -> new Note(); generic NewSomething() -> new Something()
  s = s.replace(/\bNew([A-Z]\w*)\s*\(\s*\)/g, 'new $1()');
  // XmlSerializer('List<Note>') -> XmlSerializer(typeof(List<Note>))
  s = s.replace(/new XmlSerializer\('([^']+)'\)/g, 'new XmlSerializer(typeof($1))');
  // FileStream(path, 'Create'|'Open') -> FileStream(path, FileMode.Create|Open)
  s = s.replace(/new FileStream\(([^,]+),\s*['"]Create['"]\)/g, 'new FileStream($1, FileMode.Create)');
  s = s.replace(/new FileStream\(([^,]+),\s*['"]Open['"]\)/g, 'new FileStream($1, FileMode.Open)');
  // xs.Deserialize(fs) -> (List<Note>)xs.Deserialize(fs) — cast needed in C#
  s = s.replace(/=\s*xs\.Deserialize\(([^)]+)\)/g, '= (List<Note>)xs.Deserialize($1)');
  // String(x) -> (x).ToString()  (parens preserve operator precedence)
  s = s.replace(/\bString\(([^)]+)\)/g, '($1).ToString()');
  // ShowDialog("FormName", arg) -> (new FormName(arg)).ShowDialog()
  s = s.replace(/\bShowDialog\(['"]([^'"]+)['"]\s*,\s*([^)]+)\)/g,
    (m, formName, arg) => `(new ${formName}(${arg})).ShowDialog()`);
  s = s.replace(/\bShowDialog\(['"]([^'"]+)['"]\)/g,
    (m, formName) => `(new ${formName}()).ShowDialog()`);
  // Close() — already valid in C#
  // === Comparisons: r === 'OK' -> r == DialogResult.OK
  s = s.replace(/r\s*===?\s*'OK'/g, "r == DialogResult.OK");
  s = s.replace(/===/g, '==').replace(/!==/g, '!=');
  // var -> appropriate C# type (use `var` as it's valid in C# too)
  // `for (var i = 0;...)` is fine in C# already.
  // Reverse transpile: for (let i = 0; i < x.length; i++) -> for (var i = 0; i < x.Count; i++)
  s = s.replace(/for\s*\(\s*let\s+(\w+)\s*=\s*([^;]+);\s*\1\s*<\s*([^;]+)\.length\s*;\s*\1\+\+\s*\)/g,
    'for (var $1 = $2; $1 < $3.Count; $1++)');
  // Reverse transpile: for (const x of y) -> foreach (var x in y)
  s = s.replace(/for\s*\(\s*const\s+(\w+)\s+of\s+([^)]+)\)\s*\{/g,
    'foreach (var $1 in $2) {');
  // `lines.push(x)` -> `lines.Add(x)` (we assume a List<string>)
  s = s.replace(/\.push\(/g, '.Add(');
  // `lines.length` -> `lines.Count`
  s = s.replace(/\.length\b/g, '.Count');
  // `.join('\n')` -> `string.Join("\n", lines)` — harder; for now produce a TODO comment
  s = s.replace(/(\w+)\.join\(['"]([^'"]+)['"]\)/g, 'string.Join("$2", $1)');
  // `.split(/.../) -> Regex.Split or .Split(new[]{...})` — we use .Split which works for simple cases
  s = s.replace(/(\w+)\.split\(\/\\r\?\\n\/\)/g, '$1.Split(new[] { "\\r\\n", "\\n" }, StringSplitOptions.None)');
  // `parseInt(x)` -> `int.Parse(x)`
  s = s.replace(/\bparseInt\(([^)]+)\)\s*\|\|\s*(\d+)/g, '(ushort.TryParse($1, out var __p) ? __p : (ushort)$2)');
  s = s.replace(/\bparseInt\(([^)]+)\)/g, 'Convert.ToUInt16($1)');
  // .localeCompare(...) -> .CompareTo(...)
  s = s.replace(/\.localeCompare\(([^)]+)\)/g, '.CompareTo($1)');
  // .toLowerCase() -> .ToLower()
  s = s.replace(/\.toLowerCase\(\)/g, '.ToLower()');
  // .includes(...) -> .Contains(...) (C# string/List)
  s = s.replace(/\.includes\(([^)]+)\)/g, '.Contains($1)');
  // MessageBox buttons string -> enum (4-arg first, then 3-arg)
  s = s.replace(/MessageBox\.Show\(([^,]+),\s*([^,]+),\s*['"](\w+)['"]\s*,\s*([^)]+)\)/g, 'MessageBox.Show($1, $2, MessageBoxButtons.$3, $4)');
  s = s.replace(/MessageBox\.Show\(([^,]+),\s*([^,]+),\s*['"](\w+)['"]\)/g, 'MessageBox.Show($1, $2, MessageBoxButtons.$3)');
  return s;
}

export { transpileCsToJs, transpileBodyToCS };
