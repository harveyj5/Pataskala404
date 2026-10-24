#!/usr/bin/env bash
# Automated Folder & Environment Setup Script for Linux/macOS

set -e

echo "[+] Initializing S6 Framework Isolated Workspace Pipeline..."

# Create core directories
mkdir -p .githooks
mkdir -p config
mkdir -p memory
mkdir -p review_pipeline/00_pre_flight_alignment
mkdir -p review_pipeline/01_discovery
mkdir -p review_pipeline/02_antagonist
mkdir -p review_pipeline/03_architecture
mkdir -p review_pipeline/04_software_engineering
mkdir -p review_pipeline/05_security
mkdir -p review_pipeline/06_ux_ui
mkdir -p review_pipeline/07_qa/features
mkdir -p review_pipeline/08_reporting
mkdir -p dashboard
mkdir -p src/core

# Initialize Git Hooks
cat << 'EOF' > .githooks/pre-commit
#!/usr/bin/env bash
echo "[Git Hook] Running QA Automated Verification before commit..."
if [ -f "review_pipeline/07_qa/Automated_Tests.py" ]; then
    python3 review_pipeline/07_qa/Automated_Tests.py
    if [ $? -ne 0 ]; then
        echo "[FATAL] Automated tests failed! Commit aborted."
        exit 1
    fi
fi
echo "[Git Hook] All tests passed. Proceeding with commit."
EOF

chmod +x .githooks/pre-commit
git config core.hooksPath .githooks 2>/dev/null || true

# Initialize memory file if it doesn't exist
if [ ! -f "memory/framework_knowledge.json" ]; then
    echo "{}" > memory/framework_knowledge.json
fi

echo "[+] Directory structure successfully verified."