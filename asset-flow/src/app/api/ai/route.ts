import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma-safe";

function normalizeStatusKeyword(k: string) {
  const s = k.toLowerCase();
  if (s.includes('pending')) return 'PENDING';
  if (s.includes('approved')) return 'APPROVED';
  if (s.includes('completed') || s.includes('done')) return 'COMPLETED';
  if (s.includes('available')) return 'ACTIVE';
  if (s.includes('allocated') || s.includes('assigned')) return 'ALLOCATED';
  if (s.includes('maintenance') || s.includes('repair')) return 'MAINTENANCE';
  if (s.includes('reserved')) return 'RESERVED';
  if (s.includes('lost') || s.includes('retire')) return 'LOST_RETIRED';
  return '';
}

async function detectEntity(q: string, prisma: any) {
  const lower = q.toLowerCase();
  // obvious keywords
  if (lower.includes('booking') || lower.includes('reservation')) return { entity: 'booking' };
  if (lower.includes('asset') || lower.includes('device') || lower.includes('equipment')) return { entity: 'asset' };
  if (lower.includes('maintenance') || lower.includes('request') || lower.includes('repair')) return { entity: 'maintenanceRequest' };
  if (lower.includes('employee') || lower.includes('staff') || lower.includes('user')) return { entity: 'user' };
  if (lower.includes('notification') || lower.includes('alert')) return { entity: 'notification' };
  // department / organization synonyms
  if (lower.includes('department') || lower.includes('team') || lower.includes('organization') || lower.includes('organisation') || lower.includes('org') || lower.includes('company')) return { entity: 'department' };

  // try to match by department name (fuzzy-ish: substring match)
  try {
    const depts = await prisma.department.findMany({ select: { id: true, name: true } });
    for (const d of depts) {
      const nameLower = (d.name || '').toLowerCase();
      if (!nameLower) continue;
      if (lower.includes(nameLower) || nameLower.split(/\s+/).every((tok: string) => lower.includes(tok))) {
        return { entity: 'department', departmentId: d.id, departmentName: d.name };
      }
    }
  } catch (e) {
    // ignore; DB might not be available for detection
  }

  return { entity: '' };
}

export async function POST(request: Request) {
  const prisma = getPrismaClient();
  try {
    const { q } = await request.json().catch(() => ({ q: "" }));

    const totalAssets = await prisma.asset.count();
    const available = await prisma.asset.count({ where: { status: "ACTIVE" } });
    const allocated = await prisma.asset.count({ where: { status: "ALLOCATED" } });
    const maintenance = await prisma.asset.count({ where: { status: "MAINTENANCE" } });
    const lostRetired = await prisma.asset.count({ where: { status: { in: ["LOST", "RETIRED"] } } });
    const totalEmployees = await prisma.user.count();
    const departments = await prisma.department.count();
    const categories = await prisma.assetCategory.count();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todaysBookings = await prisma.booking.count({ where: { startAt: { gte: today, lt: tomorrow } } });
    const pendingMaintenance = await prisma.maintenanceRequest.count({ where: { status: "REQUESTED" } });
    const notifications = await prisma.notification.count({ where: { read: false } });

    const stats = { totalAssets, available, allocated, maintenance, lostRetired, totalEmployees, departments, categories, todaysBookings, pendingMaintenance, notifications };

    // Try to answer more dynamically: detect entity/status intents
    const lower = (q || '').toLowerCase();
    const entityInfo = await detectEntity(lower, prisma);
    const entity = entityInfo?.entity;
    const statusKeywordMatch = lower.match(/(pending|approved|completed|available|allocated|reserved|lost|retire|maintenance|repair|assigned)/i);
    const status = statusKeywordMatch ? normalizeStatusKeyword(statusKeywordMatch[0]) : '';

    if (entity) {
      const allowedBooking = new Set(['PENDING','APPROVED','COMPLETED','CANCELLED']);
      const allowedAsset = new Set(['ACTIVE','ALLOCATED','MAINTENANCE','RESERVED','LOST','RETIRED']);
      const allowedMaintenance = new Set(['REQUESTED','IN_PROGRESS','COMPLETED','CANCELLED']);
      // Handle special case: LOST_RETIRED maps to either LOST or RETIRED
      if (entity === 'asset' && status === 'LOST_RETIRED') {
        const count = await prisma.asset.count({ where: { status: { in: ['LOST', 'RETIRED'] } } });
        const reply = `⚠️ There are **${count} assets** marked as lost or retired.`;
        console.log('[api/ai] q=', q, 'reply=', reply);
        return NextResponse.json({ success: true, reply });
      }

      if (entity === 'booking') {
        if (status && allowedBooking.has(status)) {
          const count = await prisma.booking.count({ where: { status } as any });
          const reply = `📅 **${count} ${status.toLowerCase()} bookings**.`;
          console.log('[api/ai] q=', q, 'reply=', reply);
          return NextResponse.json({ success: true, reply });
        }
      }

      if (entity === 'asset') {
        if (status) {
          if (status === 'ACTIVE') {
            const count = await prisma.asset.count({ where: { status: 'ACTIVE' } });
            const reply = `✅ **${count} assets** are available.`;
            console.log('[api/ai] q=', q, 'reply=', reply);
            return NextResponse.json({ success: true, reply });
          }
          if (status === 'MAINTENANCE') {
            const count = await prisma.asset.count({ where: { status: 'MAINTENANCE' } });
            const reply = `🔧 **${count} assets** are under maintenance.`;
            console.log('[api/ai] q=', q, 'reply=', reply);
            return NextResponse.json({ success: true, reply });
          }
          if (status === 'ALLOCATED') {
            const where: any = { status: 'ALLOCATED' };
            // if department was detected, filter by department
            if (entityInfo?.departmentId) where.departmentId = entityInfo.departmentId;
            const count = await prisma.asset.count({ where });
            const reply = `👥 **${count} assets** are currently allocated.`;
            console.log('[api/ai] q=', q, 'reply=', reply);
            return NextResponse.json({ success: true, reply });
          }
          // if status not in allowedAsset, fallthrough to generic reply
        }
      }

      if (entity === 'maintenanceRequest') {
        if (status && allowedMaintenance.has(status)) {
          const map: any = { PENDING: 'REQUESTED', COMPLETED: 'COMPLETED' };
          const where: any = map[status] ? { status: map[status] } : undefined;
          if (entityInfo?.departmentId) {
            // maintenance requests are linked to assets which have departmentId
            where.asset = { departmentId: entityInfo.departmentId };
          }
          const count = where ? await prisma.maintenanceRequest.count({ where }) : await prisma.maintenanceRequest.count();
          const reply = `🔧 **${count} maintenance requests**${where ? ` with status ${where.status}` : ''}.`;
          console.log('[api/ai] q=', q, 'reply=', reply);
          return NextResponse.json({ success: true, reply });
        }
      }

      if (entity === 'user') {
        if (status === 'ACTIVE') {
          const count = await prisma.user.count({ where: { isActive: true } });
          const reply = `👥 **${count} active employees**.`;
          console.log('[api/ai] q=', q, 'reply=', reply);
          return NextResponse.json({ success: true, reply });
        }
      }

      if (entity === 'notification') {
        // default to unread notifications unless user explicitly asked about read ones
        const where: any = status ? { read: status === 'COMPLETED' ? true : false } : { read: false };
        if (entityInfo?.departmentId) {
          // notifications currently don't have department, skip
        }
        const count = await prisma.notification.count({ where } as any);
        const reply = `🔔 You have **${count} ${where.read ? 'read' : 'unread'} notifications**.`;
        console.log('[api/ai] q=', q, 'reply=', reply);
        return NextResponse.json({ success: true, reply });
      }
    }

    // Try to include department-specific counts when detected
    let defaultReply = `🤖 I found data for your query. You have **${stats.totalAssets ?? 0} assets**, **${stats.totalEmployees ?? 0} employees**, and **${stats.todaysBookings ?? 0} bookings today**.`;
    if (entityInfo?.departmentName) {
      defaultReply = `🤖 In ${entityInfo.departmentName}, there are **${stats.totalAssets ?? 0} assets** (global counts shown).`;
    }
    const reply = defaultReply;
    console.log('[api/ai] q=', q, 'reply=', reply);
    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    console.error('[api/ai] error:', err);
    return NextResponse.json({ success: false, message: err?.message ?? String(err) }, { status: 500 });
  }
}
