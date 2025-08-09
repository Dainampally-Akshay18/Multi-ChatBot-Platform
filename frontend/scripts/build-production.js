import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Building Multi-Chatbot Platform for Production');
console.log('='.repeat(50));

try {
  // Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  execSync('rm -rf dist', { stdio: 'inherit' });
  
  // Build with production environment
  console.log('📦 Building production bundle...');
  execSync('npm run build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Generate build info
  const buildInfo = {
    version: process.env.npm_package_version || '1.0.0',
    buildTime: new Date().toISOString(),
    nodeVersion: process.version,
    environment: 'production'
  };
  
  writeFileSync(
    join('dist', 'build-info.json'), 
    JSON.stringify(buildInfo, null, 2)
  );
  
  console.log('✅ Production build completed successfully!');
  console.log(`📊 Build size: ${execSync('du -sh dist').toString().trim()}`);
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
