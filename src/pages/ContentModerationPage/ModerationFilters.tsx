import { Form } from 'react-bootstrap';
import {
	AI_REVIEW_STATUSES,
	type AiReviewRiskLevel,
	type AiReviewStatus,
	type ContentApprovalStatus,
	type ModeratedContentType,
} from '@/utils/contentModeration';
import {
	APPROVAL_FILTERS,
	CONTENT_TYPES,
	RISK_FILTERS,
	type ModerationFilterSetters,
	type ModerationFilterState,
} from './moderationFiltersTypes';

interface ModerationFiltersProps extends ModerationFilterState, ModerationFilterSetters {}

export function ModerationFilters(props: ModerationFiltersProps) {
	const {
		contentType,
		setContentType,
		approvalStatus,
		setApprovalStatus,
		aiReviewStatus,
		setAiReviewStatus,
		riskLevel,
		setRiskLevel,
		authorId,
		setAuthorId,
		faceIdText,
		setFaceIdText,
		moderationVersionText,
		setModerationVersionText,
		flagContains,
		setFlagContains,
		minConfidenceText,
		setMinConfidenceText,
		maxConfidenceText,
		setMaxConfidenceText,
		submittedFromUtc,
		setSubmittedFromUtc,
		submittedToUtc,
		setSubmittedToUtc,
		reviewedByUserId,
		setReviewedByUserId,
		minQueueAgeHoursText,
		setMinQueueAgeHoursText,
	} = props;

	return (
		<div className="content-moderation-page__header-filters">
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
					onChange={(event) => setApprovalStatus(event.target.value as ContentApprovalStatus | '')}
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
				<Form.Select
					aria-label="AI risk level"
					value={riskLevel}
					onChange={(event) => setRiskLevel(event.target.value as AiReviewRiskLevel | '')}
				>
					{RISK_FILTERS.map((value) => (
						<option key={value || 'all'} value={value}>
							{value || 'All risks'}
						</option>
					))}
				</Form.Select>
				<Form.Control
					aria-label="Author id"
					placeholder="Author id"
					value={authorId}
					onChange={(event) => setAuthorId(event.target.value)}
				/>
			</div>
			<div className="content-moderation-page__filters content-moderation-page__filters--secondary">
				<Form.Control
					aria-label="Face id"
					placeholder="Face id"
					value={faceIdText}
					onChange={(event) => setFaceIdText(event.target.value)}
				/>
				<Form.Control
					aria-label="Moderation version"
					placeholder="Moderation version"
					value={moderationVersionText}
					onChange={(event) => setModerationVersionText(event.target.value)}
				/>
				<Form.Control
					aria-label="Flag contains"
					placeholder="Flag contains"
					value={flagContains}
					onChange={(event) => setFlagContains(event.target.value)}
				/>
				<Form.Control
					aria-label="Min AI confidence"
					placeholder="Min confidence (0–1)"
					value={minConfidenceText}
					onChange={(event) => setMinConfidenceText(event.target.value)}
				/>
				<Form.Control
					aria-label="Max AI confidence"
					placeholder="Max confidence (0–1)"
					value={maxConfidenceText}
					onChange={(event) => setMaxConfidenceText(event.target.value)}
				/>
				<Form.Control
					aria-label="Submitted from (UTC ISO)"
					placeholder="Submitted from (UTC ISO)"
					value={submittedFromUtc}
					onChange={(event) => setSubmittedFromUtc(event.target.value)}
				/>
				<Form.Control
					aria-label="Submitted to (UTC ISO)"
					placeholder="Submitted to (UTC ISO)"
					value={submittedToUtc}
					onChange={(event) => setSubmittedToUtc(event.target.value)}
				/>
				<Form.Control
					aria-label="Reviewed by user id"
					placeholder="Human reviewer user id"
					value={reviewedByUserId}
					onChange={(event) => setReviewedByUserId(event.target.value)}
				/>
				<Form.Control
					aria-label="Min queue age hours"
					placeholder="Min queue age (hours)"
					value={minQueueAgeHoursText}
					onChange={(event) => setMinQueueAgeHoursText(event.target.value)}
				/>
			</div>
		</div>
	);
}
