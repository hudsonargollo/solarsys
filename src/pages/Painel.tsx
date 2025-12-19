import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { safeGetAllLeads, safeUpdateLeadStatus } from '../lib/database'
import { handleSupabaseError } from '../lib/errors'
import type { AppError } from '../lib/errors'
import type { Lead } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { LoadingState, ErrorDisplay } from '../components/ui/LoadingSpinner'

export default function Painel() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<AppError | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [leadsError, setLeadsError] = useState<AppError | null>(null)
  const [sortField, setSortField] = useState<keyof Lead>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthError(handleSupabaseError(error))
        } else {
          setUser(session?.user || null)
          setAuthError(null)
        }
      } catch (error) {
        setAuthError(handleSupabaseError(error))
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (event === 'SIGNED_OUT') {
        setLeads([])
        setLeadsError(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load leads when authenticated
  useEffect(() => {
    if (user) {
      loadLeads()
    }
  }, [user])

  // Filter and sort leads
  useEffect(() => {
    let filtered = [...leads]

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(lead => 
        lead.name.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        lead.city.toLowerCase().includes(term) ||
        lead.whatsapp.includes(term)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      
      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1
      
      return sortDirection === 'desc' ? -comparison : comparison
    })

    setFilteredLeads(filtered)
  }, [leads, statusFilter, searchTerm, sortField, sortDirection])

  const loadLeads = async () => {
    setLeadsLoading(true)
    setLeadsError(null)
    
    try {
      const { data: leadsData, error } = await safeGetAllLeads()
      
      if (error) {
        setLeadsError(error)
      } else {
        setLeads(leadsData || [])
      }
    } catch (error) {
      console.error('Error loading leads:', error)
      setLeadsError(handleSupabaseError(error))
    } finally {
      setLeadsLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      setAuthError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/painel`
        }
      })
      if (error) {
        setAuthError(handleSupabaseError(error))
      }
    } catch (error) {
      console.error('Error logging in:', error)
      setAuthError(handleSupabaseError(error))
    }
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const { data: success, error } = await safeUpdateLeadStatus(leadId, newStatus)
      
      if (error) {
        console.error('Error updating lead status:', error)
        alert(error.message)
      } else if (success) {
        // Update local state
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        )
      } else {
        alert('Erro ao atualizar status do lead')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      alert('Erro inesperado ao atualizar status do lead')
    }
  }

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const getStatusBadge = (status: Lead['status']) => {
    const statusConfig = {
      new: { label: 'Novo', className: 'bg-blue-100 text-blue-800' },
      qualified: { label: 'Qualificado', className: 'bg-green-100 text-green-800' },
      whatsapp_clicked: { label: 'WhatsApp Clicado', className: 'bg-yellow-100 text-yellow-800' },
      contacted: { label: 'Contatado', className: 'bg-purple-100 text-purple-800' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    )
  }

  if (loading) {
    return (
      <LoadingState 
        loading={true} 
        loadingMessage="Carregando painel administrativo..."
        className="min-h-screen flex items-center justify-center"
      >
        <div />
      </LoadingState>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <ErrorDisplay error={authError} onRetry={() => window.location.reload()} />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-solarsys-green mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600 mb-8">
              Faça login para acessar o painel de leads
            </p>
            <Button 
              onClick={handleLogin}
              className="btn-solarsys-primary w-full"
            >
              Entrar com Google
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-solarsys-green">
                Painel Administrativo
              </h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {user.email}
              </p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="btn-solarsys-secondary"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">T</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Leads</p>
                <p className="text-2xl font-semibold text-gray-900">{leads.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Q</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Qualificados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leads.filter(l => l.status === 'qualified').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">W</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">WhatsApp Clicado</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leads.filter(l => l.status === 'whatsapp_clicked').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">C</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Contatados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {leads.filter(l => l.status === 'contacted').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-solarsys-green"
              >
                <option value="all">Todos os Status</option>
                <option value="new">Novo</option>
                <option value="qualified">Qualificado</option>
                <option value="whatsapp_clicked">WhatsApp Clicado</option>
                <option value="contacted">Contatado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, email, cidade ou telefone..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-solarsys-green"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={loadLeads}
                className="btn-solarsys-primary"
              >
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <LoadingState
            loading={leadsLoading}
            error={leadsError}
            onRetry={loadLeads}
            loadingMessage="Carregando leads..."
            className="p-8"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('created_at')}
                  >
                    Data {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    Nome {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('bill_value')}
                  >
                    Conta de Luz {sortField === 'bill_value' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    UTM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.whatsapp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.city}, {lead.state}</div>
                      <div className="text-sm text-gray-500">{lead.zip_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(lead.bill_value)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.connection_type === 'mono' ? 'Monofásico' : 
                         lead.connection_type === 'bi' ? 'Bifásico' : 'Trifásico'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.utm_source && (
                        <div className="space-y-1">
                          {lead.utm_source && <div>Fonte: {lead.utm_source}</div>}
                          {lead.utm_medium && <div>Meio: {lead.utm_medium}</div>}
                          {lead.utm_campaign && <div>Campanha: {lead.utm_campaign}</div>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value as Lead['status'])}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-solarsys-green"
                      >
                        <option value="new">Novo</option>
                        <option value="qualified">Qualificado</option>
                        <option value="whatsapp_clicked">WhatsApp Clicado</option>
                        <option value="contacted">Contatado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && !leadsLoading && !leadsError && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum lead encontrado</p>
            </div>
          )}
          </LoadingState>
        </div>
      </div>
    </div>
  )
}