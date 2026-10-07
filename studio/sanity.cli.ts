import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Hosted at https://mozimotors.sanity.studio
  deployment: { appId: "o5up3udmijydho62iktt6hj9", autoUpdates: true },
});
