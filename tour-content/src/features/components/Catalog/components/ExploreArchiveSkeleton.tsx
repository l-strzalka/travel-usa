import { Grid, Skeleton, Card, CardContent, Box } from '@mui/material';

interface ExploreArchiveSkeletonProps {
  count?: number;
}

export const ExploreArchiveSkeleton = ({
  count = 8,
}:ExploreArchiveSkeletonProps) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} lg={3} key={index}>
          <Card
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}
          >
            <Skeleton variant="rectangular" height={220} animation="wave" />
            <CardContent sx={{ p: 2.5 }}>
              <Skeleton variant="text" width="85%" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />
              <Box
                sx={{
                  pt: 1.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Skeleton variant="text" width="30%" height={16} />
                <Skeleton variant="text" width="40%" height={28} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};