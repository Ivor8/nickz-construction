// yh
import React, { useEffect, useState } from 'react';
import { contactsAPI, quotesAPI } from '@/lib/api';
import type { Contact, QuoteRequest } from '@/lib/types';
import { Mail, FileText, Trash2, Eye, X, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'contacts' | 'quotes'>('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [c, q] = await Promise.all([
        contactsAPI.getAllAdmin(),
        quotesAPI.getAllAdmin(),
      ]);
      setContacts(c);
      setQuotes(q);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const markContactRead = async (contact: Contact) => {
    if (!contact.is_read) {
      await contactsAPI.markAsRead(contact.id);
    }
    setSelectedContact(contact);
  };

  const markQuoteRead = async (quote: QuoteRequest) => {
    if (!quote.is_read) {
      await quotesAPI.markAsRead(quote.id);
    }
    setSelectedQuote(quote);
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactsAPI.delete(id);
      toast({ title: 'Deleted' });
      setSelectedContact(null);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete contact', variant: 'destructive' });
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm('Delete this quote request?')) return;
    try {
      await quotesAPI.delete(id);
      toast({ title: 'Deleted' });
      setSelectedQuote(null);
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete quote', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages & Enquiries</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage contact messages and quote requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('contacts')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'contacts' ? 'bg-[#1F2F8F] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
          <Mail className="w-4 h-4" /> Contact Messages ({contacts.length})
        </button>
        <button onClick={() => setTab('quotes')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'quotes' ? 'bg-[#1F2F8F] text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}>
          <FileText className="w-4 h-4" /> Quote Requests ({quotes.length})
        </button>
      </div>

      {/* Contact Messages */}
      {tab === 'contacts' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Subject</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Message</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : contacts.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No messages yet.</td></tr>
                ) : (
                  contacts.map(c => (
                    <tr key={c.id} className={`hover:bg-gray-50 ${!c.is_read ? 'bg-blue-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className={`text-sm ${!c.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{c.name}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{c.subject || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell max-w-xs truncate">{c.message}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => markContactRead(c)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => deleteContact(c.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quote Requests */}
      {tab === 'quotes' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">From</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Details</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Timeline</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : quotes.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No quote requests yet.</td></tr>
                ) : (
                  quotes.map(q => (
                    <tr key={q.id} className={`hover:bg-gray-50 ${!q.is_read ? 'bg-orange-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <p className={`text-sm ${!q.is_read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{q.name}</p>
                        <p className="text-xs text-gray-500">{q.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">{q.project_details || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{q.timeline || '-'}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(q.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => markQuoteRead(q)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => deleteQuote(q.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Message from {selectedContact.name}</h3>
              <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-500">Email:</span> <a href={`mailto:${selectedContact.email}`} className="text-[#1F2F8F]">{selectedContact.email}</a></div>
              {selectedContact.phone && <div><span className="font-medium text-gray-500">Phone:</span> <a href={`tel:${selectedContact.phone}`} className="text-[#1F2F8F]">{selectedContact.phone}</a></div>}
              {selectedContact.subject && <div><span className="font-medium text-gray-500">Subject:</span> {selectedContact.subject}</div>}
              <div><span className="font-medium text-gray-500">Date:</span> {new Date(selectedContact.created_at).toLocaleString()}</div>
              <div className="pt-2 border-t">
                <span className="font-medium text-gray-500 block mb-1">Message:</span>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <a href={`mailto:${selectedContact.email}`} className="px-4 py-2 bg-[#1F2F8F] text-white rounded-lg text-sm font-medium hover:bg-[#2E3FBF] flex items-center gap-2">
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
              {selectedContact.phone && (
                <a href={`tel:${selectedContact.phone}`} className="px-4 py-2 border text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Quote from {selectedQuote.name}</h3>
              <button onClick={() => setSelectedQuote(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-gray-500">Email:</span> <a href={`mailto:${selectedQuote.email}`} className="text-[#1F2F8F]">{selectedQuote.email}</a></div>
              {selectedQuote.phone && <div><span className="font-medium text-gray-500">Phone:</span> {selectedQuote.phone}</div>}
              {selectedQuote.timeline && <div><span className="font-medium text-gray-500">Timeline:</span> {selectedQuote.timeline}</div>}
              {selectedQuote.budget_range && <div><span className="font-medium text-gray-500">Budget:</span> {selectedQuote.budget_range}</div>}
              <div><span className="font-medium text-gray-500">Date:</span> {new Date(selectedQuote.created_at).toLocaleString()}</div>
              <div className="pt-2 border-t">
                <span className="font-medium text-gray-500 block mb-1">Project Details:</span>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedQuote.project_details || 'No details provided.'}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <a href={`mailto:${selectedQuote.email}`} className="px-4 py-2 bg-[#1F2F8F] text-white rounded-lg text-sm font-medium hover:bg-[#2E3FBF] flex items-center gap-2">
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
