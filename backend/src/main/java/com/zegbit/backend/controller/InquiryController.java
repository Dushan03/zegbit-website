package com.zegbit.backend.controller;

import com.zegbit.backend.dto.ApiResponse;
import com.zegbit.backend.dto.InquiryRequest;
import com.zegbit.backend.dto.InquiryStatusUpdateRequest;
import com.zegbit.backend.model.Inquiry;
import com.zegbit.backend.model.InquiryStatus;
import com.zegbit.backend.service.InquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Inquiries & Proposals", description = "Endpoints for project quotation intake and management")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping("/inquiries")
    @Operation(summary = "Submit a proposal or quote request (Public)")
    public ResponseEntity<ApiResponse<Inquiry>> submitInquiry(
            @Valid @RequestBody InquiryRequest request,
            HttpServletRequest httpRequest) {

        String clientIp = httpRequest.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = httpRequest.getRemoteAddr();
        }

        Inquiry inquiry = inquiryService.createInquiry(request, clientIp);
        return new ResponseEntity<>(ApiResponse.success("Your proposal request has been received successfully", inquiry), HttpStatus.CREATED);
    }

    @GetMapping("/admin/inquiries")
    @Operation(summary = "Get all client inquiries (Admin / Staff)")
    public ResponseEntity<ApiResponse<List<Inquiry>>> getAllInquiries(
            @RequestParam(required = false) InquiryStatus status) {

        List<Inquiry> inquiries = (status != null)
                ? inquiryService.getInquiriesByStatus(status)
                : inquiryService.getAllInquiries();

        return ResponseEntity.ok(ApiResponse.success("Inquiries retrieved successfully", inquiries));
    }

    @GetMapping("/admin/inquiries/{id}")
    @Operation(summary = "Get single inquiry details by ID (Admin / Staff)")
    public ResponseEntity<ApiResponse<Inquiry>> getInquiryById(@PathVariable Long id) {
        Inquiry inquiry = inquiryService.getInquiryById(id);
        return ResponseEntity.ok(ApiResponse.success("Inquiry retrieved", inquiry));
    }

    @PatchMapping("/admin/inquiries/{id}/status")
    @Operation(summary = "Update inquiry status (Admin / Staff)")
    public ResponseEntity<ApiResponse<Inquiry>> updateInquiryStatus(
            @PathVariable Long id,
            @Valid @RequestBody InquiryStatusUpdateRequest request) {

        Inquiry updated = inquiryService.updateInquiryStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Status updated to " + request.getStatus(), updated));
    }
}
