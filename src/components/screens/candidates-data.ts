export const stages = ["Applied", "Reviewed", "Interview", "Offer", "Hired", "Rejected"] as const;

export type CandidateStage = (typeof stages)[number];

export type CandidateEngagement = "High" | "Medium" | "Low";

export interface Candidate {
  id: number;
  name: string;
  role: string;
  jobId: string;
  jobTitle: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  fitScore: number;
  intentScore: number;
  engagement: CandidateEngagement;
  stage: CandidateStage;
  appliedDate: string;
  lastActivity: string;
  avatar: string;
  experience: string;
  availability: string;
  currentCompany: string;
  skills: string[];
  note: string;
}

export const jobs = [
  {
    id: "job-1",
    title: "Senior Product Designer",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  {
    id: "job-2",
    title: "Senior Frontend Engineer",
    color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
  },
  {
    id: "job-3",
    title: "Marketing Manager - Growth",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  {
    id: "job-4",
    title: "Senior Data Analyst",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
  },
  {
    id: "job-5",
    title: "Bartender - Weekend Shifts",
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20"
  },
  {
    id: "job-6",
    title: "Server - Full Time",
    color: "bg-teal-500/10 text-teal-500 border-teal-500/20"
  }
] as const;

export const candidatesData: Candidate[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Product Designer",
    jobId: "job-1",
    jobTitle: "Senior Product Designer",
    location: "San Francisco, CA",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/sarahchen",
    fitScore: 95,
    intentScore: 88,
    engagement: "High",
    stage: "Applied",
    appliedDate: "2 hours ago",
    lastActivity: "Viewed job 3 times",
    avatar: "SC",
    experience: "8 years",
    availability: "2 weeks notice",
    currentCompany: "Figma",
    skills: ["UI/UX", "Figma", "Product Strategy"],
    note: "Strong portfolio, matches all requirements"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Frontend Engineer",
    jobId: "job-2",
    jobTitle: "Senior Frontend Engineer",
    location: "Austin, TX",
    email: "m.rodriguez@email.com",
    phone: "+1 (555) 234-5678",
    linkedin: "linkedin.com/in/mrodriguez",
    fitScore: 82,
    intentScore: 76,
    engagement: "Medium",
    stage: "Applied",
    appliedDate: "5 hours ago",
    lastActivity: "Saved job, clicked 'Apply'",
    avatar: "MR",
    experience: "5 years",
    availability: "",
    currentCompany: "Meta",
    skills: ["React", "TypeScript", "Node.js"],
    note: "Good technical background"
  },
  {
    id: 3,
    name: "Emma Thompson",
    role: "Marketing Manager",
    jobId: "job-3",
    jobTitle: "Marketing Manager - Growth",
    location: "Remote",
    email: "emma.t@email.com",
    phone: "+1 (555) 345-6789",
    linkedin: "linkedin.com/in/emmathompson",
    fitScore: 78,
    intentScore: 91,
    engagement: "High",
    stage: "Applied",
    appliedDate: "1 day ago",
    lastActivity: "Engaged with 5 job cards",
    avatar: "ET",
    experience: "6 years",
    availability: "1 month notice",
    currentCompany: "Shopify",
    skills: ["Growth Marketing", "SEO", "Analytics"],
    note: "Very interested, high intent signals"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Senior Product Designer",
    jobId: "job-1",
    jobTitle: "Senior Product Designer",
    location: "New York, NY",
    email: "james.wilson@email.com",
    phone: "+1 (555) 456-7890",
    linkedin: "linkedin.com/in/jameswilson",
    fitScore: 91,
    intentScore: 85,
    engagement: "High",
    stage: "Reviewed",
    appliedDate: "2 days ago",
    lastActivity: "Resume reviewed by hiring manager",
    avatar: "JW",
    experience: "10 years",
    availability: "Flexible",
    currentCompany: "Adobe",
    skills: ["Design Systems", "Leadership", "Prototyping"],
    note: "Excellent design leadership experience"
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Data Analyst",
    jobId: "job-4",
    jobTitle: "Senior Data Analyst",
    location: "Seattle, WA",
    email: "lisa.park@email.com",
    phone: "+1 (555) 567-8901",
    linkedin: "linkedin.com/in/lisapark",
    fitScore: 87,
    intentScore: 72,
    engagement: "Medium",
    stage: "Reviewed",
    appliedDate: "3 days ago",
    lastActivity: "Portfolio viewed",
    avatar: "LP",
    experience: "4 years",
    availability: "",
    currentCompany: "Amazon",
    skills: ["SQL", "Python", "Tableau"],
    note: "Strong analytical skills"
  },
  {
    id: 6,
    name: "David Kumar",
    role: "Frontend Engineer",
    jobId: "job-2",
    jobTitle: "Senior Frontend Engineer",
    location: "Boston, MA",
    email: "david.kumar@email.com",
    phone: "+1 (555) 678-9012",
    linkedin: "linkedin.com/in/davidkumar",
    fitScore: 89,
    intentScore: 94,
    engagement: "High",
    stage: "Interview",
    appliedDate: "4 days ago",
    lastActivity: "Interview scheduled for tomorrow",
    avatar: "DK",
    experience: "7 years",
    availability: "2 weeks notice",
    currentCompany: "Google",
    skills: ["React", "Performance", "Architecture"],
    note: "Interview prep sent"
  },
  {
    id: 7,
    name: "Maria Garcia",
    role: "Senior Product Designer",
    jobId: "job-1",
    jobTitle: "Senior Product Designer",
    location: "Los Angeles, CA",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 789-0123",
    linkedin: "linkedin.com/in/mariagarcia",
    fitScore: 96,
    intentScore: 97,
    engagement: "High",
    stage: "Offer",
    appliedDate: "5 days ago",
    lastActivity: "Offer extended yesterday",
    avatar: "MG",
    experience: "12 years",
    availability: "Immediate",
    currentCompany: "Airbnb",
    skills: ["Product Design", "Strategy", "User Research"],
    note: "Top candidate, offer pending"
  },
  {
    id: 8,
    name: "Alex Martinez",
    role: "Bartender",
    jobId: "job-5",
    jobTitle: "Bartender - Weekend Shifts",
    location: "Miami, FL",
    email: "alex.m@email.com",
    phone: "+1 (555) 890-1234",
    linkedin: "",
    fitScore: 88,
    intentScore: 95,
    engagement: "High",
    stage: "Applied",
    appliedDate: "3 hours ago",
    lastActivity: "Applied via mobile",
    avatar: "AM",
    experience: "3 years",
    availability: "Weekends",
    currentCompany: "",
    skills: ["Mixology", "Customer Service", "Cash Handling"],
    note: "Available for weekend shifts, has cocktail certification"
  },
  {
    id: 9,
    name: "Jordan Lee",
    role: "Server",
    jobId: "job-6",
    jobTitle: "Server - Full Time",
    location: "Chicago, IL",
    email: "jordan.lee@email.com",
    phone: "+1 (555) 901-2345",
    linkedin: "",
    fitScore: 85,
    intentScore: 89,
    engagement: "High",
    stage: "Applied",
    appliedDate: "1 hour ago",
    lastActivity: "Viewed job 2 times",
    avatar: "JL",
    experience: "2 years",
    availability: "Immediate",
    currentCompany: "",
    skills: ["Table Service", "POS Systems", "Team Player"],
    note: "Looking for full-time position"
  }
];

export const getEngagementColor = (engagement: CandidateEngagement) => {
  if (engagement === "High") {
    return "bg-success/10 text-success";
  }

  if (engagement === "Medium") {
    return "bg-warning/10 text-warning";
  }

  return "bg-muted text-muted-foreground";
};

export const getJobColor = (jobId: string) => {
  const colors = {
    "job-1": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "job-2": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    "job-3": "bg-amber-500/10 text-amber-500 border-amber-500/20",
    "job-4": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    "job-5": "bg-rose-500/10 text-rose-500 border-rose-500/20",
    "job-6": "bg-teal-500/10 text-teal-500 border-teal-500/20"
  } as const;

  return colors[jobId as keyof typeof colors] ?? "bg-muted text-muted-foreground border-border";
};

export function getCandidateById(id: number) {
  return candidatesData.find((candidate) => candidate.id === id);
}
