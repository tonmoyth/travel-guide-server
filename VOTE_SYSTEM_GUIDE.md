# Vote System Implementation Guide

## Overview

This document describes the upVote/downVote system implementation for the Travel Guide Server application.

## Business Logic

The voting system follows this business logic flow:

### 1. Cast Vote Logic

When a user votes on a guide:

- **Get existing vote**: Check if a vote already exists for the member-guide combination using the unique constraint `memberId_guideId`
- **No vote exists** → Create a new vote with the specified voteType (UP/DOWN)
- **Same vote type exists** → Delete the vote (toggle behavior - voting again removes the vote)
- **Different vote type exists** → Update the vote to the new type

### 2. Vote Count

The system calculates and returns:

- **upVotes**: Count of all UP votes for a guide
- **downVotes**: Count of all DOWN votes for a guide
- **totalScore**: Calculated as `upVotes - downVotes`

### 3. User Vote Score

Returns the current user's vote value:

- `1` for an UP vote
- `-1` for a DOWN vote
- `0` for no vote

## Data Model

### Vote Schema

```prisma
model Vote {
    id        String   @id @default(cuid())
    memberId  String   // FK to User
    guideId   String   // FK to TravelGuide
    voteType  VoteType // UP or DOWN
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    // Relations
    member User        @relation(fields: [memberId], references: [id], onDelete: Cascade)
    guide  TravelGuide @relation(fields: [guideId], references: [id], onDelete: Cascade)

    // Unique constraint ensures one vote per user per guide
    @@unique([memberId, guideId])
    @@index([memberId])
    @@index([guideId])
    @@map("votes")
}

enum VoteType {
    UP
    DOWN
}
```

## API Endpoints

### 1. Cast Vote

**Endpoint**: `POST /votes/cast-vote`  
**Authentication**: Required (Member or Admin)

**Request Body**:

```json
{
  "guideId": "string",
  "voteType": "UP" | "DOWN"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Vote cast successfully | Vote removed successfully",
  "data": {
    "vote": {
      "id": "string",
      "memberId": "string",
      "guideId": "string",
      "voteType": "UP" | "DOWN",
      "createdAt": "ISO-8601 timestamp",
      "updatedAt": "ISO-8601 timestamp"
    } || null,
    "voteCount": {
      "upVotes": number,
      "downVotes": number
    },
    "userVoteScore": number
  }
}
```

**Usage Examples**:

- First vote (UP): Creates a vote, returns vote object and count
- Remove vote (toggle): Voting same type again removes vote, returns `vote: null`
- Change vote: Voting different type updates vote to new type

### 2. Get Vote Stats

**Endpoint**: `GET /votes/stats/:guideId`  
**Authentication**: Optional (returns user's vote if authenticated)

**Response**:

```json
{
  "success": true,
  "message": "Vote stats retrieved successfully",
  "data": {
    "voteCount": {
      "upVotes": number,
      "downVotes": number,
      "totalScore": number
    },
    "userVote": {
      "id": "string",
      "memberId": "string",
      "guideId": "string",
      "voteType": "UP" | "DOWN",
      "createdAt": "ISO-8601 timestamp",
      "updatedAt": "ISO-8601 timestamp"
    } || null
  }
}
```

## Module Structure

```
src/modules/Vote/
├── vote.interface.ts      # TypeScript interfaces and types
├── vote.validation.ts     # Zod validation schemas
├── vote.service.ts        # Business logic
├── vote.controller.ts     # Request handlers
└── vote.route.ts          # Route definitions
```

## Implementation Details

### Service Methods

#### `castVote(memberId: string, payload: VotePayload)`

Handles the vote casting logic with the business rules mentioned above.

#### `getVoteCount(guideId: string)`

Returns vote statistics for a guide (upVotes, downVotes, totalScore).

#### `getGuideVoteStats(guideId: string, memberId?: string)`

Gets comprehensive vote statistics including user's current vote if authenticated.

#### `calculateUserVoteScore(vote: Vote | null)`

Calculates the user's vote score (1 for UP, -1 for DOWN, 0 for no vote).

## Error Handling

The system handles the following error cases:

- **404**: Guide not found when casting vote or getting stats
- **400**: Invalid vote type or missing required fields
- **401**: User not authenticated when attempting to cast vote

## Database Indexes

For performance optimization:

- `memberId` index for quick lookups by member
- `guideId` index for quick lookups by guide
- `unique(memberId, guideId)` constraint ensures data consistency and enables efficient lookups

## Testing Scenarios

1. **Create Vote**: User votes UP on a guide for the first time
2. **Toggle Vote**: User votes UP, then votes UP again to remove vote
3. **Change Vote**: User votes UP, then votes DOWN to change vote type
4. **Get Stats**: View vote statistics without authentication
5. **Get Stats with User**: View vote statistics with current user's vote info
