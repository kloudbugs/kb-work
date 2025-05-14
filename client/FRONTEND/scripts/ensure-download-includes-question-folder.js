/**
 * This script ensures that the "?" folder is included when downloading the project
 * It creates a symbolic link to ensure Replit includes the folder in the download
 */

const fs = require('fs');
const path = require('path');

// Create a marker file in the "?" folder
try {
  if (!fs.existsSync('./?/.download_marker')) {
    fs.writeFileSync('./?/.download_marker', 'This file ensures the ? folder is included in downloads');
    console.log('Created download marker in ? folder');
  }
} catch (error) {
  console.error('Error creating marker file:', error);
}

// Create a visible reference to the "?" folder
try {
  if (!fs.existsSync('./documentation_folder')) {
    // Create a symbolic link to the "?" folder
    fs.symlinkSync('./?', './documentation_folder', 'dir');
    console.log('Created symbolic link to ? folder');
  }
} catch (error) {
  console.error('Error creating symbolic link:', error);
}

console.log('Download preparation complete');