const fs = require('fs');

try {
  const lcov = fs.readFileSync('./coverage/lcov.info', 'utf8');
  
  // Diviser en blocs par fichier
  const fileBlocks = lcov.split('end_of_record');
  
  let totalLines = 0;
  let hitLines = 0;
  
  fileBlocks.forEach(block => {
    // Ne traiter que les fichiers src/
    if (block.includes('SF:src/')) {
      const lfMatch = block.match(/LF:(\d+)/);
      const lhMatch = block.match(/LH:(\d+)/);
      
      if (lfMatch && lhMatch) {
        totalLines += parseInt(lfMatch[1]);
        hitLines += parseInt(lhMatch[1]);
      }
    }
  });
  
  if (totalLines === 0) {
    console.error('Aucune ligne trouvée dans les fichiers src/');
    process.exit(1);
  }
  
  const coverage = Math.round((hitLines / totalLines) * 100);
  console.log(coverage);
  
} catch (error) {
  console.error('Erreur:', error.message);
  process.exit(1);
}
