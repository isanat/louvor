{
  "name": "DirectorVote",
  "type": "object",
  "properties": {
    "churchId": {
      "type": "string",
      "description": "ID da igreja onde a votação ocorre"
    },
    "voterId": {
      "type": "string",
      "description": "ID de quem votou"
    },
    "candidateId": {
      "type": "string",
      "description": "ID do diretor/candidato em questão"
    },
    "voteType": {
      "type": "string",
      "enum": [
        "revogar",
        "eleger"
      ],
      "description": "Tipo de voto"
    }
  },
  "required": [
    "churchId",
    "voterId",
    "candidateId",
    "voteType"
  ]
}