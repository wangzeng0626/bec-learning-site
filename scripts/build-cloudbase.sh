#!/usr/bin/env bash

set -euo pipefail

rm -rf dist
mkdir -p dist/assets

cp index.html dist/
cp assets/app.js assets/styles.css dist/assets/
cp f1edbef12f2326129cf8486b952bfd0a.txt dist/
