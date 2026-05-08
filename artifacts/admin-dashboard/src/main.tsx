import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import './index.css';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Users from './pages/Users';
import Rooms from './pages/Rooms';
import Images from './pages/Images';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem', marginLeft: '250px' }}>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/bookings" component={Bookings} />
            <Route path="/users" component={Users} />
            <Route path="/rooms" component={Rooms} />
            <Route path="/images" component={Images} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </main>
      </div>
    </QueryClientProvider>
  );
}