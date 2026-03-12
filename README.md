# WhatsApp-First Order & Status Tracking System

A production-grade MVP for managing orders with automated WhatsApp updates using Twilio and Sequelize.

## Tech Stack
- **Backend:** Node.js, Express, PostgreSQL, Sequelize ORM
- **Frontend:** React (Vite), TailwindCSS, Lucide Icons
- **Messaging:** Twilio WhatsApp API
- **PDF:** pdfkit for invoices

## Prerequisites
- Docker & Docker Compose
- Twilio Account (Sandbox SID/Token)

## Quick Start (Docker)

1. Clone the repository.
2. Configure `.env` in the `backend/` directory (see `.env.example`).
3. Run the entire stack:
   ```bash
   docker-compose up --build
   ```
4. Access the platforms:
   - **Admin Dashboard:** [http://localhost:5173/](http://localhost:5173/)
   - **Customer Entry:** [http://localhost:5173/order-now](http://localhost:5173/order-now)
   - **Backend API:** [http://localhost:3000/](http://localhost:3000/)

## System Architecture

1. **Admin Panel:** Manage orders, update status, generate invoices.
2. **Customer Entry:** Simple portal for customers to place requests.
3. **Event System:** Internal bus triggers WhatsApp messages on order events.
4. **WhatsApp Manager:** Handles outbound notifications and inbound status queries ("STATUS 123").

## Inbound Commands
Message your Twilio WhatsApp number with:
`STATUS <OrderId>`
*Example: `STATUS ORD-1234`*

## Clean Architecture
- `src/models`: Data structures & associations (Sequelize)
- `src/services`: Business logic & lifecycle
- `src/events`: Decoupled communication
- `src/whatsapp`: Twilio integration logic
# whatsapp-ordering
