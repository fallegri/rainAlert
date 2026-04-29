'use client';

interface ControlPanelProps {
  windDir: number;
  windSpeed: number;
  userETA: number;
  isSimulationRunning: boolean;
  onUserETAChange: (value: number) => void;
  onSimulationStart: () => void;
  onSimulationCancel: () => void;
}

export default function ControlPanel({
  windDir,
  windSpeed,
  userETA,
  isSimulationRunning,
  onUserETAChange,
  onSimulationStart,
  onSimulationCancel
}: ControlPanelProps) {
  return (
    <section>
      <h2>Controles</h2>
      <div className="info-group">
        <div className="field">
          <label>
            Dirección del viento: <span>{windDir}°</span>
          </label>
        </div>
        <div className="field">
          <label>
            Velocidad del viento: <span>{windSpeed} km/h</span>
          </label>
        </div>
      </div>
      <div className="slider-group">
        <div className="field">
          <label>
            Tiempo de llegada <span>{userETA} min</span>
          </label>
          <input
            type="range"
            min="0"
            max="120"
            value={userETA}
            step="1"
            onChange={(event) => onUserETAChange(Number(event.target.value))}
            disabled={isSimulationRunning}
          />
        </div>
      </div>

      <div style={{ marginTop: '18px' }}>
        {isSimulationRunning ? (
          <button type="button" className="primary" onClick={onSimulationCancel}>
            Detener simulación
          </button>
        ) : (
          <button type="button" className="primary" onClick={onSimulationStart}>
            Iniciar simulación acelerada
          </button>
        )}
      </div>
    </section>
  );
}
