import React from "react";
import { Clock, CheckCircle } from "lucide-react";

export default function AguardandoAprovacao() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="clay-card p-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mb-6">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Cadastro Enviado!
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Seu cadastro foi enviado para o diretor de música da sua igreja. 
            Você receberá uma notificação assim que for aprovado.
          </p>

          <div className="bg-purple-50 p-6 rounded-2xl">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-purple-900 mb-1">Próximos passos</p>
                <p className="text-sm text-purple-700">
                  Enquanto aguarda, você pode completar seu perfil musical com vídeo de apresentação, 
                  instrumentos que toca e mais informações.
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Você receberá um email quando seu cadastro for aprovado
          </p>
        </div>
      </div>
    </div>
  );
}