import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Wrench, FolderOpen, Star, MessageSquare, FileText, Eye, Clock, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ services: 0, projects: 0, reviews: 0, pendingReviews: 0, contacts: 0, unreadContacts: 0, quotes: 0, unreadQuotes: 0 });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [s, p, r, pr, c, uc, q, uq] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('quote_requests').select('id', { count: 'exact', head: true }),
        supabase.from('quote_requests').select('id', { count: 'exact', head: true }).eq('is_read', false),
      ]);
      setStats({
        services: s.count || 0,
        projects: p.count || 0,
        reviews: r.count || 0,
        pendingReviews: pr.count || 0,
        contacts: c.count || 0,
        unreadContacts: uc.count || 0,
        quotes: q.count || 0,
        unreadQuotes: uq.count || 0,
      });
    };

    const fetchRecent = async () => {
      const [c, r] = await Promise.all([
        supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      if (c.data) setRecentContacts(c.data);
      if (r.data) setRecentReviews(r.data);
    };

    fetchStats();
    fetchRecent();
  }, []);

  const cards = [
    { label: 'Services', value: stats.services, icon: Wrench, color: 'bg-blue-500', link: '/admin/services' },
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'bg-green-500', link: '/admin/projects' },
    { label: 'Reviews', value: stats.reviews, icon: Star, color: 'bg-yellow-500', badge: stats.pendingReviews > 0 ? `${stats.pendingReviews} pending` : undefined, link: '/admin/reviews' },
    { label: 'Contacts', value: stats.contacts, icon: MessageSquare, color: 'bg-purple-500', badge: stats.unreadContacts > 0 ? `${stats.unreadContacts} unread` : undefined, link: '/admin/contacts' },
    { label: 'Quote Requests', value: stats.quotes, icon: FileText, color: 'bg-orange-500', badge: stats.unreadQuotes > 0 ? `${stats.unreadQuotes} new` : undefined, link: '/admin/contacts' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to the Nickztech Construction admin panel.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card, i) => (
          <Link key={i} to={card.link} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              {card.badge && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{card.badge}</span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Messages</h3>
            <Link to="/admin/contacts" className="text-sm text-[#1F2F8F] hover:text-[#F5A623]">View All</Link>
          </div>
          <div className="divide-y">
            {recentContacts.length === 0 ? (
              <p className="p-5 text-gray-500 text-sm">No messages yet.</p>
            ) : (
              recentContacts.map(c => (
                <div key={c.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-gray-900 flex items-center gap-2">
                      {c.name}
                      {!c.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </p>
                    <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{c.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Reviews</h3>
            <Link to="/admin/reviews" className="text-sm text-[#1F2F8F] hover:text-[#F5A623]">View All</Link>
          </div>
          <div className="divide-y">
            {recentReviews.length === 0 ? (
              <p className="p-5 text-gray-500 text-sm">No reviews yet.</p>
            ) : (
              recentReviews.map(r => (
                <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm text-gray-900 flex items-center gap-2">
                      {r.client_name}
                      {!r.is_approved && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>}
                    </p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{r.review_text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
