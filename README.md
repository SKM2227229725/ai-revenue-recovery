# 💰 AI Revenue Recovery

> AI-powered payment recovery platform that detects failed payments, diagnoses failure reasons, predicts recovery probability, prioritizes cases, and recommends recovery actions.

Built for **Razorpay AI Buildathon 2026 — Track 03: Revenue Recovery**

---

## 🚀 Overview

Businesses lose revenue because of failed payments caused by insufficient funds, expired cards, network issues, and other failures.

Our system uses **AI + Machine Learning + Business Rules** to intelligently recover lost revenue.

### Workflow

```text
Failed Payment
      ↓
AI Diagnosis
      ↓
ML Recovery Prediction
      ↓
Priority Scoring
      ↓
Policy Engine
      ↓
Recovery Action
      ↓
Audit Trail

✨ Features
🤖 AI Failure Diagnosis — Claude analyzes why a payment failed.
🧠 ML Recovery Prediction — Random Forest predicts recovery probability.
🎯 Priority Scoring — Ranks cases from Critical to Low.
⚡ Automated Recovery — Retry, Reminder, Payment Link, Escalation.
📊 Analytics Dashboard — Revenue at risk, recovered revenue, recovery rate.
💳 Payment Analytics — Payment methods, customer segments, monthly trends.
🔎 Transaction Explorer — Search and filter failed transactions.
🧾 Audit Trail — Tracks AI decisions, actions, and results.
🔔 Notifications — Real-time recovery updates.
🌙 Dark Mode + Responsive UI



🛠️ Tech Stack
Layer	Technology
Frontend	React 18, Vite, Tailwind CSS
Charts	Recharts
Backend	Django, Django REST Framework
Database	PostgreSQL / SQLite
AI	Anthropic Claude
ML	Scikit-learn
Data	Pandas, NumPy
Model	Random Forest
Deployment	Vercel + Render



🧠 ML Model

Algorithm: Random Forest Classifier

Features:

Transaction Amount
Retry Count
Payment Method
Failure Reason
Customer Segment

Training Data: 650 synthetic transactions
Documented Accuracy: 66.67%

🔌 API Endpoints
Method	Endpoint	Description
GET	/api/recovery/metrics/	Dashboard metrics
GET	/api/recovery/transactions/	All transactions
POST	/api/recovery/run/	Run recovery workflow
GET	/api/recovery/audit/	Audit logs
GET	/api/recovery/ai/analyze/:id	AI transaction analysis
📊 Example Metrics
{
  "totalAtRisk": 68240,
  "recovered": 22179,
  "recoveryRate": 32.5,
  "activeCases": 9
}
📁 Project Structure
AI Revenue Recovery/
├── backend/
│   ├── config/
│   ├── api/
│   ├── recovery/
│   └── manage.py
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── services/
│       └── App.jsx
│
├── data/
│   └── payments.csv
│
├── models/
│   ├── train_model.py
│   └── recovery_model.pkl
│
└── docs/
    └── screenshots/
⚙️ Setup
Backend
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
Frontend
cd frontend

npm install
npm run dev
Train Model
python models/train_model.py
🔐 Environment Variables
ANTHROPIC_API_KEY=your_api_key
DATABASE_URL=your_database_url

Never commit API keys or secrets to GitHub.

📸 Screenshots
Dashboard

Payment Analytics

AI Explainability

Audit Trail

🚀 Deployment
Frontend — Vercel
npm run build
npx vercel --prod
Backend — Render
Build:
pip install -r requirements.txt

Start:
gunicorn config.wsgi:application
🎯 Why This Project?

Unlike a traditional failed-payment system, our platform:

Detect
  ↓
Diagnose
  ↓
Predict
  ↓
Prioritize
  ↓
Decide
  ↓
Recover
  ↓
Audit

It combines AI diagnosis + ML prediction + business rules + automated recovery to focus on the payments with the highest recovery potential.

🏆 Built For

Razorpay AI Buildathon 2026

Track 03 — Revenue Recovery

"Find revenue that's slipping away and win it back."

📄 License

MIT License

🔗 Links
GitHub: https://github.com/your-username/ai-revenue-recovery
Live Demo: https://your-demo-url.vercel.app


<img width="2437" height="1695" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/a60222fa-cef4-47e9-bc50-b835fc77f755" />
