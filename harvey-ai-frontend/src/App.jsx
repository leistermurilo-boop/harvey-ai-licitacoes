import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { 
  Star, 
  MessageCircle, 
  FileText, 
  BarChart3, 
  Settings, 
  Upload, 
  Send,
  User,
  Search,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  X
} from 'lucide-react'
import './App.css'

// Componente Header
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold">Harvey AI</h1>
            <Badge variant="secondary" className="bg-yellow-400 text-blue-900 font-semibold">
              Assistente Jurídico
            </Badge>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Dashboard
            </Button>
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Chat IA
            </Button>
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Casos
            </Button>
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Análise
            </Button>
            <Button variant="ghost" className="text-white hover:text-yellow-400">
              Configurações
            </Button>
          </nav>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-500">
              Entrar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-blue-800 pt-4">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="text-white hover:text-yellow-400 justify-start">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-400 justify-start">
                Chat IA
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-400 justify-start">
                Casos
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-400 justify-start">
                Análise
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-400 justify-start">
                Configurações
              </Button>
              <Button className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 mt-4">
                Entrar
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

// Componente Hero Section
function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="bg-yellow-400 text-blue-900 mb-6 text-sm font-semibold px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            Plataforma Jurídica Avançada
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            O Futuro dos
            <span className="text-yellow-400 block">Recursos Jurídicos</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Conectamos advogados e escritórios através de tecnologia avançada, IA e transparência total. 
            Simplificamos recursos e potencializamos oportunidades jurídicas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-500 px-8 py-4 text-lg font-semibold">
              <MessageCircle className="h-5 w-5 mr-2" />
              Começar Chat IA
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg">
              <FileText className="h-5 w-5 mr-2" />
              Ver Demonstração
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Componente Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-yellow-400" />,
      title: "IA Avançada",
      description: "Assistente inteligente para criação de recursos e análise de oportunidades com precisão"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-yellow-400" />,
      title: "Compliance Total",
      description: "Validação jurídica automática e conformidade com todas as normas brasileiras"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-yellow-400" />,
      title: "Alcance Nacional",
      description: "Conecte-se com oportunidades em todo território nacional com dados em tempo real"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Tecnologia que Transforma
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Recursos avançados para otimizar processos e garantir compliance
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-blue-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Componente Dashboard Stats
function DashboardStats() {
  const stats = [
    { label: "Casos Ativos", value: "24", icon: <FileText className="h-6 w-6" />, color: "text-blue-600" },
    { label: "Recursos Gerados", value: "156", icon: <CheckCircle className="h-6 w-6" />, color: "text-green-600" },
    { label: "Análises IA", value: "89", icon: <BarChart3 className="h-6 w-6" />, color: "text-yellow-600" },
    { label: "Taxa de Sucesso", value: "94%", icon: <Star className="h-6 w-6" />, color: "text-purple-600" }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className={`flex justify-center mb-2 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// Componente Chat Interface
function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Olá! Sou o Harvey, seu assistente jurídico especializado em licitações. Como posso ajudá-lo hoje?',
      timestamp: '10:30'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setInputMessage('')
      
      // Simular resposta do bot
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: 'Entendi sua solicitação. Vou analisar e fornecer uma resposta jurídica especializada em alguns instantes...',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Chat com Harvey IA
            </h2>
            <p className="text-gray-600">
              Converse com nosso assistente jurídico especializado
            </p>
          </div>
          
          <Card className="h-96">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite sua pergunta jurídica..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Componente Recent Cases
function RecentCases() {
  const cases = [
    {
      id: 1,
      number: "2024/001",
      title: "Licitação Obras Públicas - Prefeitura Municipal",
      status: "Em Andamento",
      date: "15/09/2024",
      priority: "Alta"
    },
    {
      id: 2,
      number: "2024/002", 
      title: "Pregão Eletrônico - Fornecimento de Equipamentos",
      status: "Concluído",
      date: "10/09/2024",
      priority: "Média"
    },
    {
      id: 3,
      number: "2024/003",
      title: "Concorrência Pública - Serviços de Consultoria",
      status: "Em Análise",
      date: "08/09/2024",
      priority: "Baixa"
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Em Andamento': return 'bg-blue-100 text-blue-800'
      case 'Concluído': return 'bg-green-100 text-green-800'
      case 'Em Análise': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-800'
      case 'Média': return 'bg-yellow-100 text-yellow-800'
      case 'Baixa': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">
                Casos Recentes
              </h2>
              <p className="text-gray-600">
                Acompanhe o status dos seus casos jurídicos
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Caso
            </Button>
          </div>
          
          <div className="grid gap-4">
            {cases.map((case_item) => (
              <Card key={case_item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {case_item.number}
                        </Badge>
                        <Badge className={getStatusColor(case_item.status)}>
                          {case_item.status}
                        </Badge>
                        <Badge className={getPriorityColor(case_item.priority)}>
                          {case_item.priority}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {case_item.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {case_item.date}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Componente Footer
function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-bold">Harvey AI</h3>
            </div>
            <p className="text-blue-100 text-sm">
              Seu assistente jurídico especializado em licitações públicas brasileiras.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#" className="hover:text-yellow-400">Chat IA</a></li>
              <li><a href="#" className="hover:text-yellow-400">Análise de Editais</a></li>
              <li><a href="#" className="hover:text-yellow-400">Gerenciamento de Casos</a></li>
              <li><a href="#" className="hover:text-yellow-400">Relatórios</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#" className="hover:text-yellow-400">Documentação</a></li>
              <li><a href="#" className="hover:text-yellow-400">Tutoriais</a></li>
              <li><a href="#" className="hover:text-yellow-400">FAQ</a></li>
              <li><a href="#" className="hover:text-yellow-400">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li><a href="#" className="hover:text-yellow-400">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-yellow-400">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-yellow-400">LGPD</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-100">
          <p>&copy; 2024 Harvey AI. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

// Componente Principal da Aplicação
function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DashboardStats />
      <ChatInterface />
      <RecentCases />
      <Footer />
    </div>
  )
}

export default App

