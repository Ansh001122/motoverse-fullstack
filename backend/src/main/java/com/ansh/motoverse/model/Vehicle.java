package com.ansh.motoverse.model;
import jakarta.persistence.*; import jakarta.validation.constraints.*; import java.math.BigDecimal;
@Entity public class Vehicle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @NotBlank private String name; @NotBlank private String category; @NotBlank private String location;
    @NotNull private BigDecimal pricePerDay; private boolean available; @Column(length = 1200) private String imageUrl;
    public Vehicle() {}
    public Vehicle(String name, String category, String location, BigDecimal pricePerDay, boolean available, String imageUrl){this.name=name;this.category=category;this.location=location;this.pricePerDay=pricePerDay;this.available=available;this.imageUrl=imageUrl;}
    public Long getId(){return id;} public String getName(){return name;} public String getCategory(){return category;} public String getLocation(){return location;} public BigDecimal getPricePerDay(){return pricePerDay;} public boolean isAvailable(){return available;} public String getImageUrl(){return imageUrl;}
    public void setId(Long id){this.id=id;} public void setName(String name){this.name=name;} public void setCategory(String category){this.category=category;} public void setLocation(String location){this.location=location;} public void setPricePerDay(BigDecimal pricePerDay){this.pricePerDay=pricePerDay;} public void setAvailable(boolean available){this.available=available;} public void setImageUrl(String imageUrl){this.imageUrl=imageUrl;}
}
