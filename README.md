# 🧭 Beacon ITSM – Intelligent Service Desk & Ticketing Platform

Beacon is a modern **IT Service Management (ITSM) platform** designed for handling incidents, service requests, and change approvals in a structured, SLA-aware workflow.

It provides a unified workspace for analysts and requesters with intelligent triage, ownership assignment, and resolution tracking — including AI-assisted ticket classification.

---

## 🚀 Live Demo
https://ticket-system-next-livid.vercel.app/  

---

## 📌 Key Features

### 🎫 Ticket Management
- Create, update, and track tickets
- Support for incidents, requests, and change approvals
- Full ticket lifecycle tracking

### 🧑‍💻 Role-Based Workflows
- Requester vs Analyst views
- Ownership assignment
- Controlled state transitions

### ⏱️ SLA-Aware System
- Priority-based handling
- Structured workflow for resolution tracking
- Designed for operational efficiency

### 🤖 AI-Powered Ticket Classification
- Automatic ticket categorization
- Smart routing suggestions
- AI-assisted decision support modal

### 🧩 Modular Architecture
- Feature-based module boundaries
- Shared auth utilities layer
- Clean separation of concerns across domain modules

### 🎨 UI System
- Consistent design system (Beacon UI)
- Analyst-focused workspace layout
- Responsive dashboard interface

### 🧪 Testing & Reliability
- Unit testing with Vitest
- Structured validation per module
- Maintainable domain logic separation

---

## 🧠 Architecture Highlights

This project is built with a **scalable, enterprise-style frontend architecture**:

- Next.js App Router architecture
- Feature-based module design
- Domain-driven structure (tickets, auth, workflows)
- Shared authentication utilities layer
- AI integration layer for ticket classification
- Strict module boundary enforcement
- Prisma-based data modeling

---

## 🏗️ Project Structure

src/
├── modules/ → Core business domains (tickets, auth, users)
├── components/ → Shared UI components
├── lib/ → Utilities and shared logic
├── server/ → Server-side logic & actions
├── styles/ → Global styles
├── hooks/ → Custom React hooks

docs/
├── features/ → Feature documentation
├── DESIGN.md → UI/UX design system
├── SPEC.md → System specifications
├── GUIDE.md → Developer guidelines
├── CLAUDE.md → AI development rules

prisma/ → Database schema

---

## 🔐 Authentication System

- Secure authentication layer
- Shared auth utilities across modules
- Role-based access control (RBAC-ready design)
- Middleware-based route protection

---

## 🤖 AI Classification System

Beacon includes an AI-assisted workflow:

1. User creates a ticket
2. AI analyzes content
3. System assigns:
   - Category
   - Priority
   - Suggested routing team
4. Analyst reviews and confirms

---

## ⚙️ Tech Stack

- Next.js (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL 
- Tailwind CSS
- Vitest (testing)
- AI integration layer
- Modular architecture pattern

---

## 🧪 Testing Strategy

- Unit tests for core modules
- Validation layer testing
- Component-level tests
- Workflow simulation tests

---

## 🚀 Future Improvements & Roadmap

This project is actively evolving toward a production-grade ITSM platform. Planned enhancements are grouped into architectural, infrastructure, security, and product-level improvements.

---

### 🔐 Security & Authentication Hardening
- Throttle login attempts to prevent brute-force attacks
- Async password verification improvements
- Harden AI classification input validation
- Handle external AI provider failures gracefully
- Improve session security and token lifecycle management

---

### 📊 Auditability & Observability
- Add audit logging for ticket and user-management changes
- Implement full activity timeline for tickets with visibility rules
- Configure centralized error tracking with Sentry
- Improve global and route-level error handling strategy

---

### 🧠 AI & Intelligence Layer
- Add local fallback mechanism for AI classification
- Improve ticket classification accuracy and resilience
- Add fallback routing when AI provider is unavailable
- Enhance confidence scoring for classification results

---

### 🧩 System Architecture Improvements
- Extract shared ticket mutation helpers for reuse across modules
- Bound dashboard queries to prevent over-fetching and leaks
- Improve module boundary enforcement
- Refactor legacy state handling in public app context

---

### ☁️ Infrastructure & DevOps (AWS-first direction)
- Implement private AWS S3 upload/download for attachments
- Replace current storage layer with provider abstraction
- Add encrypted PostgreSQL backups to AWS S3
- Create Docker Compose production baseline for EC2 deployment
- Write full EC2 deployment runbook (manual + reproducible)
- Document AWS-first deployment architecture

---

### ⚡ Performance & Reliability
- Add in-memory rate limiting for public API endpoints
- Improve query performance for dashboard and incident views
- Optimize ticket creation flow with explicit success states
- Reduce unnecessary re-renders in request-heavy workflows

---

### 🧪 CI/CD & Quality Assurance
- Add GitHub Actions for automated quality checks
- Enforce linting, type-checking, and test pipelines
- Introduce pre-deploy validation gates

---



---

## 🛠️ Getting Started

git clone https://github.com/Ramahadam/beacon-track.git  
cd beacon-track  
npm install  
npm run dev  

---

## 📄 Documentation

Full system documentation is available in:

- `/docs/features`
- `SPEC.md`
- `DESIGN.md`
- `GUIDE.md`
- `CLAUDE.md`

---

## 👤 Author

Mohamed Adam  
Full-Stack Developer  
Focused on scalable systems, SaaS architecture, and AI-assisted workflows
