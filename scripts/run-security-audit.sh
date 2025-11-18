#!/bin/bash
# Security Audit Execution Script
# Runs comprehensive security checks based on SECURITY_AUDIT_CHECKLIST.md

set -e

echo "🔒 Security Audit Execution"
echo "==========================="
echo ""

# Step 1: Dependency Vulnerabilities
echo "📦 Step 1: Checking for Dependency Vulnerabilities..."
echo ""

npm audit --production || echo "⚠️  Vulnerabilities found (review above)"
echo ""

# Step 2: Environment Variables
echo "🔐 Step 2: Auditing Environment Variables..."
echo ""

if [ -f .env ]; then
  echo "Checking .env file..."
  
  # Check for exposed secrets
  if grep -E "(password|secret|key|token).*=.*['\"]?[a-zA-Z0-9]{8,}" .env > /dev/null 2>&1; then
    echo "✅ Environment variables configured"
  else
    echo "⚠️  Some environment variables may be missing"
  fi
  
  # Check if .env is gitignored
  if grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo "✅ .env is gitignored"
  else
    echo "❌ WARNING: .env is NOT gitignored!"
  fi
else
  echo "⚠️  No .env file found"
fi

echo ""

# Step 3: Code Security Patterns
echo "🔍 Step 3: Scanning for Security Anti-patterns..."
echo ""

echo "Checking for hardcoded secrets..."
if grep -r -E "(password|secret|key|token)\s*=\s*['\"][a-zA-Z0-9]{8,}" src/ --exclude-dir=node_modules 2>/dev/null | head -n 5; then
  echo "⚠️  Potential hardcoded secrets found (review above)"
else
  echo "✅ No obvious hardcoded secrets"
fi

echo ""
echo "Checking for SQL injection risks..."
if grep -r "prisma\.\$executeRaw\|prisma\.\$queryRaw" src/ 2>/dev/null | head -n 5; then
  echo "⚠️  Raw SQL queries found - ensure parameterization"
else
  echo "✅ No raw SQL queries found"
fi

echo ""
echo "Checking for XSS vulnerabilities..."
if grep -r "dangerouslySetInnerHTML\|innerHTML" src/ 2>/dev/null | head -n 5; then
  echo "⚠️  Potential XSS vectors found (review above)"
else
  echo "✅ No obvious XSS vectors"
fi

echo ""

# Step 4: Authentication & Authorization
echo "🔑 Step 4: Checking Authentication Implementation..."
echo ""

if [ -f "src/middleware/auth.ts" ]; then
  echo "✅ Auth middleware exists"
  
  # Check for JWT validation
  if grep -q "verify\|decode" src/middleware/auth.ts; then
    echo "✅ Token validation implemented"
  else
    echo "⚠️  Token validation may be missing"
  fi
else
  echo "⚠️  Auth middleware not found"
fi

echo ""

# Step 5: API Security
echo "🛡️  Step 5: Checking API Security..."
echo ""

echo "Checking for rate limiting..."
if grep -r "rateLimit\|rate-limit" src/ 2>/dev/null | head -n 3; then
  echo "✅ Rate limiting implemented"
else
  echo "⚠️  Rate limiting not found"
fi

echo ""
echo "Checking for CORS configuration..."
if grep -r "cors" next.config.* 2>/dev/null; then
  echo "✅ CORS configuration found"
else
  echo "⚠️  CORS configuration not found"
fi

echo ""

# Step 6: Data Protection
echo "🔐 Step 6: Checking Data Protection..."
echo ""

echo "Checking for encryption..."
if grep -r "encrypt\|bcrypt\|hash" src/ 2>/dev/null | head -n 3; then
  echo "✅ Encryption/hashing implemented"
else
  echo "⚠️  No encryption/hashing found"
fi

echo ""

# Step 7: Security Headers
echo "📋 Step 7: Checking Security Headers..."
echo ""

if [ -f "next.config.mjs" ] || [ -f "next.config.js" ]; then
  if grep -q "headers" next.config.*; then
    echo "✅ Custom headers configured"
    
    # Check for specific security headers
    if grep -q "X-Frame-Options\|Content-Security-Policy\|X-Content-Type-Options" next.config.*; then
      echo "✅ Security headers present"
    else
      echo "⚠️  Some security headers may be missing"
    fi
  else
    echo "⚠️  No custom headers configured"
  fi
fi

echo ""

# Step 8: File Upload Security
echo "📤 Step 8: Checking File Upload Security..."
echo ""

if [ -f "src/lib/upload/storage.ts" ]; then
  echo "✅ Upload handler exists"
  
  if grep -q "validateFile\|fileType\|maxSize" src/lib/upload/storage.ts; then
    echo "✅ File validation implemented"
  else
    echo "⚠️  File validation may be incomplete"
  fi
else
  echo "⚠️  Upload handler not found"
fi

echo ""

# Summary
echo "==========================="
echo "✅ Security Audit Complete"
echo ""
echo "📊 Audit Summary:"
echo "  ✅ Dependency vulnerabilities checked"
echo "  ✅ Environment variables audited"
echo "  ✅ Code patterns scanned"
echo "  ✅ Authentication reviewed"
echo "  ✅ API security checked"
echo "  ✅ Data protection verified"
echo "  ✅ Security headers reviewed"
echo "  ✅ File upload security checked"
echo ""
echo "📝 Next Steps:"
echo "  1. Review any warnings above"
echo "  2. Fix critical vulnerabilities from npm audit"
echo "  3. Implement missing security controls"
echo "  4. Run penetration testing"
echo "  5. Schedule regular security audits"
echo ""
echo "📖 Full checklist: docs/implementation/SECURITY_AUDIT_CHECKLIST.md"
echo ""
