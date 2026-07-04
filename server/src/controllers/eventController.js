import * as eventService from '../services/eventService.js';

export async function createEvent(req, res) {
  res.status(201).json(await eventService.addEvent(req.body || {}, req.user));
}

export async function deleteEvent(req, res) {
  await eventService.deleteEvent(Number(req.params.id), req.user);
  res.json({ ok: true });
}

export async function replaceOpportunityEvents(req, res) {
  const events = await eventService.replaceOpportunityEvents(
    Number(req.params.opportunityId),
    req.body?.eventDefs || [],
    req.user
  );
  res.json(events);
}
