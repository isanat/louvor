{
  "name": "Church",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome da igreja"
    },
    "address": {
      "type": "string",
      "description": "Endereço completo"
    },
    "city": {
      "type": "string",
      "description": "Cidade"
    },
    "state": {
      "type": "string",
      "description": "Estado"
    },
    "imageUrl": {
      "type": "string",
      "description": "URL da foto da igreja"
    },
    "directorId": {
      "type": "string",
      "description": "ID do diretor responsável"
    },
    "phone": {
      "type": "string",
      "description": "Telefone da igreja"
    },
    "pastorName": {
      "type": "string",
      "description": "Nome do pastor responsável"
    },
    "district": {
      "type": "string",
      "description": "Nome do distrito"
    }
  },
  "required": [
    "name",
    "city",
    "state"
  ]
}