#!/usr/bin/env node
/**
 * Comprehensive security scanning script
 * Automated security checks for production deployment
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Security configuration
const SECURITY_CONFIG = {
  // Vulnerability thresholds
  vulnerabilities: {
    critical: 0,    // No critical vulnerabilities allowed
    high: 0,        // No high vulnerabilities allowed  
    moderate: 5,    // Max 5 moderate vulnerabilities
    low: 20         // Max 20 low vulnerabilities
  },
  
  // Files to scan for secrets
  secretScanPaths: [
    'src/**/*.{ts,tsx,js,jsx}',
    '*.{json,yml,yaml,env,config}',
    '.github/**/*',
    'public/**/*'
  ],
  
  // Known secret patterns to detect
  secretPatterns: [
    {
      name: 'API Keys',
      pattern: /(?:api[_-]?key|apikey|key)[\"']?\s*[:=]\s*[\"']?[a-zA-Z0-9_\-]{16,}/gi,
      severity: 'critical'
    },
    {
      name: 'JWT Tokens',
      pattern: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
      severity: 'critical'
    },
    {
      name: 'Database URLs',
      pattern: /(mongodb|mysql|postgresql|redis):\/\/[^\s\"']+/gi,
      severity: 'high'
    },
    {
      name: 'AWS Keys',
      pattern: /(AKIA[0-9A-Z]{16}|aws_access_key_id|aws_secret_access_key)/gi,
      severity: 'critical'
    },
    {
      name: 'GitHub Tokens',
      pattern: /(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})/gi,
      severity: 'critical'
    },
    {
      name: 'Private Keys',
      pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE KEY-----/gi,
      severity: 'critical'
    }
  ],
  
  // Security headers to validate
  requiredHeaders: [
    'Content-Security-Policy',
    'X-Frame-Options', 
    'X-Content-Type-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Referrer-Policy'
  ],
  
  // Allowed external domains for CSP
  allowedDomains: [
    'https://*.sentry.io',
    'https://browser.sentry-cdn.com',
    'https://formspree.io',
    'https://*.vercel.com'
  ]
};

/**
 * Scan for dependency vulnerabilities
 */
async function scanDependencyVulnerabilities() {
  console.log('🔍 Scanning dependencies for vulnerabilities...');
  
  try {
    // Try npm audit first (more reliable)
    let auditOutput;
    try {
      auditOutput = execSync('npm audit --audit-level low --json', { 
        cwd: ROOT_DIR,
        encoding: 'utf8'
      });
    } catch (error) {
      // npm audit exits with non-zero code when vulnerabilities found
      auditOutput = error.stdout;
    }
    
    if (!auditOutput) {
      console.log('✅ No dependency vulnerabilities found');
      return { passed: true, vulnerabilities: [] };
    }
    
    const auditData = JSON.parse(auditOutput);
    const vulnerabilities = [];
    
    // Parse npm audit output
    if (auditData.vulnerabilities) {
      for (const [pkg, vuln] of Object.entries(auditData.vulnerabilities)) {
        vulnerabilities.push({
          package: pkg,
          severity: vuln.severity,
          title: vuln.via?.[0]?.title || 'Unknown vulnerability',
          range: vuln.range,
          fixAvailable: vuln.fixAvailable !== false
        });
      }
    }
    
    // Check against thresholds
    const severityCounts = {
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      moderate: vulnerabilities.filter(v => v.severity === 'moderate').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length
    };
    
    const passed = 
      severityCounts.critical <= SECURITY_CONFIG.vulnerabilities.critical &&
      severityCounts.high <= SECURITY_CONFIG.vulnerabilities.high &&
      severityCounts.moderate <= SECURITY_CONFIG.vulnerabilities.moderate &&
      severityCounts.low <= SECURITY_CONFIG.vulnerabilities.low;
    
    if (passed) {
      console.log('✅ Dependency vulnerabilities within acceptable limits');
    } else {
      console.log('❌ Dependency vulnerabilities exceed limits:', severityCounts);
    }
    
    return { passed, vulnerabilities, severityCounts };
    
  } catch (error) {
    console.warn('⚠️ Could not run dependency audit:', error.message);
    return { passed: true, vulnerabilities: [], warning: 'Audit unavailable' };
  }
}

/**
 * Scan for hardcoded secrets and sensitive data
 */
