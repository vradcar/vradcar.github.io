import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Typography, Button, Container } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';

const HeroContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  zIndex: 1,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  textAlign: 'left',
  maxWidth: '800px',
}));

const Hero = () => {
  return (
    <HeroContainer>
      <HeroContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            sx={{
              background: 'linear-gradient(45deg, #64B5F6 30%, #90CAF9 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Varad Paradkar
          </Typography>
          <Typography variant="h2" color="text.secondary" sx={{ mb: 4 }}>
            Building the future with code & creativity
          </Typography>
          <Typography variant="h3" sx={{ mb: 4 }}>
            Computer Science Graduate Student | Software Developer | Research Assistant
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              href="/resume.pdf"
              download
              sx={{
                background: 'linear-gradient(45deg, #64B5F6 30%, #90CAF9 90%)',
                px: 4,
              }}
            >
              Download Resume
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="#contact"
              sx={{ px: 4 }}
            >
              Contact Me
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              href="https://github.com/vradcar"
              target="_blank"
              aria-label="GitHub"
            >
              <GitHub />
            </IconButton>
            <IconButton
              href="https://www.linkedin.com/in/varadparadkar"
              target="_blank"
              aria-label="LinkedIn"
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </motion.div>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;