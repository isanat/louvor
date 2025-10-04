{
  "name": "MusicianProfile",
  "type": "object",
  "properties": {
    "userId": {
      "type": "string",
      "description": "ID do usuário músico"
    },
    "bio": {
      "type": "string",
      "description": "Biografia do músico"
    },
    "videoUrl": {
      "type": "string",
      "description": "URL do vídeo de apresentação"
    },
    "vocalRange": {
      "type": "string",
      "enum": [
        "Soprano",
        "Contralto",
        "Tenor",
        "Barítono",
        "Baixo"
      ],
      "description": "Extensão vocal"
    },
    "instruments": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Lista de instrumentos que toca"
    },
    "yearsExperience": {
      "type": "number",
      "description": "Anos de experiência"
    }
  },
  "required": [
    "userId"
  ]
}