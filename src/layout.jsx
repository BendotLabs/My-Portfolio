function Container({ children }) {
  return (
    <div className="max-w-6xl w-full mx-auto h-full flex items-center px-6 md:px-20">
      {children}
    </div>
  )
}

export default Container