package com.zegbit.backend.controller;

import com.zegbit.backend.dto.ApiResponse;
import com.zegbit.backend.dto.WaitlistRequest;
import com.zegbit.backend.model.ProductWaitlist;
import com.zegbit.backend.service.ProductWaitlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Product Waitlists", description = "Endpoints for ZegBit Guard, PDPA Ready, and Class early access")
public class ProductWaitlistController {

    private final ProductWaitlistService waitlistService;

    public ProductWaitlistController(ProductWaitlistService waitlistService) {
        this.waitlistService = waitlistService;
    }

    @PostMapping("/products/waitlist")
    @Operation(summary = "Register for product early access (Public)")
    public ResponseEntity<ApiResponse<ProductWaitlist>> joinWaitlist(@Valid @RequestBody WaitlistRequest request) {
        ProductWaitlist entry = waitlistService.registerForWaitlist(request);
        return new ResponseEntity<>(ApiResponse.success("Thank you for your interest! We will contact you once pilots open.", entry), HttpStatus.CREATED);
    }

    @GetMapping("/admin/products/waitlist")
    @Operation(summary = "View all product waitlist signups (Admin / Staff)")
    public ResponseEntity<ApiResponse<List<ProductWaitlist>>> getAllWaitlists(
            @RequestParam(required = false) String productName) {

        List<ProductWaitlist> list = (productName != null && !productName.isBlank())
                ? waitlistService.getWaitlistByProduct(productName)
                : waitlistService.getAllWaitlistEntries();

        return ResponseEntity.ok(ApiResponse.success("Waitlist retrieved", list));
    }
}
