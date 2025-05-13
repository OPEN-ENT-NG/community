const BASE_URL = "http://localhost:8090/community/api/communities";
const AUTH_URL = "http://localhost:8090/auth/oauth2/token";

// Create a timestamp for unique title
const timestamp = new Date().toISOString();

// Community data
const communityData = {
  title: `Test Community ${timestamp}`,
  type: "FREE",
  schoolYearStart: 2025,
  schoolYearEnd: 2026,
  discussionEnabled: true,
  welcomeNote: "Welcome to this test community via OAuth",
  invitations: {
    userIds: [],
  },
};

// Updated community data for testing PATCH
const updateData = {
  title: `Updated Community ${timestamp}`,
  discussionEnabled: false,
  type: "FREE",
};

/**
 * Authenticate with OAuth2 and get an access token
 * @param {string} login - User login 
 * @param {string} password - User password
 * @param {string} clientId - OAuth client ID
 * @param {string} clientSecret - OAuth client secret
 * @return {Promise<string|null>} Access token or null if authentication failed
 */
async function authenticate(login, password, clientId, clientSecret) {
  try {
    console.log(`Authenticating user ${login}...`);
    
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", login);
    formData.append("password", password);
    formData.append("client_id", clientId);
    formData.append("client_secret", clientSecret);
    formData.append("scope", "portal auth directory community");
    
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Authentication successful");
    
    return data.access_token;
  } catch (error) {
    console.error("Authentication failed:", error);
    return null;
  }
}

/**
 * Create a new community
 * @param {string} token - OAuth access token
 */
async function createCommunity(token) {
  try {
    console.log("Creating community...");
    
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(communityData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Community created successfully:");
    console.log(JSON.stringify(data, null, 2));
    
    return data.id; // Return the ID for later use
  } catch (error) {
    console.error("Failed to create community:", error);
    return null;
  }
}

/**
 * List all communities
 * @param {string} token - OAuth access token
 */
async function listCommunities(token) {
  try {
    console.log("\nListing communities...");
    
    const response = await fetch(`${BASE_URL}?page=1&limit=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`Found ${data.total} communities:`);
    data.communities.forEach((community) => {
      console.log(`- ${community.id}: ${community.title} (${community.type})`);
    });
    
    return data;
  } catch (error) {
    console.error("Failed to list communities:", error);
    return null;
  }
}

/**
 * Get a specific community by ID
 * @param {string} token - OAuth access token
 * @param {number} id - Community ID
 */
async function getCommunity(token, id) {
  try {
    console.log(`\nGetting community with ID ${id}...`);
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Community details:");
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`Failed to get community with ID ${id}:`, error);
    return null;
  }
}

/**
 * Get a specific community by ID without catching errors
 * @param {string} token - OAuth access token
 * @param {number} id - Community ID
 */
async function getCommunityUnsafe(token, id) {
  console.log(`\nGetting community with ID ${id}...`);
  
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("Community details:");
  console.log(JSON.stringify(data, null, 2));
  
  return data;
}

/**
 * Get community secret code
 * @param {string} token - OAuth access token
 * @param {number} id - Community ID
 */
async function getSecretCode(token, id) {
  try {
    console.log(`\nGetting secret code for community with ID ${id}...`);
    
    const response = await fetch(`${BASE_URL}/${id}/secret-code`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Secret code retrieved:");
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`Failed to get secret code for community ${id}:`, error);
    return null;
  }
}

/**
 * Get community statistics
 * @param {string} token - OAuth access token
 * @param {number} id - Community ID
 */
async function getCommunityStats(token, id) {
  try {
    console.log(`\nGetting statistics for community with ID ${id}...`);
    
    const response = await fetch(`${BASE_URL}/${id}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Community statistics:");
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`Failed to get statistics for community ${id}:`, error);
    return null;
  }
}

/**
 * Update a community
 * @param {string} token - OAuth access token
 * @param {number} id - Community ID
 */
async function updateCommunity(token, id) {
  try {
    console.log(`\nUpdating community with ID ${id}...`);
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Community updated successfully:");
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`Failed to update community ${id}:`, error);
    return null;
  }
}

/**
 * Update welcome note for a community
 * @param {string} token - OAuth access token
 * @param {number} id - Community ID
 */
async function updateWelcomeNote(token, id) {
  try {
    console.log(`\nUpdating welcome note for community with ID ${id}...`);
    
    const response = await fetch(`${BASE_URL}/${id}/welcome-note`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ welcomeNote: `Updated welcome note via OAuth - ${timestamp}` }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Welcome note updated successfully:");
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`Failed to update welcome note for community ${id}:`, error);
    return null;
  }
}

/**
 * Delete a community
 * @param {string} token - OAuth access token
 * @param {number} id - Community ID
 */
async function deleteCommunity(token, id) {
  try {
    console.log(`\nDeleting community with ID ${id}...`);
    
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    console.log(`Community ${id} deleted successfully (status: ${response.status})`);
    return true;
  } catch (error) {
    console.error(`Failed to delete community ${id}:`, error);
    return false;
  }
}

/**
 * Run the test with OAuth authentication
 * @param {string} login - User login
 * @param {string} password - User password
 * @param {string} clientId - OAuth client ID
 * @param {string} clientSecret - OAuth client secret
 */
async function runTest(login, password, clientId, clientSecret) {
  console.log("Starting community API test with OAuth authentication...");
  console.log("========================================================");
  
  try {
    // Step 1: Authenticate and get token
    const token = await authenticate(login, password, clientId, clientSecret);
    if (!token) {
      throw new Error("Failed to authenticate");
    }
    
    // Step 2: Create a community
    const communityId = await createCommunity(token);
    if (!communityId) {
      throw new Error("Could not create community");
    }
    
    // Step 3: List all communities
    await listCommunities(token);
    
    // Step 4: Get the created community
    await getCommunity(token, communityId);
    
    // Step 5: Get community secret code
    await getSecretCode(token, communityId);
    
    // Step 6: Get community statistics
    await getCommunityStats(token, communityId);
    
    // Step 7: Update the community
    await updateCommunity(token, communityId);
    
    // Step 8: Update the welcome note
    await updateWelcomeNote(token, communityId);
    
    // Step 9: Verify the updates
    await getCommunity(token, communityId);
    
    // Step 10: Delete the community
    const deleted = await deleteCommunity(token, communityId);
    if (!deleted) {
      throw new Error("Failed to delete community");
    }
    
    // Step 11: Verify deletion by trying to get the community (should fail)
    console.log("\nVerifying deletion by attempting to retrieve deleted community...");
    try {
      await getCommunityUnsafe(token, communityId);
      console.warn("WARNING: Community was not actually deleted or API is returning deleted communities!");
    } catch (error) {
      console.log("Verified: Community was successfully deleted (cannot be retrieved)");
    }
    
    console.log("\n========================================================");
    console.log("Test completed successfully");
  } catch (error) {
    console.error("\n========================================================");
    console.error("Test failed:", error.message);
  }
}

// Example usage
/*
runTest(login, password, clientId, clientSecret).catch((error) => {
    console.error("Unhandled error in test:", error);
});
*/