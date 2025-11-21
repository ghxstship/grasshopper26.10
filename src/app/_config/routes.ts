/**
 * Centralized Route Configuration
 * Single source of truth for all application routes
 */

export const routes = {
  // Public routes
  public: {
    home: '/',
    about: '/about',
    blog: '/blog',
    careers: '/careers',
    contact: '/contact',
    press: '/press',
    pricing: '/pricing',
    privacy: '/privacy',
    security: '/security',
    terms: '/terms',
  },

  // Auth routes
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    connectWallet: '/auth/connect-wallet',
    onboarding: '/auth/onboarding',
  },

  // Authenticated user routes
  authenticated: {
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings',
    notifications: '/notifications',
    orders: '/orders',
    wallet: '/wallet',
    wishlist: '/wishlist',
  },

  // GVTEWAY platform routes
  gvteway: {
    events: {
      list: '/events',
      detail: (id: string) => `/events/${id}`,
      search: '/events/search',
      create: '/events/create',
    },
    tickets: {
      list: '/tickets',
      checkout: '/tickets/checkout',
      sell: (id: string) => `/tickets/sell/${id}`,
    },
    adventures: {
      list: '/adventures',
      detail: (id: string) => `/adventures/${id}`,
      bookings: '/adventures/bookings',
      tours: '/adventures/tours',
      vip: '/adventures/vip',
      meetGreet: '/adventures/meet-greet',
    },
    marketplace: {
      list: '/marketplace',
      detail: (id: string) => `/marketplace/${id}`,
    },
    memberships: {
      list: '/memberships',
      detail: (id: string) => `/memberships/${id}`,
    },
    cart: '/cart',
    checkout: {
      main: '/checkout',
      success: '/checkout/success',
    },
    search: '/search',
    social: '/social',
    analytics: {
      main: '/analytics',
      events: '/analytics/events',
      personal: '/analytics/personal',
      recommendations: '/analytics/recommendations',
      spending: '/analytics/spending',
    },
  },

  // ATLVS platform routes
  atlvs: {
    overview: '/atlvs/overview',
    advancing: {
      main: '/atlvs/advancing',
      catalog: '/atlvs/advancing/catalog',
      requests: '/atlvs/advancing/requests',
      approvals: '/atlvs/advancing/approvals',
      history: '/atlvs/advancing/history',
    },
    projects: {
      list: '/atlvs/projects',
      detail: (id: string) => `/atlvs/projects/${id}`,
      create: '/atlvs/projects/create',
      templates: '/atlvs/projects/templates',
      archive: '/atlvs/projects/archive',
    },
    tasks: {
      list: '/atlvs/tasks',
      board: '/atlvs/tasks/board',
      calendar: '/atlvs/tasks/calendar',
      detail: (id: string) => `/atlvs/tasks/${id}`,
    },
    teams: {
      list: '/atlvs/teams',
      detail: (id: string) => `/atlvs/teams/${id}`,
      members: '/atlvs/teams/members',
      roles: '/atlvs/teams/roles',
    },
    budgets: {
      list: '/atlvs/budgets',
      detail: (id: string) => `/atlvs/budgets/${id}`,
      forecasting: '/atlvs/budgets/forecasting',
      reports: '/atlvs/budgets/reports',
    },
    vendors: {
      list: '/atlvs/vendors',
      detail: (id: string) => `/atlvs/vendors/${id}`,
      contracts: '/atlvs/vendors/contracts',
    },
    documents: {
      list: '/atlvs/documents',
      contracts: '/atlvs/documents/contracts',
      invoices: '/atlvs/documents/invoices',
      reports: '/atlvs/documents/reports',
    },
    assets: {
      list: '/atlvs/assets',
      inventory: '/atlvs/assets/inventory',
      tracking: '/atlvs/assets/tracking',
    },
    analytics: {
      main: '/atlvs/analytics',
      projects: '/atlvs/analytics/projects',
      resources: '/atlvs/analytics/resources',
      performance: '/atlvs/analytics/performance',
    },
    calendar: '/atlvs/calendar',
    settings: '/atlvs/settings',
    n8n: '/atlvs/n8n',
  },

  // COMPVSS platform routes
  compvss: {
    overview: '/compvss/overview',
    advancing: {
      main: '/compvss/advancing',
      requests: '/compvss/advancing/requests',
      approvals: '/compvss/advancing/approvals',
    },
    compensation: {
      list: '/compvss/compensation',
      detail: (id: string) => `/compvss/compensation/${id}`,
      packages: '/compvss/compensation/packages',
      tiers: '/compvss/compensation/tiers',
    },
    settlements: {
      list: '/compvss/settlements',
      detail: (id: string) => `/compvss/settlements/${id}`,
      pending: '/compvss/settlements/pending',
      history: '/compvss/settlements/history',
    },
    expenses: {
      list: '/compvss/expenses',
      submit: '/compvss/expenses/submit',
      approvals: '/compvss/expenses/approvals',
    },
    payroll: {
      main: '/compvss/payroll',
      processing: '/compvss/payroll/processing',
      reports: '/compvss/payroll/reports',
    },
    affiliates: {
      list: '/compvss/affiliates',
      detail: (id: string) => `/compvss/affiliates/${id}`,
      commissions: '/compvss/affiliates/commissions',
    },
    credentials: {
      list: '/compvss/credentials',
      verify: '/compvss/credentials/verify',
    },
    dayOfShow: {
      main: '/compvss/day-of-show',
      checkin: '/compvss/day-of-show/checkin',
      roster: '/compvss/day-of-show/roster',
    },
    issues: {
      list: '/compvss/issues',
      detail: (id: string) => `/compvss/issues/${id}`,
    },
    reports: {
      main: '/compvss/reports',
      financial: '/compvss/reports/financial',
      compliance: '/compvss/reports/compliance',
    },
    settings: '/compvss/settings',
  },

  // API routes
  api: {
    auth: '/api/auth',
    events: '/api/events',
    tickets: '/api/tickets',
    users: '/api/users',
    // Add more as needed
  },
} as const;

// Type helper for route parameters
export type RouteParams = {
  [K in keyof typeof routes]: typeof routes[K];
};
