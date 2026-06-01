package com.ansh.motoverse.repository;
import com.ansh.motoverse.model.Vehicle; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByAvailableTrue();
    List<Vehicle> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrLocationContainingIgnoreCase(String name,String category,String location);
    long countByAvailableTrue();
}
