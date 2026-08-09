# Debian-based image — Cursor/VS Code server needs glibc (Alpine/musl fails to install it).
FROM node:24-bookworm-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends git ca-certificates openssh-client \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

EXPOSE 5173
