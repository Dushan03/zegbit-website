package com.zegbit.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public class InquiryRequest {

    @NotBlank(message = "Name or company is required")
    @Size(max = 150, message = "Name must not exceed 150 characters")
    private String name;

    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String email;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @NotEmpty(message = "At least one service must be selected")
    private List<String> services;

    @Size(max = 100, message = "Timeline/Budget must not exceed 100 characters")
    private String timelineBudget;

    @NotBlank(message = "Project scope details are required")
    @Size(max = 4000, message = "Scope description must not exceed 4000 characters")
    private String scope;

    public InquiryRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public String getTimelineBudget() {
        return timelineBudget;
    }

    public void setTimelineBudget(String timelineBudget) {
        this.timelineBudget = timelineBudget;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }
}
