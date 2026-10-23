package com.zegbit.backend.repository;

import com.zegbit.backend.model.Inquiry;
import com.zegbit.backend.model.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {
    List<Inquiry> findByStatus(InquiryStatus status);
    List<Inquiry> findAllByOrderByCreatedAtDesc();
}
