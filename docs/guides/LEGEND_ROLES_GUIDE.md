# Legend Roles Guide

**God-Mode Access & Administration**  
**Version:** 1.0.0  
**Last Updated:** November 16, 2025

---

## Overview

Legend roles are special administrative roles with elevated privileges across all three applications (GVTEWAY, COMPVSS, ATLVS). These roles are restricted to @ghxstship.pro email addresses and require two-factor authentication.

---

## Legend Role Hierarchy

### 1. LEGEND_SUPER_ADMIN
**God Mode - Absolute Platform Control**

**Capabilities**:
- Full access to all applications and data
- Create/modify/delete any resource
- Manage all Legend roles
- Access all administrative functions
- Override any permission check
- View all audit logs
- Impersonate any user (no permission required)
- Modify system configurations
- Access production database directly

**Use Cases**:
- Emergency system recovery
- Critical security incidents
- Platform-wide configuration changes
- Final escalation point

**Restrictions**:
- Maximum 2 users with this role
- Requires approval from both existing SUPER_ADMINs
- All actions logged with video audit trail

---

### 2. LEGEND_ADMIN
**Internal Product Management**

**Capabilities**:
- Cross-app access to all three platforms
- Manage users and permissions (except Legend roles)
- Access all events, projects, and data
- View analytics and reports
- Manage content and configurations
- Access support tools
- View audit logs (own actions only)

**Use Cases**:
- Product management
- Content moderation
- User support escalation
- Platform monitoring

**Restrictions**:
- Cannot modify Legend roles
- Cannot access system configurations
- Cannot impersonate users

---

### 3. LEGEND_DEVELOPER
**Full Repository Access**

**Capabilities**:
- Access to all code repositories
- Deploy to staging environments
- View production logs and metrics
- Access development tools
- Run database migrations (staging)
- Test new features in production-like environment
- Access API documentation and tools

**Use Cases**:
- Feature development
- Bug fixing
- Performance optimization
- Technical troubleshooting

**Restrictions**:
- Cannot deploy to production (requires approval)
- Cannot access user data directly
- Cannot modify user permissions
- Read-only access to production database

---

### 4. LEGEND_COLLABORATOR
**External Scoped Full Repository Access**

**Capabilities**:
- Access to specific repositories/projects
- Collaborate on assigned features
- Submit pull requests
- Access staging environments
- View relevant documentation
- Participate in code reviews

**Use Cases**:
- External contractors
- Partner integrations
- Temporary project work
- Specialized consulting

**Restrictions**:
- Scoped to assigned projects only
- Cannot access production
- Cannot view user data
- Time-limited access (renewable)

---

### 5. LEGEND_SUPPORT
**Technical Support with User Impersonation**

**Capabilities**:
- Impersonate users (with their permission)
- Access user accounts for troubleshooting
- View user data and activity
- Modify user settings
- Process refunds and adjustments
- Access support tickets and history
- View limited audit logs

**Use Cases**:
- Customer support escalation
- Account recovery
- Billing issues
- Technical troubleshooting

**Restrictions**:
- Requires user permission to impersonate
- Cannot access financial data directly
- Cannot modify system settings
- All actions logged and notified to user

---

### 6. LEGEND_INCOGNITO
**Stealth User Impersonation**

**Capabilities**:
- Impersonate any user without permission
- No notification sent to user
- Access all user data and actions
- Perform actions as user
- View complete user history
- Access deleted/archived data

**Use Cases**:
- Security investigations
- Fraud detection
- Legal compliance requests
- Emergency account access

**Restrictions**:
- Requires SUPER_ADMIN approval for each use
- Limited to 1-hour sessions
- All actions logged with justification
- Quarterly audit of all uses
- Maximum 5 users with this role

---

## Access Requirements

### Email Verification
- Must use @ghxstship.pro email address
- Email verified before role assignment
- Regular re-verification (every 90 days)

### Two-Factor Authentication
- Required for all Legend roles
- Hardware key recommended (YubiKey, etc.)
- Backup codes stored securely
- Re-authentication every 12 hours

### Background Check
- Required for SUPER_ADMIN and INCOGNITO roles
- Annual renewal
- Criminal background check
- Identity verification

---

## Audit & Compliance

### Logging
All Legend role actions are logged with:
- User ID and role
- Action performed
- Timestamp
- IP address
- Device information
- Justification (for sensitive actions)
- Video recording (for SUPER_ADMIN)

### Audit Trail
- Real-time audit log
- Immutable records
- 7-year retention
- Quarterly reviews
- Anomaly detection

### Notifications
- User notified of impersonation (except INCOGNITO)
- Admin notified of Legend role usage
- Security team alerted for suspicious activity

---

## Using Legend Roles

### Activating Legend Mode

1. Log in with @ghxstship.pro account
2. Navigate to Admin Panel
3. Click "Activate Legend Mode"
4. Enter 2FA code
5. Select role to activate
6. Provide justification
7. Confirm activation

### Impersonating Users

**LEGEND_SUPPORT** (with permission):
```
1. Search for user
2. Click "Request Impersonation"
3. User receives notification
4. User approves/denies
5. If approved, enter session
6. User notified when session ends
```

**LEGEND_INCOGNITO** (no permission):
```
1. Request SUPER_ADMIN approval
2. Provide detailed justification
3. SUPER_ADMIN reviews and approves
4. Enter 1-hour session
5. All actions logged
6. Session auto-terminates after 1 hour
```

### Deactivating Legend Mode

- Click "Deactivate Legend Mode"
- Or automatic after 8 hours
- Or on logout

---

## Best Practices

### For All Legend Roles

1. **Principle of Least Privilege**: Use lowest role needed
2. **Justification**: Always document why you need access
3. **Time-Limited**: Deactivate when done
4. **Transparency**: Inform users when appropriate
5. **Security**: Never share credentials
6. **Compliance**: Follow all policies

### For SUPER_ADMIN

1. **Emergency Only**: Use only for critical issues
2. **Approval**: Get second SUPER_ADMIN approval
3. **Documentation**: Document all actions thoroughly
4. **Communication**: Inform team of actions taken
5. **Review**: Regular review of all SUPER_ADMIN actions

### For INCOGNITO

1. **Legal Compliance**: Ensure legal justification
2. **Approval Required**: Always get SUPER_ADMIN approval
3. **Minimal Access**: Access only what's needed
4. **Documentation**: Detailed justification required
5. **Notification**: Inform user after investigation (if appropriate)

---

## Security Protocols

### Account Security

- Strong password (20+ characters)
- Hardware 2FA key required
- Regular password rotation (90 days)
- No password reuse
- Secure password manager

### Session Security

- Auto-logout after inactivity (15 minutes)
- IP whitelist (office/VPN only)
- Device fingerprinting
- Anomaly detection
- Concurrent session limits

### Data Security

- Encrypted data access
- No data export without approval
- Screen recording for sensitive actions
- Secure communication channels
- Data handling policies

---

## Incident Response

### Security Incident

1. Immediately deactivate Legend mode
2. Notify security team
3. Change passwords
4. Review audit logs
5. Investigate and document
6. Implement corrective actions

### Unauthorized Access

1. Lock all Legend accounts
2. Notify all Legend users
3. Force password reset
4. Review all recent actions
5. Investigate breach
6. Report to authorities if needed

### Data Breach

1. Activate incident response team
2. Assess scope of breach
3. Notify affected users
4. Implement containment
5. Document incident
6. Regulatory reporting

---

## Compliance & Legal

### GDPR Compliance

- User right to access
- User right to deletion
- Data minimization
- Purpose limitation
- Lawful basis for processing

### SOC 2 Compliance

- Access controls
- Audit logging
- Incident response
- Change management
- Risk assessment

### Legal Requests

- Require valid legal documentation
- Verify authenticity
- Consult legal team
- Document all access
- Notify user (unless prohibited)

---

## Training & Certification

### Required Training

- Security awareness (annual)
- Data privacy (annual)
- Incident response (annual)
- Role-specific training (initial + annual)

### Certification

- Complete training modules
- Pass assessment (90%+)
- Acknowledge policies
- Annual recertification

---

## Revocation

### Automatic Revocation

- 90 days of inactivity
- Failed 2FA multiple times
- Security policy violation
- Employment termination
- Role change

### Manual Revocation

- Security incident
- Policy violation
- Misuse of privileges
- Legal requirement
- User request

---

## Support

For Legend role issues:
- **Email**: legend-support@ghxstship.pro
- **Emergency**: Call security hotline
- **Documentation**: legend.ghxstship.pro

---

**Remember: With great power comes great responsibility. Use Legend roles ethically and responsibly.**
