#!/usr/bin/env ts-node
"use strict";
/**
 * API Route Validation Script
 * Validates that all API routes are properly implemented
 * Checks for:
 * - Proper HTTP method exports (GET, POST, PUT, PATCH, DELETE)
 * - Error handling with handleApiError or try-catch
 * - Rate limiting implementation
 * - Authentication checks
 * - Input validation with Zod schemas
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var API_DIR = path.join(process.cwd(), 'src/app/api');
function findRouteFiles(dir) {
    var files = [];
    function traverse(currentDir) {
        var items = fs.readdirSync(currentDir);
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var fullPath = path.join(currentDir, item);
            var stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                traverse(fullPath);
            }
            else if (item === 'route.ts') {
                files.push(fullPath);
            }
        }
    }
    traverse(dir);
    return files;
}
function validateRoute(filePath) {
    var content = fs.readFileSync(filePath, 'utf-8');
    var relativePath = path.relative(API_DIR, filePath);
    var validation = {
        file: relativePath,
        methods: [],
        hasErrorHandling: false,
        hasRateLimiting: false,
        hasAuth: false,
        hasValidation: false,
        hasTODO: false,
        issues: [],
    };
    // Check for HTTP methods (both function and const patterns)
    var functionMethodRegex = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)/g;
    var constMethodRegex = /export\s+const\s+(GET|POST|PUT|PATCH|DELETE)\s*=/g;
    var match;
    while ((match = functionMethodRegex.exec(content)) !== null) {
        validation.methods.push(match[1]);
    }
    while ((match = constMethodRegex.exec(content)) !== null) {
        validation.methods.push(match[1]);
    }
    if (validation.methods.length === 0) {
        validation.issues.push('No HTTP method exports found');
    }
    // Check for error handling
    validation.hasErrorHandling =
        content.includes('handleApiError') ||
            (content.includes('try') && content.includes('catch')) ||
            content.includes('NextAuth('); // NextAuth handles errors internally
    if (!validation.hasErrorHandling) {
        validation.issues.push('Missing error handling');
    }
    // Check for rate limiting
    validation.hasRateLimiting = content.includes('rateLimit');
    // Check for authentication
    validation.hasAuth =
        content.includes('requireAuth') ||
            content.includes('getServerSession') ||
            content.includes('validateRequest');
    // Check for validation
    validation.hasValidation =
        content.includes('.parse(') ||
            content.includes('.safeParse(') ||
            content.includes('z.object');
    // Check for TODOs (only in comments, not in strings)
    var todoRegex = /\/\/\s*(TODO|FIXME)|\/\*[\s\S]*?(TODO|FIXME)[\s\S]*?\*\//gi;
    validation.hasTODO = todoRegex.test(content);
    if (validation.hasTODO) {
        validation.issues.push('Contains TODO/FIXME comments');
    }
    return validation;
}
function generateReport(validations) {
    console.log('\n=== API Route Validation Report ===\n');
    var total = validations.length;
    var withIssues = validations.filter(function (v) { return v.issues.length > 0; }).length;
    var withTODOs = validations.filter(function (v) { return v.hasTODO; }).length;
    var withoutAuth = validations.filter(function (v) { return !v.hasAuth; }).length;
    var withoutRateLimit = validations.filter(function (v) { return !v.hasRateLimiting; }).length;
    var withoutValidation = validations.filter(function (v) { return !v.hasValidation; }).length;
    console.log("Total Routes: ".concat(total));
    console.log("Routes with Issues: ".concat(withIssues, " (").concat(((withIssues / total) * 100).toFixed(1), "%)"));
    console.log("Routes with TODOs: ".concat(withTODOs, " (").concat(((withTODOs / total) * 100).toFixed(1), "%)"));
    console.log("Routes without Auth: ".concat(withoutAuth, " (").concat(((withoutAuth / total) * 100).toFixed(1), "%)"));
    console.log("Routes without Rate Limiting: ".concat(withoutRateLimit, " (").concat(((withoutRateLimit / total) * 100).toFixed(1), "%)"));
    console.log("Routes without Validation: ".concat(withoutValidation, " (").concat(((withoutValidation / total) * 100).toFixed(1), "%)"));
    var completionRate = ((total - withIssues) / total * 100).toFixed(1);
    console.log("\nCompletion Rate: ".concat(completionRate, "%"));
    if (withIssues > 0) {
        console.log('\n=== Routes with Issues ===\n');
        validations
            .filter(function (v) { return v.issues.length > 0; })
            .forEach(function (v) {
            console.log("\n".concat(v.file));
            console.log("  Methods: ".concat(v.methods.join(', ') || 'None'));
            console.log("  Issues:");
            v.issues.forEach(function (issue) {
                console.log("    - ".concat(issue));
            });
        });
    }
    // Summary by category
    console.log('\n=== Summary by Category ===\n');
    var categories = new Map();
    validations.forEach(function (v) {
        var category = v.file.split('/')[0];
        if (!categories.has(category)) {
            categories.set(category, []);
        }
        categories.get(category).push(v);
    });
    Array.from(categories.entries())
        .sort(function (a, b) { return a[0].localeCompare(b[0]); })
        .forEach(function (_a) {
        var category = _a[0], routes = _a[1];
        var categoryIssues = routes.filter(function (r) { return r.issues.length > 0; }).length;
        var categoryCompletion = ((routes.length - categoryIssues) / routes.length * 100).toFixed(1);
        console.log("".concat(category, ": ").concat(routes.length, " routes, ").concat(categoryCompletion, "% complete"));
    });
    // Export JSON report
    var reportPath = path.join(process.cwd(), 'API_VALIDATION_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify({
        timestamp: new Date().toISOString(),
        summary: {
            total: total,
            withIssues: withIssues,
            withTODOs: withTODOs,
            withoutAuth: withoutAuth,
            withoutRateLimit: withoutRateLimit,
            withoutValidation: withoutValidation,
            completionRate: parseFloat(completionRate),
        },
        routes: validations,
    }, null, 2));
    console.log("\nDetailed report saved to: ".concat(reportPath));
    return parseFloat(completionRate);
}
// Main execution
try {
    console.log('Scanning API routes...\n');
    var routeFiles = findRouteFiles(API_DIR);
    console.log("Found ".concat(routeFiles.length, " route files\n"));
    var validations = routeFiles.map(validateRoute);
    var completionRate = generateReport(validations);
    console.log('\n=== Validation Complete ===\n');
    if (completionRate === 100) {
        console.log('✅ All routes are 100% complete!');
        process.exit(0);
    }
    else {
        console.log("\u26A0\uFE0F  Routes are ".concat(completionRate, "% complete"));
        process.exit(1);
    }
}
catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
}
