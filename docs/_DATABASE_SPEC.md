# Elite Battlegrounds Database Specification

**Version:** 1.0  
**Status:** In Progress

---

# Purpose

This document defines the complete production database architecture for Elite Battlegrounds.

It serves as the single source of truth before implementing the Prisma schema.

Every model, relationship, business rule, index, and constraint must be approved and locked in this document before any Prisma model is generated.

---

# Technology Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Prisma ORM
- Auth.js (Credentials Provider)
- Enterprise RBAC
- Server Actions

---

# Design Principles

- Production-first architecture
- Security by design
- Database-driven RBAC
- Multiple roles per user
- Direct user permissions
- PostgreSQL optimized
- Scalable tournament engine
- Frontend-first compatibility
- No breaking changes to the existing frontend
- Business rules defined before implementation

---

# Development Workflow

DATABASE_SPEC.md

↓

schema.prisma

↓

Migration

↓

Seed

↓

Prisma Client

↓

Authentication

↓

Authorization (RBAC)

↓

Server Actions

↓

Business Logic

↓

Frontend Integration

↓

Testing

↓

Deployment

---

# Locked Frontend

The frontend (Files #1–89) is considered complete.

The backend must adapt to the frontend.

No breaking frontend changes are allowed.

---

# Production Domains

| Domain | Status |
|---------|--------|
| 1. Foundation | 🔒 LOCKED |
| 2. Identity | ⏳ Pending |
| 3. Authorization (RBAC) | ⏳ Pending |
| 4. Media | ⏳ Pending |
| 5. Season | ⏳ Pending |
| 6. Tournament | ⏳ Pending |
| 7. Teams & Players | ⏳ Pending |
| 8. Match Engine | ⏳ Pending |
| 9. Content | ⏳ Pending |
| 10. System | ⏳ Pending |
| 11. Optimization | ⏳ Pending |

---

# Model Progress

## Identity

- [x] Model 1 — User 🔒
- [x] Model 2 — Session 🔒
- [x] Model 3 — PasswordResetToken 🔒
- [x] Model 4 — EmailVerificationToken 🔒
- [x] Model 5 — AuditLog 🔒

---

## Authorization (RBAC)

- [x] Model 6 — Role 🔒
- [x] Model 7 — Permission 🔒
- [x] Model 8 — UserRole 🔒
- [x] Model 9 — RolePermission 🔒
- [x] Model 10 — UserPermission 🔒

---

## Media

- [x] Model 11 — Media 🔒

---

## Season

- [x] Model 12 — Season 🔒

---

## Tournament

- [x] Model 13 — Tournament 🔒
- [x] Model 14 — TournamentStage 🔒
- [x] Model 15 — TournamentGroup 🔒
- [x] Model 16 — TournamentRegistration 🔒

---

## Teams & Players

- [x] Model 17 — Team 🔒
- [x] Model 18 — Player 🔒

---

## Match Engine

- [x] Model 19 — Match 🔒
- [x] Model 20 — MatchParticipant 🔒
- [x] Model 21 — MatchGame 🔒
- [x] Model 22 — MatchEvent 🔒
- [x] Model 23 — Standing 🔒

---

## Content

- [x] Model 24 — RuleCategory 🔒
- [x] Model 25 — Rule 🔒
- [x] Model 26 — Announcement 🔒
- [x] Model 27 — Sponsor 🔒
- [x] Model 28 — StaticPage 🔒

---

## System

- [x] Model 29 — Setting 🔒
- [x] Model 30 — Notification 🔒
- [x] Model 31 — ActivityLog 🔒

---

# Model Specification Template

Every model in this document will follow the same structure.

```
MODEL #

Status

Purpose

Responsibilities

Fields

Relationships

Business Rules

Indexes

Constraints

Security

Notes

Status

LOCKED
```

---

# Database Rules

The following rules apply to the entire database.

## Primary Keys

Every model uses:

- cuid() primary keys

---

## Audit Columns

Every major model includes:

- createdAt
- updatedAt

---

## Soft Delete

Only business entities that may be restored include:

- deletedAt

Authentication tokens, sessions, and historical records are not soft deleted.

---

## Public URLs

Public-facing entities use a unique slug.

Examples:

- Season
- Tournament
- Static Page

---

## Permission Strategy

Permissions are stored in the database.

Permissions are never hardcoded.

Example permission codes:

- dashboard.view
- users.manage
- roles.manage
- permissions.manage
- tournaments.create
- tournaments.update
- matches.manage
- registrations.approve
- settings.manage
- audit.view

---

# Lock Policy

A model is only marked **LOCKED** when:

- All fields are approved.
- All relationships are approved.
- Business rules are complete.
- Indexes are defined.
- Constraints are defined.
- Security considerations are complete.

Locked models are not modified unless:

- A bug is discovered.
- A critical architectural issue is identified.
- A new Version 1.x feature is explicitly approved.

---

# Change Policy

Version 1.0 focuses only on the agreed production features.

Any new functionality requested after a model is locked will be evaluated for a future version instead of modifying the locked architecture.

---

# Current Progress

---

---

# MODEL 1 — User

## Purpose

Represents every authenticated user who can access the Elite Battlegrounds platform.

The User model is responsible for identity, authentication, account security, and ownership of business records.

Authorization is handled separately by the RBAC domain.

---

## Responsibilities

The User model is responsible for:

- User Identity
- Authentication
- Account Security
- Session Ownership
- Audit Ownership
- Media Ownership
- Tournament Ownership
- Content Ownership

---

## Authentication

Supports:

- Email Login
- Username Login
- Password Login

Passwords are never stored in plain text.

Only password hashes are stored using bcrypt.

---

## Account Status

Supported account states:

- ACTIVE
- INACTIVE
- LOCKED

Rules:

- ACTIVE users can authenticate.
- INACTIVE users cannot authenticate.
- LOCKED users cannot authenticate until unlocked.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| username | Yes | Unique username |
| email | Yes | Unique email address |
| displayName | Yes | Public display name |
| firstName | Yes | First name |
| middleName | No | Middle name |
| lastName | Yes | Last name |

---

### Authentication

| Field | Required | Description |
|--------|----------|-------------|
| passwordHash | Yes | Hashed password |

---

### Profile

| Field | Required | Description |
|--------|----------|-------------|
| avatarMediaId | No | User avatar |

---

### Security

| Field | Required | Description |
|--------|----------|-------------|
| status | Yes | Account status |
| emailVerifiedAt | No | Email verification timestamp |
| lastLoginAt | No | Last successful login |
| lastActivityAt | No | Last recorded activity |
| lastPasswordChangeAt | No | Password change timestamp |
| failedLoginAttempts | Yes | Failed login counter |
| lockedUntil | No | Account lock expiration |
| forcePasswordChange | Yes | Require password change |
| isSystem | Yes | Protected system account |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Record creation time |
| updatedAt | Yes | Last update time |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Owns

- Sessions
- Password Reset Tokens
- Email Verification Tokens
- Audit Logs
- User Roles
- User Permissions

### References

- Avatar (Media)

### Creates

- Seasons
- Tournaments
- Rules
- Announcements
- Sponsors

### Reviews

- Tournament Registrations

### Uploads

- Media

### Participates

- Match Referee Assignments

---

## Business Rules

- Email must be unique.
- Username must be unique.
- Password hashes only.
- Soft delete only.
- System accounts cannot be deleted.
- Multiple active sessions are allowed.
- Multiple roles are allowed.
- Multiple direct permissions are allowed.
- Usernames may only be changed by a Super Admin.

---

## Indexes

### Unique

- email
- username

### Standard

- status
- displayName
- createdAt
- deletedAt

---

## Constraints

- Email is required.
- Username is required.
- Password hash is required.
- Display name is required.
- Status defaults to ACTIVE.
- Failed login attempts default to 0.
- Force password change defaults to false.
- System account defaults to false.

---

## Security

Supports:

- Account Lockout
- Password Reset
- Email Verification
- Session Revocation
- Activity Tracking

---

## Notes

This model represents identity only.

Permissions are handled by the Authorization (RBAC) domain.

Authentication logic belongs to Auth.js.

Business logic belongs to the service layer.

---

**Status:** 🔒 LOCKED

---

## Purpose

Represents every authenticated user who can access the Elite Battlegrounds platform.

The User model is responsible for identity, authentication, account security, and ownership of business records.

Authorization is handled separately by the RBAC domain.

---

## Responsibilities

The User model is responsible for:

- User Identity
- Authentication
- Account Security
- Session Ownership
- Audit Ownership
- Media Ownership
- Tournament Ownership
- Content Ownership

---

## Authentication

Supports:

- Email Login
- Username Login
- Password Login

Passwords are never stored in plain text.

Only password hashes are stored using bcrypt.

---

## Account Status

Supported account states:

- ACTIVE
- INACTIVE
- LOCKED

Rules:

- ACTIVE users can authenticate.
- INACTIVE users cannot authenticate.
- LOCKED users cannot authenticate until unlocked.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| username | Yes | Unique username |
| email | Yes | Unique email address |
| displayName | Yes | Public display name |
| firstName | Yes | First name |
| middleName | No | Middle name |
| lastName | Yes | Last name |

---

### Authentication

| Field | Required | Description |
|--------|----------|-------------|
| passwordHash | Yes | Hashed password |

---

### Profile

| Field | Required | Description |
|--------|----------|-------------|
| avatarMediaId | No | User avatar |

---

### Security

| Field | Required | Description |
|--------|----------|-------------|
| status | Yes | Account status |
| emailVerifiedAt | No | Email verification timestamp |
| lastLoginAt | No | Last successful login |
| lastActivityAt | No | Last recorded activity |
| lastPasswordChangeAt | No | Password change timestamp |
| failedLoginAttempts | Yes | Failed login counter |
| lockedUntil | No | Account lock expiration |
| forcePasswordChange | Yes | Require password change |
| isSystem | Yes | Protected system account |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Record creation time |
| updatedAt | Yes | Last update time |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Owns

- Sessions
- Password Reset Tokens
- Email Verification Tokens
- Audit Logs
- User Roles
- User Permissions

### References

- Avatar (Media)

### Creates

- Seasons
- Tournaments
- Rules
- Announcements
- Sponsors

### Reviews

- Tournament Registrations

### Uploads

- Media

### Participates

- Match Referee Assignments

---

## Business Rules

- Email must be unique.
- Username must be unique.
- Password hashes only.
- Soft delete only.
- System accounts cannot be deleted.
- Multiple active sessions are allowed.
- Multiple roles are allowed.
- Multiple direct permissions are allowed.
- Usernames may only be changed by a Super Admin.

---

## Indexes

### Unique

- email
- username

### Standard

- status
- displayName
- createdAt
- deletedAt

---

## Constraints

- Email is required.
- Username is required.
- Password hash is required.
- Display name is required.
- Status defaults to ACTIVE.
- Failed login attempts default to 0.
- Force password change defaults to false.
- System account defaults to false.

---

## Security

Supports:

- Account Lockout
- Password Reset
- Email Verification
- Session Revocation
- Activity Tracking

---

## Notes

This model represents identity only.

Permissions are handled by the Authorization (RBAC) domain.

Authentication logic belongs to Auth.js.

Business logic belongs to the service layer.

---

**Status:** 🔒 LOCKED

---

# MODEL 2 — Session

**Status:** 🔒 LOCKED

---

## Purpose

Represents an authenticated login session for a user.

A session is created after successful authentication and remains valid until it expires, is revoked, or the user signs out.

Sessions allow the system to securely manage active logins across multiple devices.

---

## Responsibilities

The Session model is responsible for:

- User Authentication Sessions
- Device Tracking
- Session Expiration
- Session Revocation
- Security Auditing

---

## Session Lifecycle

A session is created when:

- User successfully signs in

A session ends when:

- User signs out
- Session expires
- Session is revoked
- User account is deleted
- Administrator revokes access

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| token | Yes | Unique session token |
| userId | Yes | Owner of the session |

---

### Device Information

| Field | Required | Description |
|--------|----------|-------------|
| ipAddress | No | Client IP Address |
| userAgent | No | Browser or application information |

---

### Session

| Field | Required | Description |
|--------|----------|-------------|
| expiresAt | Yes | Session expiration |
| createdAt | Yes | Session creation time |

---

## Relationships

### Belongs To

- User

---

## Business Rules

- Every session belongs to exactly one user.
- A user may have multiple active sessions.
- Session tokens must be unique.
- Expired sessions are invalid.
- Revoked sessions are invalid.
- Deleting a user removes all active sessions.

---

## Indexes

### Unique

- token

### Standard

- userId
- expiresAt

---

## Constraints

- Token is required.
- User is required.
- Expiration date is required.

---

## Security

Supports:

- Multiple Device Login
- Session Revocation
- Automatic Session Expiration
- Device Tracking
- Login Auditing

---

## Notes

Sessions represent authenticated access only.

Authorization is handled separately by the RBAC domain.

---

**Status:** 🔒 LOCKED

---

# MODEL 3 — PasswordResetToken

**Status:** 🔒 LOCKED

---

## Purpose

Represents a one-time password reset request for a user.

Password reset tokens allow users to securely reset their password without exposing sensitive account information.

Each token is temporary, single-use, and expires automatically.

---

## Responsibilities

The PasswordResetToken model is responsible for:

- Password Reset Requests
- Token Validation
- Token Expiration
- Single-use Password Recovery

---

## Token Lifecycle

A token is created when:

- A user requests a password reset.

A token becomes invalid when:

- It is used successfully.
- It expires.
- A newer password reset token replaces it.
- The user account is deleted.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| userId | Yes | Owner of the token |
| token | Yes | Secure unique reset token |

---

### Expiration

| Field | Required | Description |
|--------|----------|-------------|
| expiresAt | Yes | Token expiration time |
| usedAt | No | Timestamp when the token was used |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Token creation time |

---

## Relationships

### Belongs To

- User

---

## Business Rules

- Every token belongs to exactly one user.
- Tokens must be unique.
- Tokens are single-use.
- Used tokens cannot be reused.
- Expired tokens are invalid.
- Password reset does not change the user's identity.
- Password reset updates the user's password hash.
- Deleting a user removes all associated password reset tokens.

---

## Indexes

### Unique

- token

### Standard

- userId
- expiresAt

---

## Constraints

- User is required.
- Token is required.
- Expiration date is required.

---

## Security

Supports:

- Secure Password Recovery
- One-Time Token Validation
- Automatic Token Expiration
- Replay Attack Prevention

---

## Notes

Password reset tokens never store passwords.

Only a secure reset token is stored.

Password hashing remains the responsibility of the authentication service.

---

**Status:** 🔒 LOCKED

---

# MODEL 4 — EmailVerificationToken

**Status:** 🔒 LOCKED

---

## Purpose

Represents a one-time email verification request for a user.

Email verification tokens are used to confirm ownership of a user's email address before granting full account access or enabling email-dependent features.

Each token is temporary, single-use, and automatically expires.

---

## Responsibilities

The EmailVerificationToken model is responsible for:

- Email Verification Requests
- Token Validation
- Token Expiration
- Single-use Email Verification

---

## Token Lifecycle

A token is created when:

- A new account is registered.
- A user changes their email address.
- A verification email is re-sent.

A token becomes invalid when:

- It is successfully verified.
- It expires.
- A newer verification token replaces it.
- The user account is deleted.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| userId | Yes | Owner of the token |
| token | Yes | Secure unique verification token |

---

### Verification

| Field | Required | Description |
|--------|----------|-------------|
| expiresAt | Yes | Verification expiration |
| verifiedAt | No | Timestamp when verification was completed |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Token creation time |

---

## Relationships

### Belongs To

- User

---

## Business Rules

- Every verification token belongs to exactly one user.
- Tokens must be unique.
- Tokens are single-use.
- Verified tokens cannot be reused.
- Expired tokens are invalid.
- A verified email updates the user's email verification timestamp.
- Deleting a user removes all associated verification tokens.

---

## Indexes

### Unique

- token

### Standard

- userId
- expiresAt

---

## Constraints

- User is required.
- Token is required.
- Expiration date is required.

---

## Security

Supports:

- Email Ownership Verification
- One-Time Token Validation
- Automatic Token Expiration
- Replay Attack Prevention

---

## Notes

Verification tokens never store passwords or sensitive authentication data.

Email verification is independent of password reset.

Authentication is handled by the authentication service.

---

**Status:** 🔒 LOCKED

---

# MODEL 5 — AuditLog

**Status:** 🔒 LOCKED

---

## Purpose

Represents an immutable security audit record for actions performed within the Elite Battlegrounds platform.

Audit logs provide accountability, traceability, and security monitoring for administrative and system events.

Audit records are historical records and are never modified after creation.

---

## Responsibilities

The AuditLog model is responsible for:

- Security Auditing
- Administrative Auditing
- Compliance Tracking
- User Activity History
- System Accountability

---

## Audit Lifecycle

An audit record is created whenever a significant system action occurs.

Examples include:

- User Login
- User Logout
- Account Lock
- Password Reset
- Password Change
- Role Assignment
- Permission Changes
- Tournament Creation
- Tournament Updates
- Registration Approval
- Match Result Submission
- Rule Changes
- Announcement Publishing
- Sponsor Management
- System Setting Changes

Audit records are permanent.

They are never edited or deleted.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| userId | No | User who performed the action |

---

### Audit Information

| Field | Required | Description |
|--------|----------|-------------|
| action | Yes | Audit action performed |
| entity | Yes | Target entity name |
| entityId | No | Target record identifier |
| description | No | Human-readable description |
| metadata | No | Additional structured audit data |

---

### Request Information

| Field | Required | Description |
|--------|----------|-------------|
| ipAddress | No | Client IP address |
| userAgent | No | Browser or device information |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Audit timestamp |

---

## Relationships

### Belongs To

- User (optional)

System-generated audit records may exist without a user.

---

## Business Rules

- Audit records are append-only.
- Audit records cannot be edited.
- Audit records cannot be deleted.
- Audit records remain after user deletion.
- Metadata must be structured JSON.
- Audit logging must not interrupt business operations.

---

## Indexes

### Standard

- userId
- action
- entity
- createdAt

---

## Constraints

- Action is required.
- Entity is required.
- Creation timestamp is required.

---

## Security

Supports:

- Administrative Accountability
- Security Monitoring
- Compliance Reporting
- Incident Investigation
- Historical Traceability

---

## Notes

AuditLog is not the same as ActivityLog.

AuditLog stores security-sensitive and administrative events.

ActivityLog (Domain 10) stores operational and business events.

---

**Status:** 🔒 LOCKED

---

# MODEL 6 — Role

**Status:** 🔒 LOCKED

---

## Purpose

Represents a collection of permissions that can be assigned to one or more users.

Roles simplify permission management by grouping related permissions together.

The system supports database-driven roles, allowing Super Administrators to create, modify, assign, and remove roles without changing application code.

---

## Responsibilities

The Role model is responsible for:

- Permission Grouping
- User Authorization
- Access Control
- Role Management
- Permission Assignment

---

## Role Lifecycle

A role may be:

- Created
- Updated
- Assigned to users
- Removed from users
- Archived
- Deleted (if not protected)

System roles cannot be deleted.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| name | Yes | Display name |
| slug | Yes | Unique system identifier |
| description | No | Description of the role |

---

### Configuration

| Field | Required | Description |
|--------|----------|-------------|
| isSystem | Yes | Indicates a built-in system role |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Record creation time |
| updatedAt | Yes | Last update time |

---

## Relationships

### Has Many

- UserRoles
- RolePermissions

---

## Business Rules

- Role slugs must be unique.
- Role names should be unique within the system.
- System roles cannot be deleted.
- System roles cannot be renamed.
- A role may be assigned to multiple users.
- A role may contain multiple permissions.
- A role without permissions is allowed.
- A role without assigned users is allowed.

---

## Indexes

### Unique

- name
- slug

---

## Constraints

- Name is required.
- Slug must be unique within the parent Tournament.
- isSystem defaults to false.

---

## Security

Supports:

- Role-Based Access Control (RBAC)
- Multiple Roles per User
- Dynamic Permission Assignment
- Database-driven Authorization

---

## Notes

Roles do not directly grant access.

Access is determined by the permissions attached to the role.

---

**Status:** 🔒 LOCKED

---

# MODEL 7 — Permission

**Status:** 🔒 LOCKED

---

## Purpose

Represents a single authorization capability within the Elite Battlegrounds platform.

Permissions define **what actions** a user is allowed to perform.

Permissions are assigned to Roles and may also be assigned directly to individual Users.

---

## Responsibilities

The Permission model is responsible for:

- Defining System Capabilities
- Access Control
- Fine-grained Authorization
- Permission Management

---

## Permission Lifecycle

A permission may be:

- Created
- Updated
- Assigned to Roles
- Assigned directly to Users
- Removed
- Archived

System permissions should not be deleted.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| code | Yes | Unique permission code |
| name | Yes | Display name |
| category | Yes | Permission category |
| description | No | Permission description |

---

### Configuration

| Field | Required | Description |
|--------|----------|-------------|
| isSystem | Yes | Indicates a built-in system permission |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Record creation time |
| updatedAt | Yes | Last update time |

---

## Relationships

### Belongs To

- RolePermissions
- UserPermissions

---

## Business Rules

- Permission codes must be unique.
- Permission codes are immutable once created.
- System permissions cannot be deleted.
- System permissions cannot change their code.
- A permission may belong to multiple roles.
- A permission may be assigned directly to multiple users.

---

## Permission Code Format

Permissions use dot notation.

Examples:

```
dashboard.view

users.view
users.create
users.update
users.delete

roles.manage

permissions.manage

seasons.view
seasons.create
seasons.update
seasons.delete

tournaments.view
tournaments.create
tournaments.update
tournaments.delete

registrations.view
registrations.approve

teams.view
teams.create
teams.update
teams.delete

players.view
players.create
players.update
players.delete

matches.view
matches.manage

rules.manage

announcements.manage

sponsors.manage

media.manage

settings.manage

audit.view
```

---

## Categories

Examples:

- Dashboard
- Users
- Roles
- Permissions
- Seasons
- Tournaments
- Registrations
- Teams
- Players
- Matches
- Rules
- Announcements
- Sponsors
- Media
- Settings
- Audit

---

## Indexes

### Unique

- code

### Standard

- category
- createdAt

---

## Constraints

- Code is required.
- Name is required.
- Category is required.
- isSystem defaults to false.

---

## Security

Supports:

- Fine-grained Authorization
- Database-driven Permissions
- Enterprise RBAC
- Dynamic Permission Assignment

---

## Notes

Permissions represent actions.

Permissions may be granted through:
- Roles (RolePermission)
- Direct User Assignments (UserPermission)

---

**Status:** 🔒 LOCKED

---

# MODEL 8 — UserRole

**Status:** 🔒 LOCKED

---

## Purpose

Represents the assignment of a Role to a User.

UserRole is the bridge between authenticated users and the roles they have been granted within the system.

A user may have multiple roles, and a role may be assigned to multiple users.

---

## Responsibilities

The UserRole model is responsible for:

- Role Assignment
- Role Revocation
- Multi-role Support
- Assignment History

---

## Assignment Lifecycle

A role assignment may be:

- Created
- Revoked
- Reassigned

Deleting a user removes all role assignments.

Deleting a role removes all associated assignments.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| userId | Yes | Assigned user |
| roleId | Yes | Assigned role |

---

### Assignment

| Field | Required | Description |
|--------|----------|-------------|
| assignedById | No | User who assigned the role |
| assignedAt | Yes | Assignment timestamp |

---

## Relationships

### Belongs To

- User
- Role

### Assigned By

- User (optional)

---

## Business Rules

- A user may have multiple roles.
- A role may belong to multiple users.
- Duplicate role assignments are not allowed.
- System roles may be assigned but cannot be modified through assignment.
- Assignment history begins at assignedAt.

---

## Composite Primary Key

- userId
- roleId

---

## Indexes

### Standard

- roleId
- assignedById
- assignedAt

---

## Constraints

- User is required.
- Role is required.
- assignedAt is required.

---

## Security

Supports:

- Multiple Roles per User
- Dynamic Role Assignment
- Administrative Role Management

---

## Notes

This model stores role assignments only.

Permissions are not stored here.

Permission evaluation occurs through RolePermission.

---

**Status:** 🔒 LOCKED

---

# MODEL 9 — RolePermission

**Status:** 🔒 LOCKED

---

## Purpose

Represents the assignment of a Permission to a Role.

RolePermission is the bridge between Roles and Permissions.

It defines what actions a Role is allowed to perform within the system.

---

## Responsibilities

The RolePermission model is responsible for:

- Permission Assignment
- Permission Revocation
- Role Capability Management
- Role Permission Assignment

---

## Assignment Lifecycle

A permission assignment may be:

- Created
- Removed

Deleting a role removes all associated permission assignments.

Deleting a permission removes all associated role assignments.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| roleId | Yes | Assigned role |
| permissionId | Yes | Assigned permission |

---

### Assignment

| Field | Required | Description |
|--------|----------|-------------|
| assignedById | No | User who granted the permission |
| assignedAt | Yes | Assignment timestamp |

---

## Relationships

### Belongs To

- Role
- Permission

### Assigned By

- User (optional)

---

## Business Rules

- A role may have multiple permissions.
- A permission may belong to multiple roles.
- Duplicate permission assignments are not allowed.
- System permissions may be assigned to system roles.
- Removing a role automatically removes all role-permission assignments.
- Removing a permission automatically removes all related assignments.

---

## Composite Primary Key

- roleId
- permissionId

---

## Indexes

### Standard

- permissionId
- assignedById
- assignedAt

---

## Constraints

- Role is required.
- Permission is required.
- assignedAt is required.

---

## Security

Supports:

- Dynamic Permission Assignment
- Database-driven Authorization
- Enterprise RBAC
- Administrative Permission Management

---

## Notes

RolePermission grants permissions to a Role.

Users inherit these permissions through their assigned roles.

---

**Status:** 🔒 LOCKED

---

# MODEL 10 — UserPermission

**Status:** 🔒 LOCKED

---

## Purpose

Represents a direct permission assignment for a specific user.

UserPermission allows the system to grant or deny individual permissions without modifying the user's assigned roles.

This enables fine-grained authorization while keeping the role system clean and reusable.

---

## Responsibilities

The UserPermission model is responsible for:

- Direct Permission Assignment
- Direct Permission Revocation
- User-specific Authorization
- Permission Overrides

---

## Assignment Lifecycle

A direct permission may be:

- Granted
- Updated
- Revoked

Deleting a user removes all direct permission assignments.

Deleting a permission removes all related assignments.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| userId | Yes | Assigned user |
| permissionId | Yes | Assigned permission |

---

### Assignment

| Field | Required | Description |
|--------|----------|-------------|
| granted | Yes | Whether the permission is granted or denied |
| assignedById | No | User who assigned the permission |
| assignedAt | Yes | Assignment timestamp |

---

## Relationships

### Belongs To

- User
- Permission

### Assigned By

- User (optional)

---

## Business Rules

- A user may have multiple direct permissions.
- A permission may be assigned to multiple users.
- Duplicate user-permission assignments are not allowed.
- Direct permissions are evaluated together with role permissions.
- Direct permissions are intended for exceptional cases and should not replace proper role design.
- Removing a user removes all direct permission assignments.
- Removing a permission removes all related assignments.

---

## Composite Primary Key

- userId
- permissionId

---

## Indexes

### Standard

- permissionId
- assignedById
- assignedAt

---

## Constraints

- User is required.
- Permission is required.
- granted defaults to true.
- assignedAt is required.

---

## Security

Supports:

- User-specific Authorization
- Fine-grained Access Control
- Temporary Permission Assignment
- Administrative Overrides

---

## Permission Evaluation Order

When authorizing a user:

1. Collect all permissions from assigned roles.
2. Apply direct user permissions.
3. Resolve the final permission set.
4. Evaluate access.

---

## Notes

UserPermission should be used sparingly.

Most authorization should be managed through Roles.

Direct permissions exist to support exceptional administrative requirements without creating unnecessary roles.

---

**Status:** 🔒 LOCKED

---

# MODEL 11 — Media

**Status:** 🔒 LOCKED

---

## Purpose

Represents every uploaded file managed by the Elite Battlegrounds platform.

The Media model serves as the centralized media library for all uploaded assets, ensuring consistent file management across the entire system.

Media files may be referenced by multiple business entities without duplicating file information.

---

## Responsibilities

The Media model is responsible for:

- File Storage Metadata
- File Organization
- Upload Tracking
- Asset Reuse
- File Ownership

---

## Media Lifecycle

A media record may be:

- Uploaded
- Referenced
- Replaced
- Archived
- Deleted

Deleting a media record removes all references according to the business rules of the owning entity.

---

## Supported File Types

### Images

- User Avatar
- Team Logo
- Tournament Banner
- Sponsor Logo
- Announcement Image

---

### Documents

- Tournament Rules
- PDF Files
- Other Documents

---

### Videos

- Promotional Videos
- Future Match Highlights

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| fileName | Yes | Original uploaded filename |
| storedFileName | Yes | Generated storage filename |
| mimeType | Yes | MIME type |
| mediaType | Yes | Image, Video or Document |

---

### Storage

| Field | Required | Description |
|--------|----------|-------------|
| path | Yes | Storage path |
| url | Yes | Public URL |
| size | Yes | File size in bytes |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| uploadedById | Yes | User who uploaded the file |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Upload timestamp |

---

## Relationships

### Belongs To

- Uploaded By (User)

---

### Referenced By

- User Avatar
- Team
- Tournament
- Sponsor
- Announcement
- Rule

---

## Business Rules

- Every uploaded file belongs to one user.
- A Media record may be referenced by one or more business entities, depending on the relationship defined by the owning model.
- Uploading a replacement creates a new media record.
- Original media history is preserved.
- Physical file deletion follows application retention policies.

---

## Indexes

### Standard

- uploadedById
- mediaType
- createdAt

---

## Constraints

- File name is required.
- Stored file name is required.
- MIME type is required.
- Media type is required.
- Storage path is required.
- Public URL is required.
- File size must be greater than zero.
- Uploaded By is required.

---

## Security

Supports:

- Upload Ownership
- File Validation
- Asset Tracking
- Secure File Management

---

## Notes

The Media model stores file metadata only.

Actual file storage is handled by the application's storage provider.

Business entities reference Media records instead of storing file information directly.

---

**Status:** 🔒 LOCKED

---

# MODEL 12 — Season

**Status:** 🔒 LOCKED

---

## Purpose

Represents a competitive season within the Elite Battlegrounds platform.

A Season groups one or more tournaments under a common competitive period, allowing the platform to organize tournaments over time while preserving historical records.

---

## Responsibilities

The Season model is responsible for:

- Tournament Organization
- Seasonal Scheduling
- Historical Separation
- Season Visibility

---

## Season Lifecycle

A season may be:

- Created
- Published
- Updated
- Archived

Archived seasons remain accessible for historical purposes.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| name | Yes | Season name |
| slug | Yes | Public unique identifier |
| description | No | Season description |

---

### Schedule

| Field | Required | Description |
|--------|----------|-------------|
| startDate | Yes | Season start date |
| endDate | Yes | Season end date |

---

### Visibility

| Field | Required | Description |
|--------|----------|-------------|
| isPublished | Yes | Indicates whether the season is publicly visible |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the season |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Record creation time |
| updatedAt | Yes | Last update time |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- Created By (User)

### Has Many

- Tournaments

---

## Business Rules

- Season names should be unique within the platform.
- Season slugs must be unique.
- A season may contain multiple tournaments.
- A tournament belongs to exactly one season.
- Archived seasons remain available for reporting and historical records.
- Soft deletion is allowed only when no active tournaments depend on the season.

---

## Indexes

### Unique

- slug

### Standard

- name
- isPublished
- startDate
- endDate
- createdById
- deletedAt

---

## Constraints

- Name is required.
- Slug is required.
- Start date is required.
- End date is required.
- End date must not be earlier than the start date.
- Created By is required.
- isPublished defaults to false.

---

## Security

Supports:

- Administrative Season Management
- Historical Data Preservation
- Controlled Publication

---

## Notes

A Season is an organizational container.

Tournament rules, registrations, standings, and matches belong to individual tournaments—not directly to the season.

---

**Status:** 🔒 LOCKED

---

# MODEL 13 — Tournament

**Status:** 🔒 LOCKED

---

## Purpose

Represents a competitive tournament conducted within a Season.

A Tournament defines the complete competition, including its registration period, tournament format, participating teams, stages, matches, standings, and published content.

Every Tournament belongs to exactly one Season.

---

## Responsibilities

The Tournament model is responsible for:

- Tournament Configuration
- Registration Management
- Competition Scheduling
- Tournament Visibility
- Tournament Lifecycle

---

## Tournament Lifecycle

A tournament progresses through the following states:

- Draft
- Registration Open
- Registration Closed
- Check-In
- Upcoming
- Live
- Completed
- Cancelled

A completed tournament becomes read-only except for administrative corrections.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| seasonId | Yes | Parent season |
| name | Yes | Tournament name |
| slug | Yes | Public unique identifier |
| description | No | Tournament description |

---

### Tournament Configuration

| Field | Required | Description |
|--------|----------|-------------|
| status | Yes | Tournament status |
| stageType | Yes | Tournament format |
| maxTeams | Yes | Maximum number of participating teams |
| checkInRequired | Yes | Indicates whether team check-in is required |

---

### Registration Schedule

| Field | Required | Description |
|--------|----------|-------------|
| registrationStartsAt | Yes | Registration opening |
| registrationEndsAt | Yes | Registration closing |

---

### Tournament Schedule

| Field | Required | Description |
|--------|----------|-------------|
| startsAt | Yes | Tournament start |
| endsAt | No | Tournament end |

---

### Media

| Field | Required | Description |
|--------|----------|-------------|
| bannerMediaId | No | Tournament banner |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the tournament |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- Season
- Banner (Media)
- Created By (User)

### Has Many

- Tournament Stages
- Tournament Groups
- Tournament Registrations

### References

- Rules
- Announcements
- Sponsors

---

## Business Rules

- Every tournament belongs to exactly one season.
- Tournament slugs must be globally unique. Tournament names should be unique within the same Season.
- Tournament slugs must be unique.
- Registration must close before the tournament begins.
- Registration cannot open after it closes.
- Maximum teams must be greater than zero.
- Completed tournaments cannot be deleted.
- Soft deletion is permitted only for Draft or Cancelled tournaments.

---

## Indexes

### Unique

- slug

### Standard

- seasonId
- status
- stageType
- startsAt
- registrationStartsAt
- registrationEndsAt
- createdById
- deletedAt

---

## Constraints

- Season is required.
- Name is required.
- Slug is required.
- Tournament status is required.
- Tournament format is required.
- Maximum teams must be greater than zero.
- Registration dates are required.
- Start date is required.
- Created By is required.
- checkInRequired defaults to false.

---

## Security

Supports:

- Administrative Tournament Management
- Controlled Tournament Publication
- Historical Preservation

---

## Notes

Tournament-specific logic such as brackets, standings, participants, and match scheduling are handled by their respective models.

The Tournament model is responsible only for tournament configuration and lifecycle.

---

**Status:** 🔒 LOCKED

---

# MODEL 14 — TournamentStage

**Status:** 🔒 LOCKED

---

## Purpose

Represents a competitive stage within a Tournament.

A TournamentStage divides a tournament into logical phases such as Group Stage, Playoffs, Quarterfinals, Semifinals, Grand Finals, Swiss Stage, or Round Robin.

Each Tournament may contain one or more stages.

---

## Responsibilities

The TournamentStage model is responsible for:

- Tournament Progression
- Stage Configuration
- Match Organization
- Stage Scheduling

---

## Stage Lifecycle

A stage may be:

- Draft
- Upcoming
- Active
- Completed
- Cancelled

Stages execute sequentially according to their display order.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| tournamentId | Yes | Parent tournament |
| name | Yes | Stage name |
| slug | Yes | Public identifier |

---

### Configuration

| Field | Required | Description |
|--------|----------|-------------|
| stageType | Yes | Competition format |
| displayOrder | Yes | Stage sequence |
| isEliminationStage | Yes | Indicates elimination format |

---

### Schedule

| Field | Required | Description |
|--------|----------|-------------|
| startsAt | No | Stage start |
| endsAt | No | Stage end |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |

---

## Relationships

### Belongs To

- Tournament

### Has Many

- TournamentGroups
- Matches
- Standings

---

## Business Rules

- Every stage belongs to exactly one tournament.
- Display order must be unique within a tournament.
- A tournament must contain at least one stage.
- Stage names should be unique within the same tournament.
- Stages execute according to their display order.
- Completed stages become read-only.

---

## Indexes

### Standard

- tournamentId
- stageType
- displayOrder
- startsAt

---

## Constraints

- Tournament is required.
- Name is required.
- Slug is required.
- Stage type is required.
- Display order is required.
- displayOrder must be greater than zero.
- isEliminationStage defaults to false.

---

## Security

Supports:

- Tournament Administration
- Stage Progression
- Bracket Organization

---

## Notes

TournamentStage defines tournament structure only.

Teams, groups, matches, and standings are managed by their respective models.

---

**Status:** 🔒 LOCKED

---

# MODEL 15 — TournamentGroup

**Status:** 🔒 LOCKED

---

## Purpose

Represents a competitive group within a Tournament Stage.

Tournament Groups organize teams into smaller competitive pools during formats such as Group Stage or Swiss.

Not every Tournament Stage requires groups.

Elimination stages generally do not use Tournament Groups.

---

## Responsibilities

The TournamentGroup model is responsible for:

- Team Grouping
- Group Organization
- Stage Segmentation
- Group Scheduling

---

## Group Lifecycle

A group may be:

- Created
- Updated
- Locked
- Archived

Groups become read-only once the associated stage is completed.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| tournamentStageId | Yes | Parent stage |
| name | Yes | Group name |
| slug | Yes | Group identifier |

---

### Configuration

| Field | Required | Description |
|--------|----------|-------------|
| displayOrder | Yes | Display sequence |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |

---

## Relationships

### Belongs To

- TournamentStage

### Has Many

- Teams
- Matches
- Standings

---

## Business Rules

- Every group belongs to exactly one Tournament Stage.
- Group names should be unique within the same Tournament Stage.
- Group slugs must be unique within the same Tournament Stage.
- Each Tournament Stage must have a unique display order within its parent Tournament.
- Groups are optional.
- Elimination stages normally do not contain groups.
- Teams are assigned to Tournament Groups through Tournament Registration or a dedicated group assignment process.
- A group may contain zero or more matches.

---

## Indexes

### Standard

- tournamentStageId
- displayOrder

---

## Constraints

- Tournament Stage is required.
- Name is required.
- Slug is required.
- Display order is required.
- Display order must be greater than zero.

---

## Security

Supports:

- Administrative Group Management
- Group Organization
- Tournament Progression

---

## Notes

Tournament Groups are only organizational containers.

Group standings, team assignments, and match scheduling are managed by their respective models.

---

**Status:** 🔒 LOCKED

---

# MODEL 16 — TournamentRegistration

**Status:** 🔒 LOCKED

---

## Purpose

Represents a team's registration for a specific Tournament.

TournamentRegistration serves as the official record of participation and manages the complete registration lifecycle from submission through approval, rejection, cancellation, and tournament entry.

A Team must have an approved Tournament Registration before participating in any Tournament Stage or Match.

---

## Responsibilities

The TournamentRegistration model is responsible for:

- Tournament Registration
- Registration Approval Workflow
- Registration Status Tracking
- Tournament Eligibility

---

## Registration Lifecycle

A registration may be:

- Submitted
- Under Review
- Approved
- Rejected
- Waitlisted
- Cancelled

Only approved registrations are eligible to participate.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| tournamentId | Yes | Tournament |
| teamId | Yes | Registered team |

---

### Registration

| Field | Required | Description |
|--------|----------|-------------|
| status | Yes | Registration status |
| remarks | No | Administrative remarks |

---

### Review

| Field | Required | Description |
|--------|----------|-------------|
| reviewedById | No | Reviewing administrator |
| reviewedAt | No | Review timestamp |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Registration timestamp |
| updatedAt | Yes | Last update |

---

## Relationships

### Belongs To

- Tournament
- Team

### Reviewed By

- User (optional)

---

## Business Rules

- A team may register only once per tournament.
- A tournament may contain multiple registrations.
- Only approved registrations may advance into tournament stages.
- Registration status determines tournament eligibility.
- A registration remains in a pending review state until an administrator approves, rejects, waitlists, or cancels it.
- Cancelling a registration removes tournament eligibility.

---

## Indexes

### Unique

- tournamentId + teamId

### Standard

- status
- reviewedById
- createdAt

---

## Constraints

- Tournament is required.
- Team is required.
- Registration status is required.

---

## Security

Supports:

- Registration Approval
- Tournament Eligibility
- Administrative Review
- Registration Auditing

---

## Notes

TournamentRegistration represents tournament participation only.

It does not store bracket position, group assignment, match history, or standings.

Those belong to later models.

---

**Status:** 🔒 LOCKED

---

# MODEL 17 — Team

**Status:** 🔒 LOCKED

---

## Purpose

Represents a competitive team participating in Elite Battlegrounds tournaments.

A Team is the primary competitive unit composed of one or more players and may participate in multiple tournaments across different seasons.

---

## Responsibilities

The Team model is responsible for:

- Team Identity
- Team Membership
- Tournament Participation
- Team Branding

---

## Team Lifecycle

A team may be:

- Created
- Updated
- Activated
- Inactivated
- Disqualified
- Archived

A Team remains part of historical tournaments even after becoming inactive.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| name | Yes | Team name |
| slug | Yes | Public unique identifier |
| tag | No | Short team tag or abbreviation |
| description | No | Team description |

---

### Branding

| Field | Required | Description |
|--------|----------|-------------|
| logoMediaId | No | Team logo |

---

### Status

| Field | Required | Description |
|--------|----------|-------------|
| status | Yes | Team status |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the team |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Record creation time |
| updatedAt | Yes | Last update time |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- Created By (User)
- Logo (Media)

### Has Many

- Players
- Tournament Registrations

---

## Business Rules

- Team names should be unique within the platform unless explicitly allowed by future organizational policies.
- Team slugs must be globally unique.
- A Team may participate in multiple tournaments.
- A Team may exist without active tournament registrations.
- A Team must satisfy the tournament roster requirements before tournament check-in.
- Disqualified teams remain visible in historical records.
- Soft deletion is permitted only when the Team is not actively participating in a tournament.

---

## Indexes

### Unique

- slug

### Standard

- name
- status
- createdById
- deletedAt

---

## Constraints

- Name is required.
- Slug is required.
- Status is required.
- Created By is required.
- Team status defaults to ACTIVE.

---

## Security

Supports:

- Administrative Team Management
- Historical Team Records
- Tournament Participation

---

## Notes

A Team represents the organization of players.

Tournament participation is managed through TournamentRegistration.

Player membership is managed by the Player model.

---

**Status:** 🔒 LOCKED

---

# MODEL 18 — Player

**Status:** 🔒 LOCKED

---

## Purpose

Represents an individual competitive player belonging to a Team.

A Player stores competitive information required for tournament participation while remaining independent of any specific tournament.

Tournament participation is determined through the Team's approved Tournament Registration.

---

## Responsibilities

The Player model is responsible for:

- Player Identity
- Team Membership
- Competitive Information
- Roster Management

---

## Player Lifecycle

A player may be:

- Added
- Updated
- Activated
- Inactivated
- Removed from a Team

Historical tournament participation is preserved even if the player later leaves the team.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| teamId | Yes | Parent team |
| inGameName | Yes | Official in-game name |
| gameId | Yes | Mobile Legends Game ID |
| gameServerId | Yes | Mobile Legends Server ID |

---

### Competitive

| Field | Required | Description |
|--------|----------|-------------|
| role | Yes | Primary game role |
| isCaptain | Yes | Team captain indicator |
| isSubstitute | Yes | Substitute indicator |

---

### Verification

| Field | Required | Description |
|--------|----------|-------------|
| isVerified | Yes | Player verification status |
| verifiedAt | No | Verification timestamp |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |

---

## Relationships

### Belongs To

- Team

---

## Business Rules

- At any given time, every Player belongs to exactly one Team.
- A Team may have multiple Players.
- A Team may have only one Captain.
- A Player has one primary competitive role.
- A Player may be marked as a Substitute.
- A verified player has completed the platform's verification process.
- Removing a Player does not remove historical tournament records.

---

## Indexes

### Standard

- teamId
- role
- isCaptain
- isVerified

---

## Constraints

- Team is required.
- In-game name is required.
- Game ID is required.
- Game Server ID is required.
- Role is required.
- isCaptain defaults to false.
- isSubstitute defaults to false.
- isVerified defaults to false.

---

## Security

Supports:

- Player Verification
- Roster Validation
- Tournament Eligibility

---

## Notes

The Player model stores player identity and roster information only.

Tournament eligibility is determined through the Team's approved Tournament Registration and compliance with tournament roster requirements.

Match participation is managed by the Match Engine.

---

**Status:** 🔒 LOCKED

---

# MODEL 19 — Match

**Status:** 🔒 LOCKED

---

## Purpose

Represents a competitive match between two participants within a Tournament Stage.

A Match is the core competitive unit of the tournament engine and supports all tournament formats, including:

- Group Stage
- Round Robin
- Swiss
- Single Elimination
- Double Elimination
- Grand Finals
- Showmatch

---

## Responsibilities

The Match model is responsible for:

- Match Scheduling
- Match Lifecycle
- Participant Assignment
- Winner Determination
- Tournament Progression

---

## Match Lifecycle

A match progresses through:

- Draft
- Ready
- Live
- Paused
- Completed
- Cancelled

Completed matches become read-only.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| tournamentStageId | Yes | Parent Tournament Stage |
| tournamentGroupId | No | Parent Tournament Group |

---

### Match Information

| Field | Required | Description |
|--------|----------|-------------|
| matchNumber | Yes | Sequential match number |
| bestOf | Yes | Match format (BO1, BO3, BO5, BO7) |
| status | Yes | Current match status |
| result | No | Match result |

---

### Scheduling

| Field | Required | Description |
|--------|----------|-------------|
| scheduledAt | No | Scheduled start time |
| startedAt | No | Actual start time |
| completedAt | No | Match completion time |

---

### Officials

| Field | Required | Description |
|--------|----------|-------------|
| refereeId | No | Assigned referee |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |

---

## Relationships

### Belongs To

- Tournament Stage
- Tournament Group (optional)
- Referee (User)

### Has Many

- Match Participants
- Match Games
- Match Events

---

## Business Rules

- Every Match belongs to exactly one Tournament Stage.
- Tournament Group is optional.
- A Match is designed for exactly two competing participants.
- A Match may contain one or more Match Games depending on the Best-of format.
- Completed Matches cannot be modified.
- Cancelled Matches do not affect tournament standings.

---

## Indexes

### Standard

- tournamentStageId
- tournamentGroupId
- status
- scheduledAt
- refereeId

---

## Constraints

- Tournament Stage is required.
- Match Number is required.
- Best-of format is required.
- Match Status is required.
- Best-of format must be one of the supported tournament formats (BO1, BO3, BO5, or BO7).

---

## Security

Supports:

- Match Administration
- Referee Assignment
- Tournament Progression
- Match Scheduling

---

## Notes

The Match model stores match metadata only.

Participants, games, events, and standings are managed by their respective models.

---

**Status:** 🔒 LOCKED

---

# MODEL 20 — MatchParticipant

**Status:** 🔒 LOCKED

---

## Purpose

Represents a participating team within a Match.

A MatchParticipant links a Tournament Registration to a Match and identifies the competing side.

Each Match contains exactly two MatchParticipants.

---

## Responsibilities

The MatchParticipant model is responsible for:

- Match Team Assignment
- Team Position
- Winner Identification

---

## Participation Lifecycle

A MatchParticipant is created when a team is assigned to a Match.

Once a Match is completed, MatchParticipants become historical records and are not modified.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| matchId | Yes | Parent Match |
| tournamentRegistrationId | Yes | Participating Tournament Registration |

---

### Match Position

| Field | Required | Description |
|--------|----------|-------------|
| side | Yes | TEAM_A or TEAM_B |
| isWinner | Yes | Winning participant indicator |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Assignment timestamp |

---

## Relationships

### Belongs To

- Match
- TournamentRegistration

---

## Business Rules

- Every MatchParticipant belongs to exactly one Match.
- Every MatchParticipant represents exactly one Tournament Registration.
- A Match contains exactly two MatchParticipants.
- A Match may have only one winning participant.
- The same Tournament Registration cannot appear twice in the same Match.

---

## Composite Primary Key

- matchId
- tournamentRegistrationId

---

## Indexes

### Standard

- side
- isWinner
- createdAt

---

## Constraints

- Match is required.
- Tournament Registration is required.
- Side is required.
- isWinner defaults to false.

---

## Security

Supports:

- Match Integrity
- Tournament Progression
- Winner Determination

---

## Notes

MatchParticipant stores only participant assignment information.

Player rosters, match games, and events are managed separately.

---

**Status:** 🔒 

---

# MODEL 21 — MatchGame

**Status:** 🔒 LOCKED

---

## Purpose

Represents an individual game within a Match.

A MatchGame allows Elite Battlegrounds to support Best-of (BO) formats such as BO1, BO3, BO5, and BO7 by recording the outcome of each individual game.

---

## Responsibilities

The MatchGame model is responsible for:

- Individual Game Results
- Best-of Progression
- Score Tracking
- Match Completion

---

## Game Lifecycle

A MatchGame progresses through:

- Draft
- Ready
- Live
- Paused
- Completed
- Cancelled

Completed MatchGames become read-only.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| matchId | Yes | Parent Match |

---

### Game Information

| Field | Required | Description |
|--------|----------|-------------|
| gameNumber | Yes | Sequential game number |
| durationSeconds | No | Total game duration in seconds |
| winnerSide | No | Winning participant side |

---

### Replay

| Field | Required | Description |
|--------|----------|-------------|
| replayUrl | No | Replay or VOD URL |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| startedAt | No | Game start time |
| completedAt | No | Game completion time |
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |

---

## Relationships

### Belongs To

- Match

---

## Business Rules

- Every MatchGame belongs to exactly one Match.
- Game numbers must be unique within the same Match.
- A Match may contain one or more MatchGames depending on the Best-of format.
- Completed MatchGames cannot be modified.
- WinnerSide must correspond to one of the competing MatchParticipant sides or remain empty until the game is completed.
- Game numbers must be sequential within the same Match.

---

## Indexes

### Standard

- matchId
- gameNumber
- completedAt

---

## Constraints

- Match is required.
- Game number is required.
- Game number must be greater than zero.

---

## Security

Supports:

- Match Result Integrity
- Best-of Series Management
- Historical Match Records

---

## Notes

MatchGame stores the result of an individual game only.

Overall Match winners are determined by the Match model based on the completed MatchGames.

---

**Status:** 🔒 LOCKED

---

# MODEL 22 — MatchEvent

**Status:** 🔒 LOCKED

---

## Purpose

Represents an administrative or operational event that occurs during a Match.

Match Events provide a complete historical timeline of significant actions affecting a match without modifying the Match record itself.

---

## Responsibilities

The MatchEvent model is responsible for:

- Match Timeline
- Administrative Actions
- Operational Logging
- Tournament Incident Recording

---

## Event Lifecycle

A Match Event is created whenever a significant event occurs during a Match.

Examples include:

- Match Started
- Match Paused
- Match Resumed
- Match Delayed
- Match Cancelled
- Referee Assigned
- Team Disqualified
- Technical Issue
- Match Completed

Events are immutable.

Once created, they are never modified or deleted.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| matchId | Yes | Parent Match |

---

### Event Information

| Field | Required | Description |
|--------|----------|-------------|
| eventType | Yes | Type of event |
| title | Yes | Short event title |
| description | No | Event details |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | No | User who created the event |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Event timestamp |

---

## Relationships

### Belongs To

- Match
- Created By (User)

---

## Business Rules

- Every Match Event belongs to exactly one Match.
- Match Events are append-only.
- Match Events cannot be modified after creation.
- Match Events are immutable and must not be modified or deleted after creation.
- Events are displayed in chronological order.
- System-generated events may not have a Created By user.
- Event timestamps must reflect the chronological order in which events occurred.

---

## Indexes

### Standard

- matchId
- eventType
- createdById
- createdAt

---

## Constraints

- Match is required.
- Event Type is required.
- Title is required.
- Creation timestamp is required.

---

## Security

Supports:

- Match Timeline
- Incident Investigation
- Administrative Accountability
- Historical Match Records

---

## Notes

MatchEvent records administrative events only.

Gameplay results belong to MatchGame.

Overall match status belongs to Match.

---

**Status:** 🔒 LOCKED

---

# MODEL 23 — Standing

**Status:** 🔒 LOCKED

---

## Purpose

Represents the competitive standing of a Tournament Registration within a Tournament Stage or Tournament Group.

The Standing model tracks rankings, performance statistics, and qualification status without storing match data directly.

---

## Responsibilities

The Standing model is responsible for:

- Tournament Rankings
- Performance Statistics
- Qualification Tracking
- Tie-break Support

---

## Standing Lifecycle

A Standing is created when a Tournament Registration becomes eligible for ranking within a Tournament Stage.

Standings are recalculated whenever completed match results affect tournament rankings.

Final standings become read-only after the Tournament Stage is completed.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| tournamentStageId | Yes | Parent Tournament Stage |
| tournamentGroupId | No | Parent Tournament Group |
| tournamentRegistrationId | Yes | Ranked Tournament Registration |

---

### Statistics

| Field | Required | Description |
|--------|----------|-------------|
| matchesPlayed | Yes | Total matches played |
| wins | Yes | Matches won |
| losses | Yes | Matches lost |
| draws | Yes | Matches drawn |
| points | Yes | Total ranking points |

---

### Ranking

| Field | Required | Description |
|--------|----------|-------------|
| rank | Yes | Current ranking position |
| qualified | Yes | Qualified for the next stage |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| updatedAt | Yes | Last ranking update |

---

## Relationships

### Belongs To

- TournamentStage
- TournamentGroup (optional)
- TournamentRegistration

---

## Business Rules

- Every Standing belongs to exactly one Tournament Stage.
- Tournament Group is optional.
- Every Tournament Registration may have only one Standing within the same Tournament Stage.
- Ranking positions must be unique within the same Tournament Stage and, when applicable, within the same Tournament Group.
- Statistical values cannot be negative.
- Completed Tournament Stages produce final read-only standings.

---

## Indexes

### Unique

- tournamentStageId + tournamentRegistrationId

### Standard

- tournamentGroupId
- rank
- qualified
- points

---

## Constraints

- Tournament Stage is required.
- Tournament Registration is required.
- Rank is required.
- Rank must be greater than zero.
- Matches Played defaults to 0.
- Wins defaults to 0.
- Losses defaults to 0.
- Draws defaults to 0.
- Points defaults to 0.
- Qualified defaults to false.
- Rank must be recalculated by the tournament engine whenever completed match results affect the standings.

---

## Security

Supports:

- Tournament Ranking Integrity
- Historical Standings
- Qualification Tracking
- Administrative Review

---

## Notes

Standing stores aggregated tournament statistics only.

Individual match results remain stored in Match and MatchGame.

Ranking calculations are performed by the tournament engine, not by the database.

---

**Status:** 🔒 LOCKED

---

# MODEL 24 — RuleCategory

**Status:** 🔒 LOCKED

---

## Purpose

Represents a category used to organize tournament rules.

Rule categories improve readability by grouping related rules together, such as General Rules, Registration Rules, Gameplay Rules, and Penalties.

---

## Responsibilities

The RuleCategory model is responsible for:

- Rule Organization
- Rule Classification
- Display Ordering

---

## Category Lifecycle

A Rule Category may be:

- Created
- Updated
- Archived

Archived categories remain available for historical reference.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| name | Yes | Category name |
| slug | Yes | Public unique identifier |
| description | No | Category description |

---

### Display

| Field | Required | Description |
|--------|----------|-------------|
| displayOrder | Yes | Display sequence |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the category |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- Created By (User)

### Has Many

- Rules

---

## Business Rules

- Category names should be unique within the platform.
- Category slugs must be globally unique.
- Display order must be unique among active Rule Categories.
- Categories may contain zero or more Rules.
- Archiving a Rule Category does not archive or delete its associated Rules.
- Soft deletion is permitted only when no active Rules reference the category.

---

## Indexes

### Unique

- slug

### Standard

- name
- displayOrder
- createdById
- deletedAt

---

## Constraints

- Name is required.
- Slug is required.
- Display order is required.
- Display order must be greater than zero.
- Created By is required.

---

## Security

Supports:

- Rule Management
- Administrative Organization
- Historical Preservation

---

## Notes

RuleCategory provides organization only.

The content of individual rules is managed by the Rule model.

---

**Status:** 🔒 LOCKED

---

# MODEL 25 — Rule

**Status:** 🔒 LOCKED

---

## Purpose

Represents an individual tournament rule published by Elite Battlegrounds.

Rules define the official regulations governing tournaments, player conduct, registration requirements, gameplay, penalties, and other competition policies.

---

## Responsibilities

The Rule model is responsible for:

- Rule Publication
- Rule Versioning
- Tournament Policy Management
- Administrative Rule Management

---

## Rule Lifecycle

A Rule may be:

- Draft
- Published
- Archived

Only published Rules are visible to the public.

- Archiving a Rule removes it from public visibility while preserving it for administrative and historical reference.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| ruleCategoryId | Yes | Parent Rule Category |
| title | Yes | Rule title |
| slug | Yes | Public unique identifier |

---

### Content

| Field | Required | Description |
|--------|----------|-------------|
| content | Yes | Rule content |
| version | Yes | Rule version |

---

### Publication

| Field | Required | Description |
|--------|----------|-------------|
| isPublished | Yes | Public visibility |
| publishedAt | No | Publication timestamp |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the rule |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- RuleCategory
- Created By (User)

---

## Business Rules

- Every Rule belongs to exactly one Rule Category.
- Rule slugs must be globally unique.
- Rule titles should be unique within the same Rule Category.
- Published Rules must have a publication timestamp.
- Archived Rules remain available for historical reference.
- Soft deletion is permitted only for unpublished Rules.

---

## Indexes

### Unique

- slug

### Standard

- ruleCategoryId
- isPublished
- publishedAt
- createdById
- deletedAt

---

## Constraints

- Rule Category is required.
- Title is required.
- Slug is required.
- Content is required.
- Version is required.
- Created By is required.
- isPublished defaults to false.
- Version must be greater than zero.

---

## Security

Supports:

- Rule Publication
- Administrative Rule Management
- Historical Rule Preservation

---

## Notes

Rules are independent content records.

Tournament enforcement is handled by administrators and the tournament engine, not by the Rule model itself.

---

**Status:** 🔒 LOCKED

---

# MODEL 26 — Announcement

**Status:** 🔒 LOCKED

---

## Purpose

Represents an official announcement published by Elite Battlegrounds.

Announcements are used to communicate tournament news, registration updates, schedules, maintenance notices, rule changes, and other important information to participants and visitors.

---

## Responsibilities

The Announcement model is responsible for:

- News Publication
- Tournament Updates
- Public Communication
- Administrative Announcements

---

## Announcement Lifecycle

An Announcement may be:

- Draft
- Published
- Archived

Only published announcements are visible to the public.

Archived announcements remain available for administrative and historical reference.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| title | Yes | Announcement title |
| slug | Yes | Public unique identifier |

---

### Content

| Field | Required | Description |
|--------|----------|-------------|
| summary | No | Short announcement summary |
| content | Yes | Announcement content |

---

### Media

| Field | Required | Description |
|--------|----------|-------------|
| featuredMediaId | No | Featured image |

---

### Publication

| Field | Required | Description |
|--------|----------|-------------|
| isPublished | Yes | Public visibility |
| publishedAt | No | Publication timestamp |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the announcement |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- Featured Media
- Created By (User)

---

## Business Rules

- Announcement slugs must be globally unique.
- A published Announcement must have a publication timestamp, and the publication timestamp cannot be earlier than the creation timestamp.
- Archived announcements remain available for administrative and historical reference.
- Soft deletion is permitted only for unpublished announcements.
- Featured media is optional.

---

## Indexes

### Unique

- slug

### Standard

- isPublished
- publishedAt
- createdById
- deletedAt

---

## Constraints

- Title is required.
- Slug is required.
- Content is required.
- Created By is required.
- isPublished defaults to false.

---

## Security

Supports:

- Administrative Publishing
- Public News Distribution
- Historical Announcement Preservation

---

## Notes

Announcements are standalone content records.

Announcements remain independent of Tournament records. If an announcement references a tournament, the relationship is managed by the application layer rather than a direct database dependency.

---

**Status:** 🔒 LOCKED

---

# MODEL 27 — Sponsor

**Status:** 🔒 LOCKED

---

## Purpose

Represents an organization, company, or individual sponsoring Elite Battlegrounds events.

Sponsors can be displayed throughout the platform and associated with tournaments, seasons, or platform-wide promotional content.

---

## Responsibilities

The Sponsor model is responsible for:

- Sponsor Management
- Brand Representation
- Promotional Visibility
- Sponsor Information Management

---

## Sponsor Lifecycle

A Sponsor may be:

- Draft
- Published
- Archived

Only published Sponsors are visible to the public.

Archived Sponsors remain available for administrative and historical reference.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| name | Yes | Sponsor name |
| slug | Yes | Public unique identifier |

---

### Information

| Field | Required | Description |
|--------|----------|-------------|
| description | No | Sponsor description |
| websiteUrl | No | Official website URL |

---

### Branding

| Field | Required | Description |
|--------|----------|-------------|
| logoMediaId | No | Sponsor logo |

---

### Publication

| Field | Required | Description |
|--------|----------|-------------|
| isPublished | Yes | Public visibility |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the sponsor |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- Logo (Media)
- Created By (User)

---

## Business Rules

- Sponsor slugs must be globally unique.
- Sponsor slugs must be globally unique. Sponsor names should be unique within the platform.
- A Sponsor may exist without an associated website.
- A Sponsor logo is optional.
- Archived Sponsors remain available for administrative and historical reference.
- Soft deletion is permitted only for unpublished Sponsors.

---

## Indexes

### Unique

- slug

### Standard

- name
- isPublished
- createdById
- deletedAt

---

## Constraints

- Name is required.
- Slug is required.
- Created By is required.
- isPublished defaults to false.

---

## Security

Supports:

- Sponsor Management
- Brand Visibility
- Administrative Publishing
- Historical Sponsor Records

---

## Notes

Sponsors are independent business entities.

The Sponsor model stores sponsor information only.

Relationships between Sponsors and other business entities are managed through dedicated relationship models when required.

---

**Status:** 🔒 LOCKED

---

# MODEL 28 — StaticPage

**Status:** 🔒 LOCKED

---

## Purpose

Represents a managed static content page within the Elite Battlegrounds platform.

Static Pages allow administrators to publish and maintain informational pages without modifying application code.

Examples include:

- About Us
- Contact Us
- Privacy Policy
- Terms & Conditions
- Tournament Guidelines
- Frequently Asked Questions (FAQ)

---

## Responsibilities

The StaticPage model is responsible for:

- Static Content Management
- Public Information
- Policy Publication
- SEO-friendly Content

---

## Page Lifecycle

A Static Page may be:

- Draft
- Published
- Archived

Only published pages are publicly accessible.

Archived pages remain available for administrative and historical reference.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| title | Yes | Page title |
| slug | Yes | Public unique identifier |

---

### Content

| Field | Required | Description |
|--------|----------|-------------|
| summary | No | Short description |
| content | Yes | Page content |

---

### SEO

| Field | Required | Description |
|--------|----------|-------------|
| metaTitle | No | SEO title |
| metaDescription | No | SEO description |

---

### Publication

| Field | Required | Description |
|--------|----------|-------------|
| isPublished | Yes | Public visibility |
| publishedAt | No | Publication timestamp |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| createdById | Yes | User who created the page |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update |
| deletedAt | No | Soft delete timestamp |

---

## Relationships

### Belongs To

- Created By (User)

---

## Business Rules

- Page slugs must be globally unique.
- Page titles should be unique within the platform.
- A published Static Page must have a publication timestamp, and the publication timestamp cannot be earlier than the creation timestamp.
- Archiving a Static Page removes it from public visibility while preserving it for administrative and historical reference.
- Soft deletion is permitted only for unpublished pages.

---

## Indexes

### Unique

- slug

### Standard

- isPublished
- publishedAt
- createdById
- deletedAt

---

## Constraints

- Title is required.
- Slug is required.
- Content is required.
- Created By is required.
- isPublished defaults to false.

---

## Security

Supports:

- Administrative Content Management
- Public Information Publishing
- Policy Management
- Historical Content Preservation

---

## Notes

Static Pages are standalone content records.

They are independent of tournaments, seasons, announcements, and sponsors.

---

**Status:** 🔒 LOCKED

---

# MODEL 29 — Setting

**Status:** 🔒 LOCKED

---

## Purpose

Represents a configurable system setting used by the Elite Battlegrounds platform.

Settings allow Super Administrators to manage application behavior without modifying source code.

---

## Responsibilities

The Setting model is responsible for:

- System Configuration
- Platform Customization
- Feature Configuration
- Administrative Settings

---

## Setting Lifecycle

A Setting may be:

- Created
- Updated
- Enabled
- Disabled

Settings are never deleted.

Deprecated settings remain for historical and migration purposes.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| key | Yes | Unique configuration key |
| name | Yes | Display name |

---

### Configuration

| Field | Required | Description |
|--------|----------|-------------|
| value | Yes | Setting value |
| dataType | Yes | Value data type (String, Number, Boolean, JSON) |
| category | Yes | Setting category |

---

### Status

| Field | Required | Description |
|--------|----------|-------------|
| isEditable | Yes | Can be modified from the admin panel |
| isSystem | Yes | Built-in protected setting |

---

### Ownership

| Field | Required | Description |
|--------|----------|-------------|
| updatedById | No | Last administrator who updated the setting |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |
| updatedAt | Yes | Last update timestamp |

---

## Relationships

### Updated By

- User (optional)

---

## Business Rules

- Setting keys must be globally unique.
- System settings cannot be deleted.
- System settings may only be modified by users with the appropriate system configuration permission.
- Non-editable settings cannot be modified through the administration interface.
- Settings are version-independent and apply platform-wide.
- Changes to system settings must be recorded in the AuditLog.

---

## Indexes

### Unique

- key

### Standard

- category
- isEditable
- isSystem
- updatedAt

---

## Constraints

- Key is required.
- Name is required.
- Value is required.
- Data type is required.
- Category is required.
- isEditable defaults to true.
- isSystem defaults to false.

---

## Security

Supports:

- Platform Configuration
- Administrative Control
- Protected System Settings
- Runtime Configuration

---

## Notes

Settings store platform configuration only.

Business data such as tournaments, teams, users, and matches must never be stored as system settings.

---

**Status:** 🔒 LOCKED

---

# MODEL 30 — Notification

**Status:** 🔒 LOCKED

---

## Purpose

Represents a notification delivered to a specific user within the Elite Battlegrounds platform.

Notifications inform users about important events requiring awareness or action, such as tournament updates, registration decisions, role changes, and system announcements.

---

## Responsibilities

The Notification model is responsible for:

- User Notifications
- Read Status Tracking
- Notification Delivery
- Administrative Messaging

---

## Notification Lifecycle

A Notification may be:

- Created
- Delivered
- Read
- Archived

Archived notifications remain available for historical reference.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| userId | Yes | Recipient |

---

### Content

| Field | Required | Description |
|--------|----------|-------------|
| title | Yes | Notification title |
| message | Yes | Notification message |
| type | Yes | Notification type |

---

### Status

| Field | Required | Description |
|--------|----------|-------------|
| isRead | Yes | Indicates whether the notification has been read |
| readAt | No | Read timestamp |

---

### Navigation

| Field | Required | Description |
|--------|----------|-------------|
| actionUrl | No | Destination within the application |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Creation timestamp |

---

## Relationships

### Belongs To

- User

---

## Business Rules

- Every Notification belongs to exactly one User.
- Notifications may remain unread indefinitely.
- A Notification transitions from unread to read only once. Once marked as read, the original read timestamp must be preserved.
- Archived Notifications remain available for historical reference.
- Deleting a User removes all associated Notifications.
- Creating or updating notification delivery status must not modify the original notification content.

---

## Indexes

### Standard

- userId
- type
- isRead
- createdAt

---

## Constraints

- User is required.
- Title is required.
- Message is required.
- Notification type is required.
- isRead defaults to false.

---

## Security

Supports:

- User Communication
- Administrative Notifications
- Read Tracking
- Historical Notification Records

---

## Notes

Notifications are user-specific.

Delivery mechanisms (email, in-app, push notifications, Discord, etc.) are handled by the application layer rather than the Notification model itself.

---

**Status:** 🔒 LOCKED

---

# MODEL 31 — ActivityLog

**Status:** 🔒 LOCKED

---

## Purpose

Represents a historical record of business activities performed within the Elite Battlegrounds platform.

Unlike AuditLog, which records security-sensitive and administrative events, ActivityLog records operational events that help administrators understand platform usage and user activity.

---

## Responsibilities

The ActivityLog model is responsible for:

- Business Activity Tracking
- Operational History
- Administrative Monitoring
- Platform Usage History

---

## Activity Lifecycle

An ActivityLog record is created whenever a significant business action occurs.

Examples include:

- Tournament Created
- Tournament Updated
- Team Registered
- Team Checked In
- Match Scheduled
- Match Completed
- Rule Published
- Announcement Published
- Sponsor Added
- Static Page Published

ActivityLog records are immutable.

Once created, they are never modified or deleted.

---

## Fields

### Identity

| Field | Required | Description |
|--------|----------|-------------|
| id | Yes | Primary identifier |
| userId | No | User responsible for the activity |

---

### Activity Information

| Field | Required | Description |
|--------|----------|-------------|
| activityType | Yes | Activity classification |
| entity | Yes | Business entity involved |
| entityId | No | Related entity identifier |
| description | Yes | Human-readable activity summary |
| metadata | No | Additional structured activity data |

---

### Audit

| Field | Required | Description |
|--------|----------|-------------|
| createdAt | Yes | Activity timestamp |

---

## Relationships

### Belongs To

- User (optional)

System-generated activities may exist without a User.

---

## Business Rules

- ActivityLog records are append-only.
- ActivityLog records are immutable after creation.
- ActivityLog records are never deleted.
- System-generated activities may not have an associated User.
- Metadata must contain structured data when provided.
- Activity logging must never interrupt business operations.

---

## Indexes

### Standard

- userId
- activityType
- entity
- createdAt

---

## Constraints

- Activity Type is required.
- Entity is required.
- Description is required.
- Creation timestamp is required.

---

## Security

Supports:

- Operational Monitoring
- Administrative Reporting
- Business Activity History
- Historical Analysis

---

## Notes

ActivityLog records business events.

AuditLog records security and authorization events.

These models serve different purposes and must remain separate.

---

**Status:** 🔒 LOCKED

# Architecture Review

Status: In Progress

---

## Review Checklist

### Relationships

- [ ] Verify every relationship has an inverse relationship.
- [ ] Verify every one-to-one relationship.
- [ ] Verify every one-to-many relationship.
- [ ] Verify every many-to-many relationship.

---

### Keys

- [ ] Verify all Primary Keys.
- [ ] Verify all Composite Primary Keys.
- [ ] Verify all Foreign Keys.

---

### Constraints

- [ ] Verify all Unique Constraints.
- [ ] Verify all Indexes.
- [ ] Verify all Required Fields.
- [ ] Verify all Default Values.

---

### Enums

- [ ] Verify every Enum.
- [ ] Remove unused Enums.
- [ ] Add missing Enums.

---

### Soft Delete

- [ ] Verify every model that uses deletedAt.
- [ ] Verify models that must never be deleted.

---

### Audit

- [ ] Verify createdAt.
- [ ] Verify updatedAt.
- [ ] Verify immutable models.

---

### Prisma Translation

- [ ] Ready for schema.prisma

# Enum Specification

Status: In Review

---

## Identity

### UserStatus

- ACTIVE
- INACTIVE
- LOCKED

---

## Tournament

### TournamentStatus

- DRAFT
- REGISTRATION_OPEN
- REGISTRATION_CLOSED
- CHECK_IN
- UPCOMING
- LIVE
- COMPLETED
- CANCELLED

---

### TournamentStageType

- GROUP_STAGE
- ROUND_ROBIN
- SWISS
- SINGLE_ELIMINATION
- DOUBLE_ELIMINATION
- GRAND_FINAL
- SHOWMATCH

---

### TournamentRegistrationStatus

- SUBMITTED
- UNDER_REVIEW
- APPROVED
- REJECTED
- WAITLISTED
- CANCELLED

---

## Team

### TeamStatus

- ACTIVE
- INACTIVE
- DISQUALIFIED
- ARCHIVED

---

### PlayerRole

- EXP
- JUNGLE
- MID
- GOLD
- ROAM
- SUBSTITUTE

---

## Match

### MatchStatus

- DRAFT
- READY
- LIVE
- PAUSED
- COMPLETED
- CANCELLED

---

### MatchResult

- TEAM_A
- TEAM_B
- DRAW
- NO_RESULT

---

### MatchSide

- TEAM_A
- TEAM_B

---

### BestOfType

- BO1
- BO3
- BO5
- BO7

---

## Media

### MediaType

- IMAGE
- VIDEO
- DOCUMENT

---

## Content

### PublicationStatus

- DRAFT
- PUBLISHED
- ARCHIVED

---

## System

### SettingDataType

- STRING
- NUMBER
- BOOLEAN
- JSON

---

### NotificationType

(To be finalized during backend implementation.)

---

### ActivityType

(To be finalized during backend implementation.)

---

### AuditAction

- CREATE
- UPDATE
- DELETE
- LOGIN
- LOGOUT
- APPROVE
- REJECT

# Relationship Specification

Status: In Review

---

## Identity

### User

Has Many

- Sessions
- PasswordResetTokens
- EmailVerificationTokens
- AuditLogs
- UserRoles
- UserPermissions
- Media (Uploaded)
- Seasons (Created)
- Tournaments (Created)
- RuleCategories (Created)
- Rules (Created)
- Announcements (Created)
- Sponsors (Created)
- StaticPages (Created)
- Notifications
- ActivityLogs
- Settings (Updated)
- MatchEvents (Created)
- Matches (Referee)

Belongs To

- Avatar (Media)

---

### Session

Belongs To

- User

---

### PasswordResetToken

Belongs To

- User

---

### EmailVerificationToken

Belongs To

- User

---

### AuditLog

Belongs To

- User (Optional)

---

## Authorization

### Role

Has Many

- UserRoles
- RolePermissions

---

### Permission

Has Many

- RolePermissions
- UserPermissions

---

### UserRole

Belongs To

- User
- Role
- AssignedBy (User)

---

### RolePermission

Belongs To

- Role
- Permission
- AssignedBy (User)

---

### UserPermission

Belongs To

- User
- Permission
- AssignedBy (User)

---

## Media

### Media

Belongs To

- UploadedBy (User)

Referenced By

- User (Avatar)
- Team (Logo)
- Tournament (Banner)
- Sponsor (Logo)
- Announcement (Featured)

---

## Season

### Season

Has Many

- Tournaments

Belongs To

- CreatedBy (User)

---

## Tournament

Belongs To

- Season
- Banner (Media)
- CreatedBy (User)

Has Many

- TournamentStages
- TournamentRegistrations

---

## TournamentStage

Belongs To

- Tournament

Has Many

- TournamentGroups
- Matches
- Standings

---

## TournamentGroup

Belongs To

- TournamentStage

Has Many

- Matches
- Standings

---

## TournamentRegistration

Belongs To

- Tournament
- Team
- ReviewedBy (User)

Has Many

- MatchParticipants
- Standings

---

## Teams & Players

### Team

Belongs To

- Logo (Media)
- CreatedBy (User)

Has Many

- Players
- TournamentRegistrations

---

### Player

Belongs To

- Team

---

## Match Engine

### Match

Belongs To

- TournamentStage
- TournamentGroup (Optional)
- Referee (User)

Has Many

- MatchParticipants
- MatchGames
- MatchEvents

---

### MatchParticipant

Belongs To

- Match
- TournamentRegistration

---

### MatchGame

Belongs To

- Match

---

### MatchEvent

Belongs To

- Match
- CreatedBy (User) (Optional)

---

### Standing

Belongs To

- TournamentStage
- TournamentGroup (Optional)
- TournamentRegistration

---

## Content

### RuleCategory

Belongs To

- CreatedBy (User)

Has Many

- Rules

---

### Rule

Belongs To

- RuleCategory
- CreatedBy (User)

---

### Announcement

Belongs To

- CreatedBy (User)
- FeaturedMedia (Media)

---

### Sponsor

Belongs To

- CreatedBy (User)
- Logo (Media)

---

### StaticPage

Belongs To

- CreatedBy (User)

---

## System

### Setting

Belongs To

- UpdatedBy (User) (Optional)

---

### Notification

Belongs To

- User

---

### ActivityLog

Belongs To

- User (Optional)

# Cardinality Specification

Status: In Review

---

## One-to-One (1:1)

None

(Current architecture intentionally avoids strict one-to-one database relationships.)

---

## One-to-Many (1:N)

User
→ Sessions

User
→ PasswordResetTokens

User
→ EmailVerificationTokens

User
→ Notifications

User
→ ActivityLogs

User
→ Uploaded Media

User
→ Seasons

User
→ Tournaments

User
→ RuleCategories

User
→ Rules

User
→ Announcements

User
→ Sponsors

User
→ StaticPages

User
→ Settings (Updated)

User
→ MatchEvents

User
→ Refereed Matches

Season
→ Tournaments

Tournament
→ TournamentStages

Tournament
→ TournamentRegistrations

TournamentStage
→ TournamentGroups

TournamentStage
→ Matches

TournamentStage
→ Standings

TournamentGroup
→ Matches

TournamentGroup
→ Standings

Team
→ Players

Team
→ TournamentRegistrations

Match
→ MatchParticipants

Match
→ MatchGames

Match
→ MatchEvents

RuleCategory
→ Rules

---

## Many-to-Many (N:N)

User
↔ Role
(via UserRole)

Role
↔ Permission
(via RolePermission)

User
↔ Permission
(via UserPermission)

# Cascade Rules Specification

Status: In Review

---

## Restrict Delete

Deletion is prevented when dependent business records exist.

Applies to:

- Season → Tournament
- Tournament → TournamentStage
- Tournament → TournamentRegistration
- TournamentStage → Match
- TournamentStage → Standing
- Team → TournamentRegistration
- RuleCategory → Rule
- TournamentRegistration → MatchParticipant
- Match → MatchGame
- Match → MatchEvent
- Match → MatchParticipant

---

## Cascade Delete

Dependent records are automatically removed.

Applies to:

- User → Sessions
- User → PasswordResetTokens
- User → EmailVerificationTokens
- User → Notifications

---

## Set Null

When the parent record is removed, the foreign key becomes NULL.

Applies to:

- Media ← User Avatar
- Media ← Tournament Banner
- Media ← Team Logo
- Media ← Sponsor Logo
- Media ← Announcement Featured Media

- Match → Referee

- Setting → UpdatedBy

- ActivityLog → User

- MatchEvent → CreatedBy

---

## Soft Delete

Business records are never physically deleted.

Instead:

deletedAt is populated.

Applies to:

- User
- Season
- Tournament
- Team
- RuleCategory
- Rule
- Announcement
- Sponsor
- StaticPage

---

## Immutable Records

These records are append-only.

Updates and deletes are prohibited after creation.

Applies to:

- MatchEvent
- ActivityLog
- AuditLog

---

Status

LOCKED

# Database Naming Convention & Prisma Standards

Status: LOCKED

---

## Model Naming

- Use singular PascalCase model names.
- Example: `User`, `Tournament`, `MatchGame`.

---

## Field Naming

- Use camelCase for all field names.
- Foreign keys must end with `Id`.
- Examples:
  - `userId`
  - `createdById`
  - `reviewedById`
  - `featuredMediaId`

---

## Primary Keys

- Every model uses a single `id` field unless a composite primary key is explicitly required.
- Primary keys use UUIDs generated by Prisma.

---

## Composite Primary Keys

Use composite primary keys only for bridge tables, including:

- UserRole
- RolePermission
- UserPermission
- MatchParticipant

---

## Timestamp Fields

Use the following standard names:

- `createdAt`
- `updatedAt`
- `deletedAt`

Immutable models omit `updatedAt`.

---

## Foreign Keys

Every foreign key follows the format:

`<relatedModel>Id`

Examples:

- `userId`
- `teamId`
- `tournamentId`
- `matchId`

---

## Boolean Fields

Prefix boolean fields with:

- `is`
- `has`

Examples:

- `isPublished`
- `isVerified`
- `isCaptain`
- `hasCheckedIn`

---

## Enum Naming

Enums use PascalCase.

Examples:

- `UserStatus`
- `MatchStatus`
- `PublicationStatus`

Enum values use UPPER_SNAKE_CASE.

Examples:

- `ACTIVE`
- `REGISTRATION_OPEN`
- `DOUBLE_ELIMINATION`

---

## Relation Naming

Use descriptive relation names where multiple relationships exist between the same models.

Examples:

- `createdBy`
- `reviewedBy`
- `uploadedBy`
- `referee`

---

## Index Naming

Indexes are defined in Prisma using `@@index`, `@@unique`, and `@@id`.

Do not create custom database index names unless required for a migration.

---

## Default Values

Use Prisma defaults where applicable:

- UUID primary keys
- `now()`
- `@updatedAt`
- Boolean defaults
- Enum defaults

---

## Soft Delete

Models using soft delete always use:

`deletedAt DateTime?`

Never use `isDeleted`.

---

## JSON Fields

Structured metadata uses Prisma `Json`.

Examples:

- Activity metadata
- Notification metadata (future)
- Setting values (where applicable)

---

## Decimal Fields

Use Prisma `Decimal` only for financial or precision values.

Do not use `Float` for monetary data.

---

Status

LOCKED