import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import VantaBackground from './components/VantaBackground'

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