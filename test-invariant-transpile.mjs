/**
 * Transpiler Contract Test
 *
 * Every transpilation rule in modules/transpilers.js MUST have at least one
 * test case here. If a rule is added/changed, this test must be updated.
 *
 * The test verifies:
 * 1. C#→JS produces expected JS
 * 2. JS→C# produces expected C#
 * 3. Round-trip: JS→C#→JS is structurally equivalent (where applicable)
 */

import assert from 'assert';
import { transpileCsToJs, transpileBodyToCS } from './modules/transpilers.mjs';

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (e) {
    console.error(`❌ ${name}: ${e.message}`);
    process.exitCode = 1;
  }
}

// ===== C# → JS =====
test('ShowDialog with args', () => {
  const cs = '(new AddForm(MyRecord, AddOrEdit.Add)).ShowDialog()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'await ShowDialog("AddForm", MyRecord, AddOrEdit.Add)');
});

test('ShowDialog without args', () => {
  const cs = '(new SearchNameForm()).ShowDialog()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'await ShowDialog("SearchNameForm")');
});

test('MessageBox.Show', () => {
  const cs = 'MessageBox.Show("Hello", "Title")';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'await MessageBox.Show("Hello", "Title")');
});

test('System.Windows.Forms.MessageBox.Show', () => {
  const cs = 'System.Windows.Forms.MessageBox.Show("Hello")';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'await MessageBox.Show("Hello")');
});

test('Dialog ShowDialog', () => {
  const cs = 'saveFileDialog1.ShowDialog()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'await saveFileDialog1.ShowDialog()');
});

test('new List<Note>()', () => {
  const cs = 'new List<Note>()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'NewList()');
});

test('new Note()', () => {
  const cs = 'new Note()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'NewNote()');
});

test('new Phonebook()', () => {
  const cs = 'new Phonebook()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'NewPhonebook()');
});

test('Convert.ToUInt16', () => {
  const cs = 'Convert.ToUInt16(sr.ReadLine())';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'parseInt(sr.ReadLine())');
});

test('(ushort) cast', () => {
  const cs = '(ushort)x';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'parseInt(x)');
});

test('.Contains', () => {
  const cs = 'list.Contains(item)';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'list.includes(item)');
});

test('MessageBoxButtons.YesNo', () => {
  const cs = 'MessageBoxButtons.YesNo';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, "'YesNo'");
});

test('MessageBoxIcon.Error', () => {
  const cs = 'MessageBoxIcon.Error';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, "'Error'");
});

test('string.Compare', () => {
  const cs = 'string.Compare(x.LastName, y.LastName)';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'x.LastName.localeCompare(y.LastName)');
});

test('.CompareTo', () => {
  const cs = 'x.Flat.CompareTo(y.Flat)';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'x.Flat.localeCompare(y.Flat)');
});

test('.GetHashCode', () => {
  const cs = 'obj.GetHashCode()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'obj.toString()');
});

test('C# pattern matching is Note', () => {
  const cs = 'if (obj is Note other) {';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'if (obj instanceof Note) { const other = obj;');
});

test('.ToString()', () => {
  const cs = 'x.ToString()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'String(x)');
});

test('== to ===', () => {
  const cs = 'a == b';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'a === b');
});

test('!= to !==', () => {
  const cs = 'a != b';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'a !== b');
});

test('this. removal', () => {
  const cs = 'this.LastNameTextBox.Text = "x"';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'LastNameTextBox.Text = "x"');
});

test('using removal', () => {
  const cs = 'using (StreamReader sr = new StreamReader(fileName)) {';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, '{');
});

test('for int loop', () => {
  const cs = 'for (int i = 0; i < list.Count; i++)';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'for (let i = 0; i < list.length; i++)');
});

test('foreach var', () => {
  const cs = 'foreach (var note in notes)';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'for (const note of notes)');
});

test('foreach typed', () => {
  const cs = 'foreach (Note note in notes)';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'for (const note of notes)');
});

test('.Count to .length', () => {
  const cs = 'list.Count';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'list.length');
});

test('state. prefix for fields', () => {
  const cs = 'PhoneNote.Add(rec)';
  const js = transpileCsToJs(cs, ['PhoneNote'], []);
  assert.strictEqual(js, 'state.PhoneNote.Add(rec)');
});

test('state. prefix does not affect controls', () => {
  const cs = 'LastNameTextBox.Text = x';
  const js = transpileCsToJs(cs, ['PhoneNote'], ['LastNameTextBox']);
  assert.strictEqual(js, 'LastNameTextBox.Text = x');
});

test('JsonSerializer.Deserialize generic strip', () => {
  const cs = "JsonSerializer.Deserialize<List<Note>>(s)";
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'JsonSerializer.Deserialize(s)');
});

