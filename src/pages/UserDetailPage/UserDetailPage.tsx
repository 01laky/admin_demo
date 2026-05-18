import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
	useOperatorUserDetail,
	useFaceRoles,
	useOperatorUserMutations,
} from '@/hooks/api/useOperatorUsersApi';
import { Button } from '@/components/radix/Button';
import { useLocalizedLink } from '@/hooks/useLocalizedLink';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import {
	canSubmitFaceBan,
	canSubmitGlobalBan,
	getFaceStatusI18nKey,
} from '@/utils/operatorUserDetailUi';
import './UserDetailPage.scss';

function mutationErrorMessage(error: unknown): string {
	if (error instanceof Error && error.message) return error.message;
	return 'Request failed';
}

export function UserDetailPage() {
	const { id } = useParams<{ id: string }>();
	const userId = id ?? '';
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const getLocalizedPath = useLocalizedLink();
	const { confirm, ConfirmModalHost } = useConfirmModal();

	const { data: user, isLoading, error } = useOperatorUserDetail(userId);
	const { data: faceRoles = [] } = useFaceRoles();
	const { globalBan, globalUnban, faceBan, faceUnban, setFaceRole, sendMessage } =
		useOperatorUserMutations(userId);

	const [globalBanReason, setGlobalBanReason] = useState('');
	const [faceBanReasonById, setFaceBanReasonById] = useState<Record<number, string>>({});
	const [platformMessage, setPlatformMessage] = useState('');

	const handleGlobalBan = async () => {
		if (!canSubmitGlobalBan(globalBanReason)) {
			toast.error(t('pages.userDetail.banReasonInvalid'));
			return;
		}
		const ok = await confirm({
			title: t('pages.userDetail.confirmGlobalBanTitle'),
			message: t('pages.userDetail.confirmGlobalBanMessage'),
			confirmLabel: t('pages.userDetail.globalBan'),
			confirmVariant: 'danger',
		});
		if (!ok) return;
		try {
			await globalBan.mutateAsync(globalBanReason.trim());
			setGlobalBanReason('');
			toast.success(t('pages.userDetail.successGlobalBan'));
		} catch (e) {
			toast.error(mutationErrorMessage(e));
		}
	};

	const handleGlobalUnban = async () => {
		const ok = await confirm({
			title: t('pages.userDetail.confirmGlobalUnbanTitle'),
			message: t('pages.userDetail.confirmGlobalUnbanMessage'),
			confirmLabel: t('pages.userDetail.globalUnban'),
			confirmVariant: 'danger',
		});
		if (!ok) return;
		try {
			await globalUnban.mutateAsync();
			toast.success(t('pages.userDetail.successGlobalUnban'));
		} catch (e) {
			toast.error(mutationErrorMessage(e));
		}
	};

	const handleFaceBan = async (faceId: number) => {
		const reason = faceBanReasonById[faceId] ?? '';
		if (!canSubmitFaceBan(reason)) {
			toast.error(t('pages.userDetail.banReasonInvalid'));
			return;
		}
		const ok = await confirm({
			title: t('pages.userDetail.confirmFaceBanTitle'),
			message: t('pages.userDetail.confirmFaceBanMessage'),
			confirmLabel: t('pages.userDetail.faceBan'),
			confirmVariant: 'danger',
		});
		if (!ok) return;
		try {
			await faceBan.mutateAsync({ faceId, reason: reason.trim() });
			setFaceBanReasonById((prev) => {
				const next = { ...prev };
				delete next[faceId];
				return next;
			});
			toast.success(t('pages.userDetail.successFaceBan'));
		} catch (e) {
			toast.error(mutationErrorMessage(e));
		}
	};

	const handleFaceUnban = async (faceId: number) => {
		const ok = await confirm({
			title: t('pages.userDetail.confirmFaceUnbanTitle'),
			message: t('pages.userDetail.confirmFaceUnbanMessage'),
			confirmLabel: t('pages.userDetail.faceUnban'),
			confirmVariant: 'danger',
		});
		if (!ok) return;
		try {
			await faceUnban.mutateAsync(faceId);
			toast.success(t('pages.userDetail.successFaceUnban'));
		} catch (e) {
			toast.error(mutationErrorMessage(e));
		}
	};

	const handleRoleChange = async (faceId: number, userRoleId: number) => {
		try {
			await setFaceRole.mutateAsync({ faceId, userRoleId });
			toast.success(t('pages.userDetail.successRole'));
		} catch (e) {
			toast.error(mutationErrorMessage(e));
		}
	};

	const handleSendMessage = async () => {
		const content = platformMessage.trim();
		if (!content) return;
		try {
			await sendMessage.mutateAsync(content);
			setPlatformMessage('');
			toast.success(t('pages.userDetail.successMessage'));
		} catch (e) {
			toast.error(mutationErrorMessage(e));
		}
	};

	if (isLoading) {
		return (
			<div className="user-detail-page-wrapper" style={{ padding: '2rem' }}>
				<Container fluid>
					<div className="user-detail-loading">
						<p>{t('pages.userDetail.loading')}</p>
					</div>
				</Container>
			</div>
		);
	}

	if (error) {
		return (
			<div className="user-detail-page-wrapper" style={{ padding: '2rem' }}>
				<Container fluid>
					<div className="user-detail-error">
						<p>{t('pages.userDetail.error')}</p>
						<Button onClick={() => navigate(getLocalizedPath('/users'))}>{t('common.back')}</Button>
					</div>
				</Container>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="user-detail-page-wrapper" style={{ padding: '2rem' }}>
				<Container fluid>
					<div className="user-detail-not-found">
						<h2>{t('pages.userDetail.notFound')}</h2>
						<Button onClick={() => navigate(getLocalizedPath('/users'))}>{t('common.back')}</Button>
					</div>
				</Container>
			</div>
		);
	}

	return (
		<div className="user-detail-page-wrapper" style={{ padding: '2rem' }}>
			{ConfirmModalHost}
			<Container fluid>
				<div className="user-detail-content">
					<div className="user-detail-header">
						<Button
							variant="outline"
							onClick={() => navigate(getLocalizedPath('/users'))}
							className="back-button"
						>
							← {t('common.back')}
						</Button>
						<h1>{t('pages.userDetail.title')}</h1>
					</div>

					<div className="user-detail-card">
						<Row>
							<Col xs={12} md={6}>
								<div className="user-detail-field">
									<label>{t('pages.userDetail.id')}</label>
									<p>{user.id}</p>
								</div>
							</Col>
							<Col xs={12} md={6}>
								<div className="user-detail-field">
									<label>{t('pages.userDetail.email')}</label>
									<p>{user.email ?? '—'}</p>
								</div>
							</Col>
							<Col xs={12} md={6}>
								<div className="user-detail-field">
									<label>{t('pages.userDetail.firstName')}</label>
									<p>{user.firstName ?? '—'}</p>
								</div>
							</Col>
							<Col xs={12} md={6}>
								<div className="user-detail-field">
									<label>{t('pages.userDetail.lastName')}</label>
									<p>{user.lastName ?? '—'}</p>
								</div>
							</Col>
							<Col xs={12} md={6}>
								<div className="user-detail-field">
									<label>{t('pages.userDetail.createdAt')}</label>
									<p>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</p>
								</div>
							</Col>
							<Col xs={12} md={6}>
								<div className="user-detail-field">
									<label>{t('pages.userDetail.globalRole')}</label>
									<p>{user.globalRole.name}</p>
								</div>
							</Col>
						</Row>

						<div className="user-detail-badges">
							{user.badges.isGloballyBanned && (
								<span className="user-detail-badge user-detail-badge--danger">
									{t('pages.userDetail.badgeGlobalBan')}
								</span>
							)}
							{user.badges.activeFaceBanCount > 0 && (
								<span className="user-detail-badge user-detail-badge--warning">
									{t('pages.userDetail.badgeFaceBans', { count: user.badges.activeFaceBanCount })}
								</span>
							)}
							<span className="user-detail-badge">
								{user.badges.emailConfirmed
									? t('pages.userDetail.badgeEmailConfirmed')
									: t('pages.userDetail.badgeEmailUnconfirmed')}
							</span>
						</div>
					</div>

					<div className="user-detail-card">
						<h2 className="user-detail-section-title">{t('pages.userDetail.moderationTitle')}</h2>
						{user.badges.isGloballyBanned ? (
							<Button
								variant="outline"
								onClick={handleGlobalUnban}
								disabled={globalUnban.isPending}
							>
								{t('pages.userDetail.globalUnban')}
							</Button>
						) : (
							<div className="user-detail-moderation-block">
								<label htmlFor="global-ban-reason">{t('pages.userDetail.banReason')}</label>
								<textarea
									id="global-ban-reason"
									className="user-detail-textarea"
									value={globalBanReason}
									onChange={(e) => setGlobalBanReason(e.target.value)}
									placeholder={t('pages.userDetail.banReasonHint')}
									rows={3}
								/>
								<Button
									variant="outline"
									onClick={handleGlobalBan}
									disabled={globalBan.isPending || !canSubmitGlobalBan(globalBanReason)}
								>
									{t('pages.userDetail.globalBan')}
								</Button>
							</div>
						)}
					</div>

					<div className="user-detail-card">
						<h2 className="user-detail-section-title">{t('pages.userDetail.facesTitle')}</h2>
						<div className="user-detail-faces-table-wrapper">
							<table className="user-detail-faces-table">
								<thead>
									<tr>
										<th>{t('pages.userDetail.faceColumnTitle')}</th>
										<th>{t('pages.userDetail.faceColumnRole')}</th>
										<th>{t('pages.userDetail.faceColumnStatus')}</th>
										<th>{t('common.actions')}</th>
									</tr>
								</thead>
								<tbody>
									{user.faces.length === 0 ? (
										<tr>
											<td colSpan={4}>{t('pages.userDetail.noFaces')}</td>
										</tr>
									) : (
										user.faces.map((face) => (
											<tr key={face.faceId}>
												<td>
													<strong>{face.faceTitle}</strong>
													<div className="user-detail-face-index">{face.faceIndex}</div>
												</td>
												<td>
													<select
														className="user-detail-role-select"
														value={face.userRoleId}
														disabled={setFaceRole.isPending}
														onChange={(e) => handleRoleChange(face.faceId, Number(e.target.value))}
													>
														{faceRoles.map((role) => (
															<option key={role.id} value={role.id}>
																{role.name}
															</option>
														))}
													</select>
													<span className="user-detail-role-current">{face.roleName}</span>
												</td>
												<td>
													{(() => {
														const statusKey = getFaceStatusI18nKey(face);
														return statusKey ? (
															<span
																className={`user-detail-badge ${face.isFaceBanned ? 'user-detail-badge--danger' : 'user-detail-badge--ok'}`}
															>
																{t(statusKey)}
															</span>
														) : (
															'—'
														);
													})()}
												</td>
												<td>
													{face.isFaceBanned ? (
														<Button
															variant="outline"
															onClick={() => handleFaceUnban(face.faceId)}
															disabled={faceUnban.isPending}
														>
															{t('pages.userDetail.faceUnban')}
														</Button>
													) : (
														<div className="user-detail-face-ban-actions">
															<textarea
																className="user-detail-textarea user-detail-textarea--compact"
																value={faceBanReasonById[face.faceId] ?? ''}
																onChange={(e) =>
																	setFaceBanReasonById((prev) => ({
																		...prev,
																		[face.faceId]: e.target.value,
																	}))
																}
																placeholder={t('pages.userDetail.banReasonHint')}
																rows={2}
															/>
															<Button
																variant="outline"
																onClick={() => handleFaceBan(face.faceId)}
																disabled={
																	faceBan.isPending ||
																	!canSubmitFaceBan(faceBanReasonById[face.faceId])
																}
															>
																{t('pages.userDetail.faceBan')}
															</Button>
														</div>
													)}
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="user-detail-card">
						<h2 className="user-detail-section-title">
							{t('pages.userDetail.platformMessageTitle')}
						</h2>
						<p className="user-detail-hint">{t('pages.userDetail.platformMessageHint')}</p>
						<textarea
							className="user-detail-textarea"
							value={platformMessage}
							onChange={(e) => setPlatformMessage(e.target.value)}
							placeholder={t('pages.userDetail.platformMessagePlaceholder')}
							rows={4}
						/>
						<Button
							onClick={handleSendMessage}
							disabled={sendMessage.isPending || !platformMessage.trim()}
						>
							{t('pages.userDetail.sendMessage')}
						</Button>
					</div>
				</div>
			</Container>
		</div>
	);
}
