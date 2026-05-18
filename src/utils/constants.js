// ─── Diagnosis Groups ──────────────────────────────────────────────────────
export const DIAGNOSIS_GROUPS = {
  'Head & Neck': [
    'Ca Buccal Mucosa', 'Ca Tongue', 'Ca Floor of Mouth', 'Ca Lip',
    'Ca Larynx', 'Ca Hypopharynx', 'Ca Oropharynx', 'Ca Nasopharynx',
    'Ca Thyroid', 'Ca Parotid', 'Sinonasal Tumor', 'Ca Maxilla',
  ],
  'Lung': [
    'Ca Lung (NSCLC)', 'Ca Lung (SCLC)', 'Mesothelioma', 'Lung Carcinoid',
  ],
  'GI': [
    'Ca Esophagus', 'Ca Stomach', 'Ca Pancreas', 'Ca Rectum',
    'Ca Anal Canal', 'Ca Liver (HCC)', 'Ca Gallbladder', 'GIST',
    'Ca Duodenum', 'Ca Colon',
  ],
  'GU': [
    'Ca Prostate', 'Ca Bladder', 'Ca Kidney (RCC)', 'Ca Testis',
    'Ca Penis', 'Ca Urethra', 'Wilms Tumor',
  ],
  'Gynaec': [
    'Ca Cervix', 'Ca Endometrium', 'Ca Ovary', 'Ca Vulva',
    'Ca Vagina', 'Gestational Trophoblastic Neoplasia',
  ],
  'CNS': [
    'Glioblastoma (GBM)', 'Astrocytoma (Grade II)', 'Astrocytoma (Grade III)',
    'Oligodendroglioma', 'Ependymoma', 'Meningioma',
    'Brain Metastasis', 'Spinal Cord Tumor', 'Craniopharyngioma', 'Medulloblastoma',
  ],
  'Lymphoma': [
    "Hodgkin's Lymphoma", "Non-Hodgkin's Lymphoma (DLBCL)",
    "Non-Hodgkin's Lymphoma (Follicular)", 'MALT Lymphoma',
    'Mantle Cell Lymphoma', 'Primary CNS Lymphoma',
  ],
  'Sarcomas': [
    'Osteosarcoma', "Ewing's Sarcoma", 'Soft Tissue Sarcoma',
    'Rhabdomyosarcoma', 'Chondrosarcoma', 'Leiomyosarcoma', 'Liposarcoma',
  ],
  'Palliative': [
    'Bone Metastasis', 'Brain Mets (Palliative)', 'Spinal Cord Compression',
    'Pain Palliation', 'Hemostatic RT', 'Liver Mets', 'Adrenal Mets',
  ],
  'Onco Emergencies': [
    'SVC Syndrome', 'Spinal Cord Compression (Emergency)',
    'Fungating / Bleeding Wound', 'Hemorrhagic Mass',
    'Obstructive Uropathy', 'Acute Stridor',
  ],
};

export const DIAGNOSIS_CATEGORIES = Object.keys(DIAGNOSIS_GROUPS);

// ─── Patient Flags ─────────────────────────────────────────────────────────
export const PATIENT_FLAGS = [
  { id: 'OPD',            label: 'OPD',              color: 'blue'   },
  { id: 'Referred',       label: 'Referred',         color: 'amber'  },
  { id: 'Machine Couch',  label: 'Machine Couch',    color: 'purple' },
  { id: 'Simulation',     label: 'Simulation',       color: 'teal'   },
  { id: 'Follow-up (Cash)', label: 'Follow-up (Cash)', color: 'orange' },
  { id: 'Needs Radiotherapy', label: 'Needs RT',     color: 'red'    },
];

// ─── Payment Types ─────────────────────────────────────────────────────────
export const PAYMENT_TYPES = ['Cash', 'PM-JAYA', 'Insurance', 'Free'];

// ─── Gender Options ────────────────────────────────────────────────────────
export const GENDERS = ['Male', 'Female', 'Other'];

// ─── Month Names ───────────────────────────────────────────────────────────
export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

// ─── Flag color maps ───────────────────────────────────────────────────────
export const FLAG_COLORS = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   ring: 'ring-blue-200'   },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  ring: 'ring-amber-200'  },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   ring: 'ring-teal-200'   },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200' },
  red:    { bg: 'bg-red-50',    text: 'text-red-700',    ring: 'ring-red-200'    },
};

export const PAYMENT_COLORS = {
  Cash:       { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'PM-JAYA':  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  Insurance:  { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  Free:       { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400'   },
};
