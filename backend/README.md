# Zegbit Backend — Spring Boot 3 & PostgreSQL

Enterprise-grade, secure REST API backend built for the **Zegbit** platform using **Java 21**, **Spring Boot 3.3**, **Spring Security (JWT)**, and **PostgreSQL**.

---

## 🏗️ Architecture & Modules

The backend matches all pages and forms from the Zegbit frontend website:

```
backend/
├── src/main/java/com/zegbit/backend/
│   ├── ZegbitBackendApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java         # CORS, CSRF, Route security filters
│   │   ├── JwtService.java             # JWT token generation & validation
│   │   ├── JwtAuthenticationFilter.java# Intercepts protected requests
│   │   ├── OpenApiConfig.java          # Swagger / OpenAPI documentation
│   │   └── GlobalExceptionHandler.java # Validation & error formatting
│   ├── controller/
│   │   ├── InquiryController.java      # Quotations & project proposal intake
│   │   ├── ProductWaitlistController.java # ZegBit Guard, PDPA & Class waitlists
│   │   ├── VulnerabilityReportController.java # Responsible disclosure reports
│   │   └── AuthController.java         # Admin & staff login / JWT token
│   ├── dto/                            # Data Transfer Objects & Validation
│   ├── model/                          # JPA Database Entities
│   │   ├── Inquiry.java                # Table: inquiries
│   │   ├── ProductWaitlist.java        # Table: product_waitlists
│   │   ├── VulnerabilityReport.java    # Table: vulnerability_reports
│   │   └── User.java                   # Table: users
│   ├── repository/                     # Spring Data JPA Repositories
│   └── service/                        # Business Logic & Notification Services
└── src/main/resources/
    └── application.properties          # Database & server configuration
```

---

## 🚀 REST API Endpoints

### 1. Inquiries & Proposals (`contact.html`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/inquiries` | **Public** | Submit a quote / proposal request |
| `GET` | `/api/v1/admin/inquiries` | **Admin (JWT)** | View all submitted inquiries |
| `GET` | `/api/v1/admin/inquiries/{id}` | **Admin (JWT)** | View single inquiry details |
| `PATCH` | `/api/v1/admin/inquiries/{id}/status` | **Admin (JWT)** | Update status (`NEW`, `UNDER_REVIEW`, `PROPOSAL_SENT`, `WON`, `LOST`) |

### 2. Product Waitlists (`products.html`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/products/waitlist` | **Public** | Register for ZegBit Guard / PDPA Ready / Class early access |
| `GET` | `/api/v1/admin/products/waitlist` | **Admin (JWT)** | View all waitlist signups |

### 3. Vulnerability Disclosure (`security.html` & `security.txt`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/security/reports` | **Public** | Submit responsible vulnerability report |
| `GET` | `/api/v1/admin/security/reports` | **Admin (JWT)** | View all security disclosures |
| `PATCH` | `/api/v1/admin/security/reports/{id}/status` | **Admin (JWT)** | Update report status (`TRIAGED`, `IN_PROGRESS`, `RESOLVED`) |

### 4. Authentication & Staff Portal
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | **Public** | Login with username/password & receive JWT token |
| `POST` | `/api/v1/auth/register-initial-admin` | **Public** | Setup initial admin account |

---

## 📖 Interactive Swagger API Documentation

Once running, view and test all APIs interactively in your browser at:
* **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **OpenAPI JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## ⚙️ How to Configure and Run

### 1. Configure PostgreSQL (`application.properties`)
Update `src/main/resources/application.properties` with your PostgreSQL password:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/zegbit_db
spring.datasource.username=postgres
spring.datasource.password=your_password_here
```

### 2. Run the Application
Open your terminal in the `backend` folder and run:

**Using Maven:**
```bash
mvn spring-boot:run
```
Or open the `backend` directory in **IntelliJ IDEA** / **VS Code** and click **Run** on `ZegbitBackendApplication.java`.
