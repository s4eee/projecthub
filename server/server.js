require('dotenv').config();
console.log("=== DATABASE ENVIRONMENT CHECK ===");
console.log("Is DATABASE_URL visible to Node?:", process.env.DATABASE_URL ? "✅ YES" : "❌ NO (It is undefined)");
console.log("==================================");
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');                         // Added for Prisma 7
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');     // Added for Prisma 7

const app = express();

// 1. Set up the PostgreSQL Connection Pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true});

// 2. Instantiate the Prisma 7 Driver Adapter
const adapter = new PrismaPg(pool);

// 3. Inject the adapter into PrismaClient to handle the engine-less architecture
const prisma = new PrismaClient({ adapter });

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// 1. GET Route: Fetch all projects from the database
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' } // Shows newest projects first
    });
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// 2. POST Route: Create a brand new project in the cloud
app.post('/api/projects', async (req, res) => {
  try {
    const { name, subtitle } = req.body;

    // Validation: Ensure the user at least provided a project name
    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    // Insert the new project using Prisma Client
    const newProject = await prisma.project.create({
      data: {
        name: name,
        subtitle: subtitle,
        status: "PLANNING" // Default starting status
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Base Welcome Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to ProjectHub API connected to Neon Cloud!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,'127.0.0.1', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});