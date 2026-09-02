const { spawn, execSync } = require('child_process');
const path = require('path');

console.log('🌾 ==============================================');
console.log('🚀 Starting KisanConnect Full-Stack Ecosystem');
console.log('🌾 ==============================================\n');

// 1. Try starting Docker PostgreSQL container if Docker is available
try {
  console.log('🐘 Checking/Starting local PostgreSQL container...');
  execSync('docker compose up -d postgres', { stdio: 'ignore' });
  console.log('✅ PostgreSQL container is active on port 5432.\n');
} catch (e) {
  try {
    execSync('docker-compose up -d postgres', { stdio: 'ignore' });
    console.log('✅ PostgreSQL container is active on port 5432.\n');
  } catch (err) {
    console.log('ℹ️  Docker not detected or already running. Proceeding with configured database...\n');
  }
}

// 2. Start Backend and Frontend concurrently
const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('📡 Launching Backend API server (Port 5000)...');
const backend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
});

console.log('💻 Launching Frontend Next.js app (Port 3000)...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

function cleanup() {
  console.log('\n🛑 Shutting down KisanConnect services...');
  backend.kill();
  frontend.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
