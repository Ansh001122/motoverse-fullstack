package com.ansh.motoverse.model;
import jakarta.validation.constraints.*;
public class BookingRequest {
    @NotNull private Long vehicleId; @NotBlank private String customerName; @Email @NotBlank private String customerEmail; @Min(1) private int rentalDays;
    public Long getVehicleId(){return vehicleId;} public String getCustomerName(){return customerName;} public String getCustomerEmail(){return customerEmail;} public int getRentalDays(){return rentalDays;}
    public void setVehicleId(Long vehicleId){this.vehicleId=vehicleId;} public void setCustomerName(String customerName){this.customerName=customerName;} public void setCustomerEmail(String customerEmail){this.customerEmail=customerEmail;} public void setRentalDays(int rentalDays){this.rentalDays=rentalDays;}
}
