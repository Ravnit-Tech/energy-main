# e-Nergy Platform — MongoDB Database Schema

> **Stack**: MongoDB Atlas · Mongoose ODM · Next.js Pages Router · Sliplane (Express backend)
>
> All model files live in `src/lib/models/`. Frontend types (no Mongoose) are in `src/lib/db-types.ts`.

---

## Collections Overview

| Collection | Model File | Documents | Purpose |
|---|---|---|---|
| `users` | `User.ts` | One per registered user | Identity, profile, bank details, auth |
| `station_managers` | `StationManager.ts` | One per SM | SM credentials & depot assignment |
| `supply_requests` | `SupplyRequest.ts` | One per request | Customer fuel supply requests |
| `purchase_orders` | `PurchaseOrder.ts` | One per order | Full BuyNow purchase (all 4 stages) |
| `loading_records` | `LoadingRecord.ts` | One per truck load | Physical depot loading event |
| `transactions` | `Transaction.ts` | One per payment event | Unified audit log across all flows |
| `trucks` | `Truck.ts` | One per truck | Registered trucks + AI review |
| `truck_rentals` | `TruckRental.ts` | One per rental | Rental bookings |
| `depots` | `Depot.ts` | One per depot (10) | Live stock levels & prices |
| `fuel_stations` | `FuelStation.ts` | One per station | Customer-owned fuel stations |
| `daily_sales` | `DailySales.ts` | One per station per day | Sales records (unique by station+date) |
| `union_dues` | `UnionDues.ts` | One per dues payment | Full paydues submission |
| `custom_levies` | `CustomLevy.ts` | One per admin-defined levy | Admin-managed extra dues |
| `platform_settings` | `PlatformSettings.ts` | Single document | All admin_settings |
| `notifications` | `Notification.ts` | One per notification | Unified inbox for all roles |
| `sessions` | `Session.ts` | One per login session | Auth tokens (TTL auto-delete) |
| `ai_feedbacks` | `AIFeedback.ts` | One per admin AI decision | Training feedback loop |

---

## Detailed Schemas

### `users`

```
_id              ObjectId   (auto)
name             String     required
email            String     required, unique, lowercase
phone            String     optional
role             Enum       "customer" | "bulk_dealer" | "truck_owner" | "admin"
status           Enum       "active" | "suspended" | "pending"   default: active
emailVerified    Boolean    default: false

passwordHash     String     bcrypt — NEVER returned to client (toJSON strips it)
emailVerifyCode  String     6-digit OTP (hashed in prod), expires via emailVerifyExp
emailVerifyExp   Date
resetToken       String     password reset token (hashed)
resetTokenExp    Date

companyName      String     optional
rcNumber         String     CAC RC number (bulk dealers)
dprRegNo         String     DPR registration number
dprLicence       String     DPR licence number (bulk dealers)
tinNumber        String     Tax ID
cacRegNo         String     CAC cert number
dealerCode       String     e.g. BD-CH1P3T (bulk dealers)
memberId         String     union membership ID

state            String     Nigerian state
lga              String     Local Government Area
headOfficeAddress String
stationAddress   String

officialIdType   Enum       nin | nimc-slip | passport | drivers-license |
                            voters-card | bvn | tin | nysc | birth-certificate
idNumber         String
idIssueDate      Date
idExpiryDate     Date
idIssuingAuthority String

bankName         String
bankAccountName  String
bankAccountNumber String     NUBAN 10-digit
bankBranch       String

lastLogin        Date
joinedAt         Date       (createdAt alias)
updatedAt        Date

INDICES: email (unique)
```

### `station_managers`

```
_id           ObjectId   (auto)
name          String     required
email         String     required, unique, lowercase
passwordHash  String     required — NEVER returned to client
phone         String     optional
depot         String     required — FK → depots.name
assignedBy    String     admin email
status        Enum       "Active" | "Blocked" | "Inactive"   default: Active
lastLogin     Date
resetToken    String
resetTokenExp Date
createdAt     Date
updatedAt     Date

INDICES: depot, status
```

### `supply_requests`

```
_id               ObjectId   (auto)
requestId         String     required, unique   e.g. SUP-REQ-1719000000000
stationId         ObjectId   optional FK → fuel_stations._id
stationName       String     required (denormalised)
product           Enum       "PMS" | "AGO" | "ATK"   required
depot             String     assigned depot (may be set by AI)
quantity          Number     required, min: 1  (litres)
priority          Enum       "normal" | "urgent" | "emergency"   default: normal
deliveryDate      Date       optional (customer-preferred)
notes             String     optional
requestedBy       String     required — FK → users.email
status            Enum       "Pending" | "Processing" | "In Transit" | "Delivered" | "Cancelled"
                             default: Pending

aiAssignedDepot         String
aiAdjustedPriority      Enum same as priority
aiReasoning             String
aiEstimatedDeliveryDays Number
aiAlternateDepots       [String]

createdAt  Date
updatedAt  Date

INDICES: (stationId, createdAt DESC), (requestedBy, createdAt DESC)
```

