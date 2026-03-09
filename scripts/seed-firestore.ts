/**
 * Firestore Seed Script
 *
 * Seeds a demo organization with sample data matching the UI screens.
 * Run: npx ts-node scripts/seed-firestore.ts
 * Or:  npm run seed
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { getAdminDb } from "../src/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

const ORG_ID = "demo-org-001";
const USER_ID = "D1bSDFyC0XN1Kzk2kChG2PYrpfV2";

async function seed() {
  const db = getAdminDb();
  const now = Timestamp.now();
  const batch = db.batch();

  console.log("Seeding Firestore with demo data...\n");

  // ─── Organization ───────────────────────────────────────────
  const orgRef = db.collection("organizations").doc(ORG_ID);
  batch.set(orgRef, {
    name: "TechCorp Inc.",
    slug: "techcorp",
    logoURL: null,
    industry: "Technology",
    website: "https://techcorp.com",
    plan: "pro",
    billingEmail: "billing@techcorp.com",
    settings: {
      timezone: "America/Los_Angeles",
      defaultCurrency: "USD",
      brandColor: "#00E5FF",
    },
    createdAt: now,
    updatedAt: now,
  });

  // ─── User Profile ──────────────────────────────────────────
  const userRef = db.collection("users").doc(USER_ID);
  batch.set(userRef, {
    uid: USER_ID,
    email: "oru@gmail.com",
    displayName: "Ori Mizrachi",
    photoURL: null,
    activeOrgId: ORG_ID,
    onboardingComplete: true,
    createdAt: now,
    updatedAt: now,
  });

  // ─── Jobs ──────────────────────────────────────────────────
  const jobsData = [
    {
      id: "job-1",
      title: "Senior Product Designer",
      department: "Design",
      location: "San Francisco, CA",
      locationType: "hybrid",
      type: "full-time",
      experienceLevel: "senior",
      salaryMin: 120000,
      salaryMax: 180000,
      status: "active",
      viewCount: 124000,
      applicationCount: 5208,
    },
    {
      id: "job-2",
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Austin, TX",
      locationType: "remote",
      type: "full-time",
      experienceLevel: "senior",
      salaryMin: 130000,
      salaryMax: 175000,
      status: "active",
      viewCount: 98000,
      applicationCount: 3724,
    },
    {
      id: "job-3",
      title: "Marketing Manager - Growth",
      department: "Marketing",
      location: "Remote",
      locationType: "remote",
      type: "full-time",
      experienceLevel: "mid",
      salaryMin: 100000,
      salaryMax: 140000,
      status: "active",
      viewCount: 156000,
      applicationCount: 7956,
    },
    {
      id: "job-4",
      title: "Senior Data Analyst",
      department: "Data",
      location: "Seattle, WA",
      locationType: "onsite",
      type: "full-time",
      experienceLevel: "senior",
      salaryMin: 85000,
      salaryMax: 120000,
      status: "paused",
      viewCount: 45000,
      applicationCount: 810,
    },
    {
      id: "job-5",
      title: "Bartender - Weekend Shifts",
      department: "Operations",
      location: "Miami, FL",
      locationType: "onsite",
      type: "part-time",
      experienceLevel: "entry",
      salaryMin: 35000,
      salaryMax: 50000,
      status: "active",
      viewCount: 73000,
      applicationCount: 2555,
    },
    {
      id: "job-6",
      title: "Server - Full Time",
      department: "Operations",
      location: "Chicago, IL",
      locationType: "onsite",
      type: "full-time",
      experienceLevel: "entry",
      salaryMin: 30000,
      salaryMax: 45000,
      status: "active",
      viewCount: 89000,
      applicationCount: 2581,
    },
  ];

  for (const job of jobsData) {
    const ref = db.collection("jobs").doc(job.id);
    batch.set(ref, {
      orgId: ORG_ID,
      title: job.title,
      department: job.department,
      location: job.location,
      locationType: job.locationType,
      type: job.type,
      experienceLevel: job.experienceLevel,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      currency: "USD",
      description: `We're looking for a ${job.title} to join our growing team...`,
      requirements: ["3+ years experience", "Strong communication skills"],
      benefits: ["Remote", "Health Insurance", "401k"],
      skills: [],
      status: job.status,
      publishedAt: now,
      closesAt: null,
      createdBy: USER_ID,
      viewCount: job.viewCount,
      applicationCount: job.applicationCount,
      createdAt: now,
      updatedAt: now,
    });
  }

  // ─── Candidates ────────────────────────────────────────────
  const candidatesData = [
    {
      id: "cand-1",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedinURL: "linkedin.com/in/sarahchen",
      currentCompany: "Figma",
      currentRole: "Senior Product Designer",
      experienceYears: 8,
      skills: ["UI/UX", "Figma", "Product Strategy"],
      source: "direct",
      availability: "2 weeks notice",
    },
    {
      id: "cand-2",
      name: "Michael Rodriguez",
      email: "m.rodriguez@email.com",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      linkedinURL: "linkedin.com/in/mrodriguez",
      currentCompany: "Meta",
      currentRole: "Frontend Engineer",
      experienceYears: 5,
      skills: ["React", "TypeScript", "Node.js"],
      source: "linkedin",
      availability: "",
    },
    {
      id: "cand-3",
      name: "Emma Thompson",
      email: "emma.t@email.com",
      phone: "+1 (555) 345-6789",
      location: "Remote",
      linkedinURL: "linkedin.com/in/emmathompson",
      currentCompany: "Shopify",
      currentRole: "Marketing Manager",
      experienceYears: 6,
      skills: ["Growth Marketing", "SEO", "Analytics"],
      source: "referral",
      availability: "1 month notice",
    },
    {
      id: "cand-4",
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 456-7890",
      location: "New York, NY",
      linkedinURL: "linkedin.com/in/jameswilson",
      currentCompany: "Adobe",
      currentRole: "Senior Product Designer",
      experienceYears: 10,
      skills: ["Design Systems", "Leadership", "Prototyping"],
      source: "direct",
      availability: "Flexible",
    },
    {
      id: "cand-5",
      name: "Lisa Park",
      email: "lisa.park@email.com",
      phone: "+1 (555) 567-8901",
      location: "Seattle, WA",
      linkedinURL: "linkedin.com/in/lisapark",
      currentCompany: "Amazon",
      currentRole: "Data Analyst",
      experienceYears: 4,
      skills: ["SQL", "Python", "Tableau"],
      source: "linkedin",
      availability: "",
    },
    {
      id: "cand-6",
      name: "David Kumar",
      email: "david.kumar@email.com",
      phone: "+1 (555) 678-9012",
      location: "Boston, MA",
      linkedinURL: "linkedin.com/in/davidkumar",
      currentCompany: "Google",
      currentRole: "Frontend Engineer",
      experienceYears: 7,
      skills: ["React", "Performance", "Architecture"],
      source: "direct",
      availability: "2 weeks notice",
    },
    {
      id: "cand-7",
      name: "Maria Garcia",
      email: "maria.garcia@email.com",
      phone: "+1 (555) 789-0123",
      location: "Los Angeles, CA",
      linkedinURL: "linkedin.com/in/mariagarcia",
      currentCompany: "Airbnb",
      currentRole: "Senior Product Designer",
      experienceYears: 12,
      skills: ["Product Design", "Strategy", "User Research"],
      source: "referral",
      availability: "Immediate",
    },
    {
      id: "cand-8",
      name: "Alex Martinez",
      email: "alex.m@email.com",
      phone: "+1 (555) 890-1234",
      location: "Miami, FL",
      linkedinURL: "",
      currentCompany: "",
      currentRole: "Bartender",
      experienceYears: 3,
      skills: ["Mixology", "Customer Service", "Cash Handling"],
      source: "direct",
      availability: "Weekends",
    },
    {
      id: "cand-9",
      name: "Jordan Lee",
      email: "jordan.lee@email.com",
      phone: "+1 (555) 901-2345",
      location: "Chicago, IL",
      linkedinURL: "",
      currentCompany: "",
      currentRole: "Server",
      experienceYears: 2,
      skills: ["Table Service", "POS Systems", "Team Player"],
      source: "direct",
      availability: "Immediate",
    },
  ];

  for (const cand of candidatesData) {
    const ref = db.collection("candidates").doc(cand.id);
    batch.set(ref, {
      orgId: ORG_ID,
      name: cand.name,
      email: cand.email,
      phone: cand.phone,
      location: cand.location,
      linkedinURL: cand.linkedinURL,
      resumeURL: null,
      avatarURL: null,
      currentCompany: cand.currentCompany,
      currentRole: cand.currentRole,
      experienceYears: cand.experienceYears,
      skills: cand.skills,
      availability: cand.availability,
      source: cand.source,
      tags: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  // ─── Applications ──────────────────────────────────────────
  const applicationsData = [
    {
      id: "app-1",
      jobId: "job-1",
      candidateId: "cand-1",
      status: "pending",
      stage: "applied",
      fitScore: 95,
      intentScore: 88,
      engagement: "high",
      lastActivity: "Viewed job 3 times",
      notes: "Strong portfolio, matches all requirements",
    },
    {
      id: "app-2",
      jobId: "job-2",
      candidateId: "cand-2",
      status: "reviewing",
      stage: "applied",
      fitScore: 82,
      intentScore: 76,
      engagement: "medium",
      lastActivity: "Saved job, clicked 'Apply'",
      notes: "Good technical background",
    },
    {
      id: "app-3",
      jobId: "job-3",
      candidateId: "cand-3",
      status: "pending",
      stage: "applied",
      fitScore: 78,
      intentScore: 91,
      engagement: "high",
      lastActivity: "Engaged with 5 job cards",
      notes: "Very interested, high intent signals",
    },
    {
      id: "app-4",
      jobId: "job-1",
      candidateId: "cand-4",
      status: "reviewing",
      stage: "reviewed",
      fitScore: 91,
      intentScore: 85,
      engagement: "high",
      lastActivity: "Resume reviewed by hiring manager",
      notes: "Excellent design leadership experience",
    },
    {
      id: "app-5",
      jobId: "job-4",
      candidateId: "cand-5",
      status: "reviewing",
      stage: "reviewed",
      fitScore: 87,
      intentScore: 72,
      engagement: "medium",
      lastActivity: "Portfolio viewed",
      notes: "Strong analytical skills",
    },
    {
      id: "app-6",
      jobId: "job-2",
      candidateId: "cand-6",
      status: "interview",
      stage: "interview",
      fitScore: 89,
      intentScore: 94,
      engagement: "high",
      lastActivity: "Interview scheduled for tomorrow",
      notes: "Interview prep sent",
    },
    {
      id: "app-7",
      jobId: "job-1",
      candidateId: "cand-7",
      status: "offer",
      stage: "offer",
      fitScore: 96,
      intentScore: 97,
      engagement: "high",
      lastActivity: "Offer extended yesterday",
      notes: "Top candidate, offer pending",
    },
    {
      id: "app-8",
      jobId: "job-5",
      candidateId: "cand-8",
      status: "pending",
      stage: "applied",
      fitScore: 88,
      intentScore: 95,
      engagement: "high",
      lastActivity: "Applied via mobile",
      notes: "Available for weekend shifts, has cocktail certification",
    },
    {
      id: "app-9",
      jobId: "job-6",
      candidateId: "cand-9",
      status: "pending",
      stage: "applied",
      fitScore: 85,
      intentScore: 89,
      engagement: "high",
      lastActivity: "Viewed job 2 times",
      notes: "Looking for full-time position",
    },
  ];

  for (const app of applicationsData) {
    const ref = db.collection("applications").doc(app.id);
    batch.set(ref, {
      orgId: ORG_ID,
      jobId: app.jobId,
      candidateId: app.candidateId,
      status: app.status,
      stage: app.stage,
      fitScore: app.fitScore,
      intentScore: app.intentScore,
      engagement: app.engagement,
      appliedAt: Timestamp.fromDate(
        new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      ),
      lastActivity: app.lastActivity,
      notes: app.notes,
      reviewedBy: null,
      interviewDates: [],
      offerAmount: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  // ─── Campaigns ─────────────────────────────────────────────
  const campaignsData = [
    {
      id: "camp-1",
      jobId: "job-1",
      name: "Designer Boost Q1",
      status: "active",
      budget: 500,
      spent: 312,
      impressions: 45200,
      clicks: 1890,
      applications: 82,
      ctr: 4.2,
      costPerClick: 0.17,
      costPerApplication: 3.8,
    },
    {
      id: "camp-2",
      jobId: "job-3",
      name: "Marketing Push",
      status: "active",
      budget: 750,
      spent: 487,
      impressions: 89100,
      clicks: 3210,
      applications: 124,
      ctr: 3.6,
      costPerClick: 0.15,
      costPerApplication: 3.93,
    },
    {
      id: "camp-3",
      jobId: "job-2",
      name: "DevOps Sprint",
      status: "completed",
      budget: 300,
      spent: 300,
      impressions: 34500,
      clicks: 1240,
      applications: 56,
      ctr: 3.6,
      costPerClick: 0.24,
      costPerApplication: 5.36,
    },
  ];

  for (const camp of campaignsData) {
    const ref = db.collection("campaigns").doc(camp.id);
    batch.set(ref, {
      orgId: ORG_ID,
      jobId: camp.jobId,
      name: camp.name,
      status: camp.status,
      budget: camp.budget,
      spent: camp.spent,
      currency: "USD",
      startDate: Timestamp.fromDate(
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      ),
      endDate: Timestamp.fromDate(
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      ),
      targetAudience: {
        locations: ["US"],
        skills: [],
        experienceLevels: ["senior"],
      },
      metrics: {
        impressions: camp.impressions,
        clicks: camp.clicks,
        applications: camp.applications,
        ctr: camp.ctr,
        costPerClick: camp.costPerClick,
        costPerApplication: camp.costPerApplication,
      },
      createdBy: USER_ID,
      createdAt: now,
      updatedAt: now,
    });
  }

  // ─── Billing ───────────────────────────────────────────────
  const billingRef = db.collection("billing").doc(ORG_ID);
  batch.set(billingRef, {
    orgId: ORG_ID,
    plan: "pro",
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    currentPeriodStart: Timestamp.fromDate(new Date(2026, 1, 1)),
    currentPeriodEnd: Timestamp.fromDate(new Date(2026, 2, 1)),
    invoices: [
      {
        id: "INV-2026-02",
        amount: 299,
        currency: "USD",
        status: "paid",
        date: Timestamp.fromDate(new Date(2026, 1, 1)),
      },
      {
        id: "INV-2026-01",
        amount: 299,
        currency: "USD",
        status: "paid",
        date: Timestamp.fromDate(new Date(2026, 0, 1)),
      },
      {
        id: "INV-2025-12",
        amount: 299,
        currency: "USD",
        status: "paid",
        date: Timestamp.fromDate(new Date(2025, 11, 1)),
      },
      {
        id: "INV-2025-11",
        amount: 299,
        currency: "USD",
        status: "paid",
        date: Timestamp.fromDate(new Date(2025, 10, 1)),
      },
      {
        id: "INV-2025-10",
        amount: 299,
        currency: "USD",
        status: "paid",
        date: Timestamp.fromDate(new Date(2025, 9, 1)),
      },
    ],
    createdAt: now,
    updatedAt: now,
  });

  // ─── Analytics Events ──────────────────────────────────────
  const eventTypes = [
    "job_view",
    "job_apply",
    "job_save",
    "candidate_view",
    "candidate_shortlist",
  ];
  for (let i = 0; i < 50; i++) {
    const ref = db.collection("analytics").doc(`event-${i}`);
    const eventType = eventTypes[i % eventTypes.length];
    const jobId = jobsData[i % jobsData.length].id;
    const daysAgo = Math.floor(Math.random() * 30);
    batch.set(ref, {
      orgId: ORG_ID,
      eventType,
      jobId,
      candidateId: i < candidatesData.length ? candidatesData[i].id : null,
      userId: USER_ID,
      timestamp: Timestamp.fromDate(
        new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      ),
      metadata: {},
      createdAt: now,
      updatedAt: now,
    });
  }

  // ─── Notifications ─────────────────────────────────────────
  const notifications = [
    {
      type: "new_application",
      title: "New Application",
      message: "Sarah Chen applied for Senior Product Designer",
      actionURL: "/candidates/1",
      metadata: { candidateId: "cand-1", jobId: "job-1" },
    },
    {
      type: "interview_reminder",
      title: "Interview Tomorrow",
      message: "David Kumar interview scheduled for tomorrow at 10 AM",
      actionURL: "/candidates/2",
      metadata: { candidateId: "cand-2", jobId: "job-2" },
    },
    {
      type: "offer_response",
      title: "Offer Update",
      message: "Maria Garcia is reviewing your offer",
      actionURL: "/candidates/3",
      metadata: { candidateId: "cand-3", jobId: "job-1" },
    },
  ];

  for (let i = 0; i < notifications.length; i++) {
    const n = notifications[i];
    const ref = db.collection("notifications").doc(`notif-${i}`);
    batch.set(ref, {
      userId: USER_ID,
      type: n.type,
      title: n.title,
      message: n.message,
      read: false,
      actionURL: n.actionURL,
      metadata: n.metadata,
      createdAt: now,
      updatedAt: now,
    });
  }

  // ─── Commit ────────────────────────────────────────────────
  await batch.commit();
  console.log("Seed complete!");
  console.log(`  Organization: ${ORG_ID}`);
  console.log(`  User: ${USER_ID}`);
  console.log(`  Jobs: ${jobsData.length}`);
  console.log(`  Candidates: ${candidatesData.length}`);
  console.log(`  Applications: ${applicationsData.length}`);
  console.log(`  Campaigns: ${campaignsData.length}`);
  console.log(`  Analytics Events: 50`);
  console.log(`  Notifications: ${notifications.length}`);
  console.log(
    `\nTo use: set the authenticated user's activeOrgId to "${ORG_ID}"`,
  );
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
