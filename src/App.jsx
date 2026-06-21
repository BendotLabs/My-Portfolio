import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import About from './Components/About'
import Projects from './Components/Projects'
import Contact from './Components/Contact'
import Footer from './Components/Footer'
import VantaBackground from './Components/Vantabackground'

function App() {
  return (
    <div className="relative">
      <VantaBackground />
      <Navbar />
      <Hero id="hello" />
      <About id="about" />
      <Projects id="projects" />
      <Contact id="contact" />
      <Footer />
    </div>
  )
}

export default App