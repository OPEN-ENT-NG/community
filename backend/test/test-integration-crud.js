// Configuration
const BASE_URL = "http://localhost:8090/community/api/communities";

// Headers for all requests
const headers = {
  "Content-Type": "application/json",
};

// Create a timestamp for unique title
const timestamp = new Date().toISOString();

// Community data
const communityData = {
  title: `Test Community ${timestamp}`,
  type: "FREE",
  schoolYearStart: 2025,
  schoolYearEnd: 2026,
  discussionEnabled: true,
  welcomeNote: "Welcome to this test community",
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
 * Create a new community
 */
async function createCommunity() {
  try {
    console.log("Creating community...");

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers,
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
 */
async function listCommunities() {
  try {
    console.log("\nListing communities...");

    const response = await fetch(`${BASE_URL}?page=1&limit=10`, {
      method: "GET",
      headers,
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
 */
async function getCommunity(id) {
  try {
    console.log(`\nGetting community with ID ${id}...`);

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers,
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
async function getCommunityUnsafe(id) {
  console.log(`\nGetting community with ID ${id}...`);

  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers,
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
 */
async function getSecretCode(id) {
  try {
    console.log(`\nGetting secret code for community with ID ${id}...`);

    const response = await fetch(`${BASE_URL}/${id}/secret-code`, {
      method: "GET",
      headers,
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
 * Update a community
 */
async function updateCommunity(id) {
  try {
    console.log(`\nUpdating community with ID ${id}...`);

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers,
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
 */
async function updateWelcomeNote(id) {
  try {
    console.log(`\nUpdating welcome note for community with ID ${id}...`);

    const response = await fetch(`${BASE_URL}/${id}/welcome-note`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ welcomeNote: `Updated welcome note - ${timestamp}` }),
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
 * Get community statistics
 */
async function getCommunityStats(id) {
  try {
    console.log(`\nGetting statistics for community with ID ${id}...`);

    const response = await fetch(`${BASE_URL}/${id}/stats`, {
      method: "GET",
      headers,
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
 * Delete a community
 */
async function deleteCommunity(id) {
  try {
    console.log(`\nDeleting community with ID ${id}...`);

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
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
 * Run the test
 */
async function runTest() {
  console.log("Starting community API test...");
  console.log("=============================");

  try {
    // Step 1: Create a community
    const communityId = await createCommunity();
    if (!communityId) {
      throw new Error("Could not create community");
    }

    // Step 2: List all communities
    await listCommunities();

    // Step 3: Get the created community
    await getCommunity(communityId);

    // Step 4: Get community secret code
    await getSecretCode(communityId);

    // Step 5: Get community statistics
    await getCommunityStats(communityId);

    // Step 6: Update the community
    await updateCommunity(communityId);

    // Step 7: Update the welcome note
    await updateWelcomeNote(communityId);

    // Step 8: Verify the updates
    await getCommunity(communityId);

    // Step 9: Delete the community
    const deleted = await deleteCommunity(communityId);
    if (!deleted) {
      throw new Error("Failed to delete community");
    }

    // Step 10: Verify deletion by trying to get the community (should fail)
    console.log("\nVerifying deletion by attempting to retrieve deleted community...");
    try {
      await getCommunityUnsafe(communityId);
      console.warn("WARNING: Community was not actually deleted or API is returning deleted communities!");
    } catch (error) {
      console.log("Verified: Community was successfully deleted (cannot be retrieved)");
    }

    console.log("\n=============================");
    console.log("Test completed successfully");
  } catch (error) {
    console.error("\n=============================");
    console.error("Test failed:", error.message);
  }
}

// Run the test
runTest().catch((error) => {
  console.error("Unhandled error in test:", error);
  process.exit(1);
});
