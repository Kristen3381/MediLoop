import { create } from 'zustand';
import { authService, referralService } from '../services/api';

// Healthcare Personnel in Kakamega
export const STAFF = {
  DOCTORS: [
    { id: 'dr-1', name: 'Dr. Brian Ochieng', role: 'Doctor' },
    { id: 'dr-2', name: 'Dr. Mercy Akinyi', role: 'Doctor' },
    { id: 'dr-3', name: 'Dr. Kevin Wanyama', role: 'Doctor' },
    { id: 'dr-4', name: 'Dr. Sheila Nabwire', role: 'Doctor' },
    { id: 'dr-5', name: 'Dr. Peter Mwangi', role: 'Doctor' }
  ],
  NURSES: [
    { id: 'ns-1', name: 'Nurse Faith Atieno', role: 'Nurse' },
    { id: 'ns-2', name: 'Nurse John Barasa', role: 'Nurse' },
    { id: 'ns-3', name: 'Nurse Everlyne Naliaka', role: 'Nurse' },
    { id: 'ns-4', name: 'Nurse Collins Kiprono', role: 'Nurse' }
  ],
  ADMINS: [
    { id: 'ad-1', name: 'Admin Ruth Wafula', role: 'Admin' },
    { id: 'ad-2', name: 'Admin Dennis Otieno', role: 'Admin' }
  ],
  EMTS: [
    { id: 'em-1', name: 'EMT Joseph Shikuku', role: 'Ambulance Staff' },
    { id: 'em-2', name: 'EMT Kevin Limo', role: 'Ambulance Staff' }
  ]
};

const INITIAL_FACILITIES = [
  { 
    id: 'FAC-1', 
    name: 'Kakamega County General Hospital (Level 5)', 
    type: 'Level 5 Referral', 
    bedsAvailable: 12, 
    icuAvailable: 2, 
    distance: '0km',
    personnel: [
      STAFF.DOCTORS[0], // Brian
      STAFF.DOCTORS[1], // Mercy
      STAFF.NURSES[0],  // Faith
      STAFF.ADMINS[0],  // Ruth
      STAFF.EMTS[0]     // Joseph (Base)
    ]
  },
  { 
    id: 'FAC-2', 
    name: 'Lumakanda Sub-County Hospital', 
    type: 'Sub-County', 
    bedsAvailable: 5, 
    icuAvailable: 0, 
    distance: '45km',
    personnel: [
      STAFF.DOCTORS[2], // Kevin
      STAFF.NURSES[1]   // John
    ]
  },
  { 
    id: 'FAC-3', 
    name: 'Malava Sub-County Hospital', 
    type: 'Sub-County', 
    bedsAvailable: 8, 
    icuAvailable: 0, 
    distance: '32km',
    personnel: [
      STAFF.DOCTORS[3], // Sheila
      STAFF.NURSES[2]   // Everlyne
    ]
  },
  { 
    id: 'FAC-4', 
    name: 'Navakholo Sub-County Hospital', 
    type: 'Sub-County', 
    bedsAvailable: 4, 
    icuAvailable: 0, 
    distance: '28km',
    personnel: [
      STAFF.DOCTORS[4], // Peter
      STAFF.NURSES[3]   // Collins
    ]
  },
  { id: 'FAC-5', name: 'Butere Sub-County Hospital', type: 'Sub-County', bedsAvailable: 10, icuAvailable: 0, distance: '55km', personnel: [STAFF.ADMINS[1]] },
  { id: 'FAC-6', name: 'Mumias Level 4 Hospital', type: 'Level 4', bedsAvailable: 15, icuAvailable: 1, distance: '42km', personnel: [STAFF.EMTS[1]] },
  { id: 'FAC-7', name: 'Matungu Sub-County Hospital', type: 'Sub-County', bedsAvailable: 6, icuAvailable: 0, distance: '48km', personnel: [] },
  { id: 'FAC-8', name: 'Khwisero Sub-County Hospital', type: 'Sub-County', bedsAvailable: 3, icuAvailable: 0, distance: '38km', personnel: [] },
  { id: 'FAC-9', name: 'St. Mary’s Mission Hospital Mumias', type: 'Private', bedsAvailable: 25, icuAvailable: 4, distance: '40km', personnel: [] },
  { id: 'FAC-10', name: 'Shibwe Hospital', type: 'Sub-County', bedsAvailable: 7, icuAvailable: 0, distance: '12km', personnel: [] }
];

