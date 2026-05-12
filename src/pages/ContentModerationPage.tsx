import { useMemo, useState } from 'react';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import {
	useModerationAction,
	useModerationEvents,
	useModerationMetrics,
	useModerationItems,
	type ModerationItem,
} from '../hooks/api/useContentModerationApi';
import {
	AI_REVIEW_STATUSES,
	formatOptionalDate,
	getModerationQueueLabel,
	isSuperAdminFromToken,
	parseModerationFlags,
	type AiReviewStatus,
	type ContentApprovalStatus,
	type ModeratedContentType,
} from '../utils/contentModeration';
import './ContentModerationPage.scss';

const APPROVAL_FILTERS: Array<ContentApprovalStatus | ''> = [
	'PendingApproval',
	'Approved',
	'Rejected',
	'Removed',
	'',
];

const CONTENT_TYPES: Array<ModeratedContentType | ''> = ['Album', 'Blog', 'Reel', ''];

export function ContentModerationPage() {
	const { token } = useAuth();
	const isSuperAdmin = useMemo(() => isSuperAdminFromToken(token), [token]);
	const [contentType, setContentType] = useState<ModeratedContentType | ''>('');
	const [approvalStatus, setApprovalStatus] = useState<ContentApprovalStatus | ''>(
		'PendingApproval'
	);
	const [aiReviewStatus, setAiReviewStatus] = useState<AiReviewStatus | ''>('');
	const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
	const [reasonByItem, setReasonByItem] = useState<Record<string, string>>({});

	const filters = {
		contentType: contentType || undefined,
		approvalStatus: approvalStatus || undefined,
		aiReviewStatus: aiReviewStatus || undefined,
	};
	const { data, isLoading, error } = useModerationItems(filters, isSuperAdmin);
	const { data: metrics } = useModerationMetrics(isSuperAdmin);
	const { data: events, isLoading: eventsLoading } = useModerationEvents(selectedItem);
	const action = useModerationAction();

	if (!isSuperAdmin) {
		return (
			<div className="content-moderation-page">
				<Alert variant="warning">
					Content moderation is restricted to SUPER_ADMIN users in this phase.
				</Alert>
			</div>
		);
	}

	const runAction = (item: ModerationItem, actionName: 'approve' | 'reject' | 'remove') => {
		const key = `${item.contentType}:${item.contentId}`;
		action.mutate({
			item,
			action: actionName,
			decision: { reason: reasonByItem[key] || `${actionName} from moderation queue` },
		});
	};

	return (
		<div className="content-moderation-page">
			<div className="content-moderation-page__header">
				<div>
					<h1>Moderation</h1>
					<p>User-created albums, blogs and reels awaiting review.</p>
				</div>
				<div className="content-moderation-page__filters">
					<Form.Select
						aria-label="Content type"
						value={contentType}
						onChange={(event) => setContentType(event.target.value as ModeratedContentType | '')}
					>
						{CONTENT_TYPES.map((value) => (
							<option key={value || 'all'} value={value}>
								{value || 'All content'}
							</option>
						))}
					</Form.Select>
					<Form.Select
						aria-label="Approval status"
						value={approvalStatus}
						onChange={(event) =>
							setApprovalStatus(event.target.value as ContentApprovalStatus | '')
						}
					>
						{APPROVAL_FILTERS.map((value) => (
							<option key={value || 'all'} value={value}>
								{value ? value.replace(/([a-z])([A-Z])/g, '$1 $2') : 'All statuses'}
							</option>
						))}
					</Form.Select>
					<Form.Select
						aria-label="AI review status"
						value={aiReviewStatus}
						onChange={(event) => setAiReviewStatus(event.target.value as AiReviewStatus | '')}
					>
						{AI_REVIEW_STATUSES.map((value) => (
							<option key={value || 'all'} value={value}>
								{value ? value.replace(/([a-z])([A-Z])/g, '$1 $2') : 'All AI states'}
							</option>
						))}
					</Form.Select>
				</div>
			</div>

			{metrics && (
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
				</div>
			)}

			{isLoading && <Spinner animation="border" />}
			{error && <Alert variant="danger">Failed to load moderation queue.</Alert>}

			<Table responsive hover className="content-moderation-page__table">
				<thead>
					<tr>
						<th>Type</th>
						<th>Title</th>
						<th>Face</th>
						<th>Author</th>
						<th>Status</th>
						<th>AI</th>
						<th>Reason</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{(data ?? []).map((item) => {
						const key = `${item.contentType}:${item.contentId}`;
						return (
							<tr key={key}>
								<td>{item.contentType}</td>
								<td>{item.title}</td>
								<td>{item.faceTitle || item.faceId}</td>
								<td>{item.creatorName.trim() || item.creatorId}</td>
								<td>{getModerationQueueLabel(item.approvalStatus, item.aiReviewStatus)}</td>
								<td>
									{item.aiReviewStatus}
									{item.aiReviewConfidence != null &&
										` (${Math.round(item.aiReviewConfidence * 100)}%)`}
									{parseModerationFlags(item.aiReviewFlagsJson).length > 0 &&
										` - ${parseModerationFlags(item.aiReviewFlagsJson).join(', ')}`}
								</td>
								<td>
									<Form.Control
										size="sm"
										value={reasonByItem[key] ?? ''}
										placeholder="Required for reject/remove and overrides"
										onChange={(event) =>
											setReasonByItem((prev) => ({ ...prev, [key]: event.target.value }))
										}
									/>
								</td>
								<td className="content-moderation-page__actions">
									<Button
										size="sm"
										variant="outline-secondary"
										onClick={() => setSelectedItem(item)}
									>
										Details
									</Button>
									<Button size="sm" variant="success" onClick={() => runAction(item, 'approve')}>
										Approve
									</Button>
									<Button size="sm" variant="warning" onClick={() => runAction(item, 'reject')}>
										Reject
									</Button>
									<Button size="sm" variant="danger" onClick={() => runAction(item, 'remove')}>
										Remove
									</Button>
								</td>
							</tr>
						);
					})}
					{!isLoading && (data ?? []).length === 0 && (
						<tr>
							<td colSpan={8}>No moderation items match the selected filters.</td>
						</tr>
					)}
				</tbody>
			</Table>

			{selectedItem && (
				<section className="content-moderation-page__detail" aria-label="Moderation detail">
					<div className="content-moderation-page__detail-header">
						<div>
							<h2>
								{selectedItem.contentType}: {selectedItem.title}
							</h2>
							<p>
								Submitted {formatOptionalDate(selectedItem.submittedAtUtc)} by{' '}
								{selectedItem.creatorName.trim() || selectedItem.creatorId}
							</p>
						</div>
						<Button variant="outline-secondary" size="sm" onClick={() => setSelectedItem(null)}>
							Close
						</Button>
					</div>
					<div className="content-moderation-page__detail-grid">
						<div>
							<h3>AI recommendation</h3>
							<p>Status: {selectedItem.aiReviewStatus}</p>
							<p>Decision: {selectedItem.aiReviewDecision}</p>
							<p>Risk: {selectedItem.aiReviewRiskLevel}</p>
							<p>
								Flags: {parseModerationFlags(selectedItem.aiReviewFlagsJson).join(', ') || 'None'}
							</p>
							<p>Reason: {selectedItem.aiReviewReason || 'No AI reason yet.'}</p>
							<p>User message: {selectedItem.aiReviewUserMessage || 'Not set'}</p>
							<p>Model: {selectedItem.aiReviewModelVersion || 'Not set'}</p>
							<p>Trace: {selectedItem.aiReviewTraceId || 'Not set'}</p>
						</div>
						<div>
							<h3>Human moderation</h3>
							<p>Status: {selectedItem.approvalStatus}</p>
							<p>Reviewed: {formatOptionalDate(selectedItem.humanReviewedAtUtc)}</p>
							<p>Decision reason: {selectedItem.humanDecisionReason || 'Not set'}</p>
							<p>Removed: {formatOptionalDate(selectedItem.removedAtUtc)}</p>
							<p>Removal reason: {selectedItem.removalReason || 'Not set'}</p>
						</div>
					</div>
					<h3>Audit history</h3>
					{eventsLoading && <Spinner animation="border" size="sm" />}
					<ul className="content-moderation-page__events">
						{(events ?? []).map((event) => (
							<li key={event.id}>
								<strong>{formatOptionalDate(event.createdAtUtc)}</strong> {event.actorType}:{' '}
								{event.oldApprovalStatus || '-'} / {event.oldAiReviewStatus || '-'} to{' '}
								{event.newApprovalStatus || '-'} / {event.newAiReviewStatus || '-'}
								{event.reason && <span> - {event.reason}</span>}
							</li>
						))}
						{!eventsLoading && (events ?? []).length === 0 && <li>No audit events yet.</li>}
					</ul>
				</section>
			)}
		</div>
	);
}
