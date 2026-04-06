import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine,
  ReferenceArea, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { ScaleResult, InconsistencyResult } from '../../lib/types';
import { tScoreColor } from '../../lib/clinical-utils';

interface ProfileChartProps {
  scales: (ScaleResult | InconsistencyResult)[];
  comparisonScales?: (ScaleResult | InconsistencyResult)[];
  title?: string;
  height?: number;
}

export function ProfileChart({ scales, comparisonScales, title, height = 280 }: ProfileChartProps) {
  const data = scales.map(s => {
    const prev = comparisonScales?.find(c => c.code === s.code);
    return {
      name: s.code,
      tScore: s.tScore ?? undefined,
      prevTScore: prev?.tScore ?? undefined,
      fill: tScoreColor(s.tScore),
    };
  });

  const hasComparison = comparisonScales && comparisonScales.length > 0;

  return (
    <div>
      {title && (
        <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
          {title}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <ReferenceArea y1={80} y2={120} fill="var(--false-bg)" fillOpacity={0.5} />
          <ReferenceArea y1={65} y2={80} fill="var(--warn-bg)" fillOpacity={0.5} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--text-secondary)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            domain={[30, 120]}
            ticks={[30, 40, 50, 60, 65, 70, 80, 90, 100, 110, 120]}
            tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'var(--text-tertiary)' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={{ stroke: 'var(--border)' }}
            width={35}
          />
          <ReferenceLine y={65} stroke="var(--warn)" strokeDasharray="6 3" strokeWidth={1.5} />
          <ReferenceLine y={80} stroke="var(--false-color)" strokeDasharray="6 3" strokeWidth={1.5} />
          <ReferenceLine y={50} stroke="var(--text-tertiary)" strokeDasharray="3 3" strokeWidth={0.5} />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
            }}
            formatter={(value: unknown, name: string) => {
              const label = name === 'prevTScore' ? 'Previous' : 'Current';
              return [`T = ${value}`, label];
            }}
            labelFormatter={(label: unknown) => String(label)}
          />
          {hasComparison && (
            <Line
              type="monotone"
              dataKey="prevTScore"
              stroke="var(--text-tertiary)"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={{ r: 3, fill: 'var(--text-tertiary)', stroke: 'var(--surface)', strokeWidth: 1 }}
              activeDot={{ r: 5, fill: 'var(--text-tertiary)', stroke: 'var(--surface)', strokeWidth: 2 }}
              connectNulls
            />
          )}
          <Line
            type="monotone"
            dataKey="tScore"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 5, fill: 'var(--accent)', stroke: 'var(--surface)', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: 'var(--accent)', stroke: 'var(--surface)', strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      {hasComparison && (
        <div className="comparison-legend">
          <div className="comparison-legend-item">
            <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="var(--accent)" strokeWidth="2" /></svg>
            Current
          </div>
          <div className="comparison-legend-item">
            <svg width="20" height="2"><line x1="0" y1="1" x2="20" y2="1" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
            Previous
          </div>
        </div>
      )}
    </div>
  );
}
