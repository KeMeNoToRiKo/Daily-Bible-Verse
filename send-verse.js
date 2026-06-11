const axios = require("axios");

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTodayFormatted() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}

function getGreeting() {
  const hour = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
  ).getHours();
  if (hour < 12) return "🌅 Good Morning";
  if (hour < 17) return "☀️ Good Afternoon";
  return "🌙 Good Evening";
}

// ── Bible Verse Fetcher ───────────────────────────────────────────────────────

async function getTodaysBibleVerse() {
  try {
    const response = await axios.get(
      "https://beta.ourmanna.com/api/v1/get/?format=json"
    );
    return response.data.verse.details;
  } catch (error) {
    console.error("Error fetching Bible verse:", error.message);
    return null;
  }
}

// ── Discord Embed Builder ─────────────────────────────────────────────────────

function buildEmbed(verse) {
  const today = getTodayFormatted();

  const verseText = verse.text?.trim() ?? "Could not load verse.";
  const verseRef = verse.reference?.trim() ?? "Unknown Reference";

  return {
    embeds: [
      {
        // Deep gold/bronze color for an elegant, sacred aesthetic
        color: 0xd4af37, 

        title: `✦  Verse of the Day  ✦`,
        
        // The date works great as the subtitle/description area
        description: `**${today}**`, 

        // Fields create a beautiful, isolated, and readable container for the text
        fields: [
          {
            name: `\u200B`, // Blank character acting as vertical spacing
            value: `*“ ${verseText} ”*`,
            inline: false
          },
          {
            name: `\u200B`,
            value: `── **${verseRef}**`,
            inline: false
          }
        ],

        footer: {
          text: "🙏 Thanks be to God!",
        },

        timestamp: new Date().toISOString(),
      },
    ],
  };
}
// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error(
      "❌  DISCORD_WEBHOOK_URL environment variable is not set.\n" +
        "    Add it as a GitHub Actions secret and reference it in your workflow."
    );
    process.exit(1);
  }

  console.log("📖  Fetching today's Bible verse…");
  const verse = await getTodaysBibleVerse();

  if (!verse) {
    console.error("❌  Failed to retrieve verse. Aborting.");
    process.exit(1);
  }

  console.log(`✅  Verse fetched: ${verse.reference}`);

  const payload = buildEmbed(verse);

  try {
    await axios.post(webhookUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("🎉  Verse sent to Discord successfully!");
  } catch (err) {
    console.error(
      "❌  Failed to send to Discord:",
      err.response?.data ?? err.message
    );
    process.exit(1);
  }
}

main();
