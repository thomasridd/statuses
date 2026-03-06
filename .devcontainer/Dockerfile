# Use verified base image from Microsoft's official devcontainer registry
FROM mcr.microsoft.com/devcontainers/base:ubuntu-22.04

# Copy corporate CA cert if present (e.g. Zscaler on company laptops)
# File is excluded from version control via .gitignore
COPY . /tmp/devcontainer-build/

# Update CA certs, install corporate CA if provided, then install Node.js 22 LTS
# All in one RUN so the cert update is guaranteed in scope for the curl call
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl xz-utils \
    && if [ -f /tmp/devcontainer-build/zscaler-ca.crt ]; then \
        echo "Installing corporate CA certificate..." \
        && cp /tmp/devcontainer-build/zscaler-ca.crt /usr/local/share/ca-certificates/zscaler-ca.crt \
        && update-ca-certificates; \
    else \
        update-ca-certificates; \
    fi \
    && ARCH=$(dpkg --print-architecture) \
    && case "$ARCH" in \
        amd64) NODE_ARCH="x64" ;; \
        arm64) NODE_ARCH="arm64" ;; \
        *) echo "Unsupported architecture: $ARCH" && exit 1 ;; \
    esac \
    && curl -fsSL "https://nodejs.org/dist/v22.13.1/node-v22.13.1-linux-${NODE_ARCH}.tar.xz" \
        -o /tmp/node.tar.xz \
    && tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1 --no-same-owner \
    && rm -rf /tmp/node.tar.xz /tmp/devcontainer-build \
    && rm -rf /var/lib/apt/lists/* \
    && node --version \
    && npm --version

# Fix ownership of node_modules so the vscode user can install global packages
RUN mkdir -p /usr/local/lib/node_modules \
    && chown -R vscode:vscode /usr/local/lib/node_modules \
    && chown -R vscode:vscode /usr/local/bin

WORKDIR /workspace