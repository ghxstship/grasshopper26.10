# Subdomain Configuration Guide

## Architecture Overview

This application uses a subdomain-based architecture to separate marketing pages from authenticated applications:

### Marketing Site (gvteway.one)
- `gvteway.one/` → GVTEWAY consumer landing page
- `gvteway.one/atlvs` → ATLVS marketing page  
- `gvteway.one/compvss` → COMPVSS marketing page

### Authenticated Applications (Subdomains)
- `app.gvteway.one/` → GVTEWAY consumer app
- `atlvs.gvteway.one/` → ATLVS production dashboard (redirects to `/atlvs/projects`)
- `compass.gvteway.one/` → COMPVSS crew operations (redirects to `/compvss/dashboard`)

## Local Development

### Testing with Subdomains Locally

1. **Edit your hosts file** (`/etc/hosts` on Mac/Linux, `C:\Windows\System32\drivers\etc\hosts` on Windows):
   ```
   127.0.0.1 app.localhost
   127.0.0.1 atlvs.localhost
   127.0.0.1 compass.localhost
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Access different subdomains**:
   - `http://localhost:3000` → Marketing site (redirects to GVTEWAY)
   - `http://app.localhost:3000` → GVTEWAY app
   - `http://atlvs.localhost:3000` → ATLVS app
   - `http://compass.localhost:3000` → COMPVSS app

## Vercel Deployment

### Domain Configuration

1. **Add Custom Domain** in Vercel project settings:
   - Add `gvteway.one` as the primary domain
   - Add `app.gvteway.one` as a subdomain
   - Add `atlvs.gvteway.one` as a subdomain
   - Add `compass.gvteway.one` as a subdomain

2. **DNS Configuration** (in your domain registrar):
   ```
   Type    Name      Value
   A       @         76.76.21.21 (Vercel IP)
   CNAME   app       cname.vercel-dns.com
   CNAME   atlvs     cname.vercel-dns.com
   CNAME   compass   cname.vercel-dns.com
   ```

3. **Vercel will automatically**:
   - Issue SSL certificates for all domains
   - Route requests based on subdomain via middleware
   - Handle rewrites transparently

### Environment Variables

No additional environment variables needed for subdomain routing. The middleware automatically detects the hostname and routes accordingly.

## How It Works

### Middleware (`src/middleware.ts`)

The middleware intercepts all requests and:

1. **Detects the subdomain** from the hostname
2. **Rewrites the URL** to the appropriate internal path:
   - `app.gvteway.one/` → `/gvteway/`
   - `atlvs.gvteway.one/` → `/atlvs/projects`
   - `compass.gvteway.one/` → `/compvss/dashboard`
3. **Leaves marketing pages** on the main domain unchanged

### Benefits

- ✅ **Clear separation** between marketing and apps
- ✅ **Better security** with isolated cookie domains
- ✅ **Professional URLs** for each platform
- ✅ **Independent scaling** per subdomain
- ✅ **SEO optimization** for marketing pages

## Troubleshooting

### Subdomain not working locally
- Ensure you've edited your hosts file
- Clear browser cache and DNS cache
- Restart your development server

### 404 errors on subdomain
- Check middleware matcher configuration
- Verify the subdomain is correctly configured in Vercel
- Check DNS propagation (can take up to 48 hours)

### SSL certificate issues
- Vercel automatically provisions SSL certificates
- May take a few minutes after adding domain
- Ensure DNS is correctly pointed to Vercel
