import { useEffect, useState, useCallback, useMemo } from "react"
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi"

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [editingUser, setEditingUser] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    website: "",
  })

  // FETCH USERS
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)

      const res = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      )

      const data = await res.json()

      const formatted = data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "Developer",
        company: user.company?.name,
        website: user.website,
      }))

      setUsers(formatted)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers()
  }, [fetchUsers])

  // HANDLE INPUT
  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // SUBMIT
  const handleSubmit = e => {
    e.preventDefault()

    if (editingUser) {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser.id
            ? { ...u, ...formData }
            : u
        )
      )
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
      }

      setUsers(prev => [newUser, ...prev])
    }

    setFormData({
      name: "",
      email: "",
      role: "",
      company: "",
      website: "",
    })

    setEditingUser(null)
  }

  // EDIT
  const handleEdit = user => {
    setEditingUser(user)
    setFormData(user)
  }

  // DELETE
  const handleDelete = id => {
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  // SEARCH FILTER
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [users, search])

  return (
    <div
      style={{
        padding: "15px",
        background: "#0b1220",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <h2>User Management Dashboard</h2>

      {/* SEARCH */}
      <div style={{ margin: "10px 0" }}>
        <FiSearch />
        <input
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        <input
          name="name"
          placeholder="Name *"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>

        <input
          name="company"
          placeholder="Company *"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <input
          name="website"
          placeholder="Website *"
          value={formData.website}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingUser ? "Update" : "Add User"}
        </button>
      </form>

      {/* USERS GRID (3–4 PER ROW) */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="user-grid">
          {filteredUsers.map(user => (
            <div className="user-card" key={user.id}>

              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.company}</p>

              {/* ROLE */}
              <span className="role-badge">
                {user.role}
              </span>

              {/* WEBSITE (NO LINK) */}
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>
                Website: {user.website}
              </p>

              <div style={{ marginTop: "8px" }}>
                <button onClick={() => handleEdit(user)}>
                  <FiEdit2 /> Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ marginLeft: "8px" }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard