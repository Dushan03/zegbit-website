package com.zegbit.backend.service;

import com.zegbit.backend.dto.WaitlistRequest;
import com.zegbit.backend.model.ProductWaitlist;
import com.zegbit.backend.repository.ProductWaitlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductWaitlistService {

    private final ProductWaitlistRepository waitlistRepository;
    private final EmailService emailService;

    public ProductWaitlistService(ProductWaitlistRepository waitlistRepository, EmailService emailService) {
        this.waitlistRepository = waitlistRepository;
        this.emailService = emailService;
    }

    @Transactional
    public ProductWaitlist registerForWaitlist(WaitlistRequest request) {
        ProductWaitlist entry = new ProductWaitlist(
                request.getProductName(),
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                request.getCompanyName(),
                request.getBusinessType(),
                request.getNotes()
        );

        ProductWaitlist saved = waitlistRepository.save(entry);

        emailService.sendNotification(
                "hello@zegbit.com",
                "New Early Access Signup: " + request.getProductName(),
                String.format("User %s (%s) registered for %s waitlist.", request.getFullName(), request.getEmail(), request.getProductName())
        );

        return saved;
    }

    public List<ProductWaitlist> getAllWaitlistEntries() {
        return waitlistRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<ProductWaitlist> getWaitlistByProduct(String productName) {
        return waitlistRepository.findByProductName(productName);
    }
}
