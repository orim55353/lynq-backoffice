/**
 * Create Fresh User & Organization
 *
 * Creates a new Firebase Auth user and a blank organization with no mock data.
 * The user is linked to the org via activeOrgId and an org member record.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/create-fresh-user.ts
 *   npm run create-user
 *
 * Environment variables (from .env.local):
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY
 *
 * Optional CLI args:
 *   --email <email>       (default: prompted or "newuser@lynq.app")
 *   --password <password> (default: "Lynq123!")
 *   --name <name>         (default: "New User")
 *   --org <org-name>      (default: "My Organization")
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getAdminAuth, getAdminDb } from "../src/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

interface CreateOptions {
  email: string;
  password: string;
  displayName: string;
  orgName: string;
}

function parseArgs(): CreateOptions {
  const args = process.argv.slice(2);
  const opts: CreateOptions = {
    email: "newuser@lynq.app",
    password: "Lynq123!",
    displayName: "New User",
    orgName: "My Organization",
  };

  for (let i = 0; i < args.length; i++) {
    const next = args[i + 1];
    switch (args[i]) {
      case "--email":
        if (next) opts.email = next;
        i++;
        break;
      case "--password":
        if (next) opts.password = next;
        i++;
        break;
      case "--name":
        if (next) opts.displayName = next;
        i++;
        break;
      case "--org":
        if (next) opts.orgName = next;
        i++;
        break;
    }
  }

  return opts;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createFreshUser() {
  const opts = parseArgs();
  const auth = getAdminAuth();
  const db = getAdminDb();
  const now = Timestamp.now();

  console.log("Creating fresh user and organization...\n");
  console.log(`  Email:    ${opts.email}`);
  console.log(`  Name:     ${opts.displayName}`);
  console.log(`  Org:      ${opts.orgName}`);
  console.log();

  // ─── Create Firebase Auth User ──────────────────────────────
  const userRecord = await auth.createUser({
    email: opts.email,
    password: opts.password,
    displayName: opts.displayName,
  });

  const userId = userRecord.uid;
  console.log(`Auth user created: ${userId}`);

  // ─── Create Organization ────────────────────────────────────
  const orgRef = db.collection("organizations").doc();
  const orgId = orgRef.id;

  const batch = db.batch();

  batch.set(orgRef, {
    name: opts.orgName,
    slug: slugify(opts.orgName),
    logoURL: null,
    industry: "",
    website: "",
    plan: "free",
    billingEmail: opts.email,
    settings: {
      timezone: "UTC",
      defaultCurrency: "USD",
      brandColor: "#00E5FF",
    },
    createdAt: now,
    updatedAt: now,
  });

  // ─── Create User Profile ───────────────────────────────────
  const userRef = db.collection("users").doc(userId);
  batch.set(userRef, {
    uid: userId,
    email: opts.email,
    displayName: opts.displayName,
    photoURL: null,
    activeOrgId: orgId,
    onboardingComplete: false,
    createdAt: now,
    updatedAt: now,
  });

  // ─── Create Org Member ─────────────────────────────────────
  const memberRef = orgRef.collection("members").doc(userId);
  batch.set(memberRef, {
    userId,
    email: opts.email,
    displayName: opts.displayName,
    role: "owner",
    invitedBy: userId,
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  });

  // ─── Create Billing Record (free plan) ─────────────────────
  const billingRef = db.collection("billing").doc(orgId);
  batch.set(billingRef, {
    orgId,
    plan: "free",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    currentPeriodStart: now,
    currentPeriodEnd: now,
    invoices: [],
    createdAt: now,
    updatedAt: now,
  });

  await batch.commit();

  console.log(`\nDone! Fresh account created with zero data.\n`);
  console.log(`  User ID:  ${userId}`);
  console.log(`  Org ID:   ${orgId}`);
  console.log(`  Email:    ${opts.email}`);
  console.log(`  Password: ${opts.password}`);
  console.log(`\nLogin at your app with these credentials.`);
}

createFreshUser().catch((error) => {
  console.error("Failed to create user:", error);
  process.exit(1);
});
