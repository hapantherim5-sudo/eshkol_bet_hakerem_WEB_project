import { getDb } from '../db.js';
import { COLLECTIONS } from '../models/collections.js';

export async function loadStatsData(twelveMonthsAgo) {
  const db = getDb();

  const [
    totalUsers,
    totalOpportunities,
    totalRegistrations,
    totalCancellations,
    totalViews,
    activeOrganizations,
    registrationsByMonth,
    cancellationsByMonth,
    registrationsByCity,
    registrationsByCategory,
    topOpportunities,
    usersByRole,
  ] = await Promise.all([
    db.collection(COLLECTIONS.users).countDocuments(),
    db.collection(COLLECTIONS.opportunities).countDocuments(),
    db.collection(COLLECTIONS.registrations).countDocuments(),
    db.collection(COLLECTIONS.cancellations).countDocuments(),
    db.collection(COLLECTIONS.views).countDocuments(),
    db.collection(COLLECTIONS.opportunities).distinct('organizationId'),
    aggregateMonthly(COLLECTIONS.registrations, 'createdAt', twelveMonthsAgo),
    aggregateMonthly(COLLECTIONS.cancellations, 'cancelledAt', twelveMonthsAgo),
    db.collection(COLLECTIONS.registrations).aggregate([
      { $lookup: { from: COLLECTIONS.opportunities, localField: 'opportunityId', foreignField: 'id', as: 'opportunity' } },
      { $unwind: { path: '$opportunity', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$opportunity.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),
    db.collection(COLLECTIONS.registrations).aggregate([
      { $lookup: { from: COLLECTIONS.opportunities, localField: 'opportunityId', foreignField: 'id', as: 'opportunity' } },
      { $unwind: { path: '$opportunity', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$opportunity.category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]).toArray(),
    db.collection(COLLECTIONS.registrations).aggregate([
      { $group: { _id: '$opportunityId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: COLLECTIONS.opportunities, localField: '_id', foreignField: 'id', as: 'opportunity' } },
      { $unwind: { path: '$opportunity', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, id: '$_id', title: '$opportunity.title', titleAr: '$opportunity.titleAr', city: '$opportunity.city', category: '$opportunity.category', count: 1 } },
    ]).toArray(),
    db.collection(COLLECTIONS.users).aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]).toArray(),
  ]);

  return {
    totalUsers,
    totalOpportunities,
    totalRegistrations,
    totalCancellations,
    totalViews,
    activeOrganizations,
    registrationsByMonth,
    cancellationsByMonth,
    registrationsByCity,
    registrationsByCategory,
    topOpportunities,
    usersByRole,
  };
}

function aggregateMonthly(collectionName, dateField, since) {
  return getDb().collection(collectionName).aggregate([
    { $addFields: { parsedDate: { $toDate: `$${dateField}` } } },
    { $match: { parsedDate: { $gte: since } } },
    { $group: { _id: { y: { $year: '$parsedDate' }, m: { $month: '$parsedDate' } }, count: { $sum: 1 } } },
  ]).toArray();
}
