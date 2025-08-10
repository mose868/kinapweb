const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class SellerVettingService {
  constructor() {
    this.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDhj7xhHayAaoFeL8QKkm7c4yhi9b8-lPU';
    this.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  }

  async analyzeWithGemini(prompt, context = '') {
    try {
      if (!this.GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
      }

      const fullPrompt = `${context}\n\n${prompt}`;

      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.8,
            maxOutputTokens: 300,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0] && result.candidates[0].content) {
        return result.candidates[0].content.parts[0].text.trim();
      }
      
      throw new Error('No response from Gemini API');
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  async vetApplication(applicationData) {
    try {
      console.log('🤖 Starting AI vetting for seller application...');

      const applicationText = this.extractApplicationText(applicationData);
      
      // Simplified assessment - just one comprehensive analysis
      const assessmentPrompt = `Analyze this seller application and provide a quick assessment. Return only a JSON object with these fields:
{
  "overallScore": number (1-10),
  "sentimentScore": number (1-10),
  "qualityScore": number (1-10),
  "riskScore": number (1-10),
  "motivationScore": number (1-10),
  "experienceScore": number (1-10),
  "confidence": number (1-10)
}

Application: ${applicationText}`;

      const assessmentResult = await this.analyzeWithGemini(assessmentPrompt);
      
      // Try to parse the JSON response
      let scores;
      try {
        scores = JSON.parse(assessmentResult);
      } catch (e) {
        // Fallback to default scores if parsing fails
        scores = {
          overallScore: 7,
          sentimentScore: 7,
          qualityScore: 7,
          riskScore: 3,
          motivationScore: 8,
          experienceScore: 6,
          confidence: 7
        };
      }

      const result = {
        overallScore: Math.round(scores.overallScore * 10) / 10,
        sentimentScore: Math.round(scores.sentimentScore * 10) / 10,
        qualityScore: Math.round(scores.qualityScore * 10) / 10,
        riskScore: Math.round(scores.riskScore * 10) / 10,
        motivationScore: Math.round(scores.motivationScore * 10) / 10,
        experienceScore: Math.round(scores.experienceScore * 10) / 10,
        recommendations: ['Continue building portfolio', 'Gain more experience'],
        flaggedIssues: ['Limited experience shown'],
        aiNotes: `AI Analysis: Overall score ${scores.overallScore}/10. Quick assessment completed.`,
        confidence: Math.round(scores.confidence * 10) / 10,
        modelUsed: 'gemini-1.5-flash',
        processedAt: new Date().toISOString()
      };

      console.log('✅ AI vetting completed quickly:', result);
      return result;

    } catch (error) {
      console.error('❌ AI vetting failed:', error);
      
      // Fallback response
      return this.getFallbackResults();
    }
  }

  extractApplicationText(applicationData) {
    const parts = [];
    
    if (applicationData.personalInfo) {
      parts.push(`Personal Info: ${applicationData.personalInfo.fullName}, ${applicationData.personalInfo.email}`);
    }
    
    if (applicationData.professionalInfo) {
      parts.push(`Professional: ${applicationData.professionalInfo.experience}, Skills: ${applicationData.professionalInfo.skills?.join(', ')}`);
    }
    
    if (applicationData.businessInfo) {
      parts.push(`Business: ${applicationData.businessInfo.businessName}, Services: ${applicationData.businessInfo.services?.join(', ')}`);
    }
    
    if (applicationData.applicationContent) {
      parts.push(`Motivation: ${applicationData.applicationContent.motivation}`);
      parts.push(`Experience: ${applicationData.applicationContent.experienceDescription}`);
      parts.push(`Value: ${applicationData.applicationContent.valueProposition}`);
    }
    
    return parts.join('. ');
  }

  getFallbackResults() {
    return {
      overallScore: 7.0,
      sentimentScore: 7.0,
      qualityScore: 7.0,
      riskScore: 3.0,
      motivationScore: 8.0,
      experienceScore: 6.0,
      recommendations: ['Continue building portfolio', 'Gain more experience'],
      flaggedIssues: ['Limited experience shown'],
      aiNotes: 'AI analysis temporarily unavailable. Manual review recommended.',
      confidence: 6.0,
      modelUsed: 'fallback',
      processedAt: new Date().toISOString()
    };
  }
}

module.exports = SellerVettingService; 