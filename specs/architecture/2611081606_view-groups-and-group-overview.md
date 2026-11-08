# Architecture: View groups and group overview

**Status:** approved
**GitHub Issue:** #134 — https://github.com/chathurka/owezy/issues/134
**Feature Spec:** `specs/features/2611081606_view-groups-and-group-overview.md`
**Feature type:** full-stack
**OpenAPI:** `specs/openapi/2611081606_view-groups-and-group-overview.yaml`
**Design:** https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-800, https://www.figma.com/design/Y7uE63pfuGfkuOHxfeUf3J/Owezy-Web?node-id=1-1257, https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-167, https://www.figma.com/design/aPUmKuvCpwnIAD5m53Rh7c/Owezy-Mobile?node-id=1-380 `(adapted — activity empty until expenses)`

---

## Scope

Group overview endpoint + detail screens. Admin n/a.

## Architecture Overview

```
Clients → GET /v1/groups | GET /v1/groups/:id
  → GroupsService.getOverview (membership gate)
  → memberCount + activityEmpty
```

## Key Design Decisions

- 404 for non-members (no existence leak beyond membership).
- No numeric balances until expense epic.

## NestJS

| Method | Path | Notes |
|--------|------|-------|
| GET | `/v1/groups` | Add `memberCount` on each item |
| GET | `/v1/groups/:id` | Overview for members |

## Flutter / User-web

- Routes `/groups/[id]` and mobile `/groups/:id`
- Wire list cards to overview
- Empty activity section

## Build Order

API → clients

## Unit tests

API: member overview; non-member 404; list membership filter.
Client: overview empty state renders.

## AI Resolutions

- `activityEmpty: true` placeholder; no balance fields.
- Design fidelity adapted from Figma metadata (MCP rate limit).
