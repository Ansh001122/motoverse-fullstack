package com.ansh.motoverse.model;
import java.math.BigDecimal;
public class DashboardSummary { private long totalVehicles; private long availableVehicles; private long totalBookings; private BigDecimal totalRevenue;
public DashboardSummary(long totalVehicles,long availableVehicles,long totalBookings,BigDecimal totalRevenue){this.totalVehicles=totalVehicles;this.availableVehicles=availableVehicles;this.totalBookings=totalBookings;this.totalRevenue=totalRevenue;}
public long getTotalVehicles(){return totalVehicles;} public long getAvailableVehicles(){return availableVehicles;} public long getTotalBookings(){return totalBookings;} public BigDecimal getTotalRevenue(){return totalRevenue;} }
