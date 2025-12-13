# MooLogic Dairy Farm Tracker - Frontend

This is the **Next.js frontend** for the MooLogic Dairy Farm Tracker, a digital platform designed to streamline dairy farm management by tracking milk production, cattle health, financial records, and more.

## 🚀 Features

- Authentication & Role-Based Access (Farm Owner, Worker, Government Official)
- Milk Production Tracking & Analytics
- Cattle Health Monitoring
- Disease Prediction System
- Alerts & Notifications
- Financial Dashboard
- Government Oversight Dashboard

## 📂 Project Structure
```
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/       # Next.js pages (Routing)
│   ├── services/    # API calls
│   ├── styles/      # Tailwind CSS styles
│   ├── utils/       # Helper functions
│   ├── hooks/       # Custom React hooks
│   ├── context/     # Global state management
├── .env.local       # Environment variables
├── package.json     # Dependencies & scripts
├── tailwind.config.js # Tailwind CSS configuration
├── next.config.js   # Next.js configuration
```

## 🛠️ Setup & Installation
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-username/moologic-frontend.git
cd moologic-frontend
```

### 2️⃣ Install Dependencies
#### For Windows Users
Ensure you have Node.js installed and use the following command:
```sh
npm install
```
#### For Mac/Linux Users
```sh
yarn install  # or npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env.local` file in the root directory and add:
```sh
NEXT_PUBLIC_API_URL=http://localhost:8000/api  # Change for production
```

### 4️⃣ Run the Development Server
```sh
npm run dev  # or yarn dev
```
Access the app at `http://localhost:3000`

## 🚀 Deployment
### **Vercel Deployment**
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` and follow setup instructions.

### **Production Build**
```sh
npm run build  # or yarn build
npm start  # Run production server
```

## 🛠️ Tech Stack
- **Next.js** - React framework for SSR & SSG
- **Tailwind CSS** - Utility-first styling
- **Redux Toolkit** - State management
- **Axios** - API requests
- **Jest & Cypress** - Testing
- **Vercel** - Hosting & deployment

## 📜 Naming Conventions
- **Components**: PascalCase (e.g., `DashboardCard.js`)
- **Functions & Variables**: camelCase (e.g., `fetchMilkData`)
- **Constants**: UPPER_CASE (e.g., `API_BASE_URL`)
- **Files & Folders**: kebab-case (e.g., `milk-production.js`)
- **Environment Variables**: UPPER_CASE with underscores (e.g., `NEXT_PUBLIC_API_URL`)

## 👨‍💻 Contributors
- **Frontend Team:** Naol Humnesa, Natnael Zemedkun, Wakeshi Tolera
- **Backend Team:** Wondmeneh Dereje, Guluma Mekonin

## 📜 License
MIT License
