# DUBAYMALL - Services Documentation

## 📚 Backend Services

### 🔐 Authentication Service (`src/lib/auth-service.ts`)

Complete authentication system with JWT and bcrypt password hashing.

**Features:**
- User registration with email/password
- User login with session management
- Password reset functionality
- Email verification
- Profile management
- Role-based access (customer, seller, blogger, admin)

**Functions:**
```typescript
signUpUser(data: SignUpData): Promise<{ user: User | null; error: string | null }>
signInUser(data: SignInData): Promise<{ user: User | null; error: string | null }>
signOutUser(): Promise<{ error: string | null }>
getCurrentUser(): Promise<{ user: User | null; error: string | null }>
requestPasswordReset(email: string): Promise<{ error: string | null }>
updatePassword(newPassword: string): Promise<{ error: string | null }>
updateUserProfile(updates: Partial<User>): Promise<{ user: User | null; error: string | null }>
verifyEmail(token: string): Promise<{ error: string | null }>
```

**Usage:**
```typescript
import { signUpUser, signInUser } from '@/lib/auth-service'

// Register new user
const { user, error } = await signUpUser({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe',
  role: 'customer'
})

// Login
const { user, error } = await signInUser({
  email: 'user@example.com',
  password: 'password123'
})
```

---

### 🛍️ Product Service (`src/lib/product-service.ts`)

Complete product management with CRUD operations and filtering.

**Features:**
- Create, read, update, delete products
- Product filtering and search
- Seller product management
- Stock tracking
- Image management
- Category and brand filtering

**Functions:**
```typescript
createProduct(sellerId: string, data: CreateProductData): Promise<{ product: Product | null; error: string | null }>
getProduct(productId: string): Promise<{ product: Product | null; error: string | null }>
updateProduct(data: UpdateProductData): Promise<{ product: Product | null; error: string | null }>
deleteProduct(productId: string): Promise<{ error: string | null }>
listProducts(filters: ProductFilters, page: number, limit: number): Promise<ProductListResult>
getSellerProducts(sellerId: string): Promise<ProductListResult>
```

**Usage:**
```typescript
import { createProduct, listProducts } from '@/lib/product-service'

// Create product
const { product, error } = await createProduct('seller-id', {
  title: 'Product Name',
  description: 'Product description',
  price: 100000,
  category: 'electronics',
  images: ['url1', 'url2'],
  stock: 50
})

// List products with filters
const { products, total } = await listProducts({
  category: 'electronics',
  minPrice: 50000,
  maxPrice: 200000,
  inStock: true
}, 1, 20)
```

---

### 📦 Order Service (`src/lib/order-service.ts`)

Complete order management system with status tracking.

**Features:**
- Create and manage orders
- Order status tracking
- Payment status management
- Delivery address management
- Order cancellation
- Order statistics
- Customer order history

**Functions:**
```typescript
createOrder(data: CreateOrderData): Promise<{ order: Order | null; error: string | null }>
getOrder(orderId: string): Promise<{ order: Order | null; error: string | null }>
updateOrder(data: UpdateOrderData): Promise<{ order: Order | null; error: string | null }>
cancelOrder(orderId: string, reason?: string): Promise<{ error: string | null }>
listOrders(filters: OrderFilters, page: number, limit: number): Promise<OrderListResult>
getCustomerOrders(customerId: string): Promise<OrderListResult>
getOrderStatistics(customerId?: string): Promise<OrderStatistics>
```

**Usage:**
```typescript
import { createOrder, getOrderStatistics } from '@/lib/order-service'

// Create order
const { order, error } = await createOrder({
  customer_id: 'customer-id',
  items: [
    {
      product_id: 'product-id',
      product_title: 'Product Name',
      product_image: 'url',
      quantity: 2,
      price: 100000
    }
  ],
  delivery_address: {
    region: 'Toshkent',
    city: 'Toshkent',
    street: 'Amir Temur',
    house: '1'
  },
  delivery_method: 'standard',
  payment_method: 'click'
})

// Get statistics
const stats = await getOrderStatistics('customer-id')
```

---

### 📧 Email Service (`src/lib/email-service.ts`)

Email service with HTML templates for various notifications.

**Features:**
- Welcome email
- Order confirmation
- Order shipped notification
- Password reset
- Email verification
- Custom HTML templates

