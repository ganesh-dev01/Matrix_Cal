import * as React from 'react';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import { Container, Typography, Button, Grid, Box } from '@mui/material';

const App: React.FC = () => {
  const router = useRouter();
  return (
    <Container className={styles.main} maxWidth={false}>
      <Box className={styles.hero}>
        <Typography variant="h2" className={styles.heading}>
          Matrix Calculator
        </Typography>
        <Typography variant="h6" className={styles.subheading}>
          Easily generate and perform operations on matrices
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          className={styles.trybtn} 
          onClick={() => router.push('/matrix')}
        >
          Try it
        </Button>
      </Box>
      <Box className={styles.features}>
        <Typography variant="h4" className={styles.featuresHeading}>
          Features
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box className={styles.featureBox}>
              <Typography variant="h6">Generate Matrices</Typography>
              <Typography>Input rows and columns to generate matrices effortlessly.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className={styles.featureBox}>
              <Typography variant="h6">Matrix Operations</Typography>
              <Typography>Perform addition and multiplication on matrices.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box className={styles.featureBox}>
              <Typography variant="h6">Responsive Design</Typography>
              <Typography>Enjoy a seamless experience during the using of this webapp
                on any device.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;