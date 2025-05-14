import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from './lib/userManager';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

interface WSUser {
  id: string;
  username: string;
  isAdmin: boolean;
  ws: WebSocket;
}

// In-memory store for active users and recent messages
const activeUsers: Map<string, WSUser> = new Map();
const recentMessages: ChatMessage[] = [];
const MAX_RECENT_MESSAGES = 50;

export function setupWebSocketServer(server: Server) {
  console.log('Setting up WebSocket server...');
  
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    let userId: string | null = null;
    
    // Handle messages from clients
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log('WebSocket message received:', data.type);
        
        // Handle authentication
        if (data.type === 'auth') {
          const user = await getUserById(data.userId);
          if (user) {
            userId = data.userId;
            if (userId) {
              const wsUser: WSUser = {
                id: userId,
                username: user.username,
                isAdmin: user.role === 'ADMIN',
                ws
              };
              
              // Add user to active users
              activeUsers.set(userId, wsUser);
            }
            
            // Send recent messages to the user
            ws.send(JSON.stringify({
              type: 'chatHistory',
              messages: recentMessages
            }));
            
            // Broadcast updated active users list to all clients
            broadcastActiveUsers();
            
            console.log(`User authenticated: ${user.username} (${user.id})`);
          }
        }
        
        // Handle chat messages
        else if (data.type === 'chatMessage' && userId) {
          const user = activeUsers.get(userId);
          if (user) {
            const newMessage: ChatMessage = {
              id: uuidv4(),
              userId: user.id,
              username: user.username,
              message: data.message,
              timestamp: new Date(),
              isAdmin: user.isAdmin
            };
            
            // Add to recent messages
            addMessage(newMessage);
            
            // Broadcast to all clients
            broadcastMessage(newMessage);
            
            console.log(`Message from ${user.username}: ${data.message.substring(0, 50)}`);
          }
        }
        
        // Handle active users request
        else if (data.type === 'getActiveUsers') {
          sendActiveUsers(ws);
        }
        
        // Handle admin commands
        else if (data.type === 'adminCommand' && userId) {
          const user = activeUsers.get(userId);
          if (user && user.isAdmin) {
            handleAdminCommand(data, user);
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      if (userId) {
        console.log(`User disconnected: ${userId}`);
        activeUsers.delete(userId);
        broadcastActiveUsers();
      }
    });
    
    // Send initial connection confirmation
    ws.send(JSON.stringify({
      type: 'connectionEstablished',
      timestamp: new Date()
    }));
  });
  
  console.log('WebSocket server setup complete');
  return wss;
}

// Helper functions
function broadcastMessage(message: ChatMessage) {
  activeUsers.forEach((user) => {
    user.ws.send(JSON.stringify({
      type: 'chatMessage',
      ...message
    }));
  });
}

function addMessage(message: ChatMessage) {
  recentMessages.push(message);
  if (recentMessages.length > MAX_RECENT_MESSAGES) {
    recentMessages.shift();
  }
}

function broadcastActiveUsers() {
  const usersList = Array.from(activeUsers.values()).map(user => ({
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  }));
  
  activeUsers.forEach((user) => {
    user.ws.send(JSON.stringify({
      type: 'activeUsers',
      users: usersList
    }));
  });
}

function sendActiveUsers(ws: WebSocket) {
  const usersList = Array.from(activeUsers.values()).map(user => ({
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  }));
  
  ws.send(JSON.stringify({
    type: 'activeUsers',
    users: usersList
  }));
}

function handleAdminCommand(data: any, adminUser: WSUser) {
  console.log(`Admin command from ${adminUser.username}: ${data.command}`);
  
  switch (data.command) {
    case 'removeMessage':
      // Implementation of message removal
      break;
    case 'banUser':
      // Implementation of user banning
      break;
    case 'systemAnnouncement':
      broadcastSystemAnnouncement(data.message, adminUser.username);
      break;
    default:
      console.log(`Unknown admin command: ${data.command}`);
  }
}

function broadcastSystemAnnouncement(message: string, adminUsername: string) {
  const announcement: ChatMessage = {
    id: uuidv4(),
    userId: 'system',
    username: 'SYSTEM',
    message: `ADMIN ${adminUsername}: ${message}`,
    timestamp: new Date(),
    isAdmin: true
  };
  
  addMessage(announcement);
  broadcastMessage(announcement);
}