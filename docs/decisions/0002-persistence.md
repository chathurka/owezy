# ADR-0002: Persistence and Soft Deletes

**Status:** accepted  
**Date:** 2026-11-01

## Context

Owezy is offline-first. Changes made offline must synchronize reliably. Hard deletes would cause sync conflicts (a device that deleted a record can't push the deletion to a device that already has the record).

## Decision

- **Database:** PostgreSQL via TypeORM.
- **Migrations:** TypeORM CLI; `synchronize: false` in all environments.
- **Soft deletes:** All syncable entities (groups, members, expenses, splits, settlements, budgets, categories, activity events) include a `deleted_at` timestamp column. Hard deletes are prohibited for these tables.
- **Client-generated UUIDs (v4):** Mobile clients generate IDs before going online. The API accepts them, validating uniqueness server-side.
- **Balances are derived.** Never stored as source-of-truth. Always calculated server-side from expenses and settlements.

## Rationale

Soft deletes + client UUIDs enable the sync queue pattern: the client enqueues mutations (create/update/delete) and the server applies them in order, with last-write-wins or conflict detection per entity type.

## Consequences

- Every migration that introduces a syncable table must include a `deleted_at` column.
- Queries must filter `WHERE deleted_at IS NULL` by default.
- The sync engine (Phase 4) must transmit tombstones for deleted records.