### `purchase_orders`

Full BuyNow form — all 4 stages:

```
_id             ObjectId   (auto)
orderId         String     required, unique   e.g. BUY-1719000000000
status          Enum       "Pending" | "Processing" | "In Transit" | "Delivered" | "Cancelled"
dealer          String     bulk dealer email (if via dealer portal)
transactionId   ObjectId   FK → transactions._id

-- Stage 1: Company --
loadingDepot      String   required (depot name)
companyName       String   required
dprRegNo          String   required
cacRegNo          String   required
companyAddress    String   required
companyTelephone  String   required
companyEmail      String   required
stationAddress    String   required

-- Stage 2: Owner / director --
ownerName       String   required
ownerTelephone  String   required
ownerAddress    String   required
ownerEmail      String   required
ownerIdType     Enum     nin | passport | drivers-license | voters-card   required
ownerIdNumber   String   required

-- Stage 3: Product & truck --
productType      Enum   "pms" | "ago" | "atk"   required
productQuantity  Number  required, min: 1 (litres)
haulageTruck     Enum   "Owned Truck" | "Rent Truck"   required

vehicleType       String   (required when Owned Truck)
tankCapacity      Number   litres
truckRegNumber    String
tractorColor      String
tankColor         String
bodyInscription   String
truckChart        String
calibrationChart  String
otherTruckDetails String
ullages           [Number] up to 5 compartment readings

driverName     String
driverIdType   String
driverIdNumber String

rentalId       ObjectId   FK → truck_rentals._id (when Rent Truck)

-- Stage 4: Payment --
paymentMethod     Enum   bank_transfer | card | wallet | opay | cash   required
bankName          String
bankAccountName   String
transactionRef    String   required

-- Pricing locked at order time --
pricePerLitre  Number   ₦
totalAmount    Number   productQuantity × pricePerLitre

createdAt  Date
updatedAt  Date

INDICES: (companyEmail, createdAt DESC), status, (dealer, createdAt DESC), (loadingDepot, status)
```

### `loading_records`

```
_id               ObjectId   (auto)
loadId            String     required, unique   e.g. LOAD-1719000000000
orderId           String     required — FK → purchase_orders.orderId
orderRef          ObjectId   FK → purchase_orders._id
product           Enum       "PMS" | "AGO" | "ATK"
depot             String     FK → depots.name
truckRegNumber    String
driverName        String
companyName       String
loadingDate       Date       required
compartments      [Number]   litres per compartment (up to 5)
totalLitresLoaded Number
sealNumbers       [String]   one per compartment
temperature       Number     °C at loading
density           Number     kg/L at loading
loaderName        String
loaderId          String     FK → users.email or station_managers.email
remarks           String
status            Enum       "Pending" | "In Progress" | "Completed" | "Cancelled"
createdAt         Date
updatedAt         Date

INDICES: orderId, orderRef, (depot, loadingDate DESC), truckRegNumber
```

### `transactions`

Unified audit log — one document per payment/flow completion:

```
_id           ObjectId   (auto)
txnId         String     required, unique   e.g. TXN-2026-000001
type          Enum       "Supply Request" | "Truck Rental" | "Union Dues" |
                         "Purchase Order" | "Supply Fulfillment" | "Loading"   required
user          String     display name   required
userEmail     String     FK → users.email
userRole      Enum       "Customer" | "Bulk Dealer"   required
product       String     optional
quantity      String     optional (string for display)
totalAmount   Number     required, ₦
status        Enum       "Completed" | "Pending" | "Failed"   default: Pending
paymentMethod Enum       bank_transfer | card | wallet | opay | cash
depot         String
reference     String     required — source record ID (BUY-xxx, SUP-REQ-xxx, etc.)
referenceType Enum       supply_request | purchase_order | truck_rental |
                         union_dues | loading
referenceId   ObjectId   FK to source document

aiFlagged         Boolean   default: false
aiAnomalySeverity Enum      "low" | "medium" | "high"
aiAnomalyDesc     String

timestamp  Date   (createdAt alias)

INDICES: (userEmail, timestamp DESC), referenceId, aiFlagged
```

