import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import AboutMe from './components/AboutMe';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import ScrollSequence from './components/ScrollSequence';

function App() {
  return (
    // reducedMotion="user" switches off movement for visitors whose system asks for less motion
    <MotionConfig reducedMotion="user">
    <div className="App">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <Landing />
        <AboutMe />
        <ScrollSequence>
          <WorkExperience />
          <Education />
        </ScrollSequence>
        <Skills />
        <Projects />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
    </MotionConfig>
  );
}

export default App;
