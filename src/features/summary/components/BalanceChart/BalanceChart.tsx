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
  ChartInner,
  ChartSvgWrap,
  ChartTitle,
  ChartTooltip,
} from "./BalanceChart.styled";

interface BalanceChartProps {
  points: BalancePoint[];
  embedded?: boolean;
}

const CHART = {
  width: 640,
  height: 200,
  padX: 8,
  padY: 16,
  padBottom: 28,
} as const;

function pointX(index: number, count: number): number {
  const innerW = CHART.width - CHART.padX * 2;
  return CHART.padX + (index / Math.max(count - 1, 1)) * innerW;
}

function pointY(balance: number, minY: number, maxY: number): number {
  const innerH = CHART.height - CHART.padY - CHART.padBottom;
  const rangeY = maxY - minY || 1;
  return CHART.padY + innerH - ((balance - minY) / rangeY) * innerH;
}

function buildPath(points: BalancePoint[], minY: number, maxY: number): string {
  return points
    .map((point, index) => {
      const x = pointX(index, points.length);
      const y = pointY(point.balance, minY, maxY);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function buildAreaPath(points: BalancePoint[], minY: number, maxY: number): string {
  const line = buildPath(points, minY, maxY);
  const lastX = CHART.width - CHART.padX;
  const baseY = CHART.height - CHART.padBottom;
  return `${line} L ${lastX.toFixed(2)} ${baseY} L ${CHART.padX} ${baseY} Z`;
}

function pickAxisLabelIndices(count: number, maxLabels = 5): number[] {
  if (count <= 1) return [0];
  const labelCount = Math.min(maxLabels, count);
  return Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / Math.max(labelCount - 1, 1)) * (count - 1))
  );
}

const BalanceChart = ({ points, embedded = false }: BalanceChartProps) => {
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
      axisIndices: pickAxisLabelIndices(points.length),
    };
  }, [points]);

  if (!chartData || points.length < 2) {
    return (
      <ChartCard $embedded={embedded}>
        <ChartEmpty>Недостаточно данных для графика. Сделайте несколько ставок.</ChartEmpty>
      </ChartCard>
    );
  }

  const activeIndex = hoverIndex ?? points.length - 1;
  const activePoint = points[activeIndex];
  const isHovering = hoverIndex !== null;
  const baseY = CHART.height - CHART.padBottom;
  const rangeStart = points.find((point) => point.label !== "Старт") ?? points[0];

  const chartContent = (
    <>
      <ChartHeader>
        <ChartTitle>{isHovering ? "Баланс на день" : "Текущий баланс"}</ChartTitle>
        <ChartCurrent $positive={(isHovering ? activePoint.balance : chartData.current) >= 0}>
          {formatMoney(isHovering ? activePoint.balance : chartData.current)}
        </ChartCurrent>
      </ChartHeader>

      <ChartSvgWrap
        onMouseLeave={() => setHoverIndex(null)}
        onTouchEnd={() => setHoverIndex(null)}
      >
        <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} role="img" aria-label="График баланса по дням">
          <defs>
            <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(102, 187, 106, 0.28)" />
              <stop offset="100%" stopColor="rgba(102, 187, 106, 0)" />
            </linearGradient>
          </defs>

          <line
            x1={CHART.padX}
            x2={CHART.width - CHART.padX}
            y1={baseY}
            y2={baseY}
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

          {chartData.axisIndices.map((index) => {
            const x = pointX(index, points.length);
            return (
              <g key={`tick-${index}`}>
                <line
                  x1={x}
                  x2={x}
                  y1={baseY}
                  y2={baseY + 4}
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={CHART.height - 6}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.38)"
                  fontSize="9"
                  fontWeight="500"
                >
                  {formatIsoDateDots(points[index].date).slice(0, 5)}
                </text>
              </g>
            );
          })}

          {points.map((point, index) => {
            const x = pointX(index, points.length);
            const y = pointY(point.balance, chartData.minY, chartData.maxY);
            const isActive = index === activeIndex;

            return (
              <circle
                key={`${point.date}-${index}`}
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
        {activePoint.label === "Старт"
          ? `Старт · ${formatMoney(activePoint.balance)}`
          : `${formatIsoDateDots(activePoint.date)} · ${formatMoney(activePoint.balance)}`}
      </ChartTooltip>

      <ChartFooter>
        <span>{formatIsoDateDots(rangeStart.date)}</span>
        <span>{formatIsoDateDots(points[points.length - 1].date)}</span>
      </ChartFooter>
    </>
  );

  return (
    <ChartCard $embedded={embedded}>
      {embedded ? <ChartInner>{chartContent}</ChartInner> : chartContent}
    </ChartCard>
  );
};

export default BalanceChart;
