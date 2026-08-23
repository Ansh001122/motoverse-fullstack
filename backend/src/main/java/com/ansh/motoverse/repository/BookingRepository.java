package com.ansh.motoverse.repository;
import com.ansh.motoverse.model.Booking; import org.springframework.data.jpa.repository.JpaRepository; import org.springframework.data.jpa.repository.Query; import java.math.BigDecimal;
public interface BookingRepository extends JpaRepository<Booking, Long> { @Query("select coalesce(sum(b.totalAmount), 0) from Booking b") BigDecimal totalRevenue(); }
