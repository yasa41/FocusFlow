export  const scrollToSection = (event, sectionId) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      // Close mobile menu after scrolling
      setMobileMenuOpen(false);
    }
  };