const c = require("ansi-colors");

// Products and categories always use the backend.
const usesBackendCatalog = true;

const requiredEnvs = usesBackendCatalog
  ? [
      {
        key: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
        description:
          "Publishable API key from the backend admin (Settings > Publishable API Keys).",
      },
    ]
  : [];

function checkEnvVariables() {
  if (!process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY =
      "pk_556869ac77dc39b82418af4a3810db83e5320c78b548444554bbd9ed540c5aa7";
  }

  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key];
  });

  if (missingEnvs.length > 0) {
    console.warn(
      c.yellow.bold("\n⚠️ Warning: Missing recommended environment variables\n")
    );

    missingEnvs.forEach(function (env) {
      console.warn(c.yellow(`  ${c.bold(env.key)}`));
      if (env.description) {
        console.warn(c.dim(`    ${env.description}\n`));
      }
    });

    console.warn(
      c.yellow(
        "\nPlease set these variables in your Vercel Dashboard (Settings > Environment Variables) or .env file.\n"
      )
    );

    if (!process.env.VERCEL && !process.env.CI) {
      process.exit(1);
    }
  }
}

module.exports = checkEnvVariables;
