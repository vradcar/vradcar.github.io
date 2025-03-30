import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme } from './theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Research from './components/Research';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ParticlesBackground />
      <Navbar />
      <Hero />
      <About />
      <Research />
      <Experience />
      <Projects />
      <Contact />
    </ThemeProvider>
  );
}

export default App;