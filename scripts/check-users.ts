// Script to check the number of users in the system
import { storage } from '../server/storage';

async function checkUsers() {
  try {
    const users = await storage.getAllUsers();
    console.log(`Total number of users: ${users.length}`);
    console.log('User details:');
    users.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}`);
    });
  } catch (error) {
    console.error('Error checking users:', error);
  }
}

checkUsers();