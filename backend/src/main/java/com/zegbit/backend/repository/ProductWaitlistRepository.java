package com.zegbit.backend.repository;

import com.zegbit.backend.model.ProductWaitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductWaitlistRepository extends JpaRepository<ProductWaitlist, Long> {
    List<ProductWaitlist> findByProductName(String productName);
    List<ProductWaitlist> findAllByOrderByCreatedAtDesc();
}