### `trucks`

```
_id              ObjectId   (auto)
ownerName        String     required
ownerEmail       String     required   FK → users.email
ownerPhone       String     required
vehicleType      String     required
tankCapacity     Number     required, min: 1 (litres)
compartments     Number
truckRegNumber   String     required, unique
tractorColor     String
tankColor        String
chassisNumber    String
engineNumber     String
yearOfManufacture String
bodyInscription  String
insuranceProvider     String
insurancePolicyNumber String
insuranceExpiry       Date
dprCertNumber    String
dprCertExpiry    Date
roadWorthinessExpiry Date
productTypes     [String]   e.g. ["PMS", "AGO"]
dailyRate        Number     required, ₦
zoneRates        Mixed      Record<state, ₦> — owner-set rates per state
approvedZoneRates Mixed     Record<state, ₦> — admin-approved rates
driverName           String   required
driverPhone          String
driverLicenseNumber  String
driverLicenseExpiry  Date
motorBoyName         String
motorBoyPhone        String
motorBoyIdType       String
motorBoyIdNumber     String
destinationState     String
destinationTown      String
tractorImageUrl      String   URL after upload
tankImageUrl         String   URL after upload
status               Enum     "Pending Review" | "Approved" | "Rejected"
reviewNote           String
aiScore              Number   0–100
aiRecommendation     Enum     "approve" | "reject"
aiSummary            String
aiStrengths          [String]
aiConcerns           [String]
aiConfidenceGate     Enum     decisive_approve | decisive_reject | needs_manual_review
submittedAt          Date     (createdAt alias)
updatedAt            Date

INDICES: ownerEmail, status, (productTypes, status)
```

### `truck_rentals`

```
_id              ObjectId   (auto)
rentalId         String     required, unique   e.g. RENTAL-1719000000000
truckId          ObjectId   required   FK → trucks._id
truckRegNumber   String     required (denormalised)
truckOwnerEmail  String     required   FK → users.email
rentedBy         String     required   FK → users.email
linkedRequestId  ObjectId   FK → supply_requests._id
linkedOrderId    ObjectId   FK → purchase_orders._id
product          Enum       "PMS" | "AGO" | "ATK"   required
quantityLitres   Number     required, min: 1
pickupDepot      String     required   FK → depots.name
deliveryAddress  String
deliveryState    String
startDate        Date       required
endDate          Date       required (estimated return)
actualReturnDate Date
dailyRateLocked  Number     required, ₦ locked at booking
totalDays        Number     required, min: 1
totalAmount      Number     required, ₦
status           Enum       Requested | Confirmed | Active | Completed | Cancelled
paymentStatus    Enum       "Unpaid" | "Paid"
transactionId    ObjectId   FK → transactions._id
createdAt        Date
updatedAt        Date

INDICES: (rentedBy, createdAt DESC), (truckId, status), truckOwnerEmail, status
```

### `depots`

```
_id         ObjectId   (auto)
name        String     required, unique   e.g. "Lagos Main Depot"
location    String     required
state       String     required
coordinates { lat: Number, lng: Number }   required
PMS         { level: Number(0-100), price: Number(₦), status: Enum(Available|Limited|Unavailable) }
AGO         { ... same }
ATK         { ... same }
lastUpdated Date       (updatedAt alias)

Seeded with 10 depots at launch.
```

### `fuel_stations`

```
_id          ObjectId   (auto)
ownerEmail   String     required   FK → users.email
stationName  String     required
state        String     required
lga          String
address      String
rcNumber     String     CAC number
dprLicenseNo String     DPR licence
tanks        [{ product, capacityLitres, currentLitres, reorderLevel, lastRestocked }]
staffCount   Number
managerName  String
managerPhone String
status       Enum       "active" | "inactive" | "suspended"
createdAt    Date
updatedAt    Date

INDICES: ownerEmail, state, (ownerEmail, stationName) UNIQUE
```

### `daily_sales`

```
_id           ObjectId   (auto)
stationId     ObjectId   required   FK → fuel_stations._id
stationName   String     required (denormalised)
recordedBy    String     required   FK → users.email
saleDate      Date       required (midnight-normalised)
sales         [{
  product          Enum  PMS | AGO | ATK
  openingStockLtrs Number  required, min: 0
  closingStockLtrs Number  required, min: 0
  litresSold       Number  = opening − closing
  pricePerLitre    Number  ₦ on that date
  revenue          Number  litresSold × pricePerLitre
  pumpNumber       String
}]
totalRevenue  Number     sum across all products
notes         String
isVerified    Boolean    manager sign-off   default: false
createdAt     Date
updatedAt     Date

INDICES: (stationId, saleDate) UNIQUE, (recordedBy, saleDate DESC), saleDate DESC
```

