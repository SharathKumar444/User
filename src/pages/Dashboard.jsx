import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react"

import {
  FiUsers,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [editingUser, setEditingUser] = useState(null)

  const [darkMode, setDarkMode] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    bio: "",
  })

  // FETCH USERS FROM JSONPLACEHOLDER
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
        role: "Frontend Developer",
        company: user.company?.name || "N/A",
        bio: "User from JSONPlaceholder API",
      }))

      setUsers(formatted)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // FILTER USERS
  const filteredUsers = useMemo(() => {
    let data = [...users]

    if (search) {
      data = data.filter(user =>
        user.name
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    }

    if (roleFilter) {
      data = data.filter(
        user => user.role === roleFilter
      )
    }

    return data
  }, [users, search, roleFilter])

  // CHART DATA
  const roleData = useMemo(() => {
    const roles = ["Frontend Developer"]

    return roles.map(role => ({
      name: role,
      value: users.filter(u => u.role === role)
        .length,
    }))
  }, [users])

  const COLORS = ["#38bdf8"]

  // FORM HANDLERS
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "",
      company: "",
      bio: "",
    })
    setEditingUser(null)
  }

  // ADD / UPDATE (LOCAL ONLY)
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

      setUsers([newUser, ...users])
    }

    resetForm()
  }

  // EDIT
  const handleEdit = user => {
    setEditingUser(user)
    setFormData(user)
  }

  // DELETE
  const handleDelete = id => {
    setUsers(users.filter(u => u.id !== id))
  }

  return (
    <div
      className={
        darkMode ? "dashboard dark" : "dashboard light"
      }
    >
      {/* TOP BAR */}
      <div className="topbar">
        <h2>User Dashboard</h2>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            Toggle Theme
          </button>

          <button className="add-btn">
            <FiPlus /> Add User
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <FiUsers />
          <div>
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="filter-bar">
        <div className="search-box">
          <FiSearch />
          <input
            placeholder="Search users..."
            value={search}
            onChange={e =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          value={roleFilter}
          onChange={e =>
            setRoleFilter(e.target.value)
          }
        >
          <option value="">All Roles</option>
          <option value="Frontend Developer">
            Frontend Developer
          </option>
        </select>
      </div>

      {/* CHART */}
      <div className="chart-box">
        <PieChart width={250} height={250}>
          <Pie
            data={roleData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
          >
            {roleData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* FORM */}
      <div className="form-card">
        <h3>
          {editingUser ? "Update User" : "Add User"}
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
          />

          <input
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />

          <textarea
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />

          <button type="submit">
            {editingUser ? "Update" : "Create"}
          </button>
        </form>
      </div>

      {/* USERS */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="user-grid">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="user-card"
            >
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>{user.company}</p>

              <div className="card-actions">
                <button
                  onClick={() =>
                    handleEdit(user)
                  }
                >
                  <FiEdit2 /> Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(user.id)
                  }
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