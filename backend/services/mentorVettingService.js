const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class MentorVettingService {
  constructor() {
    this.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
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
      console.log('🤖 Starting AI vetting for mentor application...');

      const applicationText = this.extractApplicationText(applicationData);
      
      // Sentiment Analysis
      const sentimentPrompt = `Analyze the sentiment of this mentor application. Rate it from 1-10 where 1 is very negative and 10 is very positive. Consider professionalism, enthusiasm, and confidence. Return only a number between 1-10.

Application: ${applicationText}`;

      const sentimentScore = await this.analyzeWithGemini(sentimentPrompt);
      const sentiment = Math.min(10, Math.max(1, parseFloat(sentimentScore) || 7));

      // Professional Quality Assessment
      const qualityPrompt = `Assess the professional quality of this mentor application. Rate it from 1-10 where 1 is poor quality and 10 is excellent quality. Consider clarity, completeness, and professionalism. Return only a number between 1-10.

Application: ${applicationText}`;

      const qualityScore = await this.analyzeWithGemini(qualityPrompt);
      const quality = Math.min(10, Math.max(1, parseFloat(qualityScore) || 7));

      // Risk Assessment
      const riskPrompt = `Assess potential risks in this mentor application. Rate risk from 1-10 where 1 is low risk and 10 is high risk. Consider credibility, experience level, and potential issues. Return only a number between 1-10.

Application: ${applicationText}`;

      const riskScore = await this.analyzeWithGemini(riskPrompt);
      const risk = Math.min(10, Math.max(1, parseFloat(riskScore) || 3));

      // Motivation Analysis
      const motivationPrompt = `Analyze the motivation and commitment level in this mentor application. Rate it from 1-10 where 1 is low motivation and 10 is high motivation. Consider passion, goals, and dedication. Return only a number between 1-10.

Application: ${applicationText}`;

      const motivationScore = await this.analyzeWithGemini(motivationPrompt);
      const motivation = Math.min(10, Math.max(1, parseFloat(motivationScore) || 8));

      // Experience Assessment
      const experiencePrompt = `Assess the experience level and expertise in this mentor application. Rate it from 1-10 where 1 is beginner and 10 is expert level. Consider skills, experience, and knowledge. Return only a number between 1-10.

Application: ${applicationText}`;

      const experienceScore = await this.analyzeWithGemini(experiencePrompt);
      const experience = Math.min(10, Math.max(1, parseFloat(experienceScore) || 6));

      // Overall Assessment
      const overallPrompt = `Provide an overall assessment of this mentor application. Consider all aspects and provide:
1. Overall score (1-10)
2. Key strengths (comma-separated)
3. Areas for improvement (comma-separated)
4. Recommendations (comma-separated)
5. Confidence level (1-10)

Format as: score|strengths|improvements|recommendations|confidence

Application: ${applicationText}`;

      const overallAssessment = await this.analyzeWithGemini(overallPrompt);
      const [overallScore, strengths, improvements, recommendations, confidence] = overallAssessment.split('|');

      const overall = Math.min(10, Math.max(1, parseFloat(overallScore) || 7));
      const confidenceLevel = Math.min(10, Math.max(1, parseFloat(confidence) || 8));

      const result = {
        overallScore: Math.round(overall * 10) / 10,
        sentimentScore: Math.round(sentiment * 10) / 10,
        qualityScore: Math.round(quality * 10) / 10,
        riskScore: Math.round(risk * 10) / 10,
        motivationScore: Math.round(motivation * 10) / 10,
        experienceScore: Math.round(experience * 10) / 10,
        recommendations: recommendations ? recommendations.split(',').map(r => r.trim()) : [],
        flaggedIssues: improvements ? improvements.split(',').map(i => i.trim()) : [],
        aiNotes: `AI Analysis: Overall score ${overall}/10. Strengths: ${strengths || 'Good potential'}. Areas for improvement: ${improvements || 'None significant'}.`,
        confidence: Math.round(confidenceLevel * 10) / 10,
        modelUsed: 'gemini-pro',
        processedAt: new Date().toISOString()
      };

      console.log('✅ AI vetting completed:', result);
      return result;

    } catch (error) {
      console.error('❌ AI vetting failed:', error);
      
      // Fallback response
      return {
        overallScore: 7.0,
        sentimentScore: 7.0,
        qualityScore: 7.0,
        riskScore: 3.0,
        motivationScore: 8.0,
        experienceScore: 6.0,
        recommendations: ['Continue building experience', 'Develop mentoring skills'],
        flaggedIssues: ['Limited mentoring experience shown'],
        aiNotes: 'AI analysis temporarily unavailable. Manual review recommended.',
        confidence: 6.0,
        modelUsed: 'fallback',
        processedAt: new Date().toISOString()
      };
    }
  }

  extractApplicationText(applicationData) {
    const parts = [];
    
    if (applicationData.personalInfo) {
      parts.push(`Personal Info: ${applicationData.personalInfo.fullName}, ${applicationData.personalInfo.email}`);
    }
    
    if (applicationData.professionalInfo) {
      parts.push(`Professional: ${applicationData.professionalInfo.currentRole}, Experience: ${applicationData.professionalInfo.experience}, Skills: ${applicationData.professionalInfo.skills?.join(', ')}`);
    }
    
    if (applicationData.mentorshipInfo) {
      parts.push(`Mentorship: Categories: ${applicationData.mentorshipInfo.categories?.join(', ')}, Level: ${applicationData.mentorshipInfo.expertiseLevel}`);
    }
    
    if (applicationData.applicationContent) {
      parts.push(`Motivation: ${applicationData.applicationContent.motivation}`);
      parts.push(`Experience: ${applicationData.applicationContent.experienceDescription}`);
      parts.push(`Approach: ${applicationData.applicationContent.mentoringApproach}`);
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
      recommendations: ['Continue building experience', 'Develop mentoring skills'],
      flaggedIssues: ['Limited mentoring experience shown'],
      aiNotes: 'AI analysis temporarily unavailable. Manual review recommended.',
      confidence: 6.0,
      modelUsed: 'fallback',
      processedAt: new Date().toISOString()
    };
  }
}

module.exports = MentorVettingService; 