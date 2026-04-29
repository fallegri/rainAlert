# API Contract: Rain Predictions

## Endpoint: POST /api/predictions

Calculates storm impact prediction for user location.

### Request
- Method: POST
- Content-Type: application/json

```json
{
  "zone_id": 1,
  "user_latitude": -17.7833,
  "user_longitude": -63.1667,
  "eta_minutes": 30
}
```

### Response
- Status: 200 OK
- Content-Type: application/json

```json
{
  "verdict": "TE MOJAS",
  "calculation": {
    "distance_km": 5.2,
    "wind_direction": 180.0,
    "wind_speed": 15.5,
    "trajectory_intersects": true,
    "time_to_impact_minutes": 25
  },
  "logged": true
}
```

### Error Responses
- 400 Bad Request: Invalid input parameters
- 404 Not Found: Zone not found
- 500 Internal Server Error: Calculation failed

### Contract Rules
- `verdict` must be one of: "TE SALVAS", "TE MOJAS", "PISO MOJADO"
- `logged` indicates if prediction was recorded for analytics
- Calculation details provided for transparency
- ETA of 0 minutes treated as immediate check