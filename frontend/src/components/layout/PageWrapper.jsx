export default function PageWrapper({ children, className = '' }) {
  return (
    <div className={`p-6 animate-fade-in ${className}`}>
      {children}
    </div>
  )
}
