#!/usr/bin/env node
/**
 * Health check script for production monitoring
 * Can be used with cron jobs or external monitoring services
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Sites to monitor
  sites: [
    {
      name: 'La Lunetterie du Coin - Production',
      url: 'https://www.lalunetterieducoin.fr',
      expectedStatus: 200,
      timeout: 10000,
      alerts: {
        email: process.env.ALERT_EMAIL,
        webhook: process.env.ALERT_WEBHOOK,
      }
    },
    {
      name: 'La Lunetterie du Coin - Preview',
      url: 'https://lunetterie-du-coin-preview.vercel.app',
      expectedStatus: 200,
      timeout: 10000,
      alerts: {
        email: process.env.ALERT_EMAIL,
        webhook: process.env.ALERT_WEBHOOK,
      }
    }
  ],
  
  // Performance thresholds (milliseconds)
  thresholds: {
    response_time: {
      good: 500,      // < 500ms = Good
      acceptable: 1000, // < 1000ms = Acceptable  
      slow: 3000      // < 3000ms = Slow, > 3000ms = Critical
    },
    availability: {
      critical: 99.9, // Below 99.9% availability triggers critical alert
      warning: 99.95  // Below 99.95% triggers warning
    }
  },
  
  // Alert settings
  alerts: {
    consecutive_failures: 3, // Alert after N consecutive failures
    cooldown_minutes: 15,   // Wait N minutes between duplicate alerts
  },
  
  // Log file
  logFile: path.join(__dirname, '../monitoring-logs.json')
};

/**
 * Perform health check on a single site
 */
async function checkSiteHealth(site) {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const url = new URL(site.url);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      timeout: site.timeout,
      headers: {
        'User-Agent': 'La-Lunetterie-Health-Check/1.0',
        'Accept': 'text/html,application/json',
      }
    };
    
    const req = https.request(options, (res) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const result = {
          site: site.name,
          url: site.url,
          status: 'success',
          httpStatus: res.statusCode,
          responseTime,
          timestamp: new Date().toISOString(),
          headers: res.headers,
          performance: getPerformanceLevel(responseTime),
          healthy: res.statusCode === site.expectedStatus && responseTime < CONFIG.thresholds.response_time.slow
        };
        
        // Check for critical performance issues
        if (responseTime > CONFIG.thresholds.response_time.slow) {
          result.alerts = [`Slow response time: ${responseTime}ms`];
        }
        
        if (res.statusCode !== site.expectedStatus) {
          result.alerts = result.alerts || [];
          result.alerts.push(`Unexpected status code: ${res.statusCode} (expected ${site.expectedStatus})`);
          result.status = 'error';
          result.healthy = false;
        }
        
        resolve(result);
      });
    });
    
    req.on('error', (error) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      resolve({
        site: site.name,
        url: site.url,
        status: 'error',
        error: error.message,
        responseTime,
        timestamp: new Date().toISOString(),
        healthy: false,
        alerts: [`Connection error: ${error.message}`]
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      resolve({
        site: site.name,
        url: site.url,
        status: 'timeout',
        responseTime,
        timestamp: new Date().toISOString(),
        healthy: false,
        alerts: [`Timeout after ${site.timeout}ms`]
      });
    });
    
    req.end();
  });
}

/**
 * Get performance level based on response time
 */
function getPerformanceLevel(responseTime) {
  if (responseTime < CONFIG.thresholds.response_time.good) return 'excellent';
  if (responseTime < CONFIG.thresholds.response_time.acceptable) return 'good';
  if (responseTime < CONFIG.thresholds.response_time.slow) return 'acceptable';
  return 'critical';
}

/**
 * Load previous monitoring data
 */
function loadMonitoringHistory() {
  try {
    if (fs.existsSync(CONFIG.logFile)) {
      const data = fs.readFileSync(CONFIG.logFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Could not load monitoring history:', error.message);
  }
  return { checks: [], stats: {} };
}

/**
 * Save monitoring data
 */
function saveMonitoringData(data) {
  try {
    // Keep only last 1000 checks to prevent file from growing too large
    if (data.checks.length > 1000) {
      data.checks = data.checks.slice(-1000);
    }
    
    fs.writeFileSync(CONFIG.logFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Could not save monitoring data:', error.message);
  }
}

/**
 * Calculate availability statistics
 */
function calculateStats(checks, siteName) {
  const siteChecks = checks.filter(check => check.site === siteName);
  if (siteChecks.length === 0) return null;
  
  const last24h = siteChecks.filter(check => {
    const checkTime = new Date(check.timestamp);
    const now = new Date();
    return (now - checkTime) < (24 * 60 * 60 * 1000);
  });
  
  const healthyChecks = last24h.filter(check => check.healthy);
  const availability = (healthyChecks.length / last24h.length) * 100;
  
  const responseTimes = last24h.map(check => check.responseTime).filter(rt => rt);
  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
    : 0;
  
  return {
    availability: parseFloat(availability.toFixed(2)),
    avgResponseTime: Math.round(avgResponseTime),
    totalChecks: last24h.length,
    healthyChecks: healthyChecks.length,
    lastCheck: siteChecks[siteChecks.length - 1]
  };
}

/**
 * Send alerts if necessary
 */
async function sendAlertsIfNeeded(results, history) {
  for (const result of results) {
    if (!result.healthy && result.alerts) {
      // Check consecutive failures
      const recentChecks = history.checks
        .filter(check => check.site === result.site)
        .slice(-CONFIG.alerts.consecutive_failures);
      
      const allFailed = recentChecks.length === CONFIG.alerts.consecutive_failures &&
                       recentChecks.every(check => !check.healthy);
      
      if (allFailed) {
        await sendAlert(result, 'critical');
      } else if (result.alerts.length > 0) {
        await sendAlert(result, 'warning');
      }
    }
  }
}

/**
 * Send alert (placeholder - integrate with your alerting system)
 */
async function sendAlert(result, severity) {
  const message = {
    severity,
    site: result.site,
    url: result.url,
    timestamp: result.timestamp,
    issues: result.alerts,
    responseTime: result.responseTime,
    status: result.httpStatus || 'N/A'
  };
  
  console.log(`🚨 ALERT [${severity.toUpperCase()}]:`, JSON.stringify(message, null, 2));
  
  // TODO: Integrate with your alerting system (email, Slack, PagerDuty, etc.)
  // Example integrations:
  // - await sendSlackAlert(message);
  // - await sendEmailAlert(message);
  // - await sendWebhookAlert(message);
}

/**
 * Generate status report
 */
function generateStatusReport(results, history) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total_sites: results.length,
      healthy_sites: results.filter(r => r.healthy).length,
      unhealthy_sites: results.filter(r => !r.healthy).length,
    },
    sites: []
  };
  
  for (const result of results) {
    const stats = calculateStats(history.checks, result.site);
    
    report.sites.push({
      name: result.site,
      url: result.url,
      current_status: result.healthy ? 'healthy' : 'unhealthy',
      response_time: result.responseTime,
      performance: result.performance,
      http_status: result.httpStatus,
      availability_24h: stats?.availability || 0,
      avg_response_time_24h: stats?.avgResponseTime || 0,
      alerts: result.alerts || []
    });
  }
  
  return report;
}

/**
 * Main health check function
 */
async function runHealthCheck() {
  console.log('🔍 Starting health check...');
  
  // Load historical data
  const history = loadMonitoringHistory();
  
  // Check all sites
  const results = await Promise.all(
    CONFIG.sites.map(site => checkSiteHealth(site))
  );
  
  // Update history
  history.checks.push(...results);
  
  // Send alerts if needed
  await sendAlertsIfNeeded(results, history);
  
  // Generate report
  const report = generateStatusReport(results, history);
  
  // Save data
  saveMonitoringData(history);
  
  // Output report
  console.log('📊 Health Check Report:');
  console.log(JSON.stringify(report, null, 2));
  
  // Exit with error code if any site is unhealthy
  const hasUnhealthySites = results.some(result => !result.healthy);
  process.exit(hasUnhealthySites ? 1 : 0);
}

// Run health check if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthCheck().catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
  });
}

export { runHealthCheck, CONFIG };