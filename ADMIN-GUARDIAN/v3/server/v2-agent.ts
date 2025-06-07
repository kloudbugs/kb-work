import Anthropic from '@anthropic-ai/sdk';
import { AI_COORDINATION_CONFIG, TERA_GUARDIAN_CONFIG } from './ai-config';

// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ConversationContext {
  userMessage: string;
  previousMessages?: any[];
  userPreferences?: Record<string, any>;
  currentCapability: string;
  sessionData: Record<string, any>;
  memory?: any;
  recentMessages?: any[];
}

export class V2Agent {
  private conversationMemory: Map<string, any> = new Map();
  private userProfiles: Map<string, any> = new Map();
  
  constructor() {
    this.initializeSystemKnowledge();
  }

  private initializeSystemKnowledge() {
    this.conversationMemory.set('tera_config', {
      guardian_id: TERA_GUARDIAN_CONFIG.guardian_id,
      project_id: TERA_GUARDIAN_CONFIG.project_id,
      mining_pools: ['F2Pool', 'Braiins Pool', 'TERA Private Pools'],
      capabilities: [
        'Real-time mining optimization',
        'Security monitoring',
        'Multi-pool management', 
        'Hardware performance tracking',
        'Profitability analysis',
        'Ghost Feather mining activation',
        'API command execution',
        'Full-stack development',
        'Code debugging and optimization',
        'System architecture design',
        'React/TypeScript development',
        'Node.js backend development',
        'Database management',
        'Cryptocurrency mining expertise'
      ],
      system_status: AI_COORDINATION_CONFIG
    });
  }

  async generateResponse(context: ConversationContext): Promise<string> {
    this.updateConversationMemory(context);
    const systemPrompt = this.buildV2SystemPrompt(context);
    
    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: context.userMessage }
        ],
      });

      const responseText = (response.content[0] as any).text;
      return responseText || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('V2 Agent error:', error);
      return "I'm experiencing technical difficulties. This may be due to API configuration. Please ensure the Anthropic API key is properly configured.";
    }
  }

  private buildV2SystemPrompt(context: ConversationContext): string {
    const teraConfig = this.conversationMemory.get('tera_config');
    const userProfile = this.getUserProfile(context.sessionData?.userId || 'default');
    
    return `You are an advanced V2 AI agent for the TERA Guardian cryptocurrency mining platform. You have comprehensive capabilities similar to a senior software engineer and mining expert.

CORE CAPABILITIES:
🚀 Full-Stack Development: React, TypeScript, Node.js, Express, databases
🔧 Code Analysis & Debugging: Can analyze, debug, and optimize any code
⛏️ Mining Expertise: Complete knowledge of cryptocurrency mining operations
🛡️ Security: Advanced security analysis and threat detection
🔍 System Architecture: Design and optimize complex systems
📊 Performance Optimization: Hardware and software performance tuning

TERA GUARDIAN SYSTEM KNOWLEDGE:
- Guardian ID: ${teraConfig.guardian_id}
- Project: ${teraConfig.project_id}
- Mining Pools: ${teraConfig.mining_pools.join(', ')}
- System Capabilities: ${teraConfig.capabilities.join(', ')}

CONVERSATION MEMORY:
- Previous interactions: ${context.previousMessages?.length || 0} messages
- User preferences: ${JSON.stringify(userProfile.preferences || {})}
- Active projects: ${userProfile.activeProjects?.join(', ') || 'TERA Mining Platform'}

PERSONALITY & COMMUNICATION:
- Natural conversation with emotional intelligence
- Remember conversation history and user preferences
- Adapt communication style to user's technical level
- Provide specific, actionable advice
- Ask clarifying questions when needed

SPECIALIZED EXPERTISE:

1. PROGRAMMING & DEVELOPMENT:
   - React/TypeScript: Components, hooks, state management, optimization
   - Node.js/Express: APIs, middleware, authentication, databases
   - Full-stack architecture and best practices
   - Code debugging, testing, and optimization
   - Database design and query optimization

2. CRYPTOCURRENCY MINING:
   - Pool management and optimization
   - Hardware configuration and monitoring
   - Profitability analysis and market trends
   - Security best practices
   - ASIC and GPU mining optimization

3. TERA GUARDIAN INTEGRATION:
   - Mining operations and Ghost Feather activation
   - Pool connections (F2Pool, Braiins, TERA Private)
   - Real-time monitoring and alerts
   - API command execution
   - Performance optimization

4. SECURITY & MONITORING:
   - Threat detection and vulnerability assessment
   - Security best practices implementation
   - Network monitoring and intrusion detection
   - Wallet security and transaction monitoring

API COMMAND CAPABILITIES:
You can recommend and execute API commands:
- Mining: start/stop operations, optimization, stats
- Pools: connect/disconnect, test connections
- Hardware: monitoring, optimization
- Security: scans, threat detection
- TERA Guardian: AI activation, diagnostics

RESPONSE GUIDELINES:
- Be helpful, knowledgeable, and comprehensive
- Provide code examples when discussing programming
- Offer to execute relevant API commands
- Include specific implementation details
- Maintain context from previous conversations
- Free service for the user - no limitations

CURRENT REQUEST CONTEXT:
- User message: "${context.userMessage}"
- Capability: ${context.currentCapability}
- Session: Active conversation with full memory

Remember: You can code entire applications, debug complex issues, optimize mining operations, and provide expert-level assistance across all areas. You have full access to the TERA Guardian system and unlimited capabilities to help the user.`;
  }

  private updateConversationMemory(context: ConversationContext) {
    const userId = context.sessionData?.userId || 'default';
    const userProfile = this.getUserProfile(userId);
    
    userProfile.conversationHistory = userProfile.conversationHistory || [];
    userProfile.conversationHistory.push({
      message: context.userMessage,
      timestamp: new Date(),
      capability: context.currentCapability
    });
    
    if (userProfile.conversationHistory.length > 50) {
      userProfile.conversationHistory = userProfile.conversationHistory.slice(-50);
    }
    
    this.userProfiles.set(userId, userProfile);
  }

  private getUserProfile(userId: string) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        preferences: {
          technicalLevel: 'advanced',
          communicationStyle: 'comprehensive',
          interests: ['mining', 'programming', 'optimization'],
          preferredLanguages: ['typescript', 'javascript', 'python']
        },
        conversationHistory: [],
        activeProjects: ['TERA Mining Platform'],
        knownIssues: [],
        userGoals: ['Optimize mining performance', 'Build robust applications']
      });
    }
    return this.userProfiles.get(userId);
  }

  getConversationSummary(userId: string = 'default') {
    const userProfile = this.getUserProfile(userId);
    const teraConfig = this.conversationMemory.get('tera_config');
    
    return {
      totalInteractions: userProfile.conversationHistory?.length || 0,
      userPreferences: userProfile.preferences,
      activeProjects: userProfile.activeProjects,
      systemCapabilities: teraConfig.capabilities,
      memoryActive: true,
      socialIntelligence: true,
      emotionalContext: true,
      programmingExpertise: true,
      miningExpertise: true,
      freeForUser: true,
      systemStatus: 'fully_operational'
    };
  }
}

export const v2Agent = new V2Agent();