# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/braille_math_verse

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Mapbox Configuration
MAPBOX_TOKEN=pk.eyJ1IjoiYnJhaWxsZW1hdGh2ZXJzZSIsImEiOiJjbHZqZ2ZqZ2owMDBwMmpxcGZqZ2owMDBwIn0.1234567890

# Security Configuration
JWT_SECRET=braille_math_verse_secure_jwt_secret_key_2024
NEXTAUTH_SECRET=braille_math_verse_secure_nextauth_secret_2024
NEXTAUTH_URL=http://localhost:3000

# Application Configuration
NODE_ENV=development
PORT=3000

# Email Configuration (for OTP and notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL=3600  # 1 hour in seconds
CACHE_MAX_SIZE=1000