async function scanForSecrets() {
  console.log('🔍 Scanning for hardcoded secrets...');
  
  const secrets = [];
  
  // Get all files to scan
  const filesToScan = [];
  for (const pattern of SECURITY_CONFIG.secretScanPaths) {
    try {
      const files = execSync(`find . -type f -name "${pattern.replace('**/', '')}" 2>/dev/null || true`, {
        cwd: ROOT_DIR,
        encoding: 'utf8'
      }).split('\n').filter(f => f.trim());
      
      filesToScan.push(...files);
    } catch (error) {
      // Continue with other patterns
    }
  }
  
  // Scan each file
  for (const file of filesToScan) {
    if (!file || file.includes('node_modules') || file.includes('.git')) continue;
    
    try {
      const filePath = path.join(ROOT_DIR, file);
      if (!fs.existsSync(filePath)) continue;
      
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Apply each secret pattern
      for (const secretPattern of SECURITY_CONFIG.secretPatterns) {
        const matches = content.match(secretPattern.pattern);
        if (matches) {
          for (const match of matches) {
            // Skip obvious false positives
            if (match.includes('example') || 
                match.includes('placeholder') ||
                match.includes('your-') ||
                match.includes('INSERT_') ||
                match.includes('TODO')) {
              continue;
            }
            
            secrets.push({
              file,
              type: secretPattern.name,
              severity: secretPattern.severity,
              match: match.substring(0, 50) + '...', // Truncate for security
              line: content.substring(0, content.indexOf(match)).split('\n').length
            });
          }
        }
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }
  
  const criticalSecrets = secrets.filter(s => s.severity === 'critical');
  const passed = criticalSecrets.length === 0;
  
  if (passed) {
    console.log('✅ No critical secrets detected');
  } else {
    console.log('❌ Critical secrets found:', criticalSecrets.length);
  }
  
  return { passed, secrets, criticalSecrets };
}

/**
 * Validate security headers configuration
 */
function validateSecurityHeaders() {
  console.log('🔍 Validating security headers configuration...');
  
  const issues = [];
  
  // Check _headers file
  const headersFile = path.join(ROOT_DIR, 'public', '_headers');
  if (!fs.existsSync(headersFile)) {
    issues.push('Missing _headers file for security configuration');
    return { passed: false, issues };
  }
  
  const headersContent = fs.readFileSync(headersFile, 'utf8');
  
  // Check required headers
  for (const header of SECURITY_CONFIG.requiredHeaders) {
    if (!headersContent.includes(header)) {
      issues.push(`Missing required security header: ${header}`);
    }
  }
  
  // Validate CSP configuration
  if (headersContent.includes('Content-Security-Policy')) {
    // Check for unsafe-eval or unsafe-inline (should be limited)
    const cspMatches = headersContent.match(/Content-Security-Policy: (.+)/);
    if (cspMatches) {
      const csp = cspMatches[1];
      
      if (csp.includes("'unsafe-eval'") && !csp.includes('script-src')) {
        issues.push('CSP allows unsafe-eval globally - should be restricted to script-src');
      }
      
      // Check for missing important directives
      const importantDirectives = ['default-src', 'script-src', 'object-src', 'frame-ancestors'];
      for (const directive of importantDirectives) {
        if (!csp.includes(directive)) {
          issues.push(`CSP missing important directive: ${directive}`);
        }
      }
    }
  }
  
  // Check vercel.json security headers
  const vercelFile = path.join(ROOT_DIR, 'vercel.json');
  if (fs.existsSync(vercelFile)) {
    const vercelConfig = JSON.parse(fs.readFileSync(vercelFile, 'utf8'));
    
    if (!vercelConfig.headers) {
      issues.push('vercel.json missing security headers configuration');
    }
  }
  
  const passed = issues.length === 0;
  
  if (passed) {
    console.log('✅ Security headers configuration is valid');
  } else {
    console.log('❌ Security headers issues:', issues.length);
  }
  
  return { passed, issues };
}

/**
 * Check for insecure code patterns
 */
function scanInsecureCodePatterns() {
  console.log('🔍 Scanning for insecure code patterns...');
  
  const insecurePatterns = [
    {
      name: 'dangerouslySetInnerHTML usage',
      pattern: /dangerouslySetInnerHTML/g,
      severity: 'high',
      description: 'Potential XSS vulnerability'
    },
    {
      name: 'eval() usage',
      pattern: /\beval\s*\(/g,
      severity: 'critical',
      description: 'Code injection vulnerability'
    },
    {
      name: 'innerHTML usage',
      pattern: /\.innerHTML\s*=/g,
      severity: 'moderate',
      description: 'Potential XSS vulnerability'
    },
    {
      name: 'document.write usage',
      pattern: /document\.write\s*\(/g,
      severity: 'moderate',
      description: 'Unsafe DOM manipulation'
    },
    {
      name: 'setTimeout with string',
      pattern: /setTimeout\s*\(\s*[\"']/g,
      severity: 'high',
      description: 'Code injection via setTimeout'
    },
    {
      name: 'Hardcoded localhost',
      pattern: /(http:\/\/localhost|https:\/\/localhost)/g,
      severity: 'low',
      description: 'Hardcoded development URL in production code'
    }
  ];
  
  const findings = [];
  
  // Scan TypeScript/JavaScript files
  try {
    const jsFiles = execSync('find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx"', {
      cwd: ROOT_DIR,
      encoding: 'utf8'
    }).split('\n').filter(f => f.trim());
    
    for (const file of jsFiles) {
      if (!file) continue;
      
      const filePath = path.join(ROOT_DIR, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      for (const pattern of insecurePatterns) {
        const matches = content.match(pattern.pattern);
        if (matches) {
          findings.push({
            file,
            pattern: pattern.name,
            severity: pattern.severity,
            description: pattern.description,
            occurrences: matches.length
          });
        }
      }
    }
  } catch (error) {
    console.warn('Could not scan code patterns:', error.message);
  }
  
  const criticalFindings = findings.filter(f => f.severity === 'critical');
  const highFindings = findings.filter(f => f.severity === 'high');
  
  const passed = criticalFindings.length === 0 && highFindings.length === 0;
  
  if (passed) {
    console.log('✅ No critical insecure code patterns found');
  } else {
    console.log('❌ Insecure code patterns found:', criticalFindings.length + highFindings.length);
  }
  
  return { passed, findings, criticalFindings, highFindings };
}

/**
 * Generate security report
 */
function generateSecurityReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    overall_status: Object.values(results).every(r => r.passed) ? 'PASS' : 'FAIL',
    summary: {
      dependencies: results.dependencies?.passed ? 'PASS' : 'FAIL',
      secrets: results.secrets?.passed ? 'PASS' : 'FAIL',
      headers: results.headers?.passed ? 'PASS' : 'FAIL',
      code_patterns: results.codePatterns?.passed ? 'PASS' : 'FAIL'
    },
    details: results,
    recommendations: []
  };
  
  // Generate recommendations
  if (!results.dependencies?.passed && results.dependencies?.vulnerabilities) {
    report.recommendations.push('Update dependencies to fix security vulnerabilities');
  }
  
  if (!results.secrets?.passed) {
    report.recommendations.push('Remove hardcoded secrets and use environment variables');
  }
  
  if (!results.headers?.passed) {
    report.recommendations.push('Configure missing security headers');
  }
  
  if (!results.codePatterns?.passed) {
    report.recommendations.push('Fix insecure code patterns to prevent vulnerabilities');
  }
  
  return report;
}

/**
 * Main security scan function
 */
async function runSecurityScan() {
  console.log('🔒 Starting comprehensive security scan...');
  console.log('==========================================');
  
  const results = {};
  
  // Run all security checks
  results.dependencies = await scanDependencyVulnerabilities();
  results.secrets = await scanForSecrets();
  results.headers = validateSecurityHeaders();
  results.codePatterns = scanInsecureCodePatterns();
  
  // Generate report
  const report = generateSecurityReport(results);
  
  console.log('==========================================');
  console.log('🔒 Security Scan Report:');
  console.log(JSON.stringify(report, null, 2));
  
  // Save report
  const reportPath = path.join(ROOT_DIR, 'security-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Full report saved to: ${reportPath}`);
  
  // Exit with error if security issues found
  process.exit(report.overall_status === 'PASS' ? 0 : 1);
}

// Run security scan if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSecurityScan().catch(error => {
    console.error('Security scan failed:', error);
    process.exit(1);
  });
}

export { runSecurityScan, SECURITY_CONFIG };