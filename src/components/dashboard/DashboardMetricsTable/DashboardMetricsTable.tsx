import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'react-bootstrap';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AdminDashboardSummary } from '@/types/adminDashboardStats';
import { buildMetricTiles, metricScaleMax, wallStatusSlices } from './dashboardMetricTiles';
import { MetricTileChart } from './MetricTileChart';
import './DashboardMetricsTable.scss';

export interface DashboardMetricsTableProps {
	summary: AdminDashboardSummary | undefined;
}

const WALL_BAR_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

/**
 * Grid of metric tiles with varied mini charts (radial, bar, area, donut, progress).
 */
export function DashboardMetricsTable({ summary }: DashboardMetricsTableProps) {
	const { t } = useTranslation('common');

	const tiles = useMemo(() => (summary ? buildMetricTiles(summary) : []), [summary]);
	const scaleMax = useMemo(() => metricScaleMax(tiles.map((tile) => tile.value)), [tiles]);
	const wallSlices = useMemo(() => (summary ? wallStatusSlices(summary) : []), [summary]);

	if (!summary) {
		return <p className="dash-metrics__muted">{t('pages.dashboard.metrics.loading')}</p>;
	}

	return (
		<div className="dash-metrics">
			<h2 className="dash-metrics__title">{t('pages.dashboard.metrics.sectionTitle')}</h2>

			<Row className="g-3">
				{tiles.map((tile) => (
					<Col key={tile.id} xs={12} sm={6} md={4} xl={4}>
						<article
							className="dash-metric-tile"
							style={{ '--tile-accent': tile.accentColor } as React.CSSProperties}
						>
							<header className="dash-metric-tile__header">
								<h3 className="dash-metric-tile__label">
									{t(`pages.dashboard.metrics.rows.${tile.labelKey}`)}
								</h3>
								<p className="dash-metric-tile__value">{tile.value.toLocaleString()}</p>
							</header>
							<MetricTileChart
								kind={tile.chartKind}
								value={tile.value}
								scaleMax={scaleMax}
								accentColor={tile.accentColor}
								labelSeed={tile.id}
							/>
						</article>
					</Col>
				))}

				{wallSlices.length > 0 && (
					<Col xs={12} lg={6}>
						<article className="dash-metric-tile dash-metric-tile--wide">
							<header className="dash-metric-tile__header">
								<h3 className="dash-metric-tile__label">
									{t('pages.dashboard.metrics.wallByStatus')}
								</h3>
								<p className="dash-metric-tile__value dash-metric-tile__value--sub">
									{wallSlices.reduce((sum, row) => sum + row.count, 0).toLocaleString()} total
								</p>
							</header>
							<div className="dash-metric-tile__chart dash-metric-tile__chart--tall" aria-hidden>
								<ResponsiveContainer width="100%" height={160}>
									<BarChart
										data={wallSlices.map((row) => ({
											name: row.status,
											value: row.count,
										}))}
										layout="vertical"
										margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
									>
										<XAxis type="number" hide domain={[0, 'dataMax']} />
										<YAxis
											type="category"
											dataKey="name"
											width={72}
											tick={{ fontSize: 11, fill: '#64748b' }}
										/>
										<Tooltip />
										<Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={14}>
											{wallSlices.map((row, index) => (
												<Cell
													key={row.status}
													fill={WALL_BAR_COLORS[index % WALL_BAR_COLORS.length]}
												/>
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</article>
					</Col>
				)}
			</Row>
		</div>
	);
}
