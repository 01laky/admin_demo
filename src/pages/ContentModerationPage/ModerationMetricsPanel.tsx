import { Alert, Table } from 'react-bootstrap';
import {
	dashboardHasOperationalWarnings,
	shouldWarnAboutOldestPending,
} from '@/utils/contentModeration';
import type { useModerationMetrics } from '@/hooks/api/useContentModerationApi';

type MetricsData = NonNullable<ReturnType<typeof useModerationMetrics>['data']>;

interface ModerationMetricsPanelProps {
	metrics: MetricsData | undefined;
}

export function ModerationMetricsPanel({ metrics }: ModerationMetricsPanelProps) {
	if (!metrics) return null;

	return (
		<>
			{dashboardHasOperationalWarnings({
				oldestPendingAgeHours: metrics.oldestPendingAgeHours,
				aiFailedJobs: metrics.aiFailedJobs,
				alerts: metrics.alerts,
			}) && (
				<Alert variant="warning" className="content-moderation-page__ops-banner">
					Operational attention recommended: review oldest pending age, failed AI jobs, and
					structured alerts below.
				</Alert>
			)}

			<div className="content-moderation-page__metrics" aria-label="Moderation metrics">
				<div>
					<strong>{metrics.pendingSubmissions}</strong>
					<span>Pending</span>
				</div>
				<div>
					<strong>{metrics.aiQueuedJobs}</strong>
					<span>AI queued</span>
				</div>
				<div>
					<strong>{metrics.aiProcessingJobs}</strong>
					<span>AI processing</span>
				</div>
				<div>
					<strong>{metrics.aiFailedJobs}</strong>
					<span>AI failed</span>
				</div>
				<div
					className={
						shouldWarnAboutOldestPending(metrics.oldestPendingAgeHours) ? 'is-warning' : ''
					}
				>
					<strong>
						{metrics.oldestPendingAgeHours == null
							? '-'
							: `${Math.round(metrics.oldestPendingAgeHours)}h`}
					</strong>
					<span>Oldest pending</span>
				</div>
				<div>
					<strong>
						{metrics.averageReviewLatencyHours == null
							? '-'
							: `${metrics.averageReviewLatencyHours.toFixed(1)}h`}
					</strong>
					<span>Avg review latency</span>
				</div>
				<div>
					<strong>
						{metrics.p95ReviewLatencyHours == null
							? '-'
							: `${metrics.p95ReviewLatencyHours.toFixed(1)}h`}
					</strong>
					<span>P95 review latency</span>
				</div>
				<div>
					<strong>{metrics.needsHumanReviewCount}</strong>
					<span>Needs human review</span>
				</div>
				<div>
					<strong>{metrics.aiJobsLikelyTimeoutCount}</strong>
					<span>AI jobs (timeout-ish)</span>
				</div>
			</div>

			{(metrics.alerts?.length ?? 0) > 0 && (
				<section
					className="content-moderation-page__alerts"
					aria-label="Structured moderation alerts"
				>
					<h2 className="content-moderation-page__subsection-title">Alerts</h2>
					<ul>
						{(metrics.alerts ?? []).map((a) => (
							<li key={`${a.code}-${a.message}`}>
								<strong>{a.code}</strong> ({a.severity}): {a.message}
							</li>
						))}
					</ul>
				</section>
			)}

			{(metrics.topModerationFlags?.length ?? 0) > 0 && (
				<section className="content-moderation-page__breakdown" aria-label="Top moderation flags">
					<h2 className="content-moderation-page__subsection-title">Top flags (pending)</h2>
					<Table size="sm" bordered responsive>
						<thead>
							<tr>
								<th>Flag</th>
								<th>Count</th>
							</tr>
						</thead>
						<tbody>
							{metrics.topModerationFlags.map((row) => (
								<tr key={row.flag}>
									<td>{row.flag}</td>
									<td>{row.count}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</section>
			)}

			{(metrics.pendingSubmissionsByFace?.length ?? 0) > 0 && (
				<section className="content-moderation-page__breakdown" aria-label="Pending by face">
					<h2 className="content-moderation-page__subsection-title">Pending by face</h2>
					<Table size="sm" bordered responsive>
						<thead>
							<tr>
								<th>Face</th>
								<th>Pending</th>
							</tr>
						</thead>
						<tbody>
							{metrics.pendingSubmissionsByFace.map((row) => (
								<tr key={row.faceId}>
									<td>
										{row.faceTitle} (#{row.faceId})
									</td>
									<td>{row.pendingCount}</td>
								</tr>
							))}
						</tbody>
					</Table>
				</section>
			)}
		</>
	);
}
