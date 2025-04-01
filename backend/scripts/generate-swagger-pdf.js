const { spawn, execSync } = require("child_process");
const axios = require("axios");
const waitOn = require("wait-on");
const fs = require("fs-extra");
const path = require("path");

// Function to check if the server is running
async function isServerRunning() {
  try {
    const response = await axios.get("http://127.0.0.1:3002/openapi-json", {
      timeout: 3000,
      validateStatus: () => true,
    });
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error("Connection error:", error.message);
    return false;
  }
}

// Function to generate PDF from Swagger JSON
async function generateSwaggerPdf() {
  const apiUrl = "http://127.0.0.1:3002";
  const swaggerJsonUrl = `${apiUrl}/openapi-json`;
  const outputDir = path.resolve(process.cwd(), "documentation");
  const outputPath = path.join(outputDir, "api-docs.pdf");
  const tempJsonPath = path.join(outputDir, "swagger-spec.json");
  const htmlPath = path.join(outputDir, "api-docs.html");

  try {
    console.log(`Fetching OpenAPI specification from ${swaggerJsonUrl}...`);

    // Ensure documentation directory exists
    await fs.ensureDir(outputDir);

    // Fetch OpenAPI specification
    const response = await axios.get(swaggerJsonUrl, { timeout: 5000 });

    console.log("OpenAPI specification successfully retrieved.");

    // Save specification to temporary file
    await fs.writeJson(tempJsonPath, response.data, { spaces: 2 });
    console.log(`Specification saved to ${tempJsonPath}`);

    // Generate documentation - updated with current tools
    console.log("Generating documentation...");

    // Try different approaches in order of preference
    let success = false;

    // Approach 1: Using @redocly/cli (recommended replacement for redoc-cli)
    if (!success) {
      try {
        console.log("Generating HTML with @redocly/cli...");
        execSync(
          `npx @redocly/cli build-docs ${tempJsonPath} --output=${htmlPath}`,
          { stdio: "inherit" },
        );
        success = true;
        console.log(
          "HTML documentation generated successfully with @redocly/cli.",
        );
        // Approach 1.7: Convert HTML to PDF with electron-pdf
        if (success && fs.existsSync(htmlPath)) {
          try {
            console.log("Converting HTML to PDF with electron-pdf...");
            execSync(
              `npx electron-pdf "${htmlPath}" "${outputPath}" --landscape=false --marginsType=1`,
              {
                stdio: "inherit",
              },
            );

            console.log(
              "PDF documentation generated successfully with electron-pdf.",
            );
            return outputPath;
          } catch (error) {
            console.log(
              "electron-pdf conversion failed, trying next method...",
            );
          }
        }
      } catch (error) {
        console.log("@redocly/cli failed, trying next method...");
      }
    }

    // Approach 2: Using swagger-to-pdf
    if (!success) {
      try {
        console.log("Generating PDF with swagger-to-pdf...");
        execSync(`npx swagger-to-pdf ${tempJsonPath} ${outputPath}`, {
          stdio: "inherit",
        });
        success = true;
        console.log(
          "PDF documentation generated successfully with swagger-to-pdf.",
        );
        return outputPath;
      } catch (error) {
        console.log("swagger-to-pdf failed, trying next method...");
      }
    }

    // If all approaches fail
    if (!success) {
      throw new Error("All documentation generation methods failed.");
    }

    return outputPath;
  } catch (error) {
    console.error("Error generating documentation:", error.message);
    throw error;
  }
}

async function run() {
  // Check if the server is already running
  console.log("Checking if server is already running...");
  const serverAlreadyRunning = await isServerRunning();

  let serverProcess = null;

  try {
    // Start server if not already running
    if (!serverAlreadyRunning) {
      console.log("Starting server...");
      serverProcess = spawn("pnpm", ["start"], {
        shell: true,
        stdio: "pipe",
        detached: true,
      });

      // Output server logs to console
      serverProcess.stdout.on("data", (data) => {
        console.log(`[Server]: ${data.toString().trim()}`);
      });

      serverProcess.stderr.on("data", (data) => {
        console.error(`[Server Error]: ${data.toString().trim()}`);
      });

      // Wait for server to be ready
      console.log("Waiting for server to be ready...");
      await waitOn({
        resources: ["http-get://127.0.0.1:3002/openapi-json"],
        delay: 1000,
        interval: 1000,
        timeout: 60000, // 60 seconds timeout
        verbose: true,
      });
      console.log("Server is ready!");
    } else {
      console.log("Server is already running.");
    }

    // Generate documentation
    console.log("Generating API documentation...");
    const docPath = await generateSwaggerPdf();

    // Open the documentation if it exists
    if (fs.existsSync(docPath)) {
      console.log(`Documentation generated: ${docPath}`);
      if (docPath.endsWith(".pdf")) {
        console.log("PDF documentation was successfully generated.");
      } else {
        console.log(
          "HTML documentation was generated. Use browser print function to create PDF if needed.",
        );
      }
    }
  } catch (error) {
    console.error("Error in run process:", error.message);
    process.exit(1);
  } finally {
    // Kill server if we started it
    if (serverProcess && !serverAlreadyRunning) {
      console.log("Shutting down server...");
      try {
        if (process.platform === "win32") {
          execSync(`taskkill /pid ${serverProcess.pid} /T /F`);
        } else {
          process.kill(-serverProcess.pid, "SIGINT");
        }
      } catch (error) {
        console.error("Error shutting down server:", error.message);
      }
    }
  }
}

// Execute the main script
run();
