#!/usr/bin/env node

/**
 * Script pour générer les screenshots de référence pour la CI Linux
 * 
 * Ce script duplique les screenshots macOS pour créer des baselines Linux
 * compatibles avec l'environnement CI Ubuntu.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SNAPSHOTS_DIR = path.join(__dirname, '..', 'e2e', 'visual-regression.spec.ts-snapshots');

const SCREENSHOTS = [
  'contact-form',
  'footer', 
  'form-empty',
  'form-error',
  'form-filled',
  'form-focused',
  'hero-section',
  'homepage-full',
  'homepage-mobile',
  'homepage-tablet',
  'navbar'
];

async function generateLinuxBaselines() {
  console.log('🖼️  Génération des baselines visuelles pour Linux CI...\n');

  if (!fs.existsSync(SNAPSHOTS_DIR)) {
    console.error('❌ Dossier des screenshots non trouvé:', SNAPSHOTS_DIR);
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const screenshot of SCREENSHOTS) {
    const darwinFile = `${screenshot}-chromium-darwin.png`;
    const linuxFile = `${screenshot}-chromium-linux.png`;
    
    const darwinPath = path.join(SNAPSHOTS_DIR, darwinFile);
    const linuxPath = path.join(SNAPSHOTS_DIR, linuxFile);

    if (fs.existsSync(darwinPath)) {
      if (!fs.existsSync(linuxPath)) {
        // Copier le screenshot Darwin vers Linux
        fs.copyFileSync(darwinPath, linuxPath);
        console.log(`✅ Créé: ${linuxFile}`);
        created++;
      } else {
        console.log(`⏭️  Existe déjà: ${linuxFile}`);
        skipped++;
      }
    } else {
      console.log(`⚠️  Darwin source manquant: ${darwinFile}`);
    }
  }

  console.log(`\n🎯 Résumé:`);
  console.log(`   📸 Screenshots créés: ${created}`);
  console.log(`   ⏭️  Screenshots ignorés: ${skipped}`);
  
  if (created > 0) {
    console.log(`\n💡 N'oublie pas de committer ces nouveaux screenshots:`);
    console.log(`   git add e2e/visual-regression.spec.ts-snapshots/`);
    console.log(`   git commit -m "feat: add Linux visual regression baselines"`);
  }
}

generateLinuxBaselines().catch(console.error);