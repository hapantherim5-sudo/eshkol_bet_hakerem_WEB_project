import { Router } from 'express';
import { getDb, COLLECTIONS } from '../db.js';

const router = Router();

const HE_MONTHS = ['ינו׳','פבר׳','מרץ','אפר׳','מאי','יונ׳','יול׳','אוג׳','ספט׳','אוק׳','נוב׳','דצמ׳'];

router.get('/stats', async (req, res, next) => {
  try {
    const db = getDb();
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const [
      totalUsers,
      totalOpportunities,
      totalRegistrations,
      totalCancellations,
      totalViews,
      activeOrgs,
      regsByMonthRaw,
      cancelsByMonthRaw,
      regsByCity,
      regsByCat,
      topOpps,
      usersByRole,
    ] = await Promise.all([
      db.collection(COLLECTIONS.users).countDocuments(),
      db.collection(COLLECTIONS.opportunities).countDocuments(),
      db.collection(COLLECTIONS.registrations).countDocuments(),
      db.collection(COLLECTIONS.cancellations).countDocuments(),
      db.collection(COLLECTIONS.views).countDocuments(),
      db.collection(COLLECTIONS.opportunities).distinct('organizationId'),

      db.collection(COLLECTIONS.registrations).aggregate([
        { $addFields: { d: { $toDate: '$createdAt' } } },
        { $match: { d: { $gte: twelveMonthsAgo } } },
        { $group: { _id: { y: { $year: '$d' }, m: { $month: '$d' } }, count: { $sum: 1 } } },
      ]).toArray(),

      db.collection(COLLECTIONS.cancellations).aggregate([
        { $addFields: { d: { $toDate: '$cancelledAt' } } },
        { $match: { d: { $gte: twelveMonthsAgo } } },
        { $group: { _id: { y: { $year: '$d' }, m: { $month: '$d' } }, count: { $sum: 1 } } },
      ]).toArray(),

      db.collection(COLLECTIONS.registrations).aggregate([
        { $lookup: { from: 'opportunities', localField: 'opportunityId', foreignField: 'id', as: 'o' } },
        { $unwind: { path: '$o', preserveNullAndEmptyArrays: false } },
        { $group: { _id: '$o.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),

      db.collection(COLLECTIONS.registrations).aggregate([
        { $lookup: { from: 'opportunities', localField: 'opportunityId', foreignField: 'id', as: 'o' } },
        { $unwind: { path: '$o', preserveNullAndEmptyArrays: false } },
        { $group: { _id: { cat: '$o.category', label: '$o.categoryLabel' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),

      db.collection(COLLECTIONS.registrations).aggregate([
        { $group: { _id: '$opportunityId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'opportunities', localField: '_id', foreignField: 'id', as: 'o' } },
        { $unwind: { path: '$o', preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, id: '$_id', title: '$o.title', city: '$o.city', category: '$o.categoryLabel', count: 1 } },
      ]).toArray(),

      db.collection(COLLECTIONS.users).aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]).toArray(),
    ]);

    // Build full 12-month time-series (fill zeros for missing months)
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return { y: d.getFullYear(), m: d.getMonth() + 1, label: `${HE_MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}` };
    });

    const fillMonths = (raw) =>
      months.map(({ y, m, label }) => ({
        label,
        count: raw.find(r => r._id.y === y && r._id.m === m)?.count ?? 0,
      }));

    res.json({
      kpis: {
        totalUsers,
        totalOpportunities,
        totalRegistrations,
        totalCancellations,
        totalViews,
        activeOrganizations: activeOrgs.filter(Boolean).length,
      },
      registrationsByMonth: fillMonths(regsByMonthRaw),
      cancellationsByMonth: fillMonths(cancelsByMonthRaw),
      registrationsByCity: regsByCity.map(r => ({ city: r._id || 'אחר', count: r.count })),
      registrationsByCategory: regsByCat.map(r => ({
        label: r._id.label || r._id.cat || 'אחר',
        count: r.count,
      })),
      topOpportunities: topOpps,
      usersByRole: usersByRole.map(r => ({ role: r._id || 'אחר', count: r.count })),
      conversionRate: {
        views: totalViews,
        registrations: totalRegistrations,
        rate: totalViews > 0 ? +((totalRegistrations / totalViews) * 100).toFixed(1) : 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
