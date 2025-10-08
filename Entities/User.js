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
      phone: "(11) 99999-9999"
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
        phone: "(11) 99999-9999"
      },
      {
        id: "user-2",
        full_name: "Maria Santos",
        email: "maria@email.com",
        userType: "diretor",
        status: "aprovado",
        homeChurchId: "church-2",
        phone: "(11) 88888-8888"
      }
    ];
  }

  static async updateMyUserData(data) {
    // Simulação - substitua pela sua implementação real
    console.log("Atualizando dados do usuário:", data);
    return { success: true };
  }
}

