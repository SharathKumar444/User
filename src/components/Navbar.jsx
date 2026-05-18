const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>User Dashboard</h2>
      </div>

      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/">Users</a>
        <a href="/">Settings</a>
      </div>
    </nav>
  )
}

export default Navbar