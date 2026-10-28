const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

const fs = require("fs")
const path = require("path")

// Inside the monorepo, trace files from the workspace root; a standalone
// checkout of this app (e.g. a direct deploy) traces from its own folder.
const workspaceRoot = path.join(__dirname, "../../")
const isInWorkspace = fs.existsSync(path.join(workspaceRoot, "turbo.json"))

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  ...(isInWorkspace && { outputFileTracingRoot: workspaceRoot }),
  reactStrictMode: true,
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      // Next 15's CSS HMR load/error callbacks can race with stylesheet cleanup.
      // Guard only the bundled development helper; production is unchanged.
      config.module.rules.push({
        test: /mini-css-extract-plugin[\\/]hmr[\\/]hotModuleReplacement\.js$/,
        use: [{ loader: path.join(__dirname, "scripts/css-hmr-guard-loader.cjs") }],
      })
    }
    return config
  },
  transpilePackages: ["@medusajs/icons", "@medusajs/ui-preset"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
