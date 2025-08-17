import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { DataGrid, type DataGridColumn } from "@/components/ui/data-grid"

interface TestData {
  id: number
  name: string
  email: string
  role: string
}

const mockData: TestData[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
]

const columns: DataGridColumn<TestData>[] = [
  { key: "name", header: "Name", sortable: true, searchable: true },
  { key: "email", header: "Email", sortable: true, searchable: true },
  { key: "role", header: "Role", sortable: true },
]

describe("DataGrid", () => {
  it("renders data correctly", () => {
    render(<DataGrid data={mockData} columns={columns} />)

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("jane@example.com")).toBeInTheDocument()
    expect(screen.getByText("admin")).toBeInTheDocument()
  })

  it("shows empty message when no data", () => {
    render(<DataGrid data={[]} columns={columns} emptyMessage="No users found" />)

    expect(screen.getByText("No users found")).toBeInTheDocument()
  })

  it("filters data based on search", () => {
    render(<DataGrid data={mockData} columns={columns} />)

    const searchInput = screen.getByPlaceholderText("Search...")
    fireEvent.change(searchInput, { target: { value: "john" } })

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument()
  })

  it("sorts data when column header is clicked", () => {
    render(<DataGrid data={mockData} columns={columns} />)

    const nameHeader = screen.getByText("Name")
    fireEvent.click(nameHeader)

    // After sorting, Bob should be first (alphabetically)
    const rows = screen.getAllByRole("row")
    expect(rows[1]).toHaveTextContent("Bob Johnson")
  })
})
