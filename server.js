import { serve } from 'bun';

// The secret password to check against
const correctPassword = 'swordfish';

// Create a server to listen for the password check
serve({
  async fetch(req) {
    if (req.method === 'POST' && req.url === '/check-password') {
      // Read the body of the request to get the password
      const { password } = await req.json();

      // Compare the provided password to the correct password
      if (password === correctPassword) {
        return new Response('Password correct!', {
          status: 200,
        });
      } else {
        return new Response('Incorrect password.', {
          status: 401,
        });
      }
    }

    // Serve the HTML page for password entry
    return new Response(await fetch('./index.html'), {
      headers: { 'Content-Type': 'text/html' },
    });
  },
});

// Start the server on port 3000
console.log('Server running at http://localhost:3000');
