/**
 * SHV2 PI-8: renders untrusted moderation fields as plain text only (no HTML interpretation).
 */
interface ModerationPlainTextPreviewProps {
	label: string;
	value: string;
	className?: string;
}

export function ModerationPlainTextPreview({
	label,
	value,
	className = 'content-moderation-page__plain-preview',
}: ModerationPlainTextPreviewProps) {
	return (
		<div className={className}>
			<h4>{label}</h4>
			<pre className="content-moderation-page__plain-preview-text">{value}</pre>
		</div>
	);
}
