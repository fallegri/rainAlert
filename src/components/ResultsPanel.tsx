'use client';

import type { FinalVerdict } from '../types';

interface ResultsPanelProps {
  stormETA: number;
  finalVerdict: FinalVerdict;
}

const verdictStyles: Record<FinalVerdict, React.CSSProperties> = {
  'TE SALVAS': { backgroundColor: '#047857', color: '#e9f5ee' },
  'TE MOJAS': { backgroundColor: '#dc2626', color: '#fff4f4' },
  'PISO MOJADO': { backgroundColor: '#ca8a04', color: '#fff6db' }
};

export default function ResultsPanel({ stormETA, finalVerdict }: ResultsPanelProps) {
  return (
    <section>
      <h2>Resultados</h2>
      <div className="result-card">
        <div className="result-pill" style={{ background: '#1e293b', color: '#cbd5e1' }}>
          <span className="result-strong">Storm ETA</span> {Number.isFinite(stormETA) ? `${stormETA} min` : '∞'}
        </div>

        <div className="result-pill" style={{ background: '#0f172a', color: '#cbd5e1', padding: '20px' }}>
          <p style={{ margin: 0 }}>Veredicto final</p>
          <p className="result-strong" style={{ marginTop: '8px', fontSize: '1.1rem', ...verdictStyles[finalVerdict] }}>
            {finalVerdict}
          </p>
        </div>
      </div>
    </section>
  );
}
