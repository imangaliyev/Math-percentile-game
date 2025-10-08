import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

interface ScoreHistogramProps {
  allScores: number[];
  userScore: number;
}

const ScoreHistogram: React.FC<ScoreHistogramProps> = ({ allScores, userScore }) => {
  // Create bins for the histogram (0-10, 11-20, ..., 91-100)
  const binCount = 10;
  const binSize = 10;
  const bins = Array.from({ length: binCount }, (_, i) => ({
    range: `${i * binSize + 1}-${(i + 1) * binSize}`,
    midpoint: i * binSize + (binSize / 2),
    count: 0,
  }));

  allScores.forEach(score => {
    const scoreToBin = Math.max(1, Math.min(100, score));
    const binIndex = Math.floor((scoreToBin - 1) / binSize);
    if (bins[binIndex]) {
      bins[binIndex].count++;
    }
  });

  // A custom Tooltip component for better UX
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // `label` is the midpoint, find the corresponding bin to show the range
      const binData = bins.find(b => b.midpoint === label);
      if (!binData) return null;

      return (
        <div className="p-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg">
          <p className="font-bold text-cyan-400">{`Score Range: ${binData.range}`}</p>
          <p className="text-white">{`Players: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={bins}
          margin={{
            top: 30, // Margin for the "You" label
            right: 15,
            left: -15,
            bottom: 5,
          }}
        >
          <XAxis
            type="number"
            dataKey="midpoint"
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            stroke="#9ca3af"
            tick={{ fill: '#d1d5db', fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            stroke="#9ca3af"
            tick={{ fill: '#d1d5db', fontSize: 12 }}
            width={40}
          />
          <Tooltip
            cursor={{ fill: 'rgba(107, 114, 128, 0.3)' }}
            content={<CustomTooltip />}
          />
          <Bar
            dataKey="count"
            fill="#22d3ee"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          {userScore > 0 && (
            <ReferenceLine
              x={userScore}
              stroke="#f59e0b"
              strokeWidth={3}
              ifOverflow="visible"
            >
              <Label value="You" position="top" fill="#f59e0b" fontSize={14} fontWeight="bold" />
            </ReferenceLine>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreHistogram;
