# AI Video Generation Backend

A powerful Node.js backend API for AI video generation supporting multiple AI providers.

## Features

- 🎬 **Text-to-Video Generation** - Create videos from text prompts
- 🖼️ **Image-to-Video Generation** - Animate static images with AI
- 🔄 **Real-time Progress Updates** - WebSocket support for live status
- 🎨 **Multiple Styles** - Cinematic, animated, photorealistic, artistic
- 📊 **Rate Limiting** - Protect against abuse
- 🔒 **Secure File Handling** - Safe file uploads and processing
- 📈 **User Management** - Registration, authentication, history
- 🚀 **High Performance** - Optimized for production use

## Supported AI Providers

- **RunwayML** - Industry-leading video generation (Gen-3 Alpha Turbo)
- **Stability AI** - Stable Video Diffusion
- **Mock Provider** - For development and testing

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your API keys and configuration
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Production Start
```bash
npm start
```

## API Endpoints

### Video Generation

#### Generate Video from Text
```
POST /api/video/generate/text
Content-Type: application/json

{
  "prompt": "A peaceful mountain landscape at sunset",
  "style": "cinematic",
  "duration": 10,
  "resolution": "1080p"
}
```

#### Generate Video from Image
```
POST /api/video/generate/image
Content-Type: multipart/form-data

image: [file]
prompt: "Make this image come alive with gentle motion"
style: "cinematic"
duration: 10
resolution: "1080p"
```

#### Check Generation Status
```
GET /api/video/status/:videoId
```

#### Download Generated Video
```
GET /api/video/download/:videoId
```

#### Get Generation History
```
GET /api/video/history?page=1&limit=10
```

#### Cancel Generation
```
DELETE /api/video/cancel/:videoId
```

### User Management

#### Register User
```
POST /api/user/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/user/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```
GET /api/user/profile
Authorization: Bearer <token>
```

## WebSocket Events

Connect to get real-time updates:

```javascript
const socket = io('http://localhost:5000');

socket.emit('join-video-generation', videoId);

socket.on('video-generation-started', (data) => {
  console.log('Generation started:', data);
});

socket.on('video-generation-progress', (data) => {
  console.log('Progress:', data.progress + '%');
});

socket.on('video-generation-completed', (data) => {
  console.log('Video ready:', data.downloadUrl);
});

socket.on('video-generation-failed', (data) => {
  console.error('Generation failed:', data.error);
});
```

## Configuration

### AI Provider Setup

#### RunwayML (Recommended)
1. Sign up at [RunwayML](https://runwayml.com)
2. Get your API key from the dashboard
3. Add to `.env`: `RUNWAYML_API_KEY=your_key_here`

#### Stability AI
1. Sign up at [Stability AI](https://stability.ai)
2. Get your API key
3. Add to `.env`: `STABILITY_API_KEY=your_key_here`

### Rate Limiting
- **Video Generation**: 10 videos per hour per IP
- **API Requests**: 100 requests per 15 minutes per IP

### File Limits
- **Max File Size**: 100MB
- **Supported Formats**: JPG, PNG, MP4, MOV, AVI
- **Max Video Duration**: 30 seconds

## Development

### Project Structure
```
backend/
├── routes/          # API route handlers
├── services/        # Business logic and AI integrations
├── middleware/      # Express middleware
├── uploads/         # Temporary file storage
├── outputs/         # Generated video storage
└── server.js        # Express app setup
```

### Adding New AI Providers

1. Add API integration to `services/videoService.js`
2. Add environment variables to `.env.example`
3. Update documentation

### Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### Logging

All operations are logged with timestamps and video IDs for debugging.

## Production Deployment

### Environment Variables
Set these in production:
- `NODE_ENV=production`
- `FRONTEND_URL=https://yourdomain.com`
- API keys for your chosen AI providers

### Scaling Considerations
- Use Redis for session storage and job queues
- Implement proper database (MongoDB/PostgreSQL)
- Use cloud storage (AWS S3) for file handling
- Add monitoring and logging (Winston, New Relic)
- Implement caching (Redis)

### Security
- HTTPS only in production
- Proper CORS configuration
- File type validation
- Input sanitization
- Rate limiting by user ID, not just IP

## License

MIT License - see LICENSE file for details
