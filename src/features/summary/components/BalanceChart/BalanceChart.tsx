import { useMemo, useState } from "react";
import type { BalancePoint } from "@/features/summary/lib/buildBalanceHistory";
import { formatIsoDateDots } from "@/shared/lib/date/isoDate";
import { formatMoney } from "@/shared/lib/format/money";
import {
  ChartCard,
  ChartCurrent,
  ChartEmpty,
  ChartFooter,
  ChartHeader,
  ChartSvgWrap,
  ChartTitle,
  ChartTooltip,
} from "./BalanceChart.styled";

interface BalanceChartProps {
  points: BalancePoint[];
}

const CHART = {
  width: 640,
  height: 200,
  padX: 8,
  padY: 16,
} as const;

function buildPath(points: BalancePoint[], minY: number, maxY: number): string {
  const { width, height, padX, padY } = CHART;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const rangeY = maxY - minY || 1;

  return points
    .map((point, index) => {
      const x = padX + (index / Math.max(points.length - 1, 1)) * innerW;
      const y = padY + innerH - ((point.balance - minY) / rangeY) * innerH;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(points: BalancePoint[], minY: number, maxY: number): string {
  const line = buildPath(points, minY, maxY);
  const { height, padY } = CHART;
  const lastX = CHART.width - CHART.padX;
  const baseY = height - padY;
  return `${line} L ${lastX.toFixed(2)} ${baseY} L ${CHART.padX} ${baseY} Z`;
}

const BalanceChart = ({ points }: BalanceChartProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (points.length === 0) return null;

    const balances = points.map((p) => p.balance);
    const min = Math.min(...balances);
    const max = Math.max(...balances);
    const padding = Math.max((max - min) * 0.12, 500);
    const minY = min - padding;
    const maxY = max + padding;

    return {
      minY,
      maxY,
      linePath: buildPath(points, minY, maxY),
      areaPath: buildAreaPath(points, minY, maxY),
      current: points[points.length - 1].balance,
    };
  }, [points]);

  if (!chartData || points.length < 2) {
    return (
      <ChartCard>
        <ChartEmpty>Недостаточно данных для графика. Сделайте несколько ставок.</ChartEmpty>
      </ChartCard>
    );
  }

  const activeIndex = hoverIndex ?? points.length - 1;
  const activePoint = points[activeIndex];

  return (
    <ChartCard>
      <ChartHeader>
        <ChartTitle>Баланс</ChartTitle>
        <ChartCurrent $positive={chartData.current >= 0}>
          {formatMoney(chartData.current)}
        </ChartCurrent>
      </ChartHeader>

      <ChartSvgWrap
        onMouseLeave={() => setHoverIndex(null)}
        onTouchEnd={() => setHoverIndex(null)}
      >
        <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} role="img" aria-label="График баланса">
          <defs>
            <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(102, 187, 106, 0.28)" />
              <stop offset="100%" stopColor="rgba(102, 187, 106, 0)" />
            </linearGradient>
          </defs>

          <line
            x1={CHART.padX}
            x2={CHART.width - CHART.padX}
            y1={CHART.height - CHART.padY}
            y2={CHART.height - CHART.padY}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />

          <path d={chartData.areaPath} fill="url(#balanceArea)" />
          <path
            d={chartData.linePath}
            fill="none"
            stroke="#66bb6a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((point, index) => {
            const innerW = CHART.width - CHART.padX * 2;
            const innerH = CHART.height - CHART.padY * 2;
            const rangeY = chartData.maxY - chartData.minY || 1;
            const x = CHART.padX + (index / Math.max(points.length - 1, 1)) * innerW;
            const y =
              CHART.padY + innerH - ((point.balance - chartData.minY) / rangeY) * innerH;
            const isActive = index === activeIndex;

            return (
              <circle
                key={`${point.label}-${index}`}
                cx={x}
                cy={y}
                r={isActive ? 5 : 3}
                fill={isActive ? "#a5d6a7" : "#66bb6a"}
                stroke={isActive ? "rgba(255,255,255,0.9)" : "transparent"}
                strokeWidth="1.5"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverIndex(index)}
                onFocus={() => setHoverIndex(index)}
                onTouchStart={() => setHoverIndex(index)}
              >
                <title>
                  {point.label}: {formatMoney(point.balance)}
                </title>
              </circle>
            );
          })}
        </svg>
      </ChartSvgWrap>

      <ChartTooltip>
        {activePoint.label} · {formatMoney(activePoint.balance)}
      </ChartTooltip>

      <ChartFooter>
        <span>{formatIsoDateDots(points[0].date)}</span>
        <span>{formatIsoDateDots(points[points.length - 1].date)}</span>
      </ChartFooter>
    </ChartCard>
  );
};

export default BalanceChart;
