import React from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import AboutMe from './components/AboutMe';
import WorkExperience from './components/WorkExperience';
import Education from './components/Education';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import ChatAssistant from './components/ChatAssistant';
import ScrollSequence from './components/ScrollSequence';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Landing />
        <AboutMe />
        <ScrollSequence>
          <WorkExperience />
          <Education />
        </ScrollSequence>
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <ChatAssistant />
    </div>
  );
}

export default App;
