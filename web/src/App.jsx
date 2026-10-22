import { useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import theme from './config/theme';
import BrandTitle from './components/BrandTitle';
import EventDate from './components/EventDate';
import useEvents from './hooks/useEvents';

const grainTexture = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

function PurpleWaveBackground() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        backgroundColor: '#07010C',
        backgroundImage: `
          radial-gradient(ellipse 60% 45% at 90% 10%, rgba(196, 140, 255, 0.55) 0%, transparent 70%),
          radial-gradient(ellipse 55% 50% at 5% 60%, rgba(126, 34, 206, 0.55) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 30% 85%, rgba(88, 28, 135, 0.45) 0%, transparent 75%),
          linear-gradient(180deg, #12031F 0%, #07010C 55%, #050008 100%)
        `,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="waveFill" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0%" stopColor="#2A0845" stopOpacity="0.2" />
            <stop offset="45%" stopColor="#5B1F99" stopOpacity="0.55" />
            <stop offset="80%" stopColor="#A86BF0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D9B8FF" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="waveShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07010C" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#07010C" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="rimGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F5C2FF" stopOpacity="0" />
            <stop offset="25%" stopColor="#F9D4FF" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#F0C8FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
          </linearGradient>
          <filter id="blurSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="blurRim" x="-10%" y="-50%" width="120%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <path
          d="M0,0 H1440 V430 C1330,540 1120,560 900,470 C690,385 470,250 230,265 C130,272 60,290 0,305 Z"
          fill="url(#waveFill)"
          filter="url(#blurSoft)"
        />
        <path
          d="M0,0 H1440 V430 C1330,540 1120,560 900,470 C690,385 470,250 230,265 C130,272 60,290 0,305 Z"
          fill="url(#waveShade)"
        />
        <path
          d="M0,305 C60,290 130,272 230,265 C470,250 690,385 900,470 C1120,560 1330,540 1440,430"
          fill="none"
          stroke="url(#rimGlow)"
          strokeWidth="6"
          filter="url(#blurRim)"
        />
        <path
          d="M0,305 C60,290 130,272 230,265 C470,250 690,385 900,470 C1120,560 1330,540 1440,430"
          fill="none"
          stroke="url(#rimGlow)"
          strokeWidth="1.5"
          opacity="0.8"
        />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: grainTexture,
          opacity: 0.12,
          mixBlendMode: 'overlay',
        }}
      />
    </Box>
  );
}

export default function App() {
  const { events, loading, error, stats, createEvent } = useEvents();

  // Estados para modales
  const [openRegister, setOpenRegister] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);

  // Estado del formulario de inscripción
  const [formData, setFormData] = useState({
    nameAndLastName: '',
    methodPayment: 'transferencia',
    totalPayment: 20000,
  });
  const [submitting, setSubmitting] = useState(false);

  // Manejador del submit de inscripción
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createEvent({
        nameAndLastName: formData.nameAndLastName,
        methodPayment: formData.methodPayment,
        totalPayment: Number(formData.totalPayment),
        isAssisted: false,
      });
      setFormData({ nameAndLastName: '', methodPayment: 'transferencia', totalPayment: 20000 });
      setOpenRegister(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PurpleWaveBackground />
      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', p: 4, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
        <BrandTitle />

        <Card sx={{ maxWidth: 400, textAlign: 'center', p: 2 }}>
          <CardContent>
            <Typography variant="h5" color="primary.light" gutterBottom>
              2° Congreso Jóvenes
            </Typography>
            <EventDate scale={0.6} />
          </CardContent>
        </Card>

        {/* Carga y Listado */}
        {loading && <CircularProgress color="secondary" />}

        {error && (
          <Typography color="error.main">
            Error al conectar con la base de datos: {error.message}
          </Typography>
        )}

        {!loading && !error && (
          <Card sx={{ width: '100%', maxWidth: 600, p: 2 }}>
            <CardContent>
              <Typography variant="h6" color="secondary.main" gutterBottom>
                Inscriptos ({stats.total}) - Confirmados: {stats.present}
              </Typography>

              {events.length === 0 ? (
                <Typography color="text.secondary">No hay inscriptos cargados.</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, textAlign: 'left', mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                  {events.map((item, index) => (
                    <Box key={item._id || index} sx={{ p: 1, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <Typography variant="body1">
                        <strong>{item.nameAndLastName}</strong> - {item.methodPayment} (${item.totalPayment})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Botones principales con acciones */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => setOpenRegister(true)}>
            Inscribirme
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpenSchedule(true)}>
            Ver Cronograma
          </Button>
        </Box>

        {/* MODAL 1: Formulario de Inscripción */}
        <Dialog open={openRegister} onClose={() => setOpenRegister(false)} fullWidth maxWidth="xs">
          <form onSubmit={handleSubmitRegister}>
            <DialogTitle color="primary.light">Inscripción al Congreso</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Nombre y Apellido"
                required
                fullWidth
                value={formData.nameAndLastName}
                onChange={(e) => setFormData({ ...formData, nameAndLastName: e.target.value })}
              />
              <TextField
                select
                label="Método de Pago"
                fullWidth
                value={formData.methodPayment}
                onChange={(e) => setFormData({ ...formData, methodPayment: e.target.value })}
              >
                <MenuItem value="transferencia">Transferencia</MenuItem>
                <MenuItem value="efectivo">Efectivo</MenuItem>
              </TextField>
              <TextField
                label="Monto Total ($)"
                type="number"
                fullWidth
                value={formData.totalPayment}
                onChange={(e) => setFormData({ ...formData, totalPayment: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRegister(false)} color="inherit">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                {submitting ? 'Guardando...' : 'Confirmar'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* MODAL 2: Cronograma */}
        <Dialog open={openSchedule} onClose={() => setOpenSchedule(false)} fullWidth maxWidth="sm">
          <DialogTitle color="secondary.main">Cronograma del Congreso</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1" color="primary.light" sx={{ mt: 1, fontWeight: 'bold' }}>
              Viernes 23 de Octubre
            </Typography>
            <List density="compact">
              <ListItem><ListItemText primary="18:00 hs - Acreditaciones y Bienvenida" /></ListItem>
              <ListItem><ListItemText primary="19:30 hs - Plenaria de Apertura" /></ListItem>
              <ListItem><ListItemText primary="21:30 hs - Noche de Adoración" /></ListItem>
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" color="primary.light" sx={{ fontWeight: 'bold' }}>
              Sábado 24 de Octubre
            </Typography>
            <List density="compact">
              <ListItem><ListItemText primary="09:30 hs - Desayuno & Networking" /></ListItem>
              <ListItem><ListItemText primary="10:30 hs - Talleres & Workshops" /></ListItem>
              <ListItem><ListItemText primary="17:00 hs - Plenaria General" /></ListItem>
              <ListItem><ListItemText primary="20:00 hs - Cierre del Congreso" /></ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSchedule(false)} variant="contained" color="secondary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}