### `union_dues`

```
_id           ObjectId   (auto)
paymentId     String     required, unique   e.g. DUES-1719000000000

-- Stage 1: Member info --
userEmail     String   required   FK → users.email
fullName      String   required
companyName   String   required
membershipId  String   required
telephone     String   required
address       String   required
paymentDepot  String   required (depot name)

-- Stage 2: Dues amount --
amountDue    Number   required, ₦ (from admin_settings at time of payment)
amountPaid   Number   ₦
customLevies [{
  levyId    String
  name      String
  amount    Number
  frequency String
}]

-- Stage 3: Levy / cargo declaration (optional) --
productType   Enum   PMS | AGO | DPK | LPG | CRUDE
litres        Number
truckCount    Number
declaredValue Number  ₦

-- Stage 4: Payment --
paymentMethod   Enum   bank_transfer | card | wallet | opay | cash   required
bankName        String
bankAccountName String
transactionRef  String   required

userRole    Enum   customer | bulk_dealer | truck_owner   required
duesPeriod  String   e.g. "Q1 2025"
periodStart Date
periodEnd   Date
status      Enum   Pending | Paid | Overdue | Waived   default: Pending
transactionId ObjectId   FK → transactions._id
paidAt      Date
createdAt   Date
updatedAt   Date

INDICES: (userEmail, createdAt DESC), status, membershipId, (paymentDepot, status)
```

### `custom_levies`

```
_id       ObjectId   (auto)
name      String     required   e.g. "Emergency Relief Fund"
amount    Number     required, ₦
frequency Enum       One-time | Annual | Monthly | Quarterly | Weekly   required
isActive  Boolean    default: true
createdBy String     admin email
notes     String
createdAt Date
updatedAt Date

INDICES: isActive
```

### `platform_settings`

Single document — upsert with `{ settingsKey: "global" }`:

```
_id          ObjectId   (auto)
settingsKey  String     "global" (unique — one document)

platformName     String
tagline          String
businessAddress  String
rcNumber         String
vatNumber        String
supportEmail     String
supportPhone     String
whatsappNumber   String
facebookUrl      String
instagramUrl     String
twitterUrl       String

pmsPricePerLitre   Number   ₦
agoPricePerLitre   Number   ₦
atkPricePerLitre   Number   ₦
lgpPricePerLitre   Number   ₦
depotCapacityLitres Number
lowStockThreshold   Number  %

urgentDeliveryFee      Number   ₦
emergencyDeliveryFee   Number   ₦
platformCommissionPct  Number   %
minOrderLitres         Number
maxOrderLitres         Number
standardLeadTimeHours  Number
urgentLeadTimeHours    Number
annualMembershipFee    Number   ₦
monthlyLevy            Number   ₦
loadingSurcharge       Number   ₦
bulkDealerYearlyFee    Number   ₦

paystackPublicKey  String   env only — stripped from toJSON
bankName           String
bankAccountName    String
bankAccountNumber  String
enablePaystack     Boolean
enableBankTransfer Boolean
enableCash         Boolean
enableWallet       Boolean
enableOpay         Boolean

backendUrl         String
apiKey             String   internal — stripped from toJSON
mongoDbConnected   Boolean
depotCodeSecret    String   stripped from toJSON
depotCodeTtlHours  Number

allowNewRegistrations       Boolean
notifyNewSupplyRequests     Boolean
notifyNewPurchaseOrders     Boolean
notifyLowStock              Boolean
notifyTruckRegistrations    Boolean

updatedAt  Date
```

### `notifications`

```
_id            ObjectId   (auto)
recipientEmail String     required   FK → users.email
recipientRole  Enum       customer | bulk_dealer | truck_owner | admin   required
title          String     required
message        String     required
actionRequired String     optional CTA text from AI
action         String     triggering action e.g. "truck_approved"
read           Boolean    default: false
reference      String     linked record ID if applicable
createdAt      Date       (no updatedAt — immutable)

INDICES: (recipientEmail, createdAt DESC)
```

### `sessions`

```
_id          ObjectId   (auto)
userEmail    String     required   FK → users.email
userId       ObjectId   required   FK → users._id
token        String     required, unique   hashed JWT
role         Enum       customer | bulk_dealer | truck_owner | admin
ipAddress    String
userAgent    String
expiresAt    Date       required   — TTL index auto-deletes expired docs
lastActiveAt Date       default: now
isValid      Boolean    default: true   set false on logout/revocation
createdAt    Date
updatedAt    Date

INDICES: userEmail, userId, expiresAt (TTL expireAfterSeconds: 0)
```

