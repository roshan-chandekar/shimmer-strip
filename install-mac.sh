#!/bin/bash
# One-time setup for Shimmer Strip on a Mac.
#   1. installs dependencies and builds the web app
#   2. starts the server now and at every login (LaunchAgent)
#   3. adds it to the Claude desktop app as a local MCP server
# Safe to run again: it updates rather than duplicates.
set -euo pipefail
cd "$(dirname "$0")"
APP_DIR="$(pwd)"
LABEL="com.roshan.shimmer-strip"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
CLAUDE_CFG="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
PORT=3002

say() { printf "\n\033[1m==> %s\033[0m\n" "$1"; }

# --- Node.js ---------------------------------------------------------------
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed."
  echo "Install the LTS version from https://nodejs.org (the .pkg installer), then run this script again."
  exit 1
fi
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Node.js $NODE_MAJOR found, 18 or newer is needed. Update from https://nodejs.org and run again."
  exit 1
fi
NODE_BIN="$(command -v node)"
NPX_BIN="$(command -v npx)"

# --- install + build -------------------------------------------------------
say "Installing dependencies (1-2 minutes the first time)"
npm install --no-audit --no-fund
say "Building the web app"
npm run build

# --- run at login ----------------------------------------------------------
say "Setting it to start automatically at login"
mkdir -p "$HOME/Library/LaunchAgents" "$APP_DIR/logs"
cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>$NODE_BIN</string><string>$APP_DIR/server.js</string></array>
  <key>WorkingDirectory</key><string>$APP_DIR</string>
  <key>EnvironmentVariables</key>
  <dict><key>PORT</key><string>$PORT</string></dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$APP_DIR/logs/server.log</string>
  <key>StandardErrorPath</key><string>$APP_DIR/logs/server.log</string>
</dict>
</plist>
PLIST
launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
sleep 2
if curl -fs "http://localhost:$PORT/api/auth" >/dev/null; then
  echo "Server is running at http://localhost:$PORT"
else
  echo "Server did not answer yet. Check $APP_DIR/logs/server.log"
fi

# --- Claude desktop --------------------------------------------------------
say "Adding 'wardrobe' to the Claude desktop app"
mkdir -p "$(dirname "$CLAUDE_CFG")"
[ -f "$CLAUDE_CFG" ] && cp "$CLAUDE_CFG" "$CLAUDE_CFG.backup-$(date +%Y%m%d%H%M%S)"
"$NODE_BIN" - "$CLAUDE_CFG" "$NPX_BIN" "$PORT" <<'JS'
const fs = require("fs");
const [cfgPath, npx, port] = process.argv.slice(2);
let cfg = {};
if (fs.existsSync(cfgPath)) {
  try { cfg = JSON.parse(fs.readFileSync(cfgPath, "utf8") || "{}"); }
  catch { console.error("Existing Claude config is not valid JSON; left untouched."); process.exit(1); }
}
cfg.mcpServers = cfg.mcpServers || {};
cfg.mcpServers.wardrobe = {
  command: npx,
  args: ["-y", "mcp-remote", `http://localhost:${port}/mcp`],
  env: { PATH: `${require("path").dirname(npx)}:/usr/bin:/bin` },
};
fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
console.log("Added. Other MCP servers in the file were kept.");
JS

cat <<DONE

All set.
  1. Quit Claude completely (Cmd+Q) and reopen it. 'wardrobe' will appear under connectors.
  2. Open http://localhost:$PORT/unlock-wardrobe once in your browser to allow editing,
     then http://localhost:$PORT to add your clothes with photos.
  3. Ask Claude: "What should I wear to office today?"

To stop it starting at login:
  launchctl bootout gui/\$(id -u)/$LABEL && rm "$PLIST"
DONE
