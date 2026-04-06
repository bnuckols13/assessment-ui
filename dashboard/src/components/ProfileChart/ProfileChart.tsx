import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine,
  ReferenceArea, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { ScaleResult, InconsistencyResult } from '../../lib/types';
import { tScoreColor } from '../../lib/clinical-utils';

interface ProfileChartProps {
  scales: (ScaleResult | InconsistencyResult)[];
  title?: string;
  height?: number;
}

export function ProfileChart({ scales, title, height = 280 }: ProfileChartProps) {
  const data = scales.map(s => ({
    name: s.code,
    tScore: s.tScore ?? undefined,
    fill: tScoreColor(s.tScore),
  }));

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
            formatter={(value: unknown) => [`T = ${value}`, '']}
            labelFormatter={(label: unknown) => String(label)}
          />
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
    </div>
  );
}
