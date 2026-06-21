'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Shield, KeyRound, MonitorSmartphone, LogOut, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SecuritySettingsPage() {
  const { logoutCurrentSession, logoutAllSessions, changePassword, getSessions, revokeSession } = useAuthStore();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    getSessions().then(data => {
      setSessions(data || []);
      setIsLoadingSessions(false);
    }).catch(err => {
      console.error(err);
      toast.error('Failed to load active sessions');
      setIsLoadingSessions(false);
    });
  }, [getSessions]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } catch (e: any) {
      toast.error(e.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeSession(id);
      setSessions(sessions.filter(s => s.id !== id));
      toast.success('Session revoked successfully');
    } catch (e: any) {
      toast.error(e.message || 'Failed to revoke session');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div>
        <h1 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="size-8 text-primary" />
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your password and active sessions to keep your account secure.
        </p>
      </div>

      {/* Password Change Section */}
      <section className="rounded-3xl border border-white/5 bg-[#1b1522]/80 p-6 md:p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <KeyRound className="size-5" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-white">Change Password</h2>
            <p className="text-xs text-muted-foreground">Update your password regularly to stay secure.</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-white/10 bg-secondary/30 px-4 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" disabled={isChangingPassword} className="w-full sm:w-auto h-11 bg-primary text-primary-foreground font-bold rounded-xl mt-4">
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </section>

      {/* Active Sessions Section */}
      <section className="rounded-3xl border border-white/5 bg-[#1b1522]/80 p-6 md:p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <MonitorSmartphone className="size-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">Active Sessions</h2>
              <p className="text-xs text-muted-foreground">Manage devices where you are logged in.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => logoutAllSessions()}
            className="text-destructive hover:bg-destructive hover:text-white border-destructive/30 hover:border-destructive h-9"
          >
            Logout All Devices
          </Button>
        </div>

        <div className="space-y-4">
          {isLoadingSessions ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="size-8 animate-spin text-primary/50" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => {
              // Assume session structure: { id, device, browser, location, is_current, last_active }
              return (
                <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-white/5 gap-4 transition-all hover:bg-secondary/30">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 size-2 rounded-full shrink-0 ${session.is_current ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground/50'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{session.device || 'Unknown Device'}</h4>
                        {session.is_current && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="size-3" />
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {session.browser || 'Unknown Browser'} {session.location ? `• ${session.location}` : ''}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                        {session.is_current ? 'Active now' : `Last active: ${new Date(session.last_active).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center sm:self-center">
                    {session.is_current ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => logoutCurrentSession()}
                        className="w-full sm:w-auto h-9 text-xs text-muted-foreground hover:text-white border-white/10"
                      >
                        <LogOut className="size-3.5 mr-2" />
                        Sign Out
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRevoke(session.id)}
                        className="w-full sm:w-auto h-9 text-xs text-destructive hover:bg-destructive hover:text-white border-destructive/20"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">No active sessions found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
