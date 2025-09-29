# Sistema de Formulário de Currículo

Este é um sistema completo de formulário HTML/CSS/JS para coleta de dados de currículo, baseado nas especificações fornecidas.

## 📋 Funcionalidades

### ✅ Dados Coletados
- **Informações da vaga**: Candidatura para vaga específica
- **Dados pessoais**: Nome, endereço, CPF, RG, data de nascimento, etc.
- **Contato**: WhatsApp, parentes na empresa
- **Escolaridade**: Nível de formação
- **Experiência profissional**: Até 3 experiências anteriores
- **Cursos adicionais**: Até 3 cursos complementares
- **Disponibilidade**: Turnos de trabalho disponíveis

### 🎨 Características do Design
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Moderno**: Interface clean e profissional
- **Intuitivo**: Navegação fácil e campos bem organizados
- **Validação**: Validação em tempo real dos dados
- **Máscaras**: Formatação automática para CPF, telefone, etc.

### 🔧 Funcionalidades Técnicas
- Validação de CPF
- Máscaras para campos de documento e telefone
- Campos condicionais (aparecem conforme seleção)
- Salvamento automático no localStorage
- Validação em tempo real
- Feedback visual para campos válidos/inválidos
- Responsividade completa

## 📁 Arquivos do Sistema

- `index.html` - Estrutura HTML do formulário
- `styles.css` - Estilos e responsividade
- `script.js` - Funcionalidades JavaScript e validações

## 🚀 Como Usar

1. **Abrir o formulário**: Abra o arquivo `index.html` em um navegador web
2. **Preencher dados**: Complete os campos obrigatórios (marcados com *)
3. **Validação automática**: Os campos são validados conforme você digita
4. **Enviar**: Clique em "Enviar Currículo" para submeter os dados

## 🎯 Campos Obrigatórios

- Nome completo
- Endereço completo
- CPF
- Número do RG
- Cidade onde o RG foi emitido
- Data de nascimento
- Cidade e estado de nascimento
- Estado civil
- Nome da mãe
- WhatsApp para contato
- Escolaridade
- Pelo menos uma opção de disponibilidade

## 🔄 Integração com Backend

Para integrar com um sistema backend, modifique a função `handleFormSubmit()` no arquivo `script.js`:

```javascript
// Exemplo de integração
fetch('/api/submit-curriculum', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
})
.then(response => response.json())
.then(data => {
    showSuccessMessage();
})
.catch(error => {
    showErrorMessage();
});
```

## 📱 Responsividade

O formulário é totalmente responsivo e funciona bem em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🎨 Personalização

### Cores
As cores principais podem ser alteradas no arquivo `styles.css`:
- Cor primária: `#3498db` (azul)
- Cor secundária: `#2c3e50` (azul escuro)
- Cor de fundo: Gradiente `#667eea` para `#764ba2`

### Layout
O layout é baseado em CSS Grid e Flexbox, facilitando adaptações.

## 🔧 Recursos Técnicos

- **CSS Grid**: Layout responsivo dos campos
- **Flexbox**: Alinhamento e distribuição de elementos
- **JavaScript vanilla**: Sem dependências externas
- **LocalStorage**: Salvamento automático do progresso
- **Validação HTML5**: Campos obrigatórios e tipos
- **Validação customizada**: CPF, telefone, etc.

## 📋 Lista de Validações

1. **CPF**: Validação matemática completa
2. **Campos obrigatórios**: Verificação de preenchimento
3. **Disponibilidade**: Pelo menos uma opção deve ser selecionada
4. **Formatação**: Máscaras automáticas para documentos e telefone

## 🎯 Próximos Passos

Para usar em produção, considere:
1. Integração com backend para persistir dados
2. Envio por email dos dados coletados
3. Geração de PDF do currículo
4. Sistema de notificações
5. Painel administrativo para visualizar currículos

## 📞 Suporte

Este sistema foi desenvolvido para ser simples de usar e manter. Para customizações adicionais, consulte os comentários no código-fonte.