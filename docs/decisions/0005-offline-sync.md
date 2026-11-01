# ADR-0005: Offline-First Sync Architecture (intent)

**Status:** draft — to be detailed in Phase 4  
**Date:** 2026-11-01

## Context

Owezy is offline-first: users can create and edit expenses and settlements while offline, and changes must synchronize automatically when connectivity returns.

## Intended approach (to be finalised in Phase 4)

- **Local database:** SQLite via `drift` (or `sqflite`) on mobile; IndexedDB/localStorage on web.
- **Sync queue:** All writes (create/update/soft-delete) are enqueued locally before hitting the API.
- **Upload on reconnect:** The app monitors connectivity and drains the queue when online.
- **Download on reconnect:** The app fetches remote changes since its last sync timestamp.
- **Conflict strategy:** Last-write-wins by `updated_at` timestamp for most entities. Expenses and settlements have a stricter merge: the server's calculation always wins for balance-affecting fields.
- **Tombstones:** Soft-deleted records are transmitted with `deleted_at` to inform other devices.
- **Deterministic balances:** Balances are never cached as source of truth; always recalculated server-side and returned to clients.

## Consequences

- Phase 1–3 features must be designed with the sync queue in mind (client UUIDs, soft deletes, `updated_at` columns).
- No hard deletes for syncable entities.
- Sync engine is implemented in Phase 4 — Phase 1–3 use a simpler optimistic approach.
