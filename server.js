import { serve } from "bun";
import { writeFileSync, readFileSync, existsSync } from "fs";

// File to store the password
const passwordFile = "password.json";

// Function to load the password from the JSON file
const loadPasswordFromFile = () => {
  if (existsSync(passwordFile)) {
    const data = readFileSync(passwordFile, "utf8");
    const json = JSON.parse(data);
    return json.password;
  }
  return null;
};

// Load the stored password from the password file
const storedPassword = loadPasswordFromFile();
if (!storedPassword) {
  console.error("Password file is missing or empty.");
  process.exit(1); // Exit if no password is found
}

// Serve the login page (HTML and CSS)
serve({
  fetch(req) {
    if (req.url === "/" || req.url === "/index.html") {
      return new Response(Bun.file("index.html"), {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

// Handle password checking via POST request
serve(
  {
    async fetch(req) {
      if (req.method === "POST" && req.url === "/check-password") {
        try {
          const { password: userPassword } = await req.json(); // Get the password from the request body

          // Compare the submitted password with the stored one
          if (userPassword === storedPassword) {
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: false }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Error processing request",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      }

      return new Response("Not found", { status: 404 });
    },
  },
  {
    port: 3000, // Default port
  },
);
