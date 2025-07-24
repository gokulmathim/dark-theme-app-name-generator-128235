#!/bin/bash
cd /home/kavia/workspace/code-generation/dark-theme-app-name-generator-128235/gen_ai_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

