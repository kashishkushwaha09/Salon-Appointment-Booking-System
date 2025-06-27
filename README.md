#  Salon Booking App – Full Stack Project
The Salon Appointment Booking System is designed to streamline the scheduling and management of appointments for a salon. This system allows customers to book appointments online, view available services, and manage their bookings. For salon administrators, the system provides tools to manage appointment schedules, send reminders, handle cancellations and rescheduling, and maintain a record of all appointments.
##  Setup

 **Clone the repository**
   ```bash
   git clone https://github.com/kashishkushwaha09/Salon-Appointment-Booking-System.git
   cd salon-appointment-booking-app
   npm install
```

## API Endpoints
## User Routes
### Root:- /api/users/
| Method | Endpoint   | Description                                 | Access       |
|--------|------------|---------------------------------------------|--------------|
| POST   | /register  | Register a new user (with avatar upload)    | Public       |
| POST   | /login     | Login and get authentication token          | Public       |
| GET    | /users     | Get list of all users (admin only)          | Admin only   |
| GET    | /me        | Get logged-in user's profile                | Authenticated|
| PUT    | /update    | Update user's profile                       | Authenticated|
| DELETE | /delete    | Delete user's account                       | Authenticated|

##  Service Routes
### Root:- /api/services/
| Method | Endpoint                     | Description                              | Access      |
|--------|------------------------------|------------------------------------------|-------------|
| GET    | /                            | Get all services                         | Public      |
| GET    | /:id                         | Get a specific service by ID             | Admin only  |
| POST   | /                            | Add a new service                        | Admin only  |
| PUT    | /:id                         | Update a service by ID                   | Admin only  |
| DELETE | /:id                         | Delete a service by ID                   | Admin only  |


## 📅 Availability Routes
### Root:- /api/
| Method | Endpoint          | Description                            | Access      |
|--------|-------------------|----------------------------------------|-------------|
| POST   | services/:id/availability | Set availability for a service | Admin only  |
| GET    | services/:id/availability | Get availability for a service | Public      |
| PUT    | availability/:id          | Update availability by ID      | Admin only  |
| DELETE | availability/:id          | Delete availability by ID      |             |

## Staff and Staff-Availability Routes
### Root:- /api/staff/
| Method | Endpoint                                | Description                                   | Access      |
|--------|-----------------------------------------|-----------------------------------------------|-------------|
| POST   | /                                       | Add a new staff member                        | Admin only  |
| GET    | /                                       | Get all staff members                         | Public      |
| GET    | /:id                                    | Get specific staff member by ID               | Public      |
| PUT    | /:id                                    | Update a staff member                         | Admin only  |
| DELETE | /:id                                    | Remove a staff member                         | Admin only  |
| POST   | /:id/availability                       | Set availability for a staff member           | Admin only  |
| GET    | /:id/availability                       | Get availability of a staff member            | Admin only  |
| PUT    | /availability/:availabilityId           | Update a specific availability slot           | Admin only  |
| DELETE | /availability/:availabilityId           | Delete a specific availability slot           | Admin only  |
| POST   | /:id/assign-service                     | Assign services to a staff member             | Admin only  |

##  Appointment Routes
### Root:- /api/appointments/
| Method | Endpoint              | Description                              | Access        |
|--------|-----------------------|------------------------------------------|---------------|
| GET    | /available-slots      | Get all available appointment slots      | Public        |
| POST   | /book                 | Book an appointment                      | Authenticated |
| POST   | /validate             | Validate slot and service before payment | Authenticated |
| GET    | /my                   | Get logged-in user's appointments        | Authenticated |
| GET    | /all                  | Get all appointments (admin only)        | Admin only    |
| PUT    | /:id/reschedule       | Reschedule an appointment by ID          | Authenticated |
| DELETE | /:id                  | Cancel an appointment by ID              | Authenticated |

## Payment Routes
### Root:- /api/payment/
| Method | Endpoint           | Description                          | Access        |
|--------|--------------------|--------------------------------------|---------------|
| POST   | /create-order      | Create a new payment order           | Authenticated |
| GET    | /status/:orderId   | Get payment status by order ID       | Authenticated |

## Review Routes
### Root:- /api/reviews/
| Method | Endpoint         | Description                                 | Access        |
|--------|------------------|---------------------------------------------|---------------|
| POST   | /                | Add a new review                            | Authenticated |
| PUT    | /:id             | Update a review by ID                       | Authenticated |
| PUT    | /:id/reply       | Staff reply to a review                     | Admin/Staff   |
| DELETE | /:id             | Delete a review by ID                       | Authenticated |
| GET    | /                | Get all reviews                             | Public        |
| GET    | /:id             | Get review by appointment ID                | Authenticated |