**Functions:**
```typescript
sendEmail(data: EmailData): Promise<{ error: string | null }>
sendWelcomeEmail(userName: string, userEmail: string): Promise<{ error: string | null }>
sendOrderConfirmationEmail(userName: string, userEmail: string, orderId: string, orderTotal: number, orderItems: string): Promise<{ error: string | null }>
sendOrderShippedEmail(userName: string, userEmail: string, orderId: string, trackingNumber: string): Promise<{ error: string | null }>
sendPasswordResetEmail(userName: string, userEmail: string, resetLink: string): Promise<{ error: string | null }>
sendEmailVerification(userName: string, userEmail: string, verificationLink: string): Promise<{ error: string | null }>
```

**Usage:**
```typescript
import { sendWelcomeEmail, sendOrderConfirmationEmail } from '@/lib/email-service'

// Send welcome email
await sendWelcomeEmail('John Doe', 'john@example.com')

// Send order confirmation
await sendOrderConfirmationEmail(
  'John Doe',
  'john@example.com',
  'ORD-123',
  250000,
  '<ul><li>Product 1 x 2</li></ul>'
)
```

---

### 🔔 Notification Service (`src/lib/notification-service.ts`)

Real-time notification system for user alerts.

**Features:**
- Create notifications
- Get user notifications
- Mark as read
- Delete notifications
- Unread count
- Helper functions for common events

**Functions:**
```typescript
createNotification(data: CreateNotificationData): Promise<{ notification: Notification | null; error: string | null }>
getUserNotifications(userId: string, limit: number): Promise<{ notifications: Notification[]; error: string | null }>
markAsRead(notificationId: string): Promise<{ error: string | null }>
markAllAsRead(userId: string): Promise<{ error: string | null }>
deleteNotification(notificationId: string): Promise<{ error: string | null }>
getUnreadCount(userId: string): Promise<{ count: number; error: string | null }>

// Helper functions
notifyOrderCreated(userId: string, orderId: string): Promise<{ error: string | null }>
notifyOrderShipped(userId: string, orderId: string): Promise<{ error: string | null }>
notifyPaymentSuccess(userId: string, orderId: string, amount: number): Promise<{ error: string | null }>
```

**Usage:**
```typescript
import { getUserNotifications, notifyOrderCreated } from '@/lib/notification-service'

// Get notifications
const { notifications } = await getUserNotifications('user-id', 50)

// Notify order created
await notifyOrderCreated('user-id', 'ORD-123')
```

---

### 📁 File Upload Service (`src/lib/file-upload-service.ts`)

File upload service with Supabase Storage integration.

**Features:**
- Image upload with validation
- Multiple image upload
- Document upload
- File deletion
- File size validation
- File type validation

**Functions:**
```typescript
uploadImage(file: File, bucket?: string): Promise<UploadResult>
uploadMultipleImages(files: File[], bucket?: string): Promise<{ urls: string[]; errors: string[] }>
uploadDocument(file: File, bucket?: string): Promise<UploadResult>
deleteFile(filePath: string, bucket?: string): Promise<{ error: string | null }>
validateImageFile(file: File): { valid: boolean; error: string | null }
formatFileSize(bytes: number): string
```

**Usage:**
```typescript
import { uploadImage, uploadMultipleImages } from '@/lib/file-upload-service'

// Upload single image
const { url, error } = await uploadImage(file, 'products')

// Upload multiple images
const { urls, errors } = await uploadMultipleImages(files, 'products')
```

---

### 🖼️ Image Utilities (`src/lib/image-utils.ts`)

Image optimization and manipulation utilities.

**Features:**
- Image resizing
- Image compression
- Thumbnail creation
- WebP conversion
- Image cropping
- Dimension calculation

**Functions:**
```typescript
getImageDimensions(file: File): Promise<ImageDimensions>
resizeImage(file: File, options?: ResizeOptions): Promise<File>
compressImage(file: File, quality?: number): Promise<File>
createThumbnail(file: File, size?: number): Promise<File>
convertToWebP(file: File, quality?: number): Promise<File>
cropImage(file: File, cropArea: CropArea): Promise<File>
```

