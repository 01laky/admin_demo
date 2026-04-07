import { env } from '../../config/env';

async function authFetch(path: string, token: string, init?: RequestInit) {
  const res = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers as Record<string, string>),
    },
  });
  return res;
}

export interface AdminWallTicketRow {
  id: number;
  title: string;
  descriptionPreview: string;
  status: string;
  creatorId: string;
  creatorName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface AdminWallTicketListResponse {
  items: AdminWallTicketRow[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AdminWallTicketComment {
  id: number;
  content: string;
  userId: string;
  authorName: string;
  createdAt: string;
}

export interface AdminWallTicketDetail {
  id: number;
  title: string;
  description: string;
  status: string;
  creatorId: string;
  creatorName: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string | null;
  comments: AdminWallTicketComment[];
}

export async function adminListWallTickets(
  token: string,
  faceId: number,
  page = 1,
  pageSize = 20
): Promise<AdminWallTicketListResponse> {
  const res = await authFetch(
    `/api/admin/faces/${faceId}/wall-tickets?page=${page}&pageSize=${pageSize}`,
    token
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<AdminWallTicketListResponse>;
}

export async function adminGetWallTicket(
  token: string,
  faceId: number,
  ticketId: number
): Promise<AdminWallTicketDetail> {
  const res = await authFetch(`/api/admin/faces/${faceId}/wall-tickets/${ticketId}`, token);
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<AdminWallTicketDetail>;
}

export async function adminApproveWallTicket(token: string, faceId: number, ticketId: number): Promise<void> {
  const res = await authFetch(`/api/admin/faces/${faceId}/wall-tickets/${ticketId}/approve`, token, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function adminDenyWallTicket(token: string, faceId: number, ticketId: number): Promise<void> {
  const res = await authFetch(`/api/admin/faces/${faceId}/wall-tickets/${ticketId}/deny`, token, {
    method: 'POST',
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function adminDeleteWallTicket(token: string, faceId: number, ticketId: number): Promise<void> {
  const res = await authFetch(`/api/admin/faces/${faceId}/wall-tickets/${ticketId}`, token, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function adminDeleteWallTicketComment(
  token: string,
  faceId: number,
  ticketId: number,
  commentId: number
): Promise<void> {
  const res = await authFetch(
    `/api/admin/faces/${faceId}/wall-tickets/${ticketId}/comments/${commentId}`,
    token,
    { method: 'DELETE' }
  );
  if (!res.ok) throw new Error(await res.text());
}
