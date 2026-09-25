export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-container">
        <h2>Dynasty<span>Tech</span></h2>
      </div>
      <nav>
        <ul>
          <li><a href="#diagnostics">Diagnostics</a></li>
          <li><a href="#request-service">Submit Request</a></li>
        </ul>
      </nav>
    </header>
  );
}