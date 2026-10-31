#!/usr/bin/env bash
set -euo pipefail
docker build -t tensorcraft .
echo 'Start: docker run --env-file .env -p 8787:8787 -v tensorcraft-data:/app/data tensorcraft'
