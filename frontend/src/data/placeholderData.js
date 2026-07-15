// Placeholder / mock data only — no backend wired up.

export const currentUser = {
  name: 'Pramod',
  initials: 'P',
  role: 'Workspace owner',
};

export const chatHistory = [
  { id: 'c1', title: 'Pramod_M_R_Resume.pdf', preview: 'What certifications does he have?', active: true, time: '10:44 AM' },
  { id: 'c2', title: 'Q3_Financial_Report.pdf', preview: 'Summarize the revenue growth', active: false, time: 'Yesterday' },
  { id: 'c3', title: 'Research_Paper_NLP.pdf', preview: 'Explain the methodology section', active: false, time: 'Mon' },
  { id: 'c4', title: 'Employee_Handbook.pdf', preview: 'What is the leave policy?', active: false, time: 'Sat' },
];

export const uploadedDocuments = [
  { id: 'd1', name: 'Pramod_M_R_Resume.pdf', size: '1.2 MB', uploadedAt: 'Uploaded just now', status: 'ready' },
  { id: 'd2', name: 'Q3_Financial_Report.pdf', size: '3.4 MB', uploadedAt: 'Uploaded 2 days ago', status: 'ready' },
  { id: 'd3', name: 'Research_Paper_NLP.pdf', size: '840 KB', uploadedAt: 'Uploaded 4 days ago', status: 'ready' },
];

export const activeDocument = uploadedDocuments[0];

export const initialMessages = [
  {
    id: 'm1',
    role: 'user',
    text: 'What projects has Pramod worked on?',
    time: '10:42 AM',
  },
  {
    id: 'm2',
    role: 'assistant',
    text: 'Pramod has worked on the following projects:',
    list: [
      'PitchPair – AI influencer-brand platform',
      'FloodIt Game – Java-based puzzle game',
      'Greedy Grid Game – Java-based strategic game',
      'HabitFlow – Habit tracker web application',
      'RoomSync – DBMS project for room management',
    ],
    time: '10:43 AM',
    sources: [
      { id: 's1', label: 'Page 2' },
      { id: 's2', label: 'Page 3' },
      { id: 's3', label: 'Page 4' },
    ],
  },
  {
    id: 'm3',
    role: 'user',
    text: 'What certifications does he have?',
    time: '10:44 AM',
  },
];

export const assistantReplyPool = {
  text: 'Based on the resume, Pramod holds the following certifications:',
  list: [
    'AWS Certified Cloud Practitioner',
    'Meta Front-End Developer Professional Certificate',
    'Oracle Certified Java Programmer',
  ],
  sources: [
    { id: 's4', label: 'Page 5' },
    { id: 's5', label: 'Page 6' },
  ],
};
