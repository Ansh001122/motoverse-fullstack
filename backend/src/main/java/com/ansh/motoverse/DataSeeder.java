package com.ansh.motoverse;
import com.ansh.motoverse.model.Vehicle;
import com.ansh.motoverse.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;
@Component
public class DataSeeder implements CommandLineRunner {
    private final VehicleRepository vehicleRepository;
    public DataSeeder(VehicleRepository vehicleRepository) { this.vehicleRepository = vehicleRepository; }
    @Override public void run(String... args) {
        if (vehicleRepository.count() > 0) return;
        vehicleRepository.saveAll(List.of(
            new Vehicle("Royal Enfield Classic 350", "Bike", "Bengaluru", new BigDecimal("950"), true, "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80"),
            new Vehicle("Honda Activa 6G", "Scooter", "Mysuru", new BigDecimal("450"), true, "https://images.unsplash.com/photo-1605816988069-b11383b50717?auto=format&fit=crop&w=900&q=80"),
            new Vehicle("Hyundai i20", "Car", "Bengaluru", new BigDecimal("1800"), true, "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"),
            new Vehicle("Mahindra Thar", "SUV", "Goa", new BigDecimal("3200"), true, "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80"),
            new Vehicle("Toyota Innova Crysta", "MUV", "Hyderabad", new BigDecimal("2800"), false, "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80"),
            new Vehicle("KTM Duke 390", "Bike", "Pune", new BigDecimal("1200"), true, "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80")
        ));
    }
}
