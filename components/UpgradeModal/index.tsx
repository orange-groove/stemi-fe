'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material'
import { CheckCircle, MusicNote, Speed, HighQuality } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  message?: string
  currentUsage?: number
  monthlyLimit?: number
}

export default function UpgradeModal({
  open,
  onClose,
  message,
  currentUsage = 0,
  monthlyLimit = 3,
}: UpgradeModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      // Redirect to subscription page
      router.push('/subscribe')
    } catch (error) {
      console.error('Failed to redirect to upgrade:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography
          variant="h5"
          component="div"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <MusicNote color="primary" />
          Upgrade to Premium
        </Typography>
      </DialogTitle>

      <DialogContent>
        {message && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
            <Typography variant="body2" color="warning.contrastText">
              {message}
            </Typography>
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 2 }}>
          You've used {currentUsage}/{monthlyLimit} free songs this month.
          Upgrade to Premium for unlimited access!
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Premium Benefits
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="100 songs per month"
                secondary="vs 3 free songs"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Speed color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Priority processing"
                secondary="Faster stem separation"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HighQuality color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Higher quality stems"
                secondary="Better audio separation"
              />
            </ListItem>
          </List>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.light',
            borderRadius: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" color="primary.contrastText" sx={{ mb: 1 }}>
            $5/month
          </Typography>
          <Typography variant="body2" color="primary.contrastText">
            Cancel anytime
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Maybe Later
        </Button>
        <Button
          onClick={handleUpgrade}
          variant="contained"
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Redirecting...' : 'Upgrade Now'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
