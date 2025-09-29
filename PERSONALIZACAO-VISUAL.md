# 🎨 Personalização Visual - Pastifício Selmi

## 🏢 **Logo da Empresa**

### 📁 **Como Adicionar a Logo:**

1. **Salve a logo da empresa** com o nome `logo-selmi.png` na pasta do formulário
2. **Formatos aceitos:** PNG, JPG, JPEG ou SVG
3. **Tamanho recomendado:** 
   - **Largura máxima:** 300px
   - **Altura máxima:** 80px
   - **Proporção:** Mantenha a proporção original da logo

### 🔧 **Se usar outro nome de arquivo:**
Edite o arquivo `index.html`, linha que contém:
```html
<img src="logo-selmi.png" alt="Pastifício Selmi" class="company-logo">
```
E substitua `logo-selmi.png` pelo nome do seu arquivo.

---

## 🎨 **Cores da Empresa**

### 🔴 **Esquema Atual (Vermelho/Amarelo):**
```css
--primary-color: #d32f2f;        /* Vermelho principal */
--secondary-color: #b71c1c;      /* Vermelho escuro */
--accent-color: #ffeb3b;          /* Amarelo complementar */
```

### 📝 **Para Personalizar as Cores:**

1. **Abra o arquivo:** `styles.css`
2. **Encontre as variáveis** no topo do arquivo (linhas 2-12)
3. **Substitua os códigos de cor** pelos da sua empresa

### 🎯 **Exemplos de Esquemas de Cores:**

#### 🟢 **Verde/Branco (Tradicional Italiano):**
```css
--primary-color: #4caf50;        /* Verde */
--secondary-color: #388e3c;      /* Verde escuro */
--accent-color: #ffffff;         /* Branco */
```

#### 🔵 **Azul/Dourado:**
```css
--primary-color: #1976d2;        /* Azul */
--secondary-color: #0d47a1;      /* Azul escuro */
--accent-color: #ffc107;         /* Dourado */
```

#### 🟠 **Laranja/Marrom (Massa):**
```css
--primary-color: #ff9800;        /* Laranja */
--secondary-color: #f57c00;      /* Laranja escuro */
--accent-color: #795548;         /* Marrom */
```

---

## 📱 **Responsividade da Logo**

A logo se adapta automaticamente:
- **Desktop:** Tamanho máximo (300x80px)
- **Tablet:** Reduz proporcionalmente
- **Mobile:** Ajusta para caber na tela

---

## 🔧 **Customizações Avançadas**

### 📐 **Alterar Tamanho da Logo:**
No arquivo `styles.css`, modifique:
```css
.company-logo {
    max-height: 80px;     /* Altura máxima */
    max-width: 300px;     /* Largura máxima */
}
```

### 🎨 **Posicionamento da Logo:**
- **Centralizada:** (padrão atual)
- **À esquerda:** Adicione `justify-content: flex-start;` em `.logo-container`
- **À direita:** Adicione `justify-content: flex-end;` em `.logo-container`

---

## ✅ **Checklist de Personalização**

- [ ] Logo salva na pasta com nome correto
- [ ] Cores personalizadas no `styles.css`
- [ ] Teste em diferentes dispositivos
- [ ] Verificar contraste e legibilidade
- [ ] Confirmar identidade visual da empresa

---

## 🚀 **Resultado Final**

Após personalizar, o formulário terá:
- ✅ Logo da empresa no cabeçalho
- ✅ Cores da identidade visual
- ✅ Design profissional e coerente
- ✅ Responsividade mantida

**Envie-me as cores específicas da sua empresa ou coloque a logo na pasta para completar a personalização!** 🎯
