package com.zegbit.backend.dto;

import com.zegbit.backend.model.InquiryStatus;
import jakarta.validation.constraints.NotNull;

public class InquiryStatusUpdateRequest {

    @NotNull(message = "Status cannot be null")
    private InquiryStatus status;

    public InquiryStatusUpdateRequest() {
    }

    public InquiryStatus getStatus() {
        return status;
    }

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }
}
