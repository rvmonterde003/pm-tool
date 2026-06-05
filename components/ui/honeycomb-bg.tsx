export function HoneycombBg() {
  return (
    <div
      className="fixed inset-0 -z-10 bg-canvas"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0-6l22-12.7V23.7L28 11 6 23.7v23.6L28 60z' fill='%23222222' fill-opacity='0.4'/%3E%3C/svg%3E")`,
        backgroundSize: '56px 100px',
      }}
    />
  )
}
