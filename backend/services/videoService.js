const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

class VideoService {
  constructor() {
    this.generations = new Map(); // In-memory storage for demo
    this.uploadDir = path.join(__dirname, '../uploads');
    this.outputDir = path.join(__dirname, '../outputs');
    
    // Initialize directories
    this.initDirectories();
  }
  
  async initDirectories() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directories:', error);
    }
  }
  
  /**
   * Generate video from text prompt
   */
  async generateFromText({ videoId, prompt, style, duration, resolution, userId }) {
    try {
      // Store generation info
      this.generations.set(videoId, {
        id: videoId,
        userId,
        type: 'text-to-video',
        prompt,
        style,
        duration,
        resolution,
        status: 'processing',
        progress: 0,
        createdAt: new Date(),
        estimatedCompletion: new Date(Date.now() + (duration * 30 * 1000))
      });
      
      // Start background processing
      this.processTextToVideo(videoId, { prompt, style, duration, resolution });
      
      return {
        videoId,
        status: 'processing',
        message: 'Video generation started'
      };
      
    } catch (error) {
      this.generations.set(videoId, {
        ...this.generations.get(videoId),
        status: 'failed',
        error: error.message
      });
      throw error;
    }
  }
  
  /**
   * Generate video from image + text prompt
   */
  async generateFromImage({ videoId, imageBuffer, imageMimeType, prompt, style, duration, resolution, userId }) {
    try {
      // Process and save the image
      const imageFileName = `${videoId}_input.jpg`;
      const imagePath = path.join(this.uploadDir, imageFileName);
      
      // Convert and optimize image
      await sharp(imageBuffer)
        .jpeg({ quality: 90 })
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .toFile(imagePath);
      
      // Store generation info
      this.generations.set(videoId, {
        id: videoId,
        userId,
        type: 'image-to-video',
        prompt,
        style,
        duration,
        resolution,
        status: 'processing',
        progress: 0,
        inputImage: imagePath,
        createdAt: new Date(),
        estimatedCompletion: new Date(Date.now() + (duration * 35 * 1000))
      });
      
      // Start background processing
      this.processImageToVideo(videoId, { imagePath, prompt, style, duration, resolution });
      
      return {
        videoId,
        status: 'processing',
        message: 'Image-to-video generation started'
      };
      
    } catch (error) {
      this.generations.set(videoId, {
        ...this.generations.get(videoId),
        status: 'failed',
        error: error.message
      });
      throw error;
    }
  }
  
  /**
   * Process text-to-video generation (background)
   */
  async processTextToVideo(videoId, { prompt, style, duration, resolution }) {
    try {
      const generation = this.generations.get(videoId);
      
      // Simulate progress updates
      await this.updateProgress(videoId, 10, 'Analyzing prompt...');
      
      // For demonstration, we'll use different AI services based on style
      let apiResponse;
      
      if (process.env.RUNWAYML_API_KEY) {
        apiResponse = await this.callRunwayML({ prompt, duration, resolution });
      } else if (process.env.STABILITY_API_KEY) {
        apiResponse = await this.callStabilityAI({ prompt, duration, resolution });
      } else {
        // Fallback to mock generation for demo
        apiResponse = await this.mockVideoGeneration({ prompt, style, duration, resolution });
      }
      
      await this.updateProgress(videoId, 50, 'AI model processing...');
      
      // Process the API response
      const videoPath = await this.processAPIResponse(videoId, apiResponse);
      
      await this.updateProgress(videoId, 90, 'Finalizing video...');
      
      // Mark as completed
      this.generations.set(videoId, {
        ...generation,
        status: 'completed',
        progress: 100,
        outputPath: videoPath,
        completedAt: new Date(),
        downloadUrl: `/api/video/download/${videoId}`
      });
      
      console.log(`✅ Video generation completed: ${videoId}`);
      
    } catch (error) {
      console.error(`❌ Video generation failed: ${videoId}`, error);
      const generation = this.generations.get(videoId);
      this.generations.set(videoId, {
        ...generation,
        status: 'failed',
        error: error.message,
        failedAt: new Date()
      });
    }
  }
  
  /**
   * Process image-to-video generation (background)
   */
  async processImageToVideo(videoId, { imagePath, prompt, style, duration, resolution }) {
    try {
      const generation = this.generations.get(videoId);
      
      await this.updateProgress(videoId, 15, 'Processing input image...');
      
      let apiResponse;
      
      if (process.env.RUNWAYML_API_KEY) {
        apiResponse = await this.callRunwayMLImageToVideo({ imagePath, prompt, duration });
      } else if (process.env.STABILITY_API_KEY) {
        apiResponse = await this.callStabilityImageToVideo({ imagePath, prompt, duration });
      } else {
        // Fallback to mock generation
        apiResponse = await this.mockImageToVideoGeneration({ imagePath, prompt, style, duration, resolution });
      }
      
      await this.updateProgress(videoId, 60, 'AI processing image and prompt...');
      
      const videoPath = await this.processAPIResponse(videoId, apiResponse);
      
      await this.updateProgress(videoId, 95, 'Finalizing video...');
      
      // Mark as completed
      this.generations.set(videoId, {
        ...generation,
        status: 'completed',
        progress: 100,
        outputPath: videoPath,
        completedAt: new Date(),
        downloadUrl: `/api/video/download/${videoId}`
      });
      
      console.log(`✅ Image-to-video generation completed: ${videoId}`);
      
    } catch (error) {
      console.error(`❌ Image-to-video generation failed: ${videoId}`, error);
      const generation = this.generations.get(videoId);
      this.generations.set(videoId, {
        ...generation,
        status: 'failed',
        error: error.message,
        failedAt: new Date()
      });
    }
  }
  
  /**
   * Call RunwayML API
   */
  async callRunwayML({ prompt, duration, resolution }) {
    try {
      const response = await axios.post('https://api.runwayml.com/v1/video/generations', {
        prompt,
        duration,
        resolution,
        model: 'gen-3-alpha-turbo'
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.RUNWAYML_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000 // 5 minutes
      });
      
      return response.data;
    } catch (error) {
      console.error('RunwayML API error:', error.response?.data || error.message);
      throw new Error('Failed to generate video with RunwayML');
    }
  }
  
  /**
   * Call Stability AI Video API
   */
  async callStabilityAI({ prompt, duration, resolution }) {
    try {
      const response = await axios.post('https://api.stability.ai/v2beta/video/generate', {
        prompt,
        duration_seconds: duration,
        aspect_ratio: resolution === '4k' ? '16:9' : '16:9'
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 300000
      });
      
      return response.data;
    } catch (error) {
      console.error('Stability AI API error:', error.response?.data || error.message);
      throw new Error('Failed to generate video with Stability AI');
    }
  }
  
  /**
   * Mock video generation for demonstration
   */
  async mockVideoGeneration({ prompt, style, duration, resolution }) {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      id: 'mock-generation',
      status: 'completed',
      output_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      metadata: {
        duration,
        resolution,
        prompt,
        style
      }
    };
  }
  
  /**
   * Mock image-to-video generation
   */
  async mockImageToVideoGeneration({ imagePath, prompt, style, duration, resolution }) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      id: 'mock-image-to-video',
      status: 'completed',
      output_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      metadata: {
        duration,
        resolution,
        prompt,
        style,
        inputImage: imagePath
      }
    };
  }
  
  /**
   * Process API response and save video
   */
  async processAPIResponse(videoId, apiResponse) {
    try {
      const outputPath = path.join(this.outputDir, `${videoId}.mp4`);
      
      if (apiResponse.output_url) {
        // Download video from URL
        const response = await axios.get(apiResponse.output_url, {
          responseType: 'arraybuffer'
        });
        
        await fs.writeFile(outputPath, response.data);
      } else if (apiResponse.video_data) {
        // Direct video data
        await fs.writeFile(outputPath, Buffer.from(apiResponse.video_data, 'base64'));
      } else {
        throw new Error('No video data in API response');
      }
      
      return outputPath;
    } catch (error) {
      console.error('Error processing API response:', error);
      throw new Error('Failed to process generated video');
    }
  }
  
  /**
   * Update generation progress
   */
  async updateProgress(videoId, progress, message) {
    const generation = this.generations.get(videoId);
    if (generation) {
      this.generations.set(videoId, {
        ...generation,
        progress,
        statusMessage: message,
        updatedAt: new Date()
      });
      
      // Emit real-time update if socket.io is available
      // This would be handled by the route that has access to io
      console.log(`📹 ${videoId}: ${progress}% - ${message}`);
    }
  }
  
  /**
   * Get generation status
   */
  async getGenerationStatus(videoId) {
    const generation = this.generations.get(videoId);
    
    if (!generation) {
      throw new Error('Video generation not found');
    }
    
    return {
      status: generation.status,
      progress: generation.progress,
      message: generation.statusMessage,
      createdAt: generation.createdAt,
      estimatedCompletion: generation.estimatedCompletion,
      completedAt: generation.completedAt,
      downloadUrl: generation.downloadUrl,
      error: generation.error
    };
  }
  
  /**
   * Get generated video file
   */
  async getGeneratedVideo(videoId) {
    const generation = this.generations.get(videoId);
    
    if (!generation || generation.status !== 'completed') {
      return null;
    }
    
    try {
      const videoBuffer = await fs.readFile(generation.outputPath);
      return {
        buffer: videoBuffer,
        metadata: {
          prompt: generation.prompt,
          style: generation.style,
          duration: generation.duration,
          resolution: generation.resolution
        }
      };
    } catch (error) {
      console.error('Error reading video file:', error);
      return null;
    }
  }
  
  /**
   * Get user's video history
   */
  async getUserVideoHistory(userId, { page = 1, limit = 10 }) {
    const userGenerations = Array.from(this.generations.values())
      .filter(gen => gen.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const total = userGenerations.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const videos = userGenerations.slice(startIndex, endIndex).map(gen => ({
      id: gen.id,
      type: gen.type,
      prompt: gen.prompt,
      style: gen.style,
      duration: gen.duration,
      resolution: gen.resolution,
      status: gen.status,
      createdAt: gen.createdAt,
      completedAt: gen.completedAt,
      downloadUrl: gen.downloadUrl
    }));
    
    return {
      videos,
      pagination: {
        currentPage: page,
        totalPages,
        totalVideos: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }
  
  /**
   * Cancel video generation
   */
  async cancelGeneration(videoId) {
    const generation = this.generations.get(videoId);
    
    if (!generation) {
      throw new Error('Video generation not found');
    }
    
    if (generation.status === 'completed') {
      throw new Error('Cannot cancel completed generation');
    }
    
    this.generations.set(videoId, {
      ...generation,
      status: 'cancelled',
      cancelledAt: new Date()
    });
    
    return true;
  }
}

module.exports = new VideoService();
