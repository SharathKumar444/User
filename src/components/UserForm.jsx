import { useEffect, useState } from "react"

const UserForm = ({ addUser, updateUser, editingUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    company: "",
    bio: "",
  })

  useEffect(() => {
    if (editingUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(editingUser)
    }
  }, [editingUser])

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (editingUser) {
      updateUser(formData)
    } else {
      addUser(formData)
    }

    setFormData({
      name: "",
      email: "",
      role: "",
      company: "",
      bio: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="role"
        placeholder="Role"
        value={formData.role}
        onChange={handleChange}
        required
      />

      <input
        type="text"
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
        {editingUser ? "Update User" : "Add User"}
      </button>
    </form>
  )
}

export default UserForm