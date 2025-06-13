#!/usr/bin/env node

/**
 * QuietTab Extension Validation Script
 * Checks for common issues before Chrome Web Store submission
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 QuietTab Extension Validation\n');

let issues = [];
let warnings = [];

// Check manifest.json
function validateManifest() {
    console.log('📋 Checking manifest.json...');
    
    try {
        const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
        
        // Required fields
        const required = ['manifest_version', 'name', 'version', 'description'];
        required.forEach(field => {
            if (!manifest[field]) {
                issues.push(`Missing required field: ${field}`);
            }
        });
        
        // Check manifest version
        if (manifest.manifest_version !== 3) {
            issues.push('Must use Manifest V3');
        }
        
        // Check description length
        if (manifest.description && manifest.description.length > 132) {
            warnings.push('Description is longer than 132 characters');
        }
        
        // Check icons
        if (!manifest.icons || !manifest.icons['128']) {
            issues.push('Missing 128x128 icon');
        }
        
        console.log('✅ Manifest validation complete');
        
    } catch (error) {
        issues.push(`Invalid manifest.json: ${error.message}`);
    }
}

// Check required files
function validateFiles() {
    console.log('📁 Checking required files...');
    
    const requiredFiles = [
        'manifest.json',
        'background.js',
        'content.js',
        'popup.html',
        'popup.js',
        'popup.css',
        'injected.js',
        'test-page.html',
        'icons/icon16.png',
        'icons/icon32.png',
        'icons/icon48.png',
        'icons/icon128.png'
    ];
    
    requiredFiles.forEach(file => {
        if (!fs.existsSync(file)) {
            issues.push(`Missing required file: ${file}`);
        }
    });
    
    console.log('✅ File validation complete');
}

// Check for common code issues
function validateCode() {
    console.log('💻 Checking code quality...');
    
    const jsFiles = ['background.js', 'content.js', 'popup.js', 'injected.js'];
    
    jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for console.log (should be removed in production)
            if (content.includes('console.log(')) {
                warnings.push(`${file} contains console.log statements`);
            }
            
            // Check for TODO comments
            if (content.includes('TODO') || content.includes('FIXME')) {
                warnings.push(`${file} contains TODO/FIXME comments`);
            }
            
            // Check for hardcoded URLs (potential security issue)
            const urlPattern = /https?:\/\/[^\s"']+/g;
            const urls = content.match(urlPattern);
            if (urls && urls.length > 0) {
                urls.forEach(url => {
                    if (!url.includes('chrome://') && !url.includes('chrome-extension://')) {
                        warnings.push(`${file} contains hardcoded URL: ${url}`);
                    }
                });
            }
        }
    });
    
    console.log('✅ Code validation complete');
}

// Check HTML files
function validateHTML() {
    console.log('🌐 Checking HTML files...');
    
    const htmlFiles = ['popup.html', 'test-page.html'];
    
    htmlFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            // Check for inline scripts (security concern)
            if (content.includes('<script>') && content.includes('</script>')) {
                const scriptContent = content.match(/<script>(.*?)<\/script>/s);
                if (scriptContent && scriptContent[1].trim().length > 0) {
                    warnings.push(`${file} contains inline JavaScript`);
                }
            }
            
            // Check for external resources
            if (content.includes('http://') || content.includes('https://')) {
                warnings.push(`${file} may contain external resources`);
            }
        }
    });
    
    console.log('✅ HTML validation complete');
}

// Run all validations
function runValidation() {
    validateManifest();
    validateFiles();
    validateCode();
    validateHTML();
    
    console.log('\n📊 Validation Results:');
    console.log('='.repeat(50));
    
    if (issues.length === 0) {
        console.log('✅ No critical issues found!');
    } else {
        console.log(`❌ ${issues.length} critical issue(s) found:`);
        issues.forEach(issue => console.log(`   • ${issue}`));
    }
    
    if (warnings.length === 0) {
        console.log('✅ No warnings!');
    } else {
        console.log(`⚠️  ${warnings.length} warning(s):`);
        warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    console.log('\n🚀 Extension is ready for Chrome Web Store submission!');
    
    if (issues.length > 0) {
        console.log('\n❗ Please fix critical issues before submitting.');
        process.exit(1);
    }
}

// Run the validation
runValidation();
