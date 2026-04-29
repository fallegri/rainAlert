# Data Model: Rain Alert App

## Entities

### Weather Zone
Represents a geographic area with current weather conditions.

**Fields**:
- `id`: Primary key (integer, auto-increment)
- `name`: Zone name (string, e.g., "Centro", "Norte")
- `latitude`: Geographic latitude (float)
- `longitude`: Geographic longitude (float)
- `condition`: Current weather condition (string, e.g., "storm", "clear")
- `wind_direction`: Wind direction in degrees (float, 0-360)
- `wind_speed`: Wind speed in m/s (float)
- `last_update`: Timestamp of last data update (datetime)

**Relationships**:
- One-to-many with Prediction Log (zone can have multiple predictions)

**Validation Rules**:
- Latitude: -90 to 90
- Longitude: -180 to 180
- Wind direction: 0-360 degrees
- Wind speed: >= 0

### User Location
Represents the user's current geographic position.

**Fields**:
- `latitude`: Current latitude (float)
- `longitude`: Current longitude (float)
- `timestamp`: When location was captured (datetime)

**Validation Rules**:
- Latitude: -90 to 90
- Longitude: -180 to 180

### Prediction Log
Records calculation parameters and verdicts for analytics.

**Fields**:
- `id`: Primary key (integer, auto-increment)
- `zone_id`: Foreign key to Weather Zone (integer)
- `user_latitude`: User's latitude at time of prediction (float)
- `user_longitude`: User's longitude at time of prediction (float)
- `wind_direction`: Wind direction used in calculation (float)
- `wind_speed`: Wind speed used in calculation (float)
- `distance`: Distance between zone and user in km (float)
- `eta_minutes`: User's estimated time of arrival in minutes (integer)
- `verdict`: Prediction result ("TE SALVAS", "TE MOJAS", "PISO MOJADO") (string)
- `timestamp`: When prediction was made (datetime)

**Relationships**:
- Many-to-one with Weather Zone

**Validation Rules**:
- Distance: >= 0
- ETA: >= 0
- Verdict: Must be one of the three allowed values

### Wind Data
Current wind conditions (embedded in Weather Zone for simplicity).

**Fields**:
- `direction`: Wind direction in degrees (0 = North, 90 = East) (float)
- `speed`: Wind speed in meters per second (float)

**Validation Rules**:
- Direction: 0-360
- Speed: >= 0

## State Transitions

### Weather Zone States
- `active`: Zone has current data and is available for selection
- `inactive`: Zone data is stale or unavailable
- `fallback`: Using default/cached data when API unavailable

### Prediction States
- `calculating`: Trajectory computation in progress
- `ready`: Verdict available
- `error`: Calculation failed (invalid data, etc.)

## Data Flow

1. Weather zones loaded from database/API
2. User location obtained via geolocation API
3. Wind data retrieved for selected zone
4. Trajectory calculated based on wind vector and distance
5. Verdict determined and logged
6. Animation displays trajectory if requested