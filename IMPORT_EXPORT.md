# Sistema de Importação e Exportação de Estado

## 📝 Visão Geral

O sistema agora permite **salvar e restaurar o estado completo** do catálogo, incluindo:

- ✅ Todas as páginas
- ✅ Todas as seções (títulos, grades de produtos)
- ✅ Todos os produtos (com preços, imagens, estoque, etc.)
- ✅ Configurações globais (cores, logo, rodapé, etc.)

## 🚀 Como Usar

### Exportar Estado Completo

1. Acesse a aba **"Dados"** no painel lateral
2. Na seção **"Backup Completo"**, clique em **"Exportar JSON"**
3. Um arquivo `.json` será baixado com todo o estado atual do catálogo
4. Nome do arquivo: `catalogo_completo_YYYY-MM-DD.json`

**O que é exportado:**

```json
{
  "version": "1.0.0",
  "exportDate": "2025-11-22T17:50:00.000Z",
  "pages": [...],
  "globalSettings": {...}
}
```

### Importar Estado Completo

1. Acesse a aba **"Dados"** no painel lateral
2. Na seção **"Backup Completo"**, clique em **"Importar JSON"**
3. Selecione um arquivo `.json` previamente exportado
4. Revise as informações no modal de confirmação:
   - Número de páginas
   - Número de produtos
   - Data de exportação
5. Clique em **"Substituir Tudo"** para confirmar

⚠️ **ATENÇÃO:** A importação **substitui completamente** todo o conteúdo atual. Faça backup antes!

## 📊 Diferença entre Exportações

### Backup Completo (JSON)

- ✅ **Salva todo o estado** do catálogo
- ✅ Preserva estrutura de páginas e seções
- ✅ Mantém configurações globais
- ✅ Ideal para: backup, versionamento, migração

### Exportação CSV

- ✅ **Apenas lista de produtos**
- ✅ Compatível com planilhas
- ✅ Ideal para: edição em massa, compartilhamento de produtos

## 🔧 Funcionalidades Técnicas

### Componentes Criados

- `CatalogStateExport.tsx` - Exporta estado completo para JSON
- `CatalogStateImport.tsx` - Importa e valida estado de JSON
- `importCatalog()` - Método no store para substituir estado

### Validações na Importação

- ✅ Verifica estrutura do JSON
- ✅ Valida presença de páginas e configurações
- ✅ Confirma destruição de dados atuais
- ✅ Mostra preview do que será importado

## 💡 Casos de Uso

1. **Backup Regular**: Exporte antes de fazer mudanças grandes
2. **Versionamento**: Mantenha diferentes versões do catálogo
3. **Colaboração**: Compartilhe catálogos completos com a equipe
4. **Templates**: Crie modelos base para novos catálogos
5. **Restauração**: Volte a versões anteriores quando necessário

## 🎯 Próximos Passos Sugeridos

- [ ] Adicionar histórico de versões automático (LocalStorage)
- [ ] Implementar diff viewer para comparar estados
- [ ] Adicionar compressão para arquivos grandes
- [ ] Permitir importação parcial (ex: apenas produtos)
- [ ] Integração com cloud storage (Google Drive, Dropbox)
