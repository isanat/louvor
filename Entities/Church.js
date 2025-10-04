{
  "name": "Event",
  "type": "object",
  "properties": {
    "churchId": {
      "type": "string",
      "description": "ID da igreja"
    },
    "musicianId": {
      "type": "string",
      "description": "ID do músico convidado"
    },
    "musicianName": {
      "type": "string",
      "description": "Nome do músico (cache)"
    },
    "musicianEmail": {
      "type": "string",
      "description": "Email do músico (cache)"
    },
    "musicianPhone": {
      "type": "string",
      "description": "Telefone do músico (cache)"
    },
    "musicianWhatsapp": {
      "type": "string",
      "description": "WhatsApp do músico (cache)"
    },
    "directorId": {
      "type": "string",
      "description": "ID do diretor que convidou"
    },
    "directorName": {
      "type": "string",
      "description": "Nome do diretor (cache)"
    },
    "directorEmail": {
      "type": "string",
      "description": "Email do diretor (cache)"
    },
    "eventDate": {
      "type": "string",
      "format": "date-time",
      "description": "Data e hora do evento"
    },
    "eventType": {
      "type": "string",
      "enum": [
        "Culto Matinal",
        "Culto Vespertino",
        "Culto de Oração",
        "Evento Especial"
      ],
      "description": "Tipo de evento"
    },
    "status": {
      "type": "string",
      "enum": [
        "pendente",
        "confirmado",
        "recusado",
        "concluido",
        "cancelado_pelo_musico"
      ],
      "default": "pendente",
      "description": "Status do convite"
    },
    "directorNotes": {
      "type": "string",
      "description": "Observações do diretor"
    },
    "musicianNotes": {
      "type": "string",
      "description": "Resposta do músico"
    },
    "cancellationReason": {
      "type": "string",
      "description": "Motivo do cancelamento pelo músico"
    }
  },
  "required": [
    "churchId",
    "musicianId",
    "directorId",
    "eventDate"
  ]
}