import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Fade,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  useTheme,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  CardMembership,
  DirectionsCar,
  Assignment,
  Build,
  Notifications,
  Logout,
  Person,
  ChevronLeft,
  Business,
  ExpandLess,
  ExpandMore,
  Work,
  Assessment,
  Analytics,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { notificationApi } from '../../services';
import { formatRole } from '../../utils/constants';
import type { Theme } from '@mui/material/styles';

const DRAWER_WIDTH = 268;
const APP_BAR_HEIGHT = 64;

const navSections = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/', icon: <Dashboard /> },
      { label: 'Executive Dashboard', path: '/executive', icon: <Analytics /> },
    ],
  },
  {
    title: 'Projects',
    items: [
      { label: 'All Projects', path: '/projects', icon: <Work /> },
      { label: 'Project Analytics', path: '/projects/dashboard', icon: <Analytics /> },
      { label: 'Resource Allocation', path: '/projects/allocations', icon: <Assignment /> },
    ],
  },
  {
    title: 'Certificates',
    items: [
      { label: 'All Certificates', path: '/certificates', icon: <CardMembership /> },
      { label: 'Analytics', path: '/certificates/dashboard', icon: <Analytics /> },
    ],
  },
  {
    title: 'Fleet',
    items: [
      { label: 'Vehicles', path: '/vehicles', icon: <DirectionsCar /> },
      { label: 'Assignments', path: '/vehicles/assignments', icon: <Assignment /> },
      { label: 'Maintenance', path: '/vehicles/maintenance', icon: <Build /> },
      { label: 'Fleet Analytics', path: '/vehicles/dashboard', icon: <Analytics /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Reports', path: '/reports', icon: <Assessment /> },
      { label: 'Notifications', path: '/notifications', icon: <Notifications /> },
    ],
  },
];

const drawerTransition = (theme: Theme) =>
  theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  });

function isNavActive(path: string, pathname: string): boolean {
  if (path === '/') return pathname === '/';
  if (path === '/projects') {
    return (
      pathname === '/projects' ||
      (pathname.startsWith('/projects/') &&
        !pathname.startsWith('/projects/dashboard') &&
        !pathname.startsWith('/projects/allocations'))
    );
  }
  if (path === '/certificates') {
    return (
      pathname === '/certificates' ||
      (pathname.startsWith('/certificates/') && !pathname.startsWith('/certificates/dashboard'))
    );
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Overview: true,
    Projects: true,
    Certificates: true,
    Fleet: true,
    System: true,
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const { data: unreadData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 60000,
  });

  const unreadCount = unreadData?.data.data?.count || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <Box
        sx={{
          px: 2.5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(30, 94, 255, 0.08)',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1e5eff 0%, #3b82f6 100%)',
            color: '#fff',
          }}
        >
          <Business fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#0f172a' }}>
            OMP Platform
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Operations Suite
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, py: 1, px: 0.5 }}>
        {navSections.map((section) => (
          <Box key={section.title}>
            <ListItemButton
              onClick={() => toggleSection(section.title)}
              sx={{ py: 0.75, borderRadius: 2, mx: 0.5 }}
            >
              <ListItemText
                primary={section.title}
                primaryTypographyProps={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'text.secondary',
                }}
              />
              {expanded[section.title] ? (
                <ExpandLess sx={{ fontSize: 18, color: 'text.secondary' }} />
              ) : (
                <ExpandMore sx={{ fontSize: 18, color: 'text.secondary' }} />
              )}
            </ListItemButton>
            <Collapse in={expanded[section.title]} timeout="auto">
              {section.items.map((item) => {
                const selected = isNavActive(item.path, location.pathname);
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                    <ListItemButton
                      selected={selected}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setOpen(false);
                      }}
                      sx={{
                        py: 1,
                        pl: 2.5,
                        borderRadius: 2.5,
                        mx: 0.5,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: selected ? 'primary.main' : 'text.secondary',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: selected ? 600 : 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );

  const drawerWidth = !isMobile && open ? DRAWER_WIDTH : 0;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ zIndex: theme.zIndex.drawer + 1, height: APP_BAR_HEIGHT }}
      >
        <Toolbar sx={{ height: APP_BAR_HEIGHT, minHeight: `${APP_BAR_HEIGHT}px !important` }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen((prev) => !prev)}
            sx={{
              mr: 1.5,
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            aria-label={open ? 'Close sidebar' : 'Open sidebar'}
          >
            {open && !isMobile ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, fontWeight: 600, fontSize: '1.05rem', color: '#fff' }}
          >
            Operational Management Platform
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.35)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 220,
                borderRadius: 2.5,
                border: '1px solid rgba(30, 94, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(30, 94, 255, 0.12)',
              },
            }}
          >
            <MenuItem disabled sx={{ opacity: '1 !important' }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatRole(user?.role || '')}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                navigate('/profile');
              }}
            >
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            transition: drawerTransition(theme),
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              top: APP_BAR_HEIGHT,
              height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
              borderRight: '1px solid rgba(30, 94, 255, 0.08)',
              bgcolor: '#ffffff',
              overflowX: 'hidden',
              transition: theme.transitions.create(['width', 'transform'], {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
              transform: open ? 'translateX(0)' : `translateX(-${DRAWER_WIDTH}px)`,
              boxShadow: open ? '4px 0 24px rgba(30, 94, 255, 0.06)' : 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              top: APP_BAR_HEIGHT,
              height: `calc(100% - ${APP_BAR_HEIGHT}px)`,
              borderRight: '1px solid rgba(30, 94, 255, 0.08)',
              transition: theme.transitions.create('transform', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
            },
            '& .MuiBackdrop-root': {
              top: APP_BAR_HEIGHT,
              backdropFilter: 'blur(2px)',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${drawerWidth}px)`,
          minWidth: 0,
          mt: `${APP_BAR_HEIGHT}px`,
          transition: drawerTransition(theme),
          textAlign: 'left',
        }}
      >
        <Fade in key={location.pathname} timeout={280}>
          <Box>{children}</Box>
        </Fade>
      </Box>
    </Box>
  );
}
