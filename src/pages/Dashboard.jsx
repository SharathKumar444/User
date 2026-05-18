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
  FiBriefcase,
} from "react-icons/fi"

import API from "../api/userApi"

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const [editingUser, setEditingUser] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    bio: "",
  })

  // FETCH USERS
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)

      const res = await API.get("/users")

      setUsers(res.data)
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

  // DERIVED FILTERED USERS (NO useState, NO useEffect)
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

  // FORM CHANGE
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // RESET FORM
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

  // SUBMIT (ADD / UPDATE)
  const handleSubmit = async e => {
    e.preventDefault()

    try {
      if (editingUser) {
        await API.put(
          `/users/${editingUser.id}`,
          formData
        )
      } else {
        await API.post("/users", formData)
      }

      fetchUsers()
      resetForm()
    } catch (err) {
      console.log(err)
    }
  }

  // EDIT
  const handleEdit = user => {
    setEditingUser(user)
    setFormData(user)
  }

  // DELETE
  const handleDelete = async id => {
    try {
      await API.delete(`/users/${id}`)
      fetchUsers()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h1>Admin Panel</h1>

        <nav>
          <a href="#">Dashboard</a>
          <a href="#">Users</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* TOP BAR */}
        <div className="topbar">
          <div>
            <h2>User Management</h2>
            <p>Full-stack CRUD Dashboard</p>
          </div>

          <button className="add-btn">
            <FiPlus /> Add User
          </button>
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

          <div className="stat-card">
            <FiBriefcase />
            <div>
              <h3>
                {
                  users.filter(
                    u =>
                      u.role ===
                      "Frontend Developer"
                  ).length
                }
              </h3>
              <p>Frontend Devs</p>
            </div>
          </div>
        </div>

        {/* FILTERS */}
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
            <option value="Backend Developer">
              Backend Developer
            </option>
            <option value="UI/UX Designer">
              UI/UX Designer
            </option>
          </select>
        </div>

        {/* FORM */}
        <div className="form-card">
          <h3>
            {editingUser
              ? "Update User"
              : "Add User"}
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
              {editingUser
                ? "Update"
                : "Create"}
            </button>
          </form>
        </div>

        {/* USERS */}
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <div className="user-grid">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="user-card"
              >
                <h3>{user.name}</h3>
                <p>{user.role}</p>
                <p>{user.email}</p>

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
      </main>
    </div>
  )
}

export default Dashboard