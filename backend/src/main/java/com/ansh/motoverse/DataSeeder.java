package com.ansh.motoverse;
import com.ansh.motoverse.model.Vehicle;
import com.ansh.motoverse.model.AppUser;
import com.ansh.motoverse.repository.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ansh.motoverse.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.List;
@Component
public class DataSeeder implements CommandLineRunner {
    private final VehicleRepository vehicleRepository;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(VehicleRepository vehicleRepository,
                      AppUserRepository appUserRepository,
                      PasswordEncoder passwordEncoder) {
        this.vehicleRepository = vehicleRepository;
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override public void run(String... args) {
        seedAdmin();
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

    private void seedAdmin() {
        String email = System.getenv("APP_ADMIN_EMAIL");
        String password = System.getenv("APP_ADMIN_PASSWORD");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return;
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (!appUserRepository.existsByEmail(normalizedEmail)) {
            appUserRepository.save(
                    new AppUser(normalizedEmail, passwordEncoder.encode(password), "ADMIN")
            );
        }
    }
}
