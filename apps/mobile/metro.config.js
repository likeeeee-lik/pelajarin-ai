// Setup Metro untuk monorepo pnpm.
// Tanpa ini Metro hanya mengawasi apps/mobile dan tak menemukan paket yang
// di-hoist ke akar workspace (node_modules bersimlink milik pnpm).
const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Pantau seluruh workspace agar perubahan di packages/* ikut ter-reload.
config.watchFolders = [workspaceRoot];

// 2. Cari modul di node_modules milik app DAN milik akar workspace.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// 3. pnpm memakai simlink; Metro harus mengikutinya.
config.resolver.unstable_enableSymlinks = true;

// CATATAN: JANGAN set `disableHierarchicalLookup = true`.
// Opsi itu untuk monorepo npm/yarn yang node_modules-nya rata. pnpm menaruh
// dependensi tiap paket di node_modules tetangganya sendiri (di dalam .pnpm/),
// jadi mematikan penelusuran berjenjang membuat `expo` gagal menemukan
// `expo-modules-core` miliknya. Biarkan default (false).

module.exports = config;
