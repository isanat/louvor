// Mapeamento de nomes de páginas para URLs
const PAGE_ROUTES = {
  // Comum
  SelecaoPerfil: '/selecao-perfil',
  
  // Músico
  DashboardMusico: '/musico/dashboard',
  AgendaMusico: '/musico/agenda',
  PerfilMusico: '/musico/perfil',
  CadastroMusico: '/musico/cadastro',
  AguardandoAprovacao: '/musico/aguardando',
  
  // Diretor
  DashboardDiretor: '/diretor/dashboard',
  BuscarMusicos: '/diretor/buscar',
  PerfilMusicoView: '/diretor/perfil-musico',
  AprovarMusicos: '/diretor/aprovar',
  MinhaIgreja: '/diretor/igreja',
  PerfilDiretor: '/diretor/perfil',
  
  // Compartilhadas
  VotacaoDiretor: '/votacao',
  HistoricoEventos: '/historico',
  Estatisticas: '/estatisticas'
};

/**
 * Cria URL de página baseada no nome
 * @param {string} pageName - Nome da página (ex: "DashboardMusico")
 * @returns {string} - URL da página
 */
export const createPageUrl = (pageName) => {
  return PAGE_ROUTES[pageName] || '/';
};

/**
 * Formata número de telefone brasileiro
 * @param {string} phone - Número de telefone
 * @returns {string} - Telefone formatado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Valida email
 * @param {string} email - Email para validar
 * @returns {boolean} - true se válido
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Combina classes CSS (utilitário tipo clsx)
 * @param  {...any} classes - Classes para combinar
 * @returns {string} - String de classes combinadas
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
