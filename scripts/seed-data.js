#!/usr/bin/env node

const { MongoClient } = require("mongodb");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://admin:password@localhost:27017/modular_app?authSource=admin";

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("modular_app");

    // Clear existing data
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("vehicles").deleteMany({}),
      db.collection("fuellogs").deleteMany({}),
      db.collection("servicelogs").deleteMany({}),
    ]);

    console.log("Cleared existing data");

    // Create admin user (Clerk will handle actual authentication)
    const adminUser = {
      email: "mahedianwar@gmail.com",
      full_name: "System Administrator",
      role: "admin",
      is_blocked: false,
      clerk_id: "admin_clerk_id_placeholder", // Will be updated when user signs up through Clerk
      created_at: new Date(),
      updated_at: new Date(),
    };

    const adminResult = await db.collection("users").insertOne(adminUser);
    console.log("Created admin user:", adminUser.email);

    // Create demo user (Clerk will handle actual authentication)
    const demoUser = {
      email: "demo@example.com",
      full_name: "Demo User",
      role: "user",
      is_blocked: false,
      clerk_id: "demo_clerk_id_placeholder", // Will be updated when user signs up through Clerk
      created_at: new Date(),
      updated_at: new Date(),
    };

    const userResult = await db.collection("users").insertOne(demoUser);
    console.log("Created demo user:", demoUser.email);

    // Create demo vehicles
    const vehicles = [
      {
        user_id: userResult.insertedId.toString(),
        name: "My Honda Civic",
        type: "car",
        make: "Honda",
        model: "Civic",
        year: 2020,
        fuel_type: "gasoline",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: userResult.insertedId.toString(),
        name: "Work Truck",
        type: "truck",
        make: "Ford",
        model: "F-150",
        year: 2019,
        fuel_type: "gasoline",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const vehicleResults = await db.collection("vehicles").insertMany(vehicles);
    console.log("Created demo vehicles:", vehicles.length);

    // Create demo fuel logs
    const fuelLogs = [];
    const vehicleIds = Object.values(vehicleResults.insertedIds);

    for (let i = 0; i < 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days

      const volume = 10 + Math.random() * 15; // 10-25 gallons
      const unitPrice = 3.2 + Math.random() * 1.5; // $3.20-$4.70 per gallon
      const totalCost = volume * unitPrice;

      fuelLogs.push({
        vehicle_id:
          vehicleIds[Math.floor(Math.random() * vehicleIds.length)].toString(),
        user_id: userResult.insertedId.toString(),
        date,
        odometer: 50000 + i * 300 + Math.floor(Math.random() * 200),
        volume: Math.round(volume * 100) / 100,
        unit_price: Math.round(unitPrice * 100) / 100,
        total_cost: Math.round(totalCost * 100) / 100,
        station: ["Shell", "Exxon", "BP", "Chevron", "Mobil"][
          Math.floor(Math.random() * 5)
        ],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await db.collection("fuellogs").insertMany(fuelLogs);
    console.log("Created demo fuel logs:", fuelLogs.length);

    // Create demo service logs
    const serviceLogs = [];
    const serviceTypes = [
      "oil_change",
      "tire_rotation",
      "brake_service",
      "tune_up",
      "repair",
    ];

    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // Last 6 months

      serviceLogs.push({
        vehicle_id:
          vehicleIds[Math.floor(Math.random() * vehicleIds.length)].toString(),
        user_id: userResult.insertedId.toString(),
        date,
        odometer: 50000 + i * 500 + Math.floor(Math.random() * 300),
        service_type:
          serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
        cost: Math.round((50 + Math.random() * 200) * 100) / 100, // $50-$250
        notes: "Regular maintenance service",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await db.collection("servicelogs").insertMany(serviceLogs);
    console.log("Created demo service logs:", serviceLogs.length);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📋 Demo Accounts:");
    console.log(
      "Note: Authentication is handled by Clerk. Create accounts through the sign-up flow."
    );
    console.log("Admin role will be assigned based on Clerk user metadata.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
