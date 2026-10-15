/**
 * Invariant: Round-trip GET→POST×N preserves project structure
 *
 * This test catches regressions in:
 * - C# parser (server.js) — losing properties, renaming methods, mangling handlers
 * - C# exporter (exporter.js) — emitting wrong syntax, losing items
 * - IR drift — ids/handlerIds change, but structure + handler bodies must stay identical
 *
 * If this test fails, the round-trip pipeline is broken.
 */

const HTTP_PORT = 8824;
const PROJECT = 'PhoneBook';

function stripVolatile(ir) {
  // Deep clone
  const clone = JSON.parse(JSON.stringify(ir));

  // Strip ids from forms & controls
  for (const f of clone.forms || []) {
    delete f.id;
    for (const c of walk(f.children || [])) delete c.id;
    // Strip handlerIds from events — keep event names only
    if (f.events) {
      for (const k of Object.keys(f.events)) f.events[k] = '<handler>';
    }
    for (const c of walk(f.children || [])) {
      if (c.events) {
        for (const k of Object.keys(c.events)) c.events[k] = '<handler>';
      }
      if (c.items) {
        for (const it of c.items) {
          if (it.events) {
            for (const k of Object.keys(it.events)) it.events[k] = '<handler>';
          }
          if (it.items) {
            for (const sub of it.items) {
              if (sub.events) {
                for (const k of Object.keys(sub.events)) sub.events[k] = '<handler>';
              }
            }
          }
        }
      }
    }
    // Strip volatile constructorParam wrapper vs array differences
    if (f.constructorParam && !Array.isArray(f.constructorParam)) {
      f.constructorParam = [f.constructorParam];
    }
  }

  // Strip ids from classes (methods keep names; bodies compared separately)
  for (const cls of clone.classes || []) {
    delete cls.id;
  }

  // Normalize handlers: sort by label+body (ids are volatile)
  if (clone.handlers) {
    const entries = Object.values(clone.handlers).map(h => ({
      label: h.label || '',
      body: h.body || '',
      eventType: h.eventType || ''
    }));
    entries.sort((a, b) => (a.label + a.body).localeCompare(b.label + b.body));
    clone.handlers = entries;
  }

  return clone;
}

function walk(nodes) {
  const out = [];
  const stack = [...nodes];
  while (stack.length) {
    const n = stack.pop();
    out.push(n);
    if (n.children) stack.push(...n.children);
  }
  return out;
}

function canonical(ir) {
  return JSON.stringify(stripVolatile(ir), null, 2);
}

async function getProject() {
  const res = await fetch(`http://localhost:${HTTP_PORT}/api/project?project=${PROJECT}`);
  if (!res.ok) throw new Error(`GET failed: ${res.status}`);
  return res.json();
}

async function postProject(ir) {
  const res = await fetch(`http://localhost:${HTTP_PORT}/api/project`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ir)
  });
  if (!res.ok) throw new Error(`POST failed: ${res.status} ${await res.text()}`);
  return res.text();
}

async function run() {
  // 1. Baseline
  console.log('Round-trip Invariant Test: GET→POST×3');
  const baseline = await getProject();
  const baselineCanonical = canonical(baseline);
  console.log(`Baseline IR: ${baselineCanonical.length} chars`);

  // Verify baseline has expected structure
  if (!baseline.forms || baseline.forms.length === 0) {
    throw new Error('Baseline IR has no forms');
  }
  const mainForm = baseline.forms.find(f => f.name === 'MainForm');
  if (!mainForm) throw new Error('Missing MainForm in baseline');
  if (!mainForm.helperMethods || !mainForm.helperMethods.some(m => m.name === 'PrintElement')) {
    throw new Error('Missing PrintElement helper method in MainForm');
  }

  // 2. Triple round-trip
  for (let i = 1; i <= 3; i++) {
    await postProject(baseline);
    // Small delay for file write + dotnet format
    await new Promise(r => setTimeout(r, 500));

    const next = await getProject();
    const nextCanonical = canonical(next);

    if (baselineCanonical !== nextCanonical) {
      // Find first diff
      for (let j = 0; j < Math.min(baselineCanonical.length, nextCanonical.length); j++) {
        if (baselineCanonical[j] !== nextCanonical[j]) {
          const a = baselineCanonical.slice(Math.max(0, j - 80), j + 120);
          const b = nextCanonical.slice(Math.max(0, j - 80), j + 120);
          console.error(`\n=== DIFF at round ${i}, char ${j} ===`);
          console.error('Expected:', a);
          console.error('Actual:  ', b);
          break;
        }
      }
      throw new Error(`Round-trip ${i}: IR structure drifted`);
    }
    console.log(`Round-trip ${i}: OK`);
  }

  // 3. Build check after last round-trip
  const { execSync } = await import('child_process');
  const buildOut = execSync('dotnet build', {
    cwd: `/Users/denis/Work/WinForms/${PROJECT}`,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  const hasError = /error\s*CS\d+:/i.test(buildOut);
  if (hasError) {
    console.error(buildOut);
    throw new Error('dotnet build has errors after round-trip');
  }
  console.log('dotnet build: 0 errors');

  console.log('\nTEST PASSED: round-trip invariant holds');
}

run().catch(e => {
  console.error(e.message);
  process.exit(1);
});
