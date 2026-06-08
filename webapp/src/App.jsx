import React from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import AboutMe from './components/AboutMe';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Landing />
        <AboutMe />
        <WorkExperience />
        <Education />
        <Skills />
        <Certifications />
        <Contact />
      </main>
    </div>
  );
}

export default App;
