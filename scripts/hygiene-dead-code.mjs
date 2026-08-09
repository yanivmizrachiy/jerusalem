#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const FIX = process.argv.includes('--fix');
const ROOT = process.cwd();
const configPath = ts.findConfigFile(ROOT, ts.sys.fileExists, 'tsconfig.json');
if (!configPath) throw new Error('tsconfig.json not found');

const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
if (configFile.error) {
  throw new Error(ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
}
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));
const program = ts.createProgram({ rootNames: parsed.fileNames, options: parsed.options });
const checker = program.getTypeChecker();

const isSrcTs = (sourceFile) => {
  const rel = path.relative(ROOT, sourceFile.fileName).replaceAll('\\', '/');
  return rel.startsWith('src/') && rel.endsWith('.ts') && !rel.endsWith('.d.ts');
};

const sourceFiles = program.getSourceFiles().filter(isSrcTs);
const hasExportModifier = (node) =>
  Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));

const candidates = [];
for (const sourceFile of sourceFiles) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || hasExportModifier(statement)) continue;
    if (statement.declarationList.declarations.length !== 1) continue;

    const declaration = statement.declarationList.declarations[0];
    if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
    if (!ts.isArrowFunction(declaration.initializer) && !ts.isFunctionExpression(declaration.initializer)) continue;

    const symbol = checker.getSymbolAtLocation(declaration.name);
    if (!symbol) continue;

    let referenced = false;
    for (const other of sourceFiles) {
      const visit = (node) => {
        if (referenced) return;
        if (ts.isIdentifier(node) && node !== declaration.name && checker.getSymbolAtLocation(node) === symbol) {
          referenced = true;
          return;
        }
        ts.forEachChild(node, visit);
      };
      visit(other);
      if (referenced) break;
    }

    if (!referenced) {
      candidates.push({
        fileName: sourceFile.fileName,
        rel: path.relative(ROOT, sourceFile.fileName).replaceAll('\\', '/'),
        name: declaration.name.text,
        start: statement.getFullStart(),
        end: statement.getEnd(),
      });
    }
  }
}

if (candidates.length === 0) {
  console.log('Dead-code hygiene: no safe non-exported function declarations found.');
  process.exit(0);
}

console.log(`Dead-code hygiene: ${candidates.length} safe candidate(s):`);
for (const candidate of candidates) console.log(`- ${candidate.rel}: ${candidate.name}`);

if (!FIX) {
  console.error('\nSafe dead code detected. Run `node scripts/hygiene-dead-code.mjs --fix` on a cleanup branch.');
  process.exit(1);
}

const byFile = new Map();
for (const candidate of candidates) {
  const list = byFile.get(candidate.fileName) ?? [];
  list.push(candidate);
  byFile.set(candidate.fileName, list);
}

for (const [fileName, removals] of byFile) {
  let text = fs.readFileSync(fileName, 'utf8');
  removals.sort((a, b) => b.start - a.start);
  for (const removal of removals) text = text.slice(0, removal.start) + text.slice(removal.end);
  text = text.replace(/\n{4,}/g, '\n\n\n');
  fs.writeFileSync(fileName, text);
}

console.log(`Removed ${candidates.length} symbol-proven dead declaration(s).`);
