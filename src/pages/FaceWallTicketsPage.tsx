import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useLocalizedLink } from '../hooks/useLocalizedLink';
import { Button } from '../components/radix/Button';
import {
	adminListWallTickets,
	adminGetWallTicket,
	adminApproveWallTicket,
	adminDenyWallTicket,
	adminDeleteWallTicket,
	adminDeleteWallTicketComment,
	type AdminWallTicketRow,
	type AdminWallTicketDetail,
} from '../api/services/wallTicketsAdminApi';
import './FaceWallTicketsPage.scss';

export function FaceWallTicketsPage() {
	const { id } = useParams<{ id: string }>();
	const { t } = useTranslation('common');
	const navigate = useNavigate();
	const getLocalizedPath = useLocalizedLink();
	const { token } = useAuth();
	const faceId = id ? parseInt(id, 10) : 0;

	const [page, setPage] = useState(1);
	const [items, setItems] = useState<AdminWallTicketRow[]>([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState<AdminWallTicketDetail | null>(null);
	const [detailLoading, setDetailLoading] = useState(false);
	const [actionBusy, setActionBusy] = useState(false);

	const loadList = async () => {
		if (!faceId) return;
		if (!token) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const res = await adminListWallTickets(token, faceId, page, 20);
			setItems(res.items);
			setTotalPages(Math.max(1, res.totalPages));
		} catch (err) {
			toast.error(
				err instanceof Error && err.message ? err.message : t('pages.faceWallTickets.loadError')
			);
			setItems([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		void loadList();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- token/faceId/page only
	}, [token, faceId, page]);

	const openDetail = async (ticketId: number) => {
		if (!token) return;
		setDetailLoading(true);
		try {
			const d = await adminGetWallTicket(token, faceId, ticketId);
			setSelected(d);
		} catch (err) {
			toast.error(
				err instanceof Error && err.message ? err.message : t('pages.faceWallTickets.loadError')
			);
		} finally {
			setDetailLoading(false);
		}
	};

	const refreshAll = async () => {
		await loadList();
		if (selected) {
			try {
				if (!token) return;
				const d = await adminGetWallTicket(token, faceId, selected.id);
				setSelected(d);
			} catch {
				setSelected(null);
			}
		}
	};

	const act = async (fn: () => Promise<void>, okMsg: string) => {
		setActionBusy(true);
		try {
			await fn();
			toast.success(okMsg);
			await refreshAll();
		} catch (err) {
			toast.error(
				err instanceof Error && err.message ? err.message : t('pages.faceWallTickets.actionError')
			);
		} finally {
			setActionBusy(false);
		}
	};

	if (!faceId) {
		return (
			<Container className="face-wall-tickets-page py-4">
				{t('pages.faceWallTickets.badFace')}
			</Container>
		);
	}

	return (
		<Container className="face-wall-tickets-page py-4" fluid>
			<div className="face-wall-tickets-page__header">
				<Button variant="outline" onClick={() => navigate(getLocalizedPath(`/faces/${faceId}`))}>
					← {t('common.back')}
				</Button>
				<h1>{t('pages.faceWallTickets.title')}</h1>
			</div>

			{loading && <p>{t('pages.faceWallTickets.loading')}</p>}
			{!loading && (
				<div className="table-responsive">
					<table className="table table-sm table-striped align-middle">
						<thead>
							<tr>
								<th>{t('pages.faceWallTickets.colId')}</th>
								<th>{t('pages.faceWallTickets.colTitle')}</th>
								<th>{t('pages.faceWallTickets.colStatus')}</th>
								<th>{t('pages.faceWallTickets.colCreator')}</th>
								<th>{t('pages.faceWallTickets.colCounts')}</th>
								<th>{t('pages.faceWallTickets.colActions')}</th>
							</tr>
						</thead>
						<tbody>
							{items.map((row) => (
								<tr key={row.id}>
									<td>{row.id}</td>
									<td>
										<button
											type="button"
											className="btn btn-link btn-sm p-0"
											disabled={actionBusy || detailLoading}
											onClick={() => void openDetail(row.id)}
										>
											{row.title}
										</button>
									</td>
									<td>{row.status}</td>
									<td>{row.creatorName || row.creatorId}</td>
									<td>
										{row.likesCount} / {row.commentsCount}
									</td>
									<td className="face-wall-tickets-page__actions">
										{row.status === 'active' && (
											<>
												<Button
													variant="outline"
													disabled={actionBusy}
													onClick={() =>
														void act(
															() => adminApproveWallTicket(token!, faceId, row.id),
															t('pages.faceWallTickets.approved')
														)
													}
												>
													{t('pages.faceWallTickets.approve')}
												</Button>
												<Button
													variant="outline"
													disabled={actionBusy}
													onClick={() =>
														void act(
															() => adminDenyWallTicket(token!, faceId, row.id),
															t('pages.faceWallTickets.denied')
														)
													}
												>
													{t('pages.faceWallTickets.deny')}
												</Button>
											</>
										)}
										<Button
											variant="outline"
											className="text-danger"
											disabled={actionBusy}
											onClick={() => {
												if (!window.confirm(t('pages.faceWallTickets.confirmDeleteTicket'))) return;
												void act(
													() => adminDeleteWallTicket(token!, faceId, row.id),
													t('pages.faceWallTickets.deletedTicket')
												);
											}}
										>
											{t('pages.faceWallTickets.deleteTicket')}
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{totalPages > 1 && (
				<div className="face-wall-tickets-page__pager">
					<Button
						variant="outline"
						disabled={page <= 1 || actionBusy}
						onClick={() => setPage((p) => p - 1)}
					>
						{t('pages.faceWallTickets.prev')}
					</Button>
					<span>
						{page} / {totalPages}
					</span>
					<Button
						variant="outline"
						disabled={page >= totalPages || actionBusy}
						onClick={() => setPage((p) => p + 1)}
					>
						{t('pages.faceWallTickets.next')}
					</Button>
				</div>
			)}

			{detailLoading && <p>{t('pages.faceWallTickets.detailLoading')}</p>}

			{selected && (
				<div className="face-wall-tickets-page__detail card mt-4 p-3">
					<div className="d-flex justify-content-between align-items-start">
						<h2 className="h5">{selected.title}</h2>
						<Button variant="outline" disabled={actionBusy} onClick={() => setSelected(null)}>
							{t('pages.faceWallTickets.closeDetail')}
						</Button>
					</div>
					<p className="text-muted small mb-1">
						#{selected.id} · {selected.status} · {selected.creatorName}
					</p>
					<p className="face-wall-tickets-page__body">{selected.description}</p>
					<h3 className="h6 mt-3">{t('pages.faceWallTickets.comments')}</h3>
					<ul className="list-unstyled">
						{selected.comments.map((c) => (
							<li key={c.id} className="border-bottom py-2">
								<strong>{c.authorName}</strong>
								<span className="text-muted small ms-2">
									{new Date(c.createdAt).toLocaleString()}
								</span>
								<p className="mb-1">{c.content}</p>
								<Button
									variant="outline"
									className="text-danger"
									disabled={actionBusy}
									onClick={() => {
										if (!window.confirm(t('pages.faceWallTickets.confirmDeleteComment'))) return;
										void act(
											() => adminDeleteWallTicketComment(token!, faceId, selected.id, c.id),
											t('pages.faceWallTickets.deletedComment')
										);
									}}
								>
									{t('pages.faceWallTickets.deleteComment')}
								</Button>
							</li>
						))}
					</ul>
				</div>
			)}
		</Container>
	);
}
