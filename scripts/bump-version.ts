import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const version = process.argv[2]
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('Usage: ts-node scripts/bump-version.ts <MAJOR.MINOR.PATCH>')
  process.exit(1)
}

const root = resolve(__dirname, '..')

// package.json
const pkgPath = resolve(root, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
pkg.version = version
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
console.log(`✓ package.json → ${version}`)

// tauri.conf.json
const tauriPath = resolve(root, 'src-tauri', 'tauri.conf.json')
const tauri = JSON.parse(readFileSync(tauriPath, 'utf-8'))
tauri.version = version
writeFileSync(tauriPath, JSON.stringify(tauri, null, 2) + '\n')
console.log(`✓ tauri.conf.json → ${version}`)

// Cargo.toml
const cargoPath = resolve(root, 'src-tauri', 'Cargo.toml')
let cargo = readFileSync(cargoPath, 'utf-8')
cargo = cargo.replace(/^version\s*=\s*"[^"]*"/m, `version = "${version}"`)
writeFileSync(cargoPath, cargo)
console.log(`✓ Cargo.toml → ${version}`)

console.log(`\nVersion bumped to ${version} across all files.`)
