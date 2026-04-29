# API Contract: Weather Zones

## Endpoint: GET /api/zones

Retrieves list of available weather zones.

### Request
- Method: GET
- Headers: None required
- Query Parameters: None

### Response
- Status: 200 OK
- Content-Type: application/json

```json
{
  "zones": [
    {
      "id": 1,
      "name": "Centro",
      "latitude": -17.7833,
      "longitude": -63.1667,
      "condition": "storm",
      "wind_direction": 180.0,
      "wind_speed": 15.5,
      "last_update": "2026-04-28T14:30:00Z"
    }
  ],
  "fallback": false
}
```

### Error Responses
- 500 Internal Server Error: Database unavailable, returns fallback zones with `"fallback": true`

### Contract Rules
- Always returns at least fallback zones
- `last_update` indicates data freshness
- `fallback` flag indicates data source