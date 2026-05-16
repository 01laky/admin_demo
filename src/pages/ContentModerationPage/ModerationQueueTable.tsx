import { Alert, Button, Form, Spinner, Table } from 'react-bootstrap';
import type { ModerationItem } from '@/hooks/api/useContentModerationApi';
import {
	getModerationQueueLabel,
	parseModerationFlags,
	type BulkModerationAction,
} from '@/utils/contentModeration';

interface ModerationQueueTableProps {
	data: ModerationItem[] | undefined;
	isLoading: boolean;
	error: unknown;
	selectedKeys: string[];
	reasonByItem: Record<string, string>;
	bulkActionName: BulkModerationAction;
	bulkReason: string;
	bulkResultSummary: string | null;
	bulkActionPending: boolean;
	onReasonChange: (key: string, reason: string) => void;
	onToggleSelected: (item: ModerationItem) => void;
	onSelectItem: (item: ModerationItem) => void;
	onRunAction: (item: ModerationItem, actionName: 'approve' | 'reject' | 'remove') => void;
	onBulkActionNameChange: (action: BulkModerationAction) => void;
	onBulkReasonChange: (reason: string) => void;
	onRunBulkAction: () => void;
}

export function ModerationQueueTable({
	data,
	isLoading,
	error,
	selectedKeys,
	reasonByItem,
	bulkActionName,
	bulkReason,
	bulkResultSummary,
	bulkActionPending,
	onReasonChange,
	onToggleSelected,
	onSelectItem,
	onRunAction,
	onBulkActionNameChange,
	onBulkReasonChange,
	onRunBulkAction,
}: ModerationQueueTableProps) {
	return (
		<>
			<div className="content-moderation-page__bulk" aria-label="Bulk moderation controls">
				<strong>{selectedKeys.length} selected</strong>
				<Form.Select
					aria-label="Bulk action"
					value={bulkActionName}
					onChange={(event) => onBulkActionNameChange(event.target.value as BulkModerationAction)}
				>
					<option value="Approve">Approve</option>
					<option value="Reject">Reject</option>
					<option value="Remove">Remove</option>
					<option value="RequeueAiReview">Requeue AI review</option>
				</Form.Select>
				<Form.Control
					aria-label="Bulk reason"
					placeholder="Shared reason for reject/remove/override"
					value={bulkReason}
					onChange={(event) => onBulkReasonChange(event.target.value)}
				/>
				<Button
					variant="primary"
					disabled={selectedKeys.length === 0 || bulkActionPending}
					onClick={onRunBulkAction}
				>
					Apply bulk action
				</Button>
				{bulkResultSummary && <span>{bulkResultSummary}</span>}
			</div>

			{isLoading && <Spinner animation="border" />}
			{error && <Alert variant="danger">Failed to load moderation queue.</Alert>}

			<Table responsive hover className="content-moderation-page__table">
				<thead>
					<tr>
						<th>Select</th>
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
								<td>
									<Form.Check
										aria-label={`Select ${item.contentType} ${item.contentId}`}
										checked={selectedKeys.includes(key)}
										onChange={() => onToggleSelected(item)}
									/>
								</td>
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
										onChange={(event) => onReasonChange(key, event.target.value)}
									/>
								</td>
								<td className="content-moderation-page__actions">
									<Button size="sm" variant="outline-secondary" onClick={() => onSelectItem(item)}>
										Details
									</Button>
									<Button size="sm" variant="success" onClick={() => onRunAction(item, 'approve')}>
										Approve
									</Button>
									<Button size="sm" variant="warning" onClick={() => onRunAction(item, 'reject')}>
										Reject
									</Button>
									<Button size="sm" variant="danger" onClick={() => onRunAction(item, 'remove')}>
										Remove
									</Button>
								</td>
							</tr>
						);
					})}
					{!isLoading && (data ?? []).length === 0 && (
						<tr>
							<td colSpan={9}>No moderation items match the selected filters.</td>
						</tr>
					)}
				</tbody>
			</Table>
		</>
	);
}
