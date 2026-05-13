export default function ServerErrorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "42px", marginBottom: "16px" }}>
          500 Internal Server Error
        </h1>

        <p style={{ fontSize: "18px", marginBottom: "8px" }}>
          The server encountered an unexpected condition and could not complete the request.
        </p>

        <p style={{ fontSize: "16px", color: "#cbd5e1" }}>
          Project access is currently unavailable. Please try again later.
        </p>
      </div>
    </main>
  );
}