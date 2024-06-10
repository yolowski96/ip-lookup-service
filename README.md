# IP Lookup Service

## Description

The IP Lookup Service is a REST API that allows users to:

- Lookup information for a particular IP address via the [ipwhois.io](https://ipwhois.io/) API.
- Store the lookup information in a database with caching.
- Retrieve stored lookup information from the database if it has already been searched (DB-caching).
- Remove cached results by IP.

## Prerequisites

- Node.js
- npm or yarn
- A database (SQLite is used in this example for simplicity)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yolowski96/ip-lookup-service.git
   cd ip-lookup-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the service:
   ```bash
   npm run build
   ``` 

## Running the Service

To start the service, use the following command:

```bash
docker-compose build
docker-compose up
#or
npm start
```

## API Documentation

The service uses Swagger for API documentation:

```bash
http://localhost:3000/api-docs
```