### `ai_feedbacks`

```
_id               ObjectId   (auto)
route             String     required   "truck-review" | "user-risk" | etc.
recordId          String     required   ID of the reviewed record
aiRecommendation  String     required   what Claude recommended
adminDecision     String     required   what admin actually did
adminOverrode     Boolean    required   true if admin disagreed
reasonNote        String
aiScore           Number
aiConfidenceGate  String
adminEmail        String
createdAt         Date

INDICES: (route, recordId)
```

---

## Relationships Diagram

```
users ──────────────────────────────────────────────────────────┐
  │ ownerEmail                                                   │
  ├──► fuel_stations (one-to-many)                              │
  │      └──► daily_sales (one-to-many, unique per day)         │
  ├──► supply_requests (one-to-many via requestedBy)            │
  ├──► truck_rentals (one-to-many via rentedBy)                 │
  ├──► trucks (one-to-many via ownerEmail, role=truck_owner)    │
  ├──► union_dues (one-to-many via userEmail)                   │
  ├──► purchase_orders (one-to-many via companyEmail/ownerEmail)│
  ├──► notifications (one-to-many via recipientEmail)           │
  └──► sessions (one-to-many)                                   │

station_managers ──► depots (many-to-one via depot name)        │
                                                                 │
purchase_orders ──► loading_records (one-to-one via orderId)    │
purchase_orders ──► truck_rentals (one-to-one via rentalId)     │
purchase_orders ──► transactions (one-to-one via transactionId) │
                                                                 │
transactions ──► any source (polymorphic via referenceType +    │
                 referenceId)                                    │

trucks ──► truck_rentals (one-to-many)                          │
truck_rentals ──► transactions                                   │

union_dues ──► custom_levies (embedded array, not FK)           │
union_dues ──► transactions                                      │

platform_settings ─── single document (settingsKey: "global")  │
custom_levies ──────── admin-managed, displayed in paydues flow │
ai_feedbacks ───────── written on every admin AI decision       │
```

---

## Seed Data Required

```
depots        10 documents (Lagos, PHC, Warri, Abuja, Kaduna, Kano, Ibadan, Enugu, Calabar, Benin)
platform_settings  1 document (settingsKey: "global", defaults from DEFAULT_ADMIN_SETTINGS)
users         1 admin document (admin@energy.ng, role: admin, emailVerified: true)
```

---

## Migration Checklist (localStorage → MongoDB)

| localStorage Key | Target Collection | Notes |
|---|---|---|
| `user` | `users` | Merge with profile; hash password |
| `sm_user` | `station_managers` | Hash password |
| `station_managers` | `station_managers` | Array → documents |
| `admin_suspended_users` | `users.status` | Set `status: "suspended"` |
| `admin_settings` | `platform_settings` | Upsert `settingsKey: "global"` |
| `admin_custom_levies` | `custom_levies` | Array → documents |
| `platform_transactions` | `transactions` | Map `TXN-xxx` → `txnId` |
| `supply_requests` | `supply_requests` | Map `SUP-REQ-xxx` → `requestId` |
| `purchase_orders` | `purchase_orders` | Map `BUY-xxx` → `orderId` |
| `loading_records` | `loading_records` | Map `LOAD-xxx` → `loadId` |
| `truck_rentals` | `truck_rentals` | Map `RENTAL-xxx` → `rentalId` |
| `trucks` | `trucks` | One doc per truck |
| `union_dues` | `union_dues` | Map `DUES-xxx` → `paymentId` |
| `customer_profile` | `users` | Merge into user doc |
| `bulk_dealer_profile` | `users` | Merge into user doc |
| `customer_notifications` | `notifications` | Set `recipientRole: "customer"` |
| `bulk_dealer_notifications` | `notifications` | Set `recipientRole: "bulk_dealer"` |
| `daily_sales` | `daily_sales` | Map per station+date |
| `depot_stock` | `depots` | Update stock on existing depot docs |
| `online_users` | _Drop — use Sessions_ | TTL on `sessions.lastActiveAt` |

---

## Environment Variables Required

```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
PAYSTACK_SECRET_KEY=sk_live_...     # server only
PAYSTACK_PUBLIC_KEY=pk_live_...     # safe for client
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_BACKEND_URL=https://...  # Sliplane URL
API_SECRET_KEY=...                   # internal API key
DEPOT_CODE_SECRET=...                # used to validate depot codes
```
