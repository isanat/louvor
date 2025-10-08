// Entidade User para gerenciamento de usuários
export class User {
  static async me() {
    // Simulação - substitua pela sua implementação real
    return {
      id: "user-1",
      full_name: "João Silva",
      email: "joao@email.com",
      userType: "musico", // ou "diretor"
      status: "aprovado", // ou "pendente_aprovacao"
      homeChurchId: "church-1",
      phone: "(11) 99999-9999",
      whatsappNumber: "5511999999999",
      cancellationCount: 0, // Contador de cancelamentos
      profileImageUrl: null,
      createdAt: new Date().toISOString()
    };
  }

  static async list() {
    // Simulação - substitua pela sua implementação real
    return [
      {
        id: "user-1",
        full_name: "João Silva",
        email: "joao@email.com",
        userType: "musico",
        status: "aprovado",
        homeChurchId: "church-1",
        phone: "(11) 99999-9999",
        whatsappNumber: "5511999999999",
        cancellationCount: 0,
        profileImageUrl: null
      },
      {
        id: "user-2",
        full_name: "Maria Santos",
        email: "maria@email.com",
        userType: "diretor",
        status: "aprovado",
        homeChurchId: "church-2",
        phone: "(11) 88888-8888",
        whatsappNumber: "5511888888888",
        cancellationCount: 0,
        profileImageUrl: null
      }
    ];
  }

  static async updateMyUserData(data) {
    // Simulação - substitua pela sua implementação real
    console.log("Atualizando dados do usuário:", data);
    return { success: true };
  }

  static async create(data) {
    // Simulação - substitua pela sua implementação real
    console.log("Criando usuário:", data);
    return { 
      success: true, 
      user: { 
        id: "user-new", 
        ...data, 
        status: data.userType === "musico" ? "pendente_aprovacao" : "aprovado",
        cancellationCount: 0
      } 
    };
  }

  static async incrementCancellationCount(userId) {
    // Simulação - substitua pela sua implementação real
    console.log("Incrementando contador de cancelamento para usuário:", userId);
    return { success: true };
  }

  static async getUsersByChurch(churchId) {
    // Simulação - substitua pela sua implementação real
    return [
      {
        id: "user-1",
        full_name: "João Silva",
        email: "joao@email.com",
        userType: "musico",
        status: "aprovado",
        homeChurchId: churchId,
        phone: "(11) 99999-9999",
        whatsappNumber: "5511999999999",
        cancellationCount: 0
      }
    ];
  }

  static async getPendingApprovals(churchId) {
    // Simulação - substitua pela sua implementação real
    return [
      {
        id: "user-pending",
        full_name: "Novo Músico",
        email: "novo@email.com",
        userType: "musico",
        status: "pendente_aprovacao",
        homeChurchId: churchId,
        phone: "(11) 77777-7777",
        whatsappNumber: "5511777777777",
        cancellationCount: 0
      }
    ];
  }
}

