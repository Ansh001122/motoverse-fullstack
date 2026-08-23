# MotoVerse — Phase 2.1 Payment & Booking State Transition

## Implemented

- New bookings start in `PENDING_PAYMENT`.
- Payment amount is derived from the persisted booking total.
- Duplicate payments for the same booking are rejected.
- Successful simulated payment creates a mock transaction ID.
- Successful payment changes the booking to `CONFIRMED`.
- Payment creation and booking confirmation run inside a transactional service method.
- Added `PAYMENT_FAILED` to the booking state model for future real gateway failure handling.
- Added `CANCELLED` as a terminal booking state.

## State Model

```text
Booking Created
      |
      v
PENDING_PAYMENT
      |
      v
Payment
   |      |
SUCCESS  FAILURE
   |      |
   v      v
CONFIRMED PAYMENT_FAILED
              |
              v
          CANCELLED
```

## Current Limitation

Payment processing is simulated. No real payment provider is connected and no real money is transferred.

The `PAYMENT_FAILED` state is modeled, but the current mock processor follows the successful path. A real payment provider/webhook can later drive `SUCCESS`, `FAILED`, and `REFUNDED` transitions.

## API

### Create booking

`POST /api/bookings`

### Create payment

`POST /api/payments`

### Get payment

`GET /api/payments/{id}`

### Get payment for booking

`GET /api/payments/booking/{bookingId}`

## Interview Explanation

> "I changed the booking lifecycle so a booking is created in `PENDING_PAYMENT` rather than being immediately confirmed. The payment service derives the amount from the persisted booking, prevents duplicate payments, processes the current mock payment, and confirms the booking only after a successful payment. The operation is transactional so the payment record and booking confirmation are persisted together."