**Usage:**
```typescript
import { resizeImage, createThumbnail } from '@/lib/image-utils'

// Resize image
const resized = await resizeImage(file, {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.9
})

// Create thumbnail
const thumbnail = await createThumbnail(file, 200)
```

---

### ⚡ Real-time Service (`src/lib/realtime-service.ts`)

Real-time features with Supabase Realtime.

**Features:**
- Subscribe to table changes
- User presence tracking
- Broadcasting
- Real-time chat
- Typing indicators
- Online user tracking

**Functions:**
```typescript
subscribeToTable(table: string, callback: RealtimeCallback, filter?: Filter): RealtimeChannel | null
subscribeToNotifications(userId: string, callback: RealtimeCallback): RealtimeChannel | null
subscribeToOrders(customerId: string, callback: RealtimeCallback): RealtimeChannel | null
joinPresence(channelName: string, userId: string, metadata?: any): RealtimeChannel | null
broadcast(channel: RealtimeChannel, event: string, payload: any): void
subscribeToChatRoom(roomId: string, onMessage: Function, onUserJoin?: Function, onUserLeave?: Function): RealtimeChannel | null
```

**Usage:**
```typescript
import { subscribeToNotifications, joinPresence } from '@/lib/realtime-service'

// Subscribe to notifications
const channel = subscribeToNotifications('user-id', (payload) => {
  console.log('New notification:', payload)
})

// Join presence
const presenceChannel = joinPresence('chat-room', 'user-id', {
  name: 'John Doe'
})
```

---

### 📝 Logger (`src/lib/logger.ts`)

Comprehensive logging system with database integration.

**Features:**
- Info, warn, error, debug levels
- Context tracking
- Metadata support
- Database logging
- Error boundary helpers

**Functions:**
```typescript
logger.info(message: string, context?: string, metadata?: Record<string, any>): void
logger.warn(message: string, context?: string, metadata?: Record<string, any>): void
logger.error(message: string, error?: Error, context?: string, metadata?: Record<string, any>): void
logger.debug(message: string, context?: string, metadata?: Record<string, any>): void
handleError(error: Error, context?: string): void
handleApiError(error: any, endpoint: string): { error: string }
```

**Usage:**
```typescript
import { logger } from '@/lib/logger'

logger.info('User logged in', 'Auth', { userId: '123' })
logger.error('Failed to create order', error, 'Orders')
```

---

### 🛡️ API Middleware (`src/lib/api-middleware.ts`)

API middleware with authentication, authorization, and validation.

**Features:**
- Authentication middleware
- Role-based authorization
- Rate limiting
- Request validation
- CORS handling
- Error handling

**Functions:**
```typescript
requireAuth(request: NextRequest): Promise<{ user: any; error: NextResponse | null }>
requireRole(user: any, allowedRoles: string[]): NextResponse | null
rateLimit(identifier: string, maxRequests?: number, windowMs?: number): NextResponse | null
validateRequest<T>(request: NextRequest, schema: Function): Promise<{ data: T | null; error: NextResponse | null }>
apiHandler<T>(handler: Function): Function
protectedApiHandler<T>(handler: Function): Function
adminApiHandler<T>(handler: Function): Function
sellerApiHandler<T>(handler: Function): Function
```

**Usage:**
```typescript
import { protectedApiHandler, successResponse } from '@/lib/api-middleware'

export const GET = protectedApiHandler(async (request, user) => {
  // User is authenticated
  return successResponse({ user })
})
```

---

### ⏱️ Rate Limiter (`src/lib/rate-limiter.ts`)

Rate limiting with configurable limits.

**Features:**
- In-memory rate limiting
- Configurable limits
- Automatic cleanup
- Predefined configs

**Functions:**
```typescript
rateLimiter.check(identifier: string, config: RateLimitConfig): RateLimitResult
rateLimiter.reset(identifier: string): void
getClientIdentifier(request: Request): string
```

**Usage:**
```typescript
import { rateLimiter, rateLimitConfigs } from '@/lib/rate-limiter'

const result = rateLimiter.check('user-id', rateLimitConfigs.api)
if (!result.allowed) {
  return errorResponse('Too many requests', 429)
}
```

---

### ✅ Validation (`src/lib/validation.ts`)

Input validation with sanitization.

