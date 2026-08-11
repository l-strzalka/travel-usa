import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import MapPinIcon from '@mui/icons-material/LocationOn';
import { ExploreProduct } from '../types/explore.types';
import { resolveImageUrl } from '@/utils/imageUrl';

interface ExploreProductCardProps {
  product: ExploreProduct;
}

export const ExploreProductCard: React.FC<ExploreProductCardProps> = memo(
  ({ product }) => {
    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          border: '1px solid',
          borderColor: 'grey.200',
          overflow: 'hidden',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
            '& .card-overlay': {
              opacity: 1,
            },
          },
        }}
      >
        <CardActionArea
          component={Link}
          to={`/${product.slug}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            alignItems: 'stretch',
          }}
        >
          {/* Zdjęcie */}
          <Box
            sx={{
              position: 'relative',
              height: 220,
              width: '100%',
              bgcolor: 'grey.100',
              overflow: 'hidden',
            }}
          >
            {product.imageUrl ? (
              <CardMedia
                component='img'
                image={resolveImageUrl(product.imageUrl)}
                alt={product.name}
                loading='lazy'
                sx={{
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'text.disabled',
                }}
              >
                <Typography variant='body2'>Brak zdjęcia oferty</Typography>
              </Box>
            )}

            {/* Nakładka przy najechaniu (Hover) */}
            <Box
              className='card-overlay'
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.25s ease',
                zIndex: 2,
              }}
            >
              <Box
                component='span'
                sx={{
                  px: 3,
                  py: 1.5,
                  border: '1px solid #ffffff',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  bgcolor: 'rgba(0, 0, 0, 0.35)',
                  transition:
                    'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'primary.main', 
                    borderColor: 'primary.main',
                    color: '#ffffff', 
                  },
                }}
              >
                Zobacz ofertę
              </Box>
            </Box>
          </Box>

          {/* Treść pod zdjęciem */}
          <CardContent
            sx={{
              p: 2.5,
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography
                variant='h6'
                component='h3'
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  lineHeight: 1.35,
                  color: 'text.primary',
                  mb: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.name}
              </Typography>

              {product.location && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'text.secondary',
                    mb: 2,
                  }}
                >
                  <MapPinIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                  <Typography
                    variant='body2'
                    sx={{
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.location}
                  </Typography>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                pt: 1.5,
                borderTop: '1px dashed',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant='caption'
                sx={{
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                }}
              >
                Cena od
              </Typography>
              <Typography
                variant='h6'
                component='span'
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  fontSize: '1.2rem',
                }}
              >
                {product.price.toLocaleString('pl-PL')} PLN
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  },
);

ExploreProductCard.displayName = 'ExploreProductCard';