const INITIAL_PATIENTS = [
  { id: 'PAT-1', name: 'Jane Atieno', age: 28, gender: 'Female', phone: '0712345678', condition: 'Severe abdominal pain, possible appendicitis', history: 'No known allergies. History of asthma.' },
  { id: 'PAT-2', name: 'Kiprotich Bett', age: 45, gender: 'Male', phone: '0722334455', condition: 'Multiple trauma from boda-boda accident', history: 'Type 2 Diabetes. On Metformin.' },
  { id: 'PAT-3', name: 'Sarafina Nelima', age: 2, gender: 'Female', phone: '0733445566', condition: 'Severe malaria with anemia', history: 'Born full term. Immunizations up to date.' },
  { id: 'PAT-4', name: 'Omondi Onyango', age: 62, gender: 'Male', phone: '0700112233', condition: 'Hypertensive crisis', history: 'Hypertension diagnosed 2022. Smoker.' }
];

const BACKEND_ROLE_MAP = {
  'DOCTOR': 'Doctor',
  'NURSE': 'Nurse',
  'ADMIN': 'Admin',
  'AMBULANCE': 'Ambulance Staff'
};

export const useStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  patients: INITIAL_PATIENTS,
  referrals: [],
  facilities: INITIAL_FACILITIES,
  notifications: [],
  toasts: [],
  isDark: localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  
  // Auth
  login: async (email, password) => {
    try {
      const data = await authService.login(email, password);
      set({ 
        user: { 
          ...data.user, 
          role: BACKEND_ROLE_MAP[data.user.role] || data.user.role 
        }, 
        token: data.token 
      });
      get().addToast('Login successful');
      return true;
    } catch (error) {
      get().addToast(error.message, 'error');
      return false;
    }
  },
  
  logout: () => {
    authService.logout();
    set({ user: null, token: null });
  },

  // Theme
  toggleTheme: () => set((state) => {
    const nextDark = !state.isDark;
    localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    if (nextDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    return { isDark: nextDark };
  }),
  
  // Patients
  addPatient: (patient) => set((state) => ({
    patients: [
      ...state.patients,
      {
        ...patient,
        id: `PAT-${Math.floor(Math.random() * 10000)}`
      }
    ]
  })),

  updatePatient: (id, updatedData) => set((state) => ({
    patients: state.patients.map(p => p.id === id ? { ...p, ...updatedData } : p)
  })),

  // Referrals
  fetchReferrals: async () => {
    try {
      const referrals = await referralService.getAll();
      set({ referrals });
    } catch (error) {
      get().addToast('Failed to fetch referrals', 'error');
    }
  },

  addReferral: async (referralData) => {
    try {
      const newRef = await referralService.create(referralData);
      set((state) => ({ referrals: [newRef, ...state.referrals] }));
      get().addToast('Referral initiated successfully');
    } catch (error) {
      get().addToast(error.message, 'error');
    }
  },

  updateReferralStatus: async (id, status) => {
    try {
      const updatedRef = await referralService.updateStatus(id, status);
      set((state) => ({
        referrals: state.referrals.map(r => r._id === id ? updatedRef : r)
      }));
      get().addToast(`Referral status updated to ${status}`);
    } catch (error) {
      get().addToast(error.message, 'error');
    }
  },

  addMessage: (referralId, sender, text) => set((state) => ({
    referrals: state.referrals.map(ref => {
      if (ref.id === referralId) {
        return {
          ...ref,
          messages: [...(ref.messages || []), { sender, text, time: new Date().toISOString() }]
        }
      }
      return ref;
    })
  })),

  // Notifications
  markNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  // Toasts
  addToast: (message, type = 'success') => set((state) => {
    const id = Date.now();
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
    return { toasts: [...state.toasts, { id, message, type }] };
  }),
}));

// Role Helpers
export const canEditPatient = (role) => ['Doctor', 'Nurse', 'Admin'].includes(role);
export const canManageReferral = (role) => ['Doctor', 'Nurse', 'Admin'].includes(role);
export const canAcceptReferral = (role) => ['Doctor', 'Admin'].includes(role);
