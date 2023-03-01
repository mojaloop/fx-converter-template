# [EXPERIMENTAL] FX Converter Template

<!-- ACTION: REPLACE fx-converter-template placeholders in this document -->
[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/fx-converter-template.svg?style=flat)](https://github.com/mojaloop/fx-converter-template/commits/master)
[![Git Releases](https://img.shields.io/github/release/mojaloop/fx-converter-template.svg?style=flat)](https://github.com/mojaloop/fx-converter-template/releases)
[![Npm Version](https://img.shields.io/npm/v/@mojaloop/fx-converter-template.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/fx-converter-template)
[![NPM Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@mojaloop/fx-converter-template.svg?style=flat)](https://www.npmjs.com/package/@mojaloop/fx-converter-template)
[![CircleCI](https://circleci.com/gh/mojaloop/fx-converter-template.svg?style=svg)](https://circleci.com/gh/mojaloop/fx-converter-template)

[EXPERIMENTAL] A project template for FX conversion to be used between SDK and Core connectors.

`This repository is still under development`

## Contributing

Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for information on how to contribute, committing changes, releases and snapshots.

---

## Overview

This repository is a sample implementation for the FX converter. The actual implementation may vary based on the business usecases and rules.
The FX converter sits between SDK and Core connector.
So FX converter speaks sends SDK outbound API requests to SDK service and Core connector API requests to speak to core connector service.

## Block diagram

```mermaid
flowchart TD
    CC[Core Connector] -->|Requests in Currency1| FX(fa:fa-exchange FX Converter)
    FX -->|Requests in Currency2| SDK[SDK Scheme Adapter]
    SDK -->|Responses in Currency2| FX
    FX -->|Responses in Currency1| CC
```

---

## Pre-requisites

### Install dependencies

```bash
npm install
```

## Build

Command to transpile Typescript into JS:

```bash
npm run build
```

Command to LIVE transpile Typescript into JS live when any changes are made to the code-base:

```bash
npm run watch
```

## Run

```bash
npm start
```

## Tests

```bash
npm test
```