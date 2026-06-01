package com.ansh.motoverse.model;
import jakarta.persistence.*; import jakarta.validation.constraints.*; import java.math.BigDecimal; import java.time.LocalDateTime;
@Entity public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) private Vehicle vehicle;
    @NotBlank private String customerName; @Email @NotBlank private String customerEmail; @Min(1) private int rentalDays;
    @NotNull private BigDecimal totalAmount; private LocalDateTime createdAt; @Enumerated(EnumType.STRING) private BookingStatus status;
    public Booking() {}
    public Booking(Vehicle vehicle, String customerName, String customerEmail, int rentalDays, BigDecimal totalAmount){this.vehicle=vehicle;this.customerName=customerName;this.customerEmail=customerEmail;this.rentalDays=rentalDays;this.totalAmount=totalAmount;this.createdAt=LocalDateTime.now();this.status=BookingStatus.CONFIRMED;}
    public Long getId(){return id;} public Vehicle getVehicle(){return vehicle;} public String getCustomerName(){return customerName;} public String getCustomerEmail(){return customerEmail;} public int getRentalDays(){return rentalDays;} public BigDecimal getTotalAmount(){return totalAmount;} public LocalDateTime getCreatedAt(){return createdAt;} public BookingStatus getStatus(){return status;}
    public void setId(Long id){this.id=id;} public void setVehicle(Vehicle vehicle){this.vehicle=vehicle;} public void setCustomerName(String customerName){this.customerName=customerName;} public void setCustomerEmail(String customerEmail){this.customerEmail=customerEmail;} public void setRentalDays(int rentalDays){this.rentalDays=rentalDays;} public void setTotalAmount(BigDecimal totalAmount){this.totalAmount=totalAmount;} public void setCreatedAt(LocalDateTime createdAt){this.createdAt=createdAt;} public void setStatus(BookingStatus status){this.status=status;}
}
