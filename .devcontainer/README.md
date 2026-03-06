# Secure DevContainer with Claude Code

A hardened development container setup for VS Code with Claude Code integration, following enterprise security best practices.

## 🔒 Security Features

### Implemented Controls

- **Capability Restrictions**: All capabilities dropped with `--cap-drop=ALL`, only `NET_BIND_SERVICE` re-added
- **Seccomp Profile**: Restrictive syscall allowlist kept in `.devcontainer/seccomp.json` for reference (applied on Linux hosts — see Troubleshooting)
- **Port Forwarding**: Uses VS Code's `forwardPorts` instead of Docker's `-p` flag
- **Non-root User**: Container runs as `vscode` user (UID 1000)
- **Verified Base Image**: Microsoft's official `devcontainers/base:ubuntu-22.04`
- **Secret Management**: `.env` files excluded from version control via `.gitignore`

### Explicit Restrictions

- ❌ No `--privileged` flag
- ❌ No `--security-opt seccomp=unconfined`
- ❌ No dangerous capabilities (SYS_ADMIN, SYS_MODULE, SYS_RAWIO, SYS_PTRACE)
- ❌ No sensitive host directory mounts (/, /etc, /home, ~/.ssh)
- ❌ No hardcoded secrets in any committed file

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- [Anthropic API Key](https://console.anthropic.com/)

## 🚀 Quick Start

### 1. Set up environment variables

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 2. Corporate proxy / Zscaler (company laptops)

If your machine uses Zscaler or another TLS-inspecting proxy, the Docker build will
fail with an SSL certificate error (`curl: (60) SSL certificate problem`). The proxy
re-signs all HTTPS traffic with its own root CA, which the container doesn't trust by
default. You need to inject that CA into the image.

**Export the Zscaler root CA from your Mac keychain:**

```bash
security find-certificate -a -p /Library/Keychains/System.keychain \
  > .devcontainer/zscaler-ca.crt

# Verify it contains at least one certificate
grep -c "BEGIN CERTIFICATE" .devcontainer/zscaler-ca.crt
```

Alternatively, open **Keychain Access**, find the certificate named "Zscaler Root CA"
(or similar), right-click → Export, save as `.pem`, then copy it to
`.devcontainer/zscaler-ca.crt`.

The Dockerfile will automatically detect and install the cert if the file is present.
The `.gitignore` excludes `*.crt` files so it won't be committed.

### 3. Open in VS Code

```bash
code .
# F1 → "Dev Containers: Reopen in Container"
```

### 4. Verify the container

```bash
# Node.js version
node --version   # should be v22.x

# Claude Code
claude --version

# API key present
echo $ANTHROPIC_API_KEY | grep -q "sk-ant-" && echo "API key loaded" || echo "API key missing"
```

## 🛠️ Using Claude Code

```bash
# Start a task
claude "implement user authentication"

# Get help
claude --help
```

Claude Code reads `ANTHROPIC_API_KEY` from the environment. Set it in your `.env` file
and it will be available inside the container via `remoteEnv`.

## 🔧 Customisation

### Adding ports

Edit `forwardPorts` and `portsAttributes` in `devcontainer.json`:

```json
"forwardPorts": [3000, 8080, 5432],
"portsAttributes": {
  "5432": { "label": "PostgreSQL", "onAutoForward": "notify" }
}
```

### Resource limits (macOS)

Docker Desktop on macOS doesn't support `--memory` / `--cpus` flags in `runArgs`.
Set resource limits globally via **Docker Desktop → Settings → Resources**.

### Installing additional tools

Add to the `RUN` block in `.devcontainer/Dockerfile`:

```dockerfile
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*
```

### Adding VS Code extensions

Edit `customizations.vscode.extensions` in `devcontainer.json`:

```json
"extensions": [
  "dbaeumer.vscode-eslint",
  "ms-python.python"
]
```

## 🔐 Security Best Practices

- Keep `.env` local — never commit it
- Regularly pull the latest base image and rebuild
- Rotate your Anthropic API key periodically
- Don't add capabilities beyond `NET_BIND_SERVICE`
- Don't mount sensitive host paths into the container

## 🐛 Troubleshooting

### SSL / curl errors during build (`exit code: 60`)

You're on a machine with a TLS-inspecting proxy (e.g. Zscaler). Follow step 2 in
Quick Start to export and inject the corporate CA certificate.

### Container fails to start

Check the detailed log via **F1 → Dev Containers: Show Container Log**, or:

```bash
docker ps -a
docker logs <container-id>
```

### Claude Code not working

```bash
# Check API key
echo $ANTHROPIC_API_KEY

# Reinstall Claude Code
npm install -g @anthropic-ai/claude-code

# Rebuild the container
# F1 → "Dev Containers: Rebuild Container"
```

### Permission issues

```bash
whoami          # should be: vscode
ls -la /workspace
```

### Applying the seccomp profile (Linux hosts only)

The seccomp profile in `.devcontainer/seccomp.json` cannot be applied on macOS
(Docker Desktop runs containers in a Linux VM with no access to the Mac filesystem
at container start time). On a Linux host you can enable it by adding to `runArgs`:

```json
"--security-opt=seccomp=/absolute/host/path/.devcontainer/seccomp.json"
```

## 📚 Resources

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Devcontainer Spec](https://containers.dev/implementors/spec/)