**Features:**
- Field validation
- Email, phone, URL validation
- Min/max length and value
- Pattern matching
- Custom validation
- Predefined schemas
- Sanitization helpers

**Functions:**
```typescript
validate(): Validator
schemas.signUp(data: any): ValidationResult
schemas.signIn(data: any): ValidationResult
schemas.createProduct(data: any): ValidationResult
schemas.createOrder(data: any): ValidationResult
sanitizeString(str: string): string
sanitizeEmail(email: string): string
sanitizeHtml(html: string): string
```

**Usage:**
```typescript
import { validate, schemas } from '@/lib/validation'

// Custom validation
const result = validate()
  .required(data.email, 'Email')
  .email(data.email)
  .minLength(data.password, 6, 'Password')
  .result()

// Using schema
const result = schemas.signUp(data)
if (!result.valid) {
  console.error(result.errors)
}
```

---

### 💾 Backup Utilities (`src/lib/backup-utils.ts`)

Database backup and restore utilities.

**Features:**
- Export tables to JSON
- Import from JSON
- Full backup
- Restore from backup
- Scheduled backups
- Backup verification

**Functions:**
```typescript
exportTableToJson(tableName: string): Promise<{ data: any[] | null; error: string | null }>
exportAllTables(tables: string[]): Promise<{ backup: Record<string, any> | null; error: string | null }>
downloadBackup(backup: any, filename?: string): void
importTableFromJson(tableName: string, data: any[]): Promise<{ success: boolean; error: string | null }>
restoreFromBackup(backup: any): Promise<{ success: boolean; errors: string[] }>
scheduleBackup(tables: string[], intervalHours?: number): NodeJS.Timeout
verifyBackup(backup: any): { valid: boolean; errors: string[] }
```

**Usage:**
```typescript
import { exportAllTables, downloadBackup } from '@/lib/backup-utils'

// Create backup
const { backup } = await exportAllTables(['users', 'products', 'orders'])
downloadBackup(backup)

// Schedule automatic backups
scheduleBackup(['users', 'products', 'orders'], 24)
```

---

## 🔄 Service Integration

### Mock Mode vs Production Mode

All services support both mock mode (localStorage) and production mode (Supabase):

```typescript
// Mock mode (development)
if (!supabase) {
  // Use localStorage
  const data = localStorage.getItem('users')
  return JSON.parse(data || '[]')
}

// Production mode
const { data, error } = await supabase
  .from('users')
  .select('*')
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (optional)
EMAIL_SERVICE_API_KEY=your-api-key

# SMS (optional)
SMS_SERVICE_API_KEY=your-api-key
```

---

## 📊 Service Status

| Service | Status | Mock Support | Production Ready |
|---------|--------|--------------|------------------|
| Authentication | ✅ Complete | ✅ Yes | ✅ Yes |
| Product CRUD | ✅ Complete | ✅ Yes | ✅ Yes |
| Order Management | ✅ Complete | ✅ Yes | ✅ Yes |
| Email | ✅ Complete | ✅ Yes | ⚠️ Needs integration |
| Notifications | ✅ Complete | ✅ Yes | ✅ Yes |
| File Upload | ✅ Complete | ✅ Yes | ✅ Yes |
| Image Utils | ✅ Complete | ✅ Yes | ✅ Yes |
| Real-time | ✅ Complete | ⚠️ Limited | ✅ Yes |
| Logger | ✅ Complete | ✅ Yes | ✅ Yes |
| API Middleware | ✅ Complete | N/A | ✅ Yes |
| Rate Limiter | ✅ Complete | N/A | ✅ Yes |
| Validation | ✅ Complete | N/A | ✅ Yes |
| Backup | ✅ Complete | ✅ Yes | ✅ Yes |

---

## 🚀 Next Steps

1. **Setup Supabase Project**
   - Create project
   - Run database schema
   - Configure environment variables

2. **Test Services**
   - Test authentication flow
   - Test product CRUD
   - Test order creation

3. **Integrate Payment**
   - Click payment gateway
   - Payme payment gateway

4. **Integrate Email**
   - SendGrid or similar
   - Configure templates

5. **Deploy to Production**
   - Vercel deployment
   - Environment variables
   - Domain configuration

---

## 📞 Support

For questions or issues, contact the development team.
