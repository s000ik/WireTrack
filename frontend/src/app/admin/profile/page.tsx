'use client';

import { Box, Grid } from '@chakra-ui/react';
import AdminLayout from 'layouts/admin';
import Banner from 'views/admin/profile/components/Banner';
import Image from 'next/image';

// Assets
const banner = '/img/auth/banner.png';
const avatar = process.env.NEXT_PUBLIC_URL + '/img/avatars/satwiksingh.jpg' || '/img/avatars/satwiksingh.jpg';
export default function ProfileOverview() {
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} w="100%">
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '1.34fr 1fr 1.62fr',
        }}
        templateRows={{
          base: 'repeat(3, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
        w="100%"
      >
        <Banner
          gridArea="1 / 1 / 2 / -1"  // Span all columns
          banner={banner}
          avatar={avatar}
          name="Satwik Singh"
          job="Senior Operator"
          posts="174S3DS"
          followers="4"
          following="3"
        />
      </Grid>
    </Box>
  );
}