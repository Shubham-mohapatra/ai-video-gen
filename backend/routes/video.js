const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const videoService = require('../services/videoService');
const { asyncHandler } = require('../middleware/asyncHandler');
const { validateRequest } = require('../middleware/validation');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// Validation schemas
const generateVideoSchema = Joi.object({
  prompt: Joi.string().min(10).max(1000).required(),
  style: Joi.string().valid('cinematic', 'animated', 'photorealistic', 'artistic').default('cinematic'),
  duration: Joi.number().valid(5, 10, 15, 30).default(10),
  resolution: Joi.string().valid('720p', '1080p', '4k').default('1080p'),
  aspectRatio: Joi.string().valid('16:9', '9:16', '1:1').default('16:9')
});

const textToVideoSchema = Joi.object({
  prompt: Joi.string().min(10).max(1000).required(),
  style: Joi.string().valid('cinematic', 'animated', 'photorealistic', 'artistic').default('cinematic'),
  duration: Joi.number().valid(5, 10, 15, 30).default(10),
  resolution: Joi.string().valid('720p', '1080p', '4k').default('1080p')
});

// Generate video from text prompt
router.post('/generate/text', 
  validateRequest(textToVideoSchema),
  asyncHandler(async (req, res) => {
    const { prompt, style, duration, resolution } = req.body;
    const videoId = uuidv4();
    
    // Get socket.io instance
    const io = req.app.get('io');
    
    try {
      // Start video generation process
      const result = await videoService.generateFromText({
        videoId,
        prompt,
        style,
        duration,
        resolution,
        userId: req.user?.id || 'anonymous'
      });
      
      // Emit real-time update
      io.to(`video-${videoId}`).emit('video-generation-started', {
        videoId,
        status: 'processing',
        estimatedTime: duration * 30 // rough estimate: 30 seconds per second of video
      });
      
      res.status(202).json({
        success: true,
        message: 'Video generation started',
        videoId,
        estimatedTime: duration * 30,
        status: 'processing'
      });
      
    } catch (error) {
      console.error('Video generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start video generation',
        error: error.message
      });
    }
  })
);

// Generate video from image
router.post('/generate/image', 
  upload.single('image'),
  validateRequest(generateVideoSchema),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }
    
    const { prompt, style, duration, resolution } = req.body;
    const videoId = uuidv4();
    const io = req.app.get('io');
    
    try {
      const result = await videoService.generateFromImage({
        videoId,
        imageBuffer: req.file.buffer,
        imageMimeType: req.file.mimetype,
        prompt,
        style,
        duration,
        resolution,
        userId: req.user?.id || 'anonymous'
      });
      
      io.to(`video-${videoId}`).emit('video-generation-started', {
        videoId,
        status: 'processing',
        estimatedTime: duration * 35 // image-to-video takes a bit longer
      });
      
      res.status(202).json({
        success: true,
        message: 'Video generation from image started',
        videoId,
        estimatedTime: duration * 35,
        status: 'processing'
      });
      
    } catch (error) {
      console.error('Image-to-video generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start video generation from image',
        error: error.message
      });
    }
  })
);

// Check video generation status
router.get('/status/:videoId', 
  asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    try {
      const status = await videoService.getGenerationStatus(videoId);
      
      res.json({
        success: true,
        videoId,
        ...status
      });
      
    } catch (error) {
      console.error('Status check error:', error);
      res.status(404).json({
        success: false,
        message: 'Video not found or status unavailable',
        error: error.message
      });
    }
  })
);

// Download generated video
router.get('/download/:videoId', 
  asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    try {
      const videoData = await videoService.getGeneratedVideo(videoId);
      
      if (!videoData) {
        return res.status(404).json({
          success: false,
          message: 'Video not found'
        });
      }
      
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="ai-video-${videoId}.mp4"`);
      res.send(videoData.buffer);
      
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download video',
        error: error.message
      });
    }
  })
);

// Get user's video history
router.get('/history', 
  asyncHandler(async (req, res) => {
    const userId = req.user?.id || 'anonymous';
    const { page = 1, limit = 10 } = req.query;
    
    try {
      const history = await videoService.getUserVideoHistory(userId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      res.json({
        success: true,
        ...history
      });
      
    } catch (error) {
      console.error('History fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch video history',
        error: error.message
      });
    }
  })
);

// Cancel video generation
router.delete('/cancel/:videoId', 
  asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    try {
      await videoService.cancelGeneration(videoId);
      
      const io = req.app.get('io');
      io.to(`video-${videoId}`).emit('video-generation-cancelled', {
        videoId,
        status: 'cancelled'
      });
      
      res.json({
        success: true,
        message: 'Video generation cancelled',
        videoId
      });
      
    } catch (error) {
      console.error('Cancellation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel video generation',
        error: error.message
      });
    }
  })
);

module.exports = router;
