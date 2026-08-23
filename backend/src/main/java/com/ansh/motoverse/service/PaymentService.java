package com.ansh.motoverse.service;

import com.ansh.motoverse.model.Booking;
import com.ansh.motoverse.model.Payment;
import com.ansh.motoverse.model.PaymentRequest;
import com.ansh.motoverse.model.PaymentStatus;
import com.ansh.motoverse.repository.BookingRepository;
import com.ansh.motoverse.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public Payment createPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (paymentRepository.findByBookingId(booking.getId()).isPresent()) {
            throw new IllegalStateException("A payment already exists for this booking");
        }

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(booking.getTotalAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setCreatedAt(LocalDateTime.now());

        // Phase 2 uses simulated payment processing.
        // A real gateway such as Razorpay/Stripe can replace this section later.
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId("MOCK-" + UUID.randomUUID());

        // Confirm the booking only after payment succeeds.
        booking.setStatus(com.ansh.motoverse.model.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public Payment getPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
    }

    @Transactional(readOnly = true)
    public Payment getPaymentByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found for booking"));
    }
}
