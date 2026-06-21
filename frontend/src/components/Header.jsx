function Header() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-brand">
          <span className="header-pulse" />
          <span className="header-title">CYBER NEWS AI</span>
        </div>
        <span className="header-date mono">{today}</span>
      </div>
    </header>
  );
}

export default Header;