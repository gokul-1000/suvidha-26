# Database Seeding Guide

This guide explains how to populate your database with sample data for tariffs, policies, advisories, and schemes.

## Prerequisites

1. Ensure your database is running and accessible
2. Run `npm install` to install dependencies
3. Configure your `.env` file with the correct `DATABASE_URL`

## Running Migrations

Before seeding, make sure your database schema is up to date:

```bash
npx prisma migrate dev
```

Or if migrations are already applied:

```bash
npx prisma generate
```

## Seeding Commands

### Individual Seeds

Seed each type of data separately:

```bash
# Seed government schemes (Water & Gas departments)
npm run seed:schemes

# Seed tariffs (all departments - 20 tariffs)
npm run seed:tariffs

# Seed policies (all departments - 18 policies)
npm run seed:policies

# Seed advisories (all departments - 20 advisories)
npm run seed:advisories
```

### Seed Everything at Once

Run all seed scripts in sequence:

```bash
npm run seed:all
```

## Sample Data Overview

### 📊 **Tariffs** (20 entries)

Realistic pricing data for all services:

- **Electricity**: 5 tariff slabs (domestic, commercial, industrial)
- **Water**: 4 tariff categories based on consumption
- **Gas**: 4 tariff types (LPG domestic/commercial, PNG domestic/commercial)
- **Sanitation**: 3 tariff types (residential/commercial waste, septic cleaning)
- **Municipal**: 3 tariff types (property tax, trade license)

### 📜 **Policies** (18 entries)

Real government policies and regulations:

- **Electricity**: Net metering, disconnection policy, energy conservation
- **Water**: Rainwater harvesting, quality standards, 24x7 supply
- **Gas**: PMUY scheme, DBT subsidy, safety standards
- **Sanitation**: Swachh Bharat, plastic ban, FSSM
- **Municipal**: Property tax, building approval, street vending

### 📢 **Advisories** (20 entries)

Time-sensitive notifications for citizens:

- **Electricity**: Maintenance schedules, energy saving tips, solar subsidy alerts
- **Water**: Supply disruptions, quality testing camps, conservation alerts
- **Gas**: Price updates, safety reminders, booking tips
- **Sanitation**: Collection schedules, segregation reminders, workshops
- **Municipal**: Tax deadlines, office timings, infrastructure work alerts

### 🎯 **Schemes** (4 entries)

Government welfare programs:

- **Water**: Jal Jeevan Mission, Rainwater Harvesting Subsidy
- **Gas**: Pradhan Mantri Ujjwala Yojana (PMUY), Ujjwala 2.0

## Data Features

### ✨ Realistic Content

- Actual government scheme names and descriptions
- Current market rates for utilities
- Real policy names and regulations
- Practical advisory messages

### 🗓️ Date Management

- Tariffs: Effective from dates set to realistic periods
- Policies: Historical effective dates for tracking
- Advisories: Dynamic dates (relative to current date)
  - Some expire in 2-3 days (urgent)
  - Some valid for months (ongoing programs)
  - Some valid for 1 year (permanent policies)

### 🏢 Department Coverage

All data covers all 5 departments:

- ELECTRICITY ⚡
- WATER 💧
- GAS 🔥
- SANITATION 🗑️
- MUNICIPAL 🏛️

## Verification

After seeding, verify the data:

```bash
# Check tariffs
npx prisma studio
# Navigate to Tariff table

# Or use API endpoints (with admin authentication)
GET /api/admin/tariffs
GET /api/admin/policies
GET /api/admin/advisories
GET /api/public/schemes
```

## Public Access

Some data is publicly accessible:

- `/api/public/tariffs` - View current tariffs
- `/api/public/policies` - View current policies
- `/api/public/advisories` - View active advisories
- `/api/public/schemes` - View available schemes

## Troubleshooting

### Database Connection Error

```
Error: P1001: Can't reach database server
```

**Solution**: Check your `DATABASE_URL` in `.env` and ensure the database server is running.

### Migration Error

```
Error: Migration failed
```

**Solution**: Drop existing tables or reset the database:

```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Duplicate Entry Error

```
Error: Unique constraint failed
```

**Solution**: Clear existing data before re-seeding:

```bash
# Use Prisma Studio to delete records
npx prisma studio

# Or reset the database
npx prisma migrate reset
```

## Production Deployment

For production environments:

1. **Don't use seed scripts** on production databases
2. Create proper data through admin panel
3. Use seed data only for:
   - Development environments
   - Testing environments
   - Demo instances

## Next Steps

After seeding:

1. ✅ Start the backend server: `npm run dev`
2. ✅ Test admin endpoints for CRUD operations
3. ✅ Verify public endpoints return seeded data
4. ✅ Test frontend integration with live data
5. ✅ Create admin account: `npm run admin:create`

## Questions?

- Check the main project README
- Review API documentation
- Contact: [Project Team]
