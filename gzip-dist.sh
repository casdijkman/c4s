#!/usr/bin/env bash

gzip --force --keep dist/*

# Print sizes of files in dist directory
du --human-readable --apparent-size dist/*
