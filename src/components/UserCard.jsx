const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <div className="card">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.role}</p>
      <p>{user.company}</p>
      <p>{user.bio}</p>

      <button onClick={() => onEdit(user)}>Edit</button>

      <button onClick={() => onDelete(user.id)}>
        Delete
      </button>
    </div>
  )
}

export default UserCard