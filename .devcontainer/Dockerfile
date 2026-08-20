# Debian-based image — Cursor/VS Code server needs glibc (Alpine/musl fails to install it).
FROM node:24-bookworm-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		ca-certificates \
		curl \
    jq \
		ffmpeg \
		git \
		git-lfs \
		openssh-client \
	&& git lfs install --system \
	&& curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
		| tee /usr/share/keyrings/githubcli-archive-keyring.gpg >/dev/null \
	&& chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
		> /etc/apt/sources.list.d/github-cli.list \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends gh \
	&& curl -fsSL -o /usr/local/bin/yt-dlp \
		https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux \
	&& chmod a+rx /usr/local/bin/yt-dlp \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

EXPOSE 5173
