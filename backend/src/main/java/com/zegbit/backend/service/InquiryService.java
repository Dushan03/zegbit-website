package com.zegbit.backend.service;

import com.zegbit.backend.dto.InquiryRequest;
import com.zegbit.backend.model.Inquiry;
import com.zegbit.backend.model.InquiryStatus;
import com.zegbit.backend.repository.InquiryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final EmailService emailService;

    public InquiryService(InquiryRepository inquiryRepository, EmailService emailService) {
        this.inquiryRepository = inquiryRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Inquiry createInquiry(InquiryRequest request, String clientIp) {
        Inquiry inquiry = new Inquiry(
                request.getName(),
                request.getEmail(),
                request.getPhone(),
                request.getServices(),
                request.getTimelineBudget(),
                request.getScope(),
                clientIp
        );

        Inquiry saved = inquiryRepository.save(inquiry);

        // Notify staff of new inquiry
        String servicesStr = String.join(", ", request.getServices());
        String notification = String.format(
                "New project proposal inquiry received!\n\nName: %s\nEmail: %s\nPhone: %s\nServices: %s\nBudget/Timeline: %s\n\nScope:\n%s",
                request.getName(),
                request.getEmail() != null ? request.getEmail() : "N/A",
                request.getPhone() != null ? request.getPhone() : "N/A",
                servicesStr,
                request.getTimelineBudget() != null ? request.getTimelineBudget() : "Not specified",
                request.getScope()
        );
        emailService.sendNotification("hello@zegbit.com", "New Proposal Request: " + request.getName(), notification);

        return saved;
    }

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Inquiry> getInquiriesByStatus(InquiryStatus status) {
        return inquiryRepository.findByStatus(status);
    }

    public Inquiry getInquiryById(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Inquiry not found with id: " + id));
    }

    @Transactional
    public Inquiry updateInquiryStatus(Long id, InquiryStatus newStatus) {
        Inquiry inquiry = getInquiryById(id);
        inquiry.setStatus(newStatus);
        return inquiryRepository.save(inquiry);
    }
}
