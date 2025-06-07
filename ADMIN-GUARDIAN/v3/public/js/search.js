/**
 * Validates and searches for a Bitcoin private key
 */
function searchKey() {
    const keyInput = document.getElementById('keyInput').value;
    if (!keyInput) {
        alert('Please enter a secret exponent.');
        return;
    }
    
    // Validate input is a number
    if (isNaN(keyInput) || !Number.isInteger(Number(keyInput)) || Number(keyInput) < 1) {
        alert('Please enter a valid positive integer.');
        return;
    }
    
    // Redirect to the key page
    window.location.href = '/key/' + keyInput;
}

/**
 * Initialize any event listeners when the document is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add any initialization here if needed
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchKey();
        });
    }
});