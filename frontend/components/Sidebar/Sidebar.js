import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
  return (
    <div style={{ width: '240px', height: '100vh', backgroundColor: '#282c34' }}>
      <List>
        <ListItem button>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