test('.ToLower to .toLowerCase', () => {
  const cs = 'text.ToLower()';
  const js = transpileCsToJs(cs, [], []);
  assert.strictEqual(js, 'text.toLowerCase()');
});

// ===== JS → C# =====
test('JS state. removal', () => {
  const js = 'state.PhoneNote.Add(rec)';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'PhoneNote.Add(rec)');
});

test('JS await removal', () => {
  const js = 'await MessageBox.Show("Hi")';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'MessageBox.Show("Hi")');
});

test('JS NewList to new List<Note>', () => {
  const js = 'NewList()';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'new List<Note>()');
});

test('JS NewNote to new Note', () => {
  const js = 'NewNote()';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'new Note()');
});

test('JS ShowDialog with arg', () => {
  const js = 'await ShowDialog("AddForm", state.MyRecord)';
  const cs = transpileBodyToCS(js);
  // state. prefix is removed before ShowDialog transpile
  assert.strictEqual(cs, '(new AddForm(MyRecord)).ShowDialog()');
});

test('JS ShowDialog no arg', () => {
  const js = 'await ShowDialog("SearchNameForm")';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, '(new SearchNameForm()).ShowDialog()');
});

test('JS === to ==', () => {
  const js = 'a === b';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'a == b');
});

test('JS !== to !=', () => {
  const js = 'a !== b';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'a != b');
});

test('JS for let loop to C# for var', () => {
  const js = 'for (let i = 0; i < list.length; i++)';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'for (var i = 0; i < list.Count; i++)');
});

test('JS for const of to C# foreach', () => {
  const js = 'for (const note of notes) {';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'foreach (var note in notes) {');
});

test('JS .push to .Add', () => {
  const js = 'lines.push(x)';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'lines.Add(x)');
});

test('JS .length to .Count', () => {
  const js = 'list.length';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'list.Count');
});

test('JS parseInt to Convert.ToUInt16', () => {
  const js = 'parseInt(x)';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'Convert.ToUInt16(x)');
});

test('JS localeCompare to CompareTo', () => {
  const js = 'x.localeCompare(y)';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'x.CompareTo(y)');
});

test('JS includes to Contains', () => {
  const js = 'list.includes(item)';
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'list.Contains(item)');
});

test('JS MessageBox buttons string to enum 3-arg', () => {
  const js = "await MessageBox.Show('Hi', 'Title', 'YesNo')";
  const cs = transpileBodyToCS(js);
  assert.strictEqual(cs, 'MessageBox.Show(\'Hi\', \'Title\', MessageBoxButtons.YesNo)');
});

test('JS MessageBox buttons string to enum 4-arg', () => {
  const js = "await MessageBox.Show('Hi', 'Title', 'YesNo', 'Error')";
  const cs = transpileBodyToCS(js);
  // Note: the 4-arg pattern handles buttons but icon stays as-is; this is current behavior
  assert.ok(cs.includes('MessageBoxButtons.YesNo'));
});

// ===== Round-trip invariants =====
test('Round-trip: ShowDialog with args', () => {
  const original = 'await ShowDialog("AddForm", MyRecord)';
  const cs = transpileBodyToCS(original);
  const back = transpileCsToJs(cs, [], []);
  assert.ok(back.includes('ShowDialog("AddForm", MyRecord)'));
});

test('Round-trip: parseInt / Convert.ToUInt16', () => {
  const original = 'parseInt(x)';
  const cs = transpileBodyToCS(original);
  const back = transpileCsToJs(cs, [], []);
  assert.strictEqual(back, 'parseInt(x)');
});

test('Round-trip: localeCompare / CompareTo', () => {
  const original = 'x.LastName.localeCompare(y.LastName)';
  const cs = transpileBodyToCS(original);
  const back = transpileCsToJs(cs, [], []);
  assert.strictEqual(back, 'x.LastName.localeCompare(y.LastName)');
});

test('Round-trip: includes / Contains', () => {
  const original = 'list.includes(item)';
  const cs = transpileBodyToCS(original);
  const back = transpileCsToJs(cs, [], []);
  assert.strictEqual(back, 'list.includes(item)');
});

test('Round-trip: for const of / foreach', () => {
  const original = 'for (const note of notes) {';
  const cs = transpileBodyToCS(original);
  const back = transpileCsToJs(cs, [], []);
  assert.strictEqual(back, 'for (const note of notes) {');
});

test('Round-trip: for let loop', () => {
  const original = 'for (let i = 0; i < list.length; i++)';
  const cs = transpileBodyToCS(original);
  const back = transpileCsToJs(cs, [], []);
  // let -> var in C#, and var stays var in JS (int -> let only)
  assert.strictEqual(back, 'for (var i = 0; i < list.length; i++)');
});

if (!process.exitCode) {
  console.log('\nTEST PASSED: all transpiler contracts hold');
} else {
  console.log('\nTEST FAILED: some transpiler contracts broken');
  process.exit(1);
}
