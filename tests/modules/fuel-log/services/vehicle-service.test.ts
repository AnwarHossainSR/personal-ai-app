import { describe, it, expect, vi, beforeEach } from "vitest"
import { VehicleService } from "@/modules/fuel-log/services/vehicle-service"

// Mock the database connection
vi.mock("@/lib/db/connection", () => ({
  default: vi.fn(),
}))

// Mock the Vehicle model
vi.mock("@/modules/fuel-log/models/vehicle", () => ({
  Vehicle: {
    find: vi.fn(),
    findOne: vi.fn(),
    findOneAndUpdate: vi.fn(),
    deleteOne: vi.fn(),
    prototype: {
      save: vi.fn(),
    },
  },
}))

describe("VehicleService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getAll", () => {
    it("should return vehicles for a user", async () => {
      const mockVehicles = [
        { _id: "1", name: "Car 1", user_id: "user1" },
        { _id: "2", name: "Car 2", user_id: "user1" },
      ]

      const { Vehicle } = await import("@/modules/fuel-log/models/vehicle")
      vi.mocked(Vehicle.find).mockResolvedValue(mockVehicles)

      const result = await VehicleService.getAll("user1")

      expect(Vehicle.find).toHaveBeenCalledWith({ user_id: "user1" })
      expect(result).toEqual(mockVehicles)
    })
  })

  describe("create", () => {
    it("should create a new vehicle", async () => {
      const vehicleData = {
        name: "Test Car",
        make: "Honda",
        model: "Civic",
        year: 2020,
        type: "car" as const,
        fuel_type: "gasoline" as const,
      }

      const mockVehicle = {
        ...vehicleData,
        user_id: "user1",
        _id: "new-id",
        save: vi.fn().mockResolvedValue(true),
      }

      // Mock the Vehicle constructor
      const { Vehicle } = await import("@/modules/fuel-log/models/vehicle")
      vi.mocked(Vehicle).mockImplementation(() => mockVehicle as any)

      const result = await VehicleService.create(vehicleData, "user1")

      expect(mockVehicle.save).toHaveBeenCalled()
      expect(result).toEqual(mockVehicle)
    })
  })
})
