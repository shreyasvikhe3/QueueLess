import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

function generate10kQueueHistory() {
  const serviceTypes = [
    { serviceId: 'serv-1', name: 'General OPD Consultation', avgTime: 6 },
    { serviceId: 'serv-2', name: 'Blood Sample Collection', avgTime: 4 },
    { serviceId: 'serv-3', name: 'Income & Domicile Certificate', avgTime: 8 }
  ];

  const history = [];
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  for (let i = 1; i <= 10000; i++) {
    const s = serviceTypes[i % serviceTypes.length];
    const peopleAhead = (i % 25);
    const activeCounters = (i % 3) + 1;
    const hour = (i % 10) + 8; // 8 AM - 6 PM
    const dayOfWeek = (i % 7);
    const randomOffsetMs = Math.floor(Math.random() * thirtyDaysMs);
    const timestamp = new Date(now - randomOffsetMs).toISOString();

    // Actual wait calculation with peak hour factors
    const peakSurge = (hour >= 11 && hour <= 14) ? 1.2 : 1.0;
    const baseWait = (peopleAhead * s.avgTime) / activeCounters;
    const actualWaitMinutes = Math.max(1, Math.round(baseWait * peakSurge + (Math.random() * 3 - 1.5)));

    history.push({
      historyId: `hist-10k-${i}`,
      tokenId: `tok-hist-${i}`,
      serviceId: s.serviceId,
      serviceType: s.name,
      peopleAhead,
      activeCounters,
      averageServiceTime: s.avgTime,
      queueLength: peopleAhead + (i % 5) + 1,
      hour,
      dayOfWeek,
      recentSkippedCount: i % 3,
      actualWaitMinutes,
      createdAt: timestamp
    });
  }

  return history;
}

class DataStore {
  constructor() {
    this.users = [
      {
        userId: 'usr-admin-1',
        name: 'System Admin',
        email: 'admin@queueless.com',
        passwordHash: DEFAULT_PASSWORD_HASH,
        phone: '+1 800 555 0199',
        role: 'ADMIN',
        fcmToken: null,
        createdAt: new Date().toISOString()
      },
      {
        userId: 'usr-staff-1',
        name: 'Dr. Sarah Connor (Staff)',
        email: 'staff1@queueless.com',
        passwordHash: DEFAULT_PASSWORD_HASH,
        phone: '+1 800 555 0122',
        role: 'STAFF',
        fcmToken: null,
        createdAt: new Date().toISOString()
      },
      {
        userId: 'usr-staff-2',
        name: 'Officer John Smith (Staff)',
        email: 'staff2@queueless.com',
        passwordHash: DEFAULT_PASSWORD_HASH,
        phone: '+1 800 555 0144',
        role: 'STAFF',
        fcmToken: null,
        createdAt: new Date().toISOString()
      },
      {
        userId: 'usr-user-1',
        name: 'Alice Johnson',
        email: 'user1@queueless.com',
        passwordHash: DEFAULT_PASSWORD_HASH,
        phone: '+1 555 011 2233',
        role: 'USER',
        fcmToken: null,
        createdAt: new Date().toISOString()
      },
      {
        userId: 'usr-user-2',
        name: 'Bob Williams',
        email: 'user2@queueless.com',
        passwordHash: DEFAULT_PASSWORD_HASH,
        phone: '+1 555 011 4455',
        role: 'USER',
        fcmToken: null,
        createdAt: new Date().toISOString()
      }
    ];

    this.organizations = [
      {
        organizationId: 'org-1',
        name: 'City Central Hospital',
        address: '100 Medical Center Way, Downtown',
        contactEmail: 'contact@cityhospital.org',
        createdAt: new Date().toISOString()
      },
      {
        organizationId: 'org-2',
        name: 'Metropolitan Public Civic Center',
        address: '500 Civic Square Plaza',
        contactEmail: 'info@civiccenter.gov',
        createdAt: new Date().toISOString()
      }
    ];

    this.departments = [
      {
        departmentId: 'dept-1',
        organizationId: 'org-1',
        name: 'Outpatient OPD & Consultation',
        description: 'General medical examination and doctor consultations'
      },
      {
        departmentId: 'dept-2',
        organizationId: 'org-1',
        name: 'Pathology & Diagnostic Lab',
        description: 'Blood collection and diagnostic sample testing'
      },
      {
        departmentId: 'dept-3',
        organizationId: 'org-2',
        name: 'Citizens Certification & Licensing',
        description: 'Official birth, income, and residence certificates'
      }
    ];

    this.services = [
      {
        serviceId: 'serv-1',
        departmentId: 'dept-1',
        name: 'General OPD Consultation',
        prefix: 'A',
        averageServiceTime: 6,
        description: 'Physician health evaluation'
      },
      {
        serviceId: 'serv-2',
        departmentId: 'dept-2',
        name: 'Blood Sample Collection',
        prefix: 'B',
        averageServiceTime: 4,
        description: 'Phlebotomy and lab sampling'
      },
      {
        serviceId: 'serv-3',
        departmentId: 'dept-3',
        name: 'Income & Domicile Certificate',
        prefix: 'C',
        averageServiceTime: 8,
        description: 'Verification of state residence and income tax records'
      }
    ];

    this.counters = [
      {
        counterId: 'count-1',
        departmentId: 'dept-1',
        counterNumber: 1,
        staffId: 'usr-staff-1',
        status: 'ACTIVE',
        currentServingTokenId: null
      },
      {
        counterId: 'count-2',
        departmentId: 'dept-2',
        counterNumber: 2,
        staffId: 'usr-staff-2',
        status: 'ACTIVE',
        currentServingTokenId: null
      },
      {
        counterId: 'count-3',
        departmentId: 'dept-3',
        counterNumber: 1,
        staffId: null,
        status: 'ACTIVE',
        currentServingTokenId: null
      }
    ];

    this.tokens = [
      {
        tokenId: 'tok-1001',
        tokenNumber: 'A101',
        userId: 'usr-user-1',
        organizationId: 'org-1',
        departmentId: 'dept-1',
        serviceId: 'serv-1',
        counterId: 'count-1',
        status: 'SERVING',
        qrCodeData: 'QUELESS:A101:tok-1001',
        peopleAhead: 0,
        estimatedWaitMinutes: 0,
        confidenceRange: '0-2 mins',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
        checkedInAt: new Date(Date.now() - 12 * 60000).toISOString(),
        calledAt: new Date(Date.now() - 5 * 60000).toISOString(),
        servingStartedAt: new Date(Date.now() - 4 * 60000).toISOString(),
        completedAt: null
      },
      {
        tokenId: 'tok-1002',
        tokenNumber: 'A102',
        userId: 'usr-user-2',
        organizationId: 'org-1',
        departmentId: 'dept-1',
        serviceId: 'serv-1',
        counterId: null,
        status: 'WAITING',
        qrCodeData: 'QUELESS:A102:tok-1002',
        peopleAhead: 1,
        estimatedWaitMinutes: 6,
        confidenceRange: '5-8 mins',
        createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
        checkedInAt: null,
        calledAt: null,
        servingStartedAt: null,
        completedAt: null
      }
    ];

    this.counters[0].currentServingTokenId = 'tok-1001';

    // Populate 10,000 historical dataset entries
    this.queueHistory = generate10kQueueHistory();
  }
}

export const store = new DataStore();
