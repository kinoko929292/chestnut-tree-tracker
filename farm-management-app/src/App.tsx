import React from 'react';
import { 
  Box, 
  CssBaseline, 
  Toolbar, 
  AppBar, 
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FarmAreaList from './features/farmArea/FarmAreaList';

const drawerWidth = 240;

function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: `calc(100% - ${drawerWidth}px)`
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              畑管理アプリ
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/farm-areas">
                  <ListItemIcon>
                    <LocalFloristIcon />
                  </ListItemIcon>
                  <ListItemText primary="畑エリア管理" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="植え付け記録" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="成長記録" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="カレンダービュー" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: `${drawerWidth}px`,
            marginTop: '64px',
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#f5f5f5'
          }}
        >
          <Routes>
            <Route path="/farm-areas" element={<FarmAreaList />} />
            <Route path="/" element={
              <>
                <Typography paragraph>
                  ようこそ、畑管理アプリへ
                </Typography>
                <Typography paragraph>
                  左のメニューから各機能を選択してください
                </Typography>
              </>
            } />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
