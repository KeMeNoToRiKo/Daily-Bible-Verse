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
    const verseData = response.data.verse.details;
    return verseData;
  } catch (error) {
    console.error("Error fetching Bible verse:", error.message);
    return null;
  }
}

// ── Discord Embed Builder ─────────────────────────────────────────────────────

function buildEmbed(verse) {
  const today = getTodayFormatted();
  const greeting = getGreeting();

  // Split reference from text if the API bundles them
  const verseText = verse.text?.trim() ?? "Could not load verse.";
  const verseRef = verse.reference?.trim() ?? "";

  return {
    embeds: [
      {
        // Deep navy banner colour — evokes open sky / scripture scrolls
        color: 0x1a2a4a,

        author: {
          name: "✦  Verse of the Day",
          icon_url:
            "https://em-content.zobj.net/source/twitter/376/open-book_1f4d6.png",
        },

        title: `${greeting} — ${today}`,

        description: [
          `> *${verseText}*`,
          "",
          `✦ **${verseRef}**`,
        ].join("\n"),

        fields: [
          {
            name: "📖 Reflection",
            value:
              "Take a moment to sit with this verse. Let it speak to your day.",
            inline: false,
          },
          {
            name: "🙏 Prayer",
            value:
              "Lord, let Your Word be a lamp to my feet and a light to my path. Amen.",
            inline: false,
          },
        ],

        footer: {
          text: "Daily Scripture  •  ourmanna.com",
          icon_url:
            "https://em-content.zobj.net/source/twitter/376/latin-cross_271d.png",
        },

        timestamp: new Date().toISOString(),

        // Thin gold-ish accent image strip along the top (optional thumbnail)
        thumbnail: {
          url: "https://em-content.zobj.net/source/twitter/376/sparkles_2728.png",
        },
      },
    ],

    // A subtle @silent ping so it doesn't buzz anyone
    username: "Daily Word",
    avatar_url:
      "https://em-content.zobj.net/source/twitter/376/open-book_1f4d6.png",
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

main();        description: [
          "```",
          verseText,
          "```",
          `**— ${verseRef}**`,
        ].join("\n"),

        fields: [
          {
            name: "📖 Reflection",
            value:
              "Take a moment to sit with this verse. Let it speak to your day.",
            inline: false,
          },
          {
            name: "🙏 Prayer",
            value:
              "Lord, let Your Word be a lamp to my feet and a light to my path. Amen.",
            inline: false,
          },
        ],

        footer: {
          text: "Daily Scripture  •  ourmanna.com",
          icon_url:
            "https://em-content.zobj.net/source/twitter/376/latin-cross_271d.png",
        },

        timestamp: new Date().toISOString(),

        // Thin gold-ish accent image strip along the top (optional thumbnail)
        thumbnail: {
          url: "https://em-content.zobj.net/source/twitter/376/sparkles_2728.png",
        },
      },
    ],

    // A subtle @silent ping so it doesn't buzz anyone
    username: "Daily Word",
    avatar_url:
      "https://em-content.zobj.net/source/twitter/376/open-book_1f4d6.png",
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
