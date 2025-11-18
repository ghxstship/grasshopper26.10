/**
 * Organizational Hierarchy Seed Data
 * Comprehensive catalog of departments, teams, and positions
 * for standardized team organization, reporting, and analytics
 */

export interface Position {
  code: string;
  title: string;
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
  description?: string;
  alternateNames?: string[];
  requiredCertifications?: string[];
  typicalResponsibilities?: string[];
}

export interface Team {
  code: string;
  name: string;
  description?: string;
  positions: Position[];
}

export interface Department {
  code: string;
  name: string;
  description?: string;
  teams: Team[];
}

export const ORGANIZATIONAL_HIERARCHY: Department[] = [
  {
    code: '0000',
    name: 'Executive',
    description: 'C-suite and executive leadership',
    teams: [
      {
        code: '0100',
        name: 'Executive Leadership',
        description: 'C-level executives and senior leadership',
        positions: [
          { code: '0101', title: 'Chief Executive Officer', level: 'executive', alternateNames: ['CEO'] },
          { code: '0102', title: 'Chief Operating Officer', level: 'executive', alternateNames: ['COO'] },
          { code: '0103', title: 'Chief Financial Officer', level: 'executive', alternateNames: ['CFO'] },
          { code: '0104', title: 'Chief Technology Officer', level: 'executive', alternateNames: ['CTO'] },
          { code: '0105', title: 'Chief Marketing Officer', level: 'executive', alternateNames: ['CMO'] },
          { code: '0106', title: 'Chief Creative Officer', level: 'executive', alternateNames: ['CCO'] },
          { code: '0107', title: 'Chief Experience Officer', level: 'executive', alternateNames: ['CXO'] },
          { code: '0108', title: 'President', level: 'executive' },
          { code: '0109', title: 'Vice President', level: 'executive', alternateNames: ['VP'] },
        ],
      },
    ],
  },
  {
    code: '1000',
    name: 'Creative',
    description: 'Creative design, content, and production',
    teams: [
      {
        code: '1100',
        name: 'Creative Direction',
        positions: [
          { code: '1101', title: 'Creative Director', level: 'director' },
          { code: '1102', title: 'Associate Creative Director', level: 'senior' },
          { code: '1103', title: 'Art Director', level: 'senior' },
          { code: '1104', title: 'Senior Designer', level: 'senior' },
          { code: '1105', title: 'Designer', level: 'mid' },
          { code: '1106', title: 'Junior Designer', level: 'entry' },
        ],
      },
      {
        code: '1200',
        name: 'Content Production',
        positions: [
          { code: '1201', title: 'Content Director', level: 'director' },
          { code: '1202', title: 'Content Producer', level: 'senior' },
          { code: '1203', title: 'Video Producer', level: 'mid' },
          { code: '1204', title: 'Photographer', level: 'mid' },
          { code: '1205', title: 'Videographer', level: 'mid' },
          { code: '1206', title: 'Editor', level: 'mid' },
          { code: '1207', title: 'Motion Graphics Designer', level: 'mid' },
        ],
      },
      {
        code: '1300',
        name: 'Brand & Identity',
        positions: [
          { code: '1301', title: 'Brand Director', level: 'director' },
          { code: '1302', title: 'Brand Manager', level: 'manager' },
          { code: '1303', title: 'Brand Strategist', level: 'senior' },
          { code: '1304', title: 'Copywriter', level: 'mid' },
          { code: '1305', title: 'Senior Copywriter', level: 'senior' },
        ],
      },
    ],
  },
  {
    code: '2000',
    name: 'Marketing',
    description: 'Marketing, advertising, and promotions',
    teams: [
      {
        code: '2100',
        name: 'Marketing Strategy',
        positions: [
          { code: '2101', title: 'Marketing Director', level: 'director' },
          { code: '2102', title: 'Marketing Manager', level: 'manager' },
          { code: '2103', title: 'Marketing Strategist', level: 'senior' },
          { code: '2104', title: 'Marketing Coordinator', level: 'mid' },
          { code: '2105', title: 'Marketing Assistant', level: 'entry' },
        ],
      },
      {
        code: '2200',
        name: 'Digital Marketing',
        positions: [
          { code: '2201', title: 'Digital Marketing Director', level: 'director' },
          { code: '2202', title: 'Digital Marketing Manager', level: 'manager' },
          { code: '2203', title: 'Social Media Manager', level: 'manager' },
          { code: '2204', title: 'Social Media Coordinator', level: 'mid' },
          { code: '2205', title: 'SEO Specialist', level: 'mid' },
          { code: '2206', title: 'SEM Specialist', level: 'mid' },
          { code: '2207', title: 'Email Marketing Specialist', level: 'mid' },
        ],
      },
      {
        code: '2300',
        name: 'Public Relations',
        positions: [
          { code: '2301', title: 'PR Director', level: 'director' },
          { code: '2302', title: 'PR Manager', level: 'manager' },
          { code: '2303', title: 'PR Specialist', level: 'mid' },
          { code: '2304', title: 'Media Relations Specialist', level: 'mid' },
          { code: '2305', title: 'Communications Coordinator', level: 'mid' },
        ],
      },
      {
        code: '2400',
        name: 'Sponsorship',
        positions: [
          { code: '2401', title: 'Sponsorship Director', level: 'director' },
          { code: '2402', title: 'Sponsorship Manager', level: 'manager' },
          { code: '2403', title: 'Sponsorship Coordinator', level: 'mid' },
          { code: '2404', title: 'Partnership Manager', level: 'manager' },
          { code: '2405', title: 'Account Executive', level: 'mid' },
        ],
      },
    ],
  },
  {
    code: '3000',
    name: 'Talent',
    description: 'Artist relations, booking, and talent management',
    teams: [
      {
        code: '3100',
        name: 'Talent Buying',
        positions: [
          { code: '3101', title: 'Talent Director', level: 'director' },
          { code: '3102', title: 'Talent Buyer', level: 'senior' },
          { code: '3103', title: 'Booking Agent', level: 'mid' },
          { code: '3104', title: 'Talent Coordinator', level: 'mid' },
        ],
      },
      {
        code: '3200',
        name: 'Artist Relations',
        positions: [
          { code: '3201', title: 'Artist Relations Director', level: 'director' },
          { code: '3202', title: 'Artist Relations Manager', level: 'manager' },
          { code: '3203', title: 'Artist Liaison', level: 'mid' },
          { code: '3204', title: 'Tour Manager', level: 'senior' },
        ],
      },
    ],
  },
  {
    code: '4000',
    name: 'Production',
    description: 'Event production, technical, and stage management',
    teams: [
      {
        code: '4100',
        name: 'Production Management',
        positions: [
          { code: '4101', title: 'Production Director', level: 'director' },
          { code: '4102', title: 'Production Manager', level: 'manager' },
          { code: '4103', title: 'Assistant Production Manager', level: 'senior' },
          { code: '4104', title: 'Production Coordinator', level: 'mid' },
          { code: '4105', title: 'Production Assistant', level: 'entry' },
        ],
      },
      {
        code: '4200',
        name: 'Stage Management',
        positions: [
          { code: '4201', title: 'Stage Manager', level: 'manager' },
          { code: '4202', title: 'Assistant Stage Manager', level: 'senior' },
          { code: '4203', title: 'Stage Hand', level: 'entry' },
          { code: '4204', title: 'Deck Chief', level: 'lead' },
        ],
      },
      {
        code: '4300',
        name: 'Audio',
        positions: [
          { code: '4301', title: 'Audio Director', level: 'director' },
          { code: '4302', title: 'Front of House Engineer', level: 'senior', alternateNames: ['FOH Engineer'] },
          { code: '4303', title: 'Monitor Engineer', level: 'senior' },
          { code: '4304', title: 'System Engineer', level: 'senior' },
          { code: '4305', title: 'Audio Technician', level: 'mid', alternateNames: ['A1', 'A2'] },
          { code: '4306', title: 'RF Technician', level: 'mid' },
        ],
      },
      {
        code: '4400',
        name: 'Lighting',
        positions: [
          { code: '4401', title: 'Lighting Director', level: 'director', alternateNames: ['LD'] },
          { code: '4402', title: 'Lighting Designer', level: 'senior' },
          { code: '4403', title: 'Lighting Programmer', level: 'senior' },
          { code: '4404', title: 'Lighting Technician', level: 'mid' },
          { code: '4405', title: 'Followspot Operator', level: 'entry' },
        ],
      },
      {
        code: '4500',
        name: 'Video',
        positions: [
          { code: '4501', title: 'Video Director', level: 'director' },
          { code: '4502', title: 'Video Engineer', level: 'senior' },
          { code: '4503', title: 'LED Technician', level: 'mid' },
          { code: '4504', title: 'Camera Operator', level: 'mid' },
          { code: '4505', title: 'Projectionist', level: 'mid' },
        ],
      },
      {
        code: '4600',
        name: 'Rigging',
        positions: [
          { code: '4601', title: 'Head Rigger', level: 'lead', requiredCertifications: ['ETCP Rigging'] },
          { code: '4602', title: 'Rigger', level: 'mid', requiredCertifications: ['ETCP Rigging'] },
          { code: '4603', title: 'Ground Rigger', level: 'entry' },
        ],
      },
    ],
  },
  {
    code: '5000',
    name: 'Operations',
    description: 'Site operations, logistics, and infrastructure',
    teams: [
      {
        code: '5100',
        name: 'Site Operations',
        positions: [
          { code: '5101', title: 'Site Director', level: 'director' },
          { code: '5102', title: 'Site Manager', level: 'manager' },
          { code: '5103', title: 'Site Coordinator', level: 'mid' },
          { code: '5104', title: 'Site Supervisor', level: 'lead' },
        ],
      },
      {
        code: '5200',
        name: 'Logistics',
        positions: [
          { code: '5201', title: 'Logistics Director', level: 'director' },
          { code: '5202', title: 'Logistics Manager', level: 'manager' },
          { code: '5203', title: 'Logistics Coordinator', level: 'mid' },
          { code: '5204', title: 'Warehouse Manager', level: 'manager' },
          { code: '5205', title: 'Freight Coordinator', level: 'mid' },
        ],
      },
      {
        code: '5300',
        name: 'Transportation',
        positions: [
          { code: '5301', title: 'Transportation Manager', level: 'manager' },
          { code: '5302', title: 'Transportation Coordinator', level: 'mid' },
          { code: '5303', title: 'Driver', level: 'entry', requiredCertifications: ['CDL'] },
          { code: '5304', title: 'Shuttle Coordinator', level: 'mid' },
        ],
      },
      {
        code: '5400',
        name: 'Facilities',
        positions: [
          { code: '5401', title: 'Facilities Manager', level: 'manager' },
          { code: '5402', title: 'Facilities Coordinator', level: 'mid' },
          { code: '5403', title: 'Maintenance Technician', level: 'mid' },
          { code: '5404', title: 'Electrician', level: 'mid', requiredCertifications: ['Licensed Electrician'] },
          { code: '5405', title: 'Plumber', level: 'mid', requiredCertifications: ['Licensed Plumber'] },
        ],
      },
    ],
  },
  {
    code: '6000',
    name: 'Experience',
    description: 'Guest services, accessibility, and customer experience',
    teams: [
      {
        code: '6100',
        name: 'Guest Experience',
        positions: [
          { code: '6101', title: 'Guest Experience Director', level: 'director' },
          { code: '6102', title: 'Guest Services Manager', level: 'manager' },
          { code: '6103', title: 'Guest Services Supervisor', level: 'lead' },
          { code: '6104', title: 'Guest Services Representative', level: 'entry' },
          { code: '6105', title: 'Concierge', level: 'mid' },
        ],
      },
      {
        code: '6200',
        name: 'Accessibility Services',
        positions: [
          { code: '6201', title: 'Accessibility Director', level: 'director' },
          { code: '6202', title: 'Accessibility Manager', level: 'manager' },
          { code: '6203', title: 'Accessibility Coordinator', level: 'mid' },
          { code: '6204', title: 'ADA Compliance Specialist', level: 'senior' },
        ],
      },
      {
        code: '6300',
        name: 'Ticketing & Box Office',
        positions: [
          { code: '6301', title: 'Box Office Manager', level: 'manager' },
          { code: '6302', title: 'Box Office Supervisor', level: 'lead' },
          { code: '6303', title: 'Box Office Agent', level: 'entry' },
          { code: '6304', title: 'Will Call Coordinator', level: 'mid' },
        ],
      },
    ],
  },
  {
    code: '7000',
    name: 'Hospitality',
    description: 'Food & beverage, catering, and VIP services',
    teams: [
      {
        code: '7100',
        name: 'Food & Beverage',
        positions: [
          { code: '7101', title: 'F&B Director', level: 'director' },
          { code: '7102', title: 'F&B Manager', level: 'manager' },
          { code: '7103', title: 'Catering Manager', level: 'manager' },
          { code: '7104', title: 'Chef', level: 'senior' },
          { code: '7105', title: 'Sous Chef', level: 'mid' },
          { code: '7106', title: 'Line Cook', level: 'entry' },
          { code: '7107', title: 'Bartender', level: 'entry', requiredCertifications: ['TIPS', 'ServSafe'] },
          { code: '7108', title: 'Server', level: 'entry', requiredCertifications: ['Food Handler'] },
        ],
      },
      {
        code: '7200',
        name: 'VIP Services',
        positions: [
          { code: '7201', title: 'VIP Services Director', level: 'director' },
          { code: '7202', title: 'VIP Services Manager', level: 'manager' },
          { code: '7203', title: 'VIP Host', level: 'mid' },
          { code: '7204', title: 'Hospitality Coordinator', level: 'mid' },
        ],
      },
    ],
  },
  {
    code: '8000',
    name: 'Entertainment',
    description: 'Performers, talent, and entertainment programming',
    teams: [
      {
        code: '8100',
        name: 'Entertainment Programming',
        positions: [
          { code: '8101', title: 'Entertainment Director', level: 'director' },
          { code: '8102', title: 'Entertainment Manager', level: 'manager' },
          { code: '8103', title: 'Entertainment Coordinator', level: 'mid' },
        ],
      },
      {
        code: '8200',
        name: 'Performers',
        positions: [
          { code: '8201', title: 'Headliner', level: 'executive' },
          { code: '8202', title: 'Featured Artist', level: 'senior' },
          { code: '8203', title: 'Supporting Artist', level: 'mid' },
          { code: '8204', title: 'DJ', level: 'mid' },
          { code: '8205', title: 'MC/Host', level: 'mid' },
          { code: '8206', title: 'Dancer', level: 'mid' },
          { code: '8207', title: 'Acrobat', level: 'mid' },
        ],
      },
    ],
  },
  {
    code: '9000',
    name: 'Technology',
    description: 'IT, software development, and technical infrastructure',
    teams: [
      {
        code: '9100',
        name: 'Engineering',
        positions: [
          { code: '9101', title: 'VP of Engineering', level: 'executive' },
          { code: '9102', title: 'Engineering Manager', level: 'manager' },
          { code: '9103', title: 'Tech Lead', level: 'lead' },
          { code: '9104', title: 'Senior Software Engineer', level: 'senior' },
          { code: '9105', title: 'Software Engineer', level: 'mid' },
          { code: '9106', title: 'Junior Software Engineer', level: 'entry' },
        ],
      },
      {
        code: '9200',
        name: 'Product',
        positions: [
          { code: '9201', title: 'VP of Product', level: 'executive' },
          { code: '9202', title: 'Product Manager', level: 'manager' },
          { code: '9203', title: 'Product Owner', level: 'senior' },
          { code: '9204', title: 'Product Designer', level: 'mid' },
          { code: '9205', title: 'UX Researcher', level: 'mid' },
        ],
      },
      {
        code: '9300',
        name: 'IT Operations',
        positions: [
          { code: '9301', title: 'IT Director', level: 'director' },
          { code: '9302', title: 'IT Manager', level: 'manager' },
          { code: '9303', title: 'Systems Administrator', level: 'senior' },
          { code: '9304', title: 'Network Engineer', level: 'senior' },
          { code: '9305', title: 'IT Support Specialist', level: 'mid' },
          { code: '9306', title: 'Help Desk Technician', level: 'entry' },
        ],
      },
      {
        code: '9400',
        name: 'Data & Analytics',
        positions: [
          { code: '9401', title: 'Data Director', level: 'director' },
          { code: '9402', title: 'Data Engineer', level: 'senior' },
          { code: '9403', title: 'Data Analyst', level: 'mid' },
          { code: '9404', title: 'Business Intelligence Analyst', level: 'mid' },
        ],
      },
    ],
  },
];
