# RoadResQ — AI-Powered Smart Roadside Assistance Platform

> **"Help when your vehicle stops."**  
> *Smart roadside assistance, when you need it.*

RoadResQ is a production-grade, AI-powered roadside assistance platform engineered to assist motorists when their car, two-wheeler, electric vehicle, or commercial vehicle encounters an emergency, breakdown, flat tyre, or fuel exhaustion.

---

## 🌟 Key Features

1. **Natural Language & Voice Breakdown Diagnostics (ResQ AI)**
   - Multi-lingual problem understanding in **English**, **தமிழ் (Tamil)**, **हिन्दी (Hindi)**, and **Tanglish** (*"En bike petrol theernthu pochu"*).
   - High-confidence classification across 9 breakdown categories: Fuel, Tyre, Battery Jumpstart, Mechanical, Electrical, Engine, Towing, Accident, and Unknown.
   - Dynamic safety advisories for high-speed highway lanes and accident scenes.
   - Built-in photo inspection for punctured tyres, dashboard warning indicators, and physical vehicle impact.

2. **Legal & Safe Fuel Guidance Protocol**
   - In strict compliance with motor vehicle and fire safety standards, RoadResQ does **not** promote unauthorized open petrol delivery.
   - Intelligently guides drivers to verified 24/7 fuel hubs or coordinates safe flatbed escort towing.

3. **Multi-Factor Provider Matching Algorithm**
   - Dispatches certified technicians based on vehicle type compatibility, tooling, real-time distance, rating (minimum 4.6+), and live availability.

4. **Live Real-Time Map & Technician Tracking**
   - OpenStreetMap & Leaflet interactive map showing the stranded customer's incident pin, the assigned rescue van's live position, route trajectory, and dynamic ETA countdown.

5. **Instant Emergency SOS Life Safety System**
   - 5-second countdown with immediate cancel option to prevent accidental triggers.
   - Immediate 1-click broadcast of GPS coordinates via WhatsApp/SMS to registered family members.
   - Quick hotlinks to Police Control (112) and Medical Ambulance (108).

6. **Comprehensive Multi-Role Architecture**
   - **Customer Portal**: Vehicle management, 7-step booking wizard, live map tracking, service invoices, and review ratings.
   - **Service Provider Portal**: Online/Offline toggle, incoming broadcast modal with 30s timer, turn-by-turn navigation, and today's earnings overview.
   - **Admin Command Center**: KPI charts, pending provider KYC accreditation approval/suspension, and live incident monitor.

7. **Multi-Theme & Accessible UI**
   - Engineered with deep navy (`#0B192C`), professional blue, neutral slate, and high-visibility safety orange (`#FF6500`).
   - Supports **Light Mode**, **Dark Mode**, and **System Default** with zero theme flashing.

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, React Router v7
- **Mapping & Geocoding**: Leaflet, React-Leaflet, OpenStreetMap
- **AI & Speech**: Web Speech API (speech recognition in en-US, ta-IN, hi-IN), ResQ AI Local Multi-Turn Engine, and Gemini API Adapter
- **Backend & Persistence**: Cloud Firestore, Firebase Auth, Firebase Storage, and persistent LocalStorage sync layer
- **Deployment**: Vercel & Firebase Hosting ready

---

## 📂 Project Structure

