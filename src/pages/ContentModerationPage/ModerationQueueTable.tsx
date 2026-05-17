import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
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
			<Card
				className="content-moderation-page__bulk shadow-sm"
				aria-label="Bulk moderation controls"
			>
				<Card.Body>
					<Form
						onSubmit={(e) => {
							e.preventDefault();
							onRunBulkAction();
						}}
					>
						<Row className="g-3 align-items-end">
							<Col xs={12} md="auto">
								<p className="mb-0 fw-semibold">{selectedKeys.length} selected</p>
							</Col>
							<Col xs={12} sm={6} md={3} lg={2}>
								<Form.Group controlId="moderation-bulk-action">
									<Form.Label>Bulk action</Form.Label>
									<Form.Select
										value={bulkActionName}
										onChange={(event) =>
											onBulkActionNameChange(event.target.value as BulkModerationAction)
										}
									>
										<option value="Approve">Approve</option>
										<option value="Reject">Reject</option>
										<option value="Remove">Remove</option>
										<option value="RequeueAiReview">Requeue AI review</option>
									</Form.Select>
								</Form.Group>
							</Col>
							<Col xs={12} md>
								<Form.Group controlId="moderation-bulk-reason">
									<Form.Label>Shared reason</Form.Label>
									<Form.Control
										placeholder="Reason for reject, remove, or override"
										value={bulkReason}
										onChange={(event) => onBulkReasonChange(event.target.value)}
									/>
								</Form.Group>
							</Col>
							<Col xs={12} sm={6} md="auto">
								<Button
									type="submit"
									variant="primary"
									className="w-100"
									disabled={selectedKeys.length === 0 || bulkActionPending}
								>
									Apply bulk action
								</Button>
							</Col>
							{bulkResultSummary && (
								<Col xs={12}>
									<p className="mb-0 text-muted small">{bulkResultSummary}</p>
								</Col>
							)}
						</Row>
					</Form>
				</Card.Body>
			</Card>

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
