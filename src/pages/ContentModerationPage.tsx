import { useMemo, useState } from 'react';
import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import {
	useModerationAction,
	useModerationItems,
	type ModerationItem,
} from '../hooks/api/useContentModerationApi';
import {
	getModerationQueueLabel,
	isSuperAdminFromToken,
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
	const [reasonByItem, setReasonByItem] = useState<Record<string, string>>({});

	const filters = {
		contentType: contentType || undefined,
		approvalStatus: approvalStatus || undefined,
	};
	const { data, isLoading, error } = useModerationItems(filters, isSuperAdmin);
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
				</div>
			</div>

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
		</div>
	);
}