```text
ResQ-app/
├── public/
│   └── favicon.svg                  # Custom RoadResQ SVG Brand Icon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── BrandLogo.tsx        # Vector Road + Pin + Rescue Logo
│   │   │   └── SosModal.tsx         # 5s Emergency SOS Life Safety Modal
│   │   ├── map/
│   │   │   └── AssistanceMap.tsx    # Leaflet Map with Custom Moving Markers
│   │   └── navigation/
│   │       ├── Navbar.tsx           # Desktop Header & Role Switcher
│   │       └── MobileNav.tsx        # Mobile Bottom Navigation
│   ├── contexts/
│   │   ├── AuthContext.tsx          # Multi-role authentication (Customer, Provider, Admin)
│   │   └── AssistanceContext.tsx    # Live GPS tracking & simulation state
│   ├── i18n/
│   │   ├── translations.ts          # Complete dictionaries for EN, தமிழ், हिन्दी
│   │   └── LanguageContext.tsx      # Language provider hook
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx   # Admin supervisor & KYC verification queue
│   │   ├── provider/
│   │   │   ├── ProviderDashboard.tsx# Provider dispatch & navigation console
│   │   │   └── ProviderProfile.tsx  # Provider license & credential management
│   │   ├── AssistanceWizard.tsx     # 7-Step roadside booking wizard
│   │   ├── CustomerHome.tsx         # Customer home dashboard
│   │   ├── LandingPage.tsx          # Startup landing showcase
│   │   ├── LiveTracking.tsx         # Real-time technician tracking & payment
│   │   ├── RequestsHistory.tsx      # Invoices & service history
│   │   ├── ResQAIAssistant.tsx      # Dedicated voice & photo AI triage
│   │   ├── SafePlacesView.tsx       # 24/7 fuel pumps, hospitals & police
│   │   └── VehiclesView.tsx         # Registered vehicles management
│   ├── services/
│   │   ├── aiService.ts             # ResQ AI diagnostic & safety engine
│   │   ├── firebase.ts              # Firebase configuration & security rules
│   │   ├── mockData.ts              # 5 customers, 8 providers, 10 vehicles, 15 requests
│   │   ├── speechService.ts         # Voice recognition & TTS
│   │   └── storageService.ts        # Reactive local data persistence
│   ├── theme/
│   │   └── ThemeContext.tsx         # Light / Dark / System theme provider
│   ├── types/
│   │   └── index.ts                 # Full TypeScript schemas
│   ├── App.tsx                      # App root router
│   ├── index.css                    # Tailwind v4 theme tokens
│   └── main.tsx                     # React DOM entry
├── vercel.json                      # Vercel SPA rewrite & security headers
├── .env.example                     # Environment configuration reference
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.0 or newer)
- npm or yarn

### 2. Installation
```bash
git clone https://github.com/your-username/roadresq-app.git
cd roadresq-app
npm install
```

### 3. Local Development
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```

---

## 👥 Demo Accounts & Interactive Role Switcher

RoadResQ includes an interactive **Role Switcher** in the top navigation bar. You can toggle between roles with zero setup:

1. **Customer View**:
   - Pre-loaded as *Ramesh Kumar* (Chennai OMR).
   - Test booking a flat tyre repair or asking ResQ AI in Tamil/Tanglish.
2. **Provider View**:
   - Pre-loaded as *Murugan QuickFix Auto Care* (4.9 Rating, Verified).
   - Test going Online/Offline, accepting incoming emergency dispatches, and updating milestones (*On the way* ➔ *Arrived* ➔ *Complete*).
3. **Platform Admin**:
   - Review live incident dispatches, audit pending provider licenses (*e.g., Anand Chandrasekar - Apex EV*), and inspect performance graphs.

---

## ☁️ Firebase Configuration & Security Rules

RoadResQ is pre-configured and connected to your active Firebase project **`resq-app-f438e`** in `.env`:
- **Project ID**: `resq-app-f438e`
- **Auth Domain**: `resq-app-f438e.firebaseapp.com`
- **Storage Bucket**: `resq-app-f438e.firebasestorage.app`

Deploy the following security rules into your **Firestore Rules** in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isAdmin() { return isAuthenticated() && request.auth.token.role == 'ADMIN'; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
    }
    match /vehicles/{vehicleId} {
      allow read, write: if isAuthenticated();
    }
    match /providers/{providerId} {
      allow read: if true;
      allow write: if isOwner(providerId) || isAdmin();
    }
    match /assistanceRequests/{requestId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

---

## 🚢 Deploying to Vercel

RoadResQ is pre-configured with `vercel.json` for one-click deployment:

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Framework Preset: **Vite**.
4. Set any required environment variables from `.env.example`.
5. Click **Deploy**. SPA client routing and SVG assets work immediately out of the box!
