import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { Box, Typography, Card, CardContent, CardMedia, Grid, Chip, IconButton } from '@mui/material';
import { GitHub, Launch } from '@mui/icons-material';

const projects = [
  {
    title: 'Aranya',
    description: 'An immersive AR forest simulation for middle school education, built with Unity3D and ARCore.',
    image: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107',
    technologies: ['Unity3D', 'ARCore', 'C#', 'Blender'],
    github: 'https://github.com/vradcar/aranya',
    live: '#',
  },
  {
    title: 'Chemistry VR',
    description: 'Educational VR lab experience simulating chemical reactions for interactive learning.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    technologies: ['Unity3D', 'VR', 'C#', 'Shader Programming'],
    github: 'https://github.com/vradcar/chemistry-vr',
    live: '#',
  },
  // Add more projects...
];

const ProjectCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
  },
}));

const Projects = () => {
  return (
    <Box component="section" sx={{ py: 12 }}>
      <Container>
        <Typography
          variant="h2"
          sx={{
            mb: 8,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #64B5F6 30%, #90CAF9 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Featured Projects
        </Typography>
        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProjectCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {project.technologies.map((tech) => (
                        <Chip
                          key={tech}
                          label={tech}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" href={project.github} target="_blank">
                        <GitHub />
                      </IconButton>
                      <IconButton size="small" href={project.live} target="_blank">
                        <Launch />
                      </IconButton>
                    </Box>
                  </CardContent>
                </ProjectCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Projects;