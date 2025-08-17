// MongoDB initialization script
const db = db.getSiblingDB("modular_app")

// Create collections with indexes
db.createCollection("users")
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ created_at: 1 })

db.createCollection("vehicles")
db.vehicles.createIndex({ user_id: 1, name: 1 })
db.vehicles.createIndex({ user_id: 1 })

db.createCollection("fuel_logs")
db.fuel_logs.createIndex({ user_id: 1, vehicle_id: 1, date: -1 })
db.fuel_logs.createIndex({ user_id: 1 })
db.fuel_logs.createIndex({ vehicle_id: 1 })

db.createCollection("service_logs")
db.service_logs.createIndex({ user_id: 1, vehicle_id: 1, date: -1 })
db.service_logs.createIndex({ user_id: 1 })
db.service_logs.createIndex({ vehicle_id: 1 })

print("Database initialized successfully")
