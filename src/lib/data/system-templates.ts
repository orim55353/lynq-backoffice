// ─── Blue-Collar System Job Templates ─────────────────────────
// Pre-built templates for common blue-collar roles.

import type { ShiftType, Urgency, PayFrequency, PayType } from "@/lib/firebase/types";

export type TemplateCategory =
  | "warehouse"
  | "construction"
  | "manufacturing"
  | "trades"
  | "food_service"
  | "driving"
  | "healthcare"
  | "retail"
  | "custom";

export interface SystemTemplate {
  readonly id: string;
  readonly name: string;
  readonly category: TemplateCategory;
  readonly icon: string;
  readonly fields: {
    readonly title: string;
    readonly department: string;
    readonly description: string;
    readonly requirements: readonly string[];
    readonly physicalRequirements: readonly string[];
    readonly certifications: readonly string[];
    readonly benefits: readonly string[];
    readonly skills: readonly string[];
    readonly type: "full-time" | "part-time" | "contract" | "temporary";
    readonly payType: PayType;
    readonly shiftType: ShiftType;
    readonly shiftSchedule: string;
    readonly hourlyPayMin: number;
    readonly hourlyPayMax: number;
    readonly salaryMin?: number;
    readonly salaryMax?: number;
    readonly overtimeRate: number | null;
    readonly payFrequency: PayFrequency;
    readonly experienceYears: number;
    readonly transportRequired: boolean;
    readonly urgency: Urgency;
  };
}

export const SYSTEM_TEMPLATES: readonly SystemTemplate[] = [
  {
    id: "tpl-warehouse-associate",
    name: "Warehouse Associate",
    category: "warehouse",
    icon: "Package",
    fields: {
      title: "Warehouse Associate",
      department: "Warehouse",
      description:
        "What you will do each day:\n" +
        "- Pick, pack, and ship orders accurately\n" +
        "- Load and unload delivery trucks\n" +
        "- Use RF scanner to track inventory\n" +
        "- Keep warehouse floor clean and organized\n" +
        "- Follow all safety rules and procedures",
      requirements: [
        "Able to follow instructions and work as a team",
        "Reliable — show up on time every shift",
        "Basic math skills for counting inventory",
      ],
      physicalRequirements: ["Lift 50lbs repeatedly", "Stand 8+ hours", "Walk/move constantly"],
      certifications: [],
      benefits: ["Overtime Pay", "Weekly Pay", "Health Insurance", "PPE Provided", "Training Provided"],
      skills: ["warehouse", "inventory", "forklift", "shipping", "receiving"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 6:00am - 2:30pm",
      hourlyPayMin: 16,
      hourlyPayMax: 20,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 0,
      transportRequired: true,
      urgency: "immediate",
    },
  },
  {
    id: "tpl-forklift-operator",
    name: "Forklift Operator",
    category: "warehouse",
    icon: "Truck",
    fields: {
      title: "Forklift Operator",
      department: "Warehouse",
      description:
        "What you will do each day:\n" +
        "- Operate sit-down and stand-up forklifts\n" +
        "- Move pallets from receiving to storage locations\n" +
        "- Load outbound trucks safely\n" +
        "- Do daily forklift safety inspections\n" +
        "- Keep aisles clear and organized",
      requirements: [
        "Valid forklift certification",
        "1+ year forklift experience",
        "Can work independently and follow safety rules",
      ],
      physicalRequirements: ["Lift 50lbs", "Sit/stand for extended periods", "Work in cold/hot environments"],
      certifications: ["Forklift Certified"],
      benefits: ["Overtime Pay", "Weekly Pay", "Health Insurance", "Steel-toe Boots Provided", "PPE Provided"],
      skills: ["forklift", "sit-down forklift", "stand-up forklift", "pallet jack", "warehouse"],
      type: "full-time",
      payType: "hourly",
      shiftType: "night",
      shiftSchedule: "Mon-Fri 10:00pm - 6:30am",
      hourlyPayMin: 18,
      hourlyPayMax: 24,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 1,
      transportRequired: true,
      urgency: "immediate",
    },
  },
  {
    id: "tpl-cnc-machinist",
    name: "CNC Machinist",
    category: "manufacturing",
    icon: "Cog",
    fields: {
      title: "CNC Machinist",
      department: "Manufacturing",
      description:
        "What you will do each day:\n" +
        "- Set up and operate CNC mills and lathes\n" +
        "- Read blueprints and technical drawings\n" +
        "- Inspect parts with micrometers and calipers\n" +
        "- Make tool adjustments to hold tight tolerances\n" +
        "- Log production data and report any defects",
      requirements: [
        "2+ years CNC machining experience",
        "Can read blueprints and use precision measuring tools",
        "Familiar with G-code programming",
      ],
      physicalRequirements: ["Lift 50lbs", "Stand 8+ hours", "Repetitive motions"],
      certifications: ["CNC Programming"],
      benefits: ["Overtime Pay", "Health Insurance", "Dental Insurance", "Tool Allowance", "401k"],
      skills: ["cnc", "machining", "blueprints", "g-code", "quality-inspection"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 7:00am - 3:30pm",
      hourlyPayMin: 22,
      hourlyPayMax: 32,
      overtimeRate: 1.5,
      payFrequency: "biweekly",
      experienceYears: 2,
      transportRequired: true,
      urgency: "within_week",
    },
  },
  {
    id: "tpl-electrician-journeyman",
    name: "Electrician (Journeyman)",
    category: "trades",
    icon: "Zap",
    fields: {
      title: "Journeyman Electrician",
      department: "Electrical",
      description:
        "What you will do each day:\n" +
        "- Install, repair, and maintain electrical systems\n" +
        "- Read and follow electrical blueprints and codes\n" +
        "- Troubleshoot wiring and circuit issues\n" +
        "- Pull wire, install panels and outlets\n" +
        "- Mentor apprentices on the job site",
      requirements: [
        "Valid journeyman electrician license",
        "4+ years of hands-on electrical work",
        "Know NEC codes and local building codes",
        "Own basic hand tools",
      ],
      physicalRequirements: ["Lift 75lbs+", "Climb ladders", "Work outdoors", "Work in tight spaces"],
      certifications: ["Electrical License", "OSHA 10"],
      benefits: ["Overtime Pay", "Health Insurance", "Tool Allowance", "Union", "Paid Time Off", "Holiday Pay"],
      skills: ["electrical", "wiring", "conduit", "troubleshooting", "blueprints", "nec-code"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 7:00am - 3:30pm",
      hourlyPayMin: 28,
      hourlyPayMax: 42,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 4,
      transportRequired: true,
      urgency: "within_week",
    },
  },
  {
    id: "tpl-plumber",
    name: "Plumber",
    category: "trades",
    icon: "Wrench",
    fields: {
      title: "Licensed Plumber",
      department: "Plumbing",
      description:
        "What you will do each day:\n" +
        "- Install and repair pipes, fixtures, and water heaters\n" +
        "- Read blueprints and follow plumbing codes\n" +
        "- Diagnose and fix leaks, clogs, and drainage issues\n" +
        "- Work on residential and light commercial jobs\n" +
        "- Keep work van stocked and organized",
      requirements: [
        "Valid plumbing license",
        "3+ years plumbing experience",
        "Own basic plumbing tools",
        "Clean driving record",
      ],
      physicalRequirements: ["Lift 75lbs+", "Work in tight spaces", "Climb ladders", "Kneel and crouch frequently"],
      certifications: ["Plumbing License"],
      benefits: ["Overtime Pay", "Health Insurance", "Tool Allowance", "Company Vehicle", "Paid Time Off"],
      skills: ["plumbing", "pipe-fitting", "soldering", "drain-cleaning", "water-heaters"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 7:00am - 3:30pm (on-call rotation)",
      hourlyPayMin: 25,
      hourlyPayMax: 38,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 3,
      transportRequired: false,
      urgency: "within_month",
    },
  },
  {
    id: "tpl-line-cook",
    name: "Line Cook",
    category: "food_service",
    icon: "ChefHat",
    fields: {
      title: "Line Cook",
      department: "Kitchen",
      description:
        "What you will do each day:\n" +
        "- Prep ingredients before service\n" +
        "- Cook menu items to order on your station\n" +
        "- Keep your station clean during service\n" +
        "- Follow food safety and sanitation rules\n" +
        "- Help with receiving and storing deliveries",
      requirements: [
        "1+ year of kitchen experience",
        "Can work under pressure during rush",
        "Know basic knife skills and cooking techniques",
      ],
      physicalRequirements: ["Stand 8+ hours", "Work in hot environments", "Lift 50lbs", "Repetitive motions"],
      certifications: ["Food Handler's Card"],
      benefits: ["Staff Meals", "Flexible Schedule", "Tips", "Holiday Pay", "Training Provided"],
      skills: ["cooking", "food-prep", "food-safety", "grill", "saute", "knife-skills"],
      type: "full-time",
      payType: "hourly",
      shiftType: "swing",
      shiftSchedule: "Wed-Sun 2:00pm - 10:30pm",
      hourlyPayMin: 15,
      hourlyPayMax: 20,
      overtimeRate: null,
      payFrequency: "biweekly",
      experienceYears: 1,
      transportRequired: false,
      urgency: "immediate",
    },
  },
  {
    id: "tpl-construction-laborer",
    name: "Construction Laborer",
    category: "construction",
    icon: "HardHat",
    fields: {
      title: "Construction Laborer",
      department: "Construction",
      description:
        "What you will do each day:\n" +
        "- Carry materials and tools to work areas\n" +
        "- Dig trenches and prepare job sites\n" +
        "- Assist skilled tradespeople as needed\n" +
        "- Clean up job sites at end of day\n" +
        "- Follow all site safety rules at all times",
      requirements: [
        "Reliable and willing to do physical work",
        "Can follow directions from site supervisor",
        "Show up on time every day, rain or shine",
      ],
      physicalRequirements: ["Lift 75lbs+", "Work outdoors", "Stand/walk all day", "Climb ladders"],
      certifications: ["OSHA 10"],
      benefits: ["Overtime Pay", "Weekly Pay", "PPE Provided", "Health Insurance", "Sign-on Bonus"],
      skills: ["construction", "demolition", "concrete", "framing", "general-labor"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 6:00am - 2:30pm",
      hourlyPayMin: 18,
      hourlyPayMax: 25,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 0,
      transportRequired: true,
      urgency: "immediate",
    },
  },
  {
    id: "tpl-cdl-truck-driver",
    name: "CDL Truck Driver",
    category: "driving",
    icon: "Truck",
    fields: {
      title: "CDL Truck Driver (Class A)",
      department: "Transportation",
      description:
        "What you will do each day:\n" +
        "- Drive local or regional routes\n" +
        "- Load and unload cargo at stops\n" +
        "- Do pre-trip and post-trip truck inspections\n" +
        "- Keep accurate delivery logs\n" +
        "- Follow DOT hours-of-service rules",
      requirements: [
        "Valid CDL Class A license",
        "Clean driving record (no DUIs, no major violations)",
        "2+ years CDL driving experience",
        "Pass DOT physical and drug screen",
      ],
      physicalRequirements: ["Lift 50lbs", "Sit for extended periods", "Climb in/out of cab"],
      certifications: ["CDL Class A"],
      benefits: ["Overtime Pay", "Weekly Pay", "Health Insurance", "401k", "Paid Time Off", "Sign-on Bonus"],
      skills: ["cdl", "truck-driving", "logistics", "dot-compliance", "delivery"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 5:00am - 3:00pm (home daily)",
      hourlyPayMin: 22,
      hourlyPayMax: 30,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 2,
      transportRequired: false,
      urgency: "within_week",
    },
  },
  {
    id: "tpl-hvac-technician",
    name: "HVAC Technician",
    category: "trades",
    icon: "Thermometer",
    fields: {
      title: "HVAC Technician",
      department: "HVAC",
      description:
        "What you will do each day:\n" +
        "- Install, repair, and maintain heating and cooling systems\n" +
        "- Diagnose HVAC problems and fix them\n" +
        "- Do preventive maintenance on commercial and residential units\n" +
        "- Handle refrigerant safely per EPA rules\n" +
        "- Keep service records for each job",
      requirements: [
        "EPA 608 certification",
        "2+ years HVAC experience",
        "Own basic HVAC tools",
        "Clean driving record",
      ],
      physicalRequirements: ["Lift 75lbs+", "Work outdoors", "Climb ladders", "Work in tight spaces"],
      certifications: ["EPA 608", "HVAC Certification"],
      benefits: ["Overtime Pay", "Health Insurance", "Tool Allowance", "Company Vehicle", "Paid Time Off"],
      skills: ["hvac", "refrigeration", "heating", "cooling", "troubleshooting", "epa-608"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 7:00am - 4:00pm (on-call rotation)",
      hourlyPayMin: 24,
      hourlyPayMax: 36,
      overtimeRate: 1.5,
      payFrequency: "biweekly",
      experienceYears: 2,
      transportRequired: false,
      urgency: "within_month",
    },
  },
  {
    id: "tpl-welder",
    name: "Welder",
    category: "manufacturing",
    icon: "Flame",
    fields: {
      title: "Welder (MIG/TIG)",
      department: "Manufacturing",
      description:
        "What you will do each day:\n" +
        "- Weld metal parts using MIG and TIG processes\n" +
        "- Read blueprints and weld symbols\n" +
        "- Grind and finish welded joints\n" +
        "- Inspect your own welds for defects\n" +
        "- Maintain welding equipment and keep area clean",
      requirements: [
        "AWS welding certification or equivalent",
        "2+ years welding experience (MIG and TIG)",
        "Can read blueprints and weld symbols",
        "Pass a weld test during interview",
      ],
      physicalRequirements: ["Lift 50lbs", "Stand 8+ hours", "Work in hot environments", "Repetitive motions"],
      certifications: ["AWS Welding Cert"],
      benefits: ["Overtime Pay", "Health Insurance", "Dental Insurance", "PPE Provided", "Tool Allowance"],
      skills: ["mig-welding", "tig-welding", "blueprints", "grinding", "metal-fabrication"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Thu 6:00am - 4:30pm (4x10s)",
      hourlyPayMin: 20,
      hourlyPayMax: 32,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 2,
      transportRequired: true,
      urgency: "within_week",
    },
  },
  {
    id: "tpl-retail-associate",
    name: "Retail Associate",
    category: "retail",
    icon: "ShoppingBag",
    fields: {
      title: "Retail Sales Associate",
      department: "Retail",
      description:
        "What you will do each day:\n" +
        "- Help customers find what they need\n" +
        "- Run the cash register and process payments\n" +
        "- Stock shelves and keep store looking neat\n" +
        "- Set up displays and signage\n" +
        "- Open or close the store as scheduled",
      requirements: [
        "Friendly and comfortable talking to customers",
        "Can handle cash and use a register",
        "Reliable — show up for every shift",
      ],
      physicalRequirements: ["Stand 8+ hours", "Lift 25lbs", "Walk/move constantly"],
      certifications: [],
      benefits: ["Employee Discount", "Flexible Schedule", "Paid Time Off", "Holiday Pay", "Health Insurance"],
      skills: ["customer-service", "cash-register", "merchandising", "inventory", "sales"],
      type: "part-time",
      payType: "hourly",
      shiftType: "flexible",
      shiftSchedule: "Varies — weekdays and weekends, 20-35 hrs/week",
      hourlyPayMin: 14,
      hourlyPayMax: 18,
      overtimeRate: null,
      payFrequency: "biweekly",
      experienceYears: 0,
      transportRequired: false,
      urgency: "immediate",
    },
  },
  {
    id: "tpl-home-health-aide",
    name: "Home Health Aide",
    category: "healthcare",
    icon: "Heart",
    fields: {
      title: "Home Health Aide (HHA)",
      department: "Healthcare",
      description:
        "What you will do each day:\n" +
        "- Help patients with daily activities (bathing, dressing, meals)\n" +
        "- Take and record vital signs\n" +
        "- Remind patients to take medications\n" +
        "- Light housekeeping and meal preparation\n" +
        "- Document care notes after each visit",
      requirements: [
        "HHA or CNA certification",
        "1+ year of caregiving experience",
        "Patient, kind, and dependable",
        "Valid driver's license and reliable car",
      ],
      physicalRequirements: ["Lift 50lbs", "Stand/walk for extended periods", "Help patients move/transfer"],
      certifications: ["HHA", "First Aid/CPR"],
      benefits: ["Flexible Schedule", "Weekly Pay", "Health Insurance", "Mileage Reimbursement", "Paid Training"],
      skills: ["caregiving", "vital-signs", "patient-care", "first-aid", "documentation"],
      type: "full-time",
      payType: "hourly",
      shiftType: "flexible",
      shiftSchedule: "Mon-Fri, shifts vary by patient (8am-6pm window)",
      hourlyPayMin: 15,
      hourlyPayMax: 22,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 1,
      transportRequired: true,
      urgency: "immediate",
    },
  },
  {
    id: "tpl-prep-cook",
    name: "Prep Cook",
    category: "food_service",
    icon: "UtensilsCrossed",
    fields: {
      title: "Prep Cook",
      department: "Kitchen",
      description:
        "What you will do each day:\n" +
        "- Wash, peel, chop, and portion ingredients\n" +
        "- Prepare sauces, marinades, and dressings\n" +
        "- Label and store prepped items properly\n" +
        "- Keep prep area clean and sanitized\n" +
        "- Help with receiving deliveries",
      requirements: [
        "Basic knife skills",
        "Can follow recipes and portioning instructions",
        "Dependable — kitchen counts on you to have food ready",
      ],
      physicalRequirements: ["Stand 8+ hours", "Lift 50lbs", "Work in cold/hot environments", "Repetitive motions"],
      certifications: ["Food Handler's Card"],
      benefits: ["Staff Meals", "Flexible Schedule", "Training Provided", "Growth to Line Cook"],
      skills: ["food-prep", "knife-skills", "food-safety", "organization"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Tue-Sat 7:00am - 3:00pm",
      hourlyPayMin: 14,
      hourlyPayMax: 18,
      overtimeRate: null,
      payFrequency: "biweekly",
      experienceYears: 0,
      transportRequired: false,
      urgency: "immediate",
    },
  },
  {
    id: "tpl-electrician-apprentice",
    name: "Electrician (Apprentice)",
    category: "trades",
    icon: "Zap",
    fields: {
      title: "Electrical Apprentice",
      department: "Electrical",
      description:
        "What you will do each day:\n" +
        "- Assist journeyman electricians on job sites\n" +
        "- Pull wire, mount boxes, and install conduit\n" +
        "- Carry tools and materials to work areas\n" +
        "- Learn electrical codes and safe work practices\n" +
        "- Attend classroom training as required",
      requirements: [
        "Enrolled in or willing to start apprenticeship program",
        "High school diploma or GED",
        "Willing to learn and take direction",
        "Reliable transportation",
      ],
      physicalRequirements: ["Lift 50lbs", "Climb ladders", "Work outdoors", "Stand all day"],
      certifications: [],
      benefits: ["Overtime Pay", "Health Insurance", "Paid Training", "Tool Allowance", "Career Path to Journeyman"],
      skills: ["electrical", "hand-tools", "construction", "safety"],
      type: "full-time",
      payType: "hourly",
      shiftType: "day",
      shiftSchedule: "Mon-Fri 7:00am - 3:30pm",
      hourlyPayMin: 16,
      hourlyPayMax: 22,
      overtimeRate: 1.5,
      payFrequency: "weekly",
      experienceYears: 0,
      transportRequired: true,
      urgency: "within_week",
    },
  },
] as const;
