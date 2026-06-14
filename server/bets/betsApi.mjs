import { randomBytes } from "node:crypto";

function randomBetId() {
  return randomBytes(2).toString("hex");
}

function isValidBetPayload(body) {
  if (!body || typeof body !== "object") return false;
  const profileId = Number(body.profileId);
  const amount = Number(body.amount);
  const odds = Number(body.odds);
  return (
    Number.isFinite(profileId) &&
    profileId > 0 &&
    typeof body.date === "string" &&
    body.date.trim() &&
    typeof body.time === "string" &&
    typeof body.matchId === "string" &&
    body.matchId.trim() &&
    typeof body.status === "string" &&
    body.status.trim() &&
    Number.isFinite(amount) &&
    amount > 0 &&
    Number.isFinite(odds) &&
    odds > 0 &&
    typeof body.betType === "string" &&
    body.betType.trim()
  );
}

function normalizeBetPayload(body) {
  return {
    profileId: Number(body.profileId),
    date: String(body.date).trim(),
    time: String(body.time).trim(),
    matchId: String(body.matchId).trim(),
    status: String(body.status).trim(),
    amount: Math.round(Number(body.amount)),
    odds: Number(body.odds),
    betType: String(body.betType).trim(),
  };
}

export function cleanupInvalidBets(db) {
  const bets = Array.isArray(db.data.bets) ? db.data.bets : [];
  const valid = bets.filter((bet) => isValidBetPayload(bet) && typeof bet.id === "string" && bet.id.trim());
  const removed = bets.length - valid.length;
  if (removed > 0) {
    db.data.bets = valid;
  }
  return removed;
}

export function createBetInDb(db, body) {
  if (!isValidBetPayload(body)) {
    throw new Error("Invalid bet payload");
  }
  const item = { id: randomBetId(), ...normalizeBetPayload(body) };
  const bets = Array.isArray(db.data.bets) ? db.data.bets : [];
  bets.push(item);
  db.data.bets = bets;
  return item;
}

export function updateBetInDb(db, id, body) {
  const bets = Array.isArray(db.data.bets) ? db.data.bets : [];
  const index = bets.findIndex((item) => String(item.id) === String(id));
  if (index < 0) {
    throw new Error("Bet not found");
  }
  const next = { ...bets[index], ...normalizeBetPayload({ ...bets[index], ...body }), id: String(id) };
  if (!isValidBetPayload(next)) {
    throw new Error("Invalid bet payload");
  }
  bets[index] = next;
  db.data.bets = bets;
  return next;
}

export function deleteBetInDb(db, id) {
  const bets = Array.isArray(db.data.bets) ? db.data.bets : [];
  const index = bets.findIndex((item) => String(item.id) === String(id));
  if (index < 0) {
    throw new Error("Bet not found");
  }
  const [removed] = bets.splice(index, 1);
  db.data.bets = bets;
  return removed;
}

export function registerBetsRoutes(app, db, json) {
  app.post("/bets", json(), async (req, res) => {
    try {
      const created = createBetInDb(db, req.body);
      await db.write();
      res.status(201).json(created);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to create bet";
      const status = message.includes("Invalid") ? 400 : 500;
      res.status(status).json({ error: message });
    }
  });

  app.patch("/bets/:id", json(), async (req, res) => {
    try {
      const updated = updateBetInDb(db, req.params.id ?? "", req.body);
      await db.write();
      res.status(200).json(updated);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to update bet";
      const status = message.includes("not found")
        ? 404
        : message.includes("Invalid")
          ? 400
          : 500;
      res.status(status).json({ error: message });
    }
  });

  app.delete("/bets/:id", async (req, res) => {
    try {
      const removed = deleteBetInDb(db, req.params.id ?? "");
      await db.write();
      res.status(200).json(removed);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to delete bet";
      const status = message.includes("not found") ? 404 : 500;
      res.status(status).json({ error: message });
    }
  });
}
