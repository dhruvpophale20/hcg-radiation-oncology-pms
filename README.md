# HCG Radiation Oncology — Patient Registry

A React + Vite clinical patient management dashboard for Dr. Sarthak Kumar Mohanty, HCG Hospital, Rajkot.

---

## Quick Setup

### 1. Install dependencies

```bash
cd "c:\Users\dhruv\OneDrive\Desktop\PMS"
npm install
```

### 2. Configure Firebase

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com):

1. Click **Add project** → name it (e.g. `hcg-ro-pms`)
2. Go to **Firestore Database** → **Create database** → Start in **test mode**
3. Go to **Project Settings** → **Your apps** → **Web** (`</>`) → register app
4. Copy the `firebaseConfig` object values

Create a `.env.local` file in this folder (copy from `.env.example`):

```bash
copy .env.example .env.local
```

Then fill in your values:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=hcg-ro-pms.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hcg-ro-pms
VITE_FIREBASE_STORAGE_BUCKET=hcg-ro-pms.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Features

| Feature | Description |
|---|---|
| **Patient CRUD** | Add, edit, delete patients with full form validation |
| **Real-time sync** | Firestore `onSnapshot` — changes appear instantly |
| **Month navigation** | Browse any past/future month's registry |
| **Diagnosis picker** | 10 categories, 60+ specific diagnoses, searchable |
| **Patient flags** | OPD, Referred, Simulation, Machine Couch, Needs RT, Follow-up |
| **Statistics panel** | 8 live metric cards with animated counters |
| **Search & Filters** | Instant filter by name, category, payment, flag |
| **CSV Import/Export** | Bulk import from CSV, export current view |
| **Safe delete** | Remove modal with search-before-delete + confirmation |

---

## Firestore Security Rules

For production, update your Firestore rules:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patients/{id} {
      allow read, write: if true; // Replace with auth rules for production
    }
  }
}
```

---

## Build for production

```bash
npm run build
```

Then deploy the `dist/` folder to Firebase Hosting, Netlify, or any static host.
