// Variáveis globais para controlar contadores
let experienceCounter = 1;
let courseCounter = 1;

// Função para mostrar/ocultar campo da vaga
function toggleVagaField() {
    const vagaEspecifica = document.querySelector('input[name="vaga_especifica"]:checked');
    const vagaField = document.getElementById('vagaField');
    
    if (vagaEspecifica && vagaEspecifica.value === 'sim') {
        vagaField.style.display = 'block';
        document.getElementById('qual_vaga').required = true;
    } else {
        vagaField.style.display = 'none';
        document.getElementById('qual_vaga').required = false;
        document.getElementById('qual_vaga').value = '';
    }
}

// Função para mostrar/ocultar campo do parente
function toggleParenteField() {
    const parenteEmpresa = document.querySelector('input[name="parente_empresa"]:checked');
    const parenteField = document.getElementById('parenteField');
    
    if (parenteEmpresa && parenteEmpresa.value === 'sim') {
        parenteField.style.display = 'block';
        document.getElementById('nome_parente').required = true;
    } else {
        parenteField.style.display = 'none';
        document.getElementById('nome_parente').required = false;
        document.getElementById('nome_parente').value = '';
    }
}

// Máscaras para campos
function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

function formatPhone(phone) {
    phone = phone.replace(/\D/g, '');
    phone = phone.replace(/(\d{2})(\d)/, '($1) $2');
    phone = phone.replace(/(\d{5})(\d)/, '$1-$2');
    return phone;
}

function formatPIS(pis) {
    pis = pis.replace(/\D/g, '');
    pis = pis.replace(/(\d{3})(\d)/, '$1.$2');
    pis = pis.replace(/(\d{5})(\d)/, '$1.$2');
    pis = pis.replace(/(\d{2})(\d{1})$/, '$1-$2');
    return pis;
}

// Aplicar máscaras aos campos
document.addEventListener('DOMContentLoaded', function() {
    const cpfField = document.getElementById('cpf');
    const whatsappField = document.getElementById('whatsapp');
    const pisField = document.getElementById('pis');

    if (cpfField) {
        cpfField.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }

    if (whatsappField) {
        whatsappField.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }

    if (pisField) {
        pisField.addEventListener('input', function(e) {
            e.target.value = formatPIS(e.target.value);
        });
    }
});

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// Validação em tempo real
function setupValidation() {
    const form = document.getElementById('curriculumForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Validação básica de campo obrigatório
    if (field.required && !value) {
        isValid = false;
    }
    
    // Validações específicas
    if (field.id === 'cpf' && value) {
        isValid = validarCPF(value);
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    // Aplicar classes de validação
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
    }
    
    return isValid;
}

// Função para limpar o formulário
function clearForm() {
    if (confirm('Tem certeza que deseja limpar todos os dados do formulário?')) {
        const form = document.getElementById('curriculumForm');
        form.reset();
        
        // Limpar classes de validação
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
        
        // Ocultar campos condicionais
        document.getElementById('vagaField').style.display = 'none';
        document.getElementById('parenteField').style.display = 'none';
        
        // Remover required dos campos condicionais
        document.getElementById('qual_vaga').required = false;
        document.getElementById('nome_parente').required = false;
        
        // Remover experiências e cursos adicionais (manter apenas os 3 primeiros)
        removeExtraItems('experience');
        removeExtraItems('course');
    }
}

// Função para coletar dados do formulário
function collectFormData() {
    const form = document.getElementById('curriculumForm');
    const formData = new FormData(form);
    const data = {};
    
    // Dados básicos
    for (let [key, value] of formData.entries()) {
        if (key.endsWith('[]')) {
            // Para checkboxes múltiplos (disponibilidade)
            const cleanKey = key.replace('[]', '');
            if (!data[cleanKey]) {
                data[cleanKey] = [];
            }
            data[cleanKey].push(value);
        } else {
            data[key] = value;
        }
    }
    
    // Organizar experiências em array
    const experiences = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach((item, index) => {
        const id = item.id.split('-')[1];
        const empresa = form.querySelector(`[name="exp${id}_empresa"]`)?.value || '';
        const entrada = form.querySelector(`[name="exp${id}_entrada"]`)?.value || '';
        const saida = form.querySelector(`[name="exp${id}_saida"]`)?.value || '';
        const funcoes = form.querySelector(`[name="exp${id}_funcoes"]`)?.value || '';
        
        if (empresa || entrada || saida || funcoes) {
            experiences.push({
                numero: index + 1,
                empresa,
                entrada,
                saida,
                funcoes
            });
        }
    });
    
    // Organizar cursos em array
    const courses = [];
    const courseItems = document.querySelectorAll('.course-item');
    courseItems.forEach((item, index) => {
        const id = item.id.split('-')[1];
        const instituicao = form.querySelector(`[name="curso${id}_instituicao"]`)?.value || '';
        const nome = form.querySelector(`[name="curso${id}_nome"]`)?.value || '';
        const anoCarga = form.querySelector(`[name="curso${id}_ano_carga"]`)?.value || '';
        
        if (instituicao || nome || anoCarga) {
            courses.push({
                numero: index + 1,
                instituicao,
                nome,
                anoCarga
            });
        }
    });
    
    // Adicionar arrays organizados aos dados
    data.experiencias = experiences;
    data.cursos = courses;
    
    return data;
}

// Função para enviar o formulário
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('curriculumForm');
    const fields = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    // Validar todos os campos
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Validar disponibilidade (pelo menos uma opção deve ser selecionada)
    const disponibilidade = form.querySelectorAll('input[name="disponibilidade[]"]:checked');
    if (disponibilidade.length === 0) {
        alert('Por favor, selecione pelo menos uma opção de disponibilidade de horário.');
        isFormValid = false;
    }
    
    if (!isFormValid) {
        alert('Por favor, corrija os campos destacados em vermelho antes de enviar.');
        return false;
    }
    
    // Coletar dados
    const formData = collectFormData();
    
    // Mostrar loading
    showLoadingState(true);
    
    // Gerar PDF e enviar para WhatsApp
    setTimeout(() => {
        generatePDFAndSendWhatsApp(formData);
        showLoadingState(false);
    }, 1000);
    
    return false;
}

// Função para mostrar estado de carregamento
function showLoadingState(isLoading) {
    const form = document.getElementById('curriculumForm');
    const submitBtn = form.querySelector('.btn-primary');
    
    if (isLoading) {
        form.classList.add('form-loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
    } else {
        form.classList.remove('form-loading');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Currículo';
    }
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
    // Criar elemento de mensagem se não existir
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        document.querySelector('.container').insertBefore(successMsg, document.querySelector('.curriculum-form'));
    }
    
    successMsg.innerHTML = `
        <strong>Sucesso!</strong> Seu currículo foi enviado com sucesso. 
        Entraremos em contato em breve. Obrigado!
    `;
    successMsg.style.display = 'block';
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Ocultar após 5 segundos
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 5000);
}

// Função para mostrar mensagem de erro
function showErrorMessage() {
    let errorMsg = document.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        document.querySelector('.container').insertBefore(errorMsg, document.querySelector('.curriculum-form'));
    }
    
    errorMsg.innerHTML = `
        <strong>Erro!</strong> Ocorreu um problema ao enviar seu currículo. 
        Por favor, tente novamente.
    `;
    errorMsg.style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 5000);
}

// Função para adicionar nova experiência
function addExperience() {
    experienceCounter++;
    const container = document.getElementById('experienceContainer');
    
    const newExperience = document.createElement('div');
    newExperience.className = 'experience-item new-item';
    newExperience.id = `experience-${experienceCounter}`;
    
    newExperience.innerHTML = `
        <div class="item-header">
            <h3>Experiência ${experienceCounter}</h3>
            <button type="button" class="btn-remove" onclick="removeExperience(${experienceCounter})">
                <span class="minus-icon">×</span>
            </button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="exp${experienceCounter}_empresa">Nome da empresa</label>
                <input type="text" id="exp${experienceCounter}_empresa" name="exp${experienceCounter}_empresa" placeholder="Nome da empresa">
            </div>
            <div class="form-group">
                <label for="exp${experienceCounter}_entrada">Mês e ano de entrada</label>
                <input type="month" id="exp${experienceCounter}_entrada" name="exp${experienceCounter}_entrada">
            </div>
            <div class="form-group">
                <label for="exp${experienceCounter}_saida">Mês e ano de saída</label>
                <input type="month" id="exp${experienceCounter}_saida" name="exp${experienceCounter}_saida">
            </div>
        </div>
        <div class="form-group">
            <label for="exp${experienceCounter}_funcoes">Cargo e funções exercidas (mínimo 3)</label>
            <textarea id="exp${experienceCounter}_funcoes" name="exp${experienceCounter}_funcoes" placeholder="Descreva o cargo e pelo menos 3 funções que você exercia..."></textarea>
        </div>
    `;
    
    container.appendChild(newExperience);
    updateRemoveButtons('experience');
    
    // Configurar validação para os novos campos
    setupValidationForNewFields(newExperience);
    
    // Scroll para o novo item
    newExperience.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para remover experiência
function removeExperience(id) {
    const element = document.getElementById(`experience-${id}`);
    if (element) {
        element.remove();
        updateRemoveButtons('experience');
    }
}

// Função para adicionar novo curso
function addCourse() {
    courseCounter++;
    const container = document.getElementById('coursesContainer');
    
    const newCourse = document.createElement('div');
    newCourse.className = 'course-item new-item';
    newCourse.id = `course-${courseCounter}`;
    
    newCourse.innerHTML = `
        <div class="item-header">
            <h3>Curso Adicional ${courseCounter}</h3>
            <button type="button" class="btn-remove" onclick="removeCourse(${courseCounter})">
                <span class="minus-icon">×</span>
            </button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="curso${courseCounter}_instituicao">Nome da instituição</label>
                <input type="text" id="curso${courseCounter}_instituicao" name="curso${courseCounter}_instituicao" placeholder="Nome da instituição">
            </div>
            <div class="form-group">
                <label for="curso${courseCounter}_nome">Nome do curso</label>
                <input type="text" id="curso${courseCounter}_nome" name="curso${courseCounter}_nome" placeholder="Nome do curso">
            </div>
            <div class="form-group">
                <label for="curso${courseCounter}_ano_carga">Ano e carga horária</label>
                <input type="text" id="curso${courseCounter}_ano_carga" name="curso${courseCounter}_ano_carga" placeholder="Ex: 2023 - 40h">
            </div>
        </div>
    `;
    
    container.appendChild(newCourse);
    updateRemoveButtons('course');
    
    // Configurar validação para os novos campos
    setupValidationForNewFields(newCourse);
    
    // Scroll para o novo item
    newCourse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função para remover curso
function removeCourse(id) {
    const element = document.getElementById(`course-${id}`);
    if (element) {
        element.remove();
        updateRemoveButtons('course');
    }
}

// Função para atualizar visibilidade dos botões de remover
function updateRemoveButtons(type) {
    const container = type === 'experience' ? 'experienceContainer' : 'coursesContainer';
    const items = document.getElementById(container).children;
    
    // Mostrar botões de remover apenas se houver mais de 1 item
    for (let i = 0; i < items.length; i++) {
        const removeBtn = items[i].querySelector('.btn-remove');
        if (removeBtn) {
            removeBtn.style.display = items.length > 1 ? 'flex' : 'none';
        }
    }
}

// Função para configurar validação em novos campos
function setupValidationForNewFields(container) {
    const inputs = container.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Setup da validação
    setupValidation();
    
    // Configurar submit do formulário
    const form = document.getElementById('curriculumForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Animação suave para seções
    const sections = document.querySelectorAll('.form-section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Inicializar botões de remover
    updateRemoveButtons('experience');
    updateRemoveButtons('course');
    
    console.log('Formulário de currículo inicializado com sucesso!');
});

// Função para salvar progresso no localStorage
function saveProgress() {
    const formData = collectFormData();
    localStorage.setItem('curriculum-progress', JSON.stringify(formData));
}

// Função para carregar progresso do localStorage
function loadProgress() {
    const savedData = localStorage.getItem('curriculum-progress');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            const form = document.getElementById('curriculumForm');
            
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        if (Array.isArray(data[key])) {
                            data[key].forEach(value => {
                                const option = form.querySelector(`[name="${key}"][value="${value}"]`);
                                if (option) option.checked = true;
                            });
                        } else {
                            const option = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                            if (option) option.checked = true;
                        }
                    } else {
                        field.value = data[key];
                    }
                }
            });
            
            // Atualizar campos condicionais
            toggleVagaField();
            toggleParenteField();
        } catch (e) {
            console.log('Erro ao carregar progresso salvo:', e);
        }
    }
}

// Função para remover itens extras ao limpar formulário
function removeExtraItems(type) {
    const container = type === 'experience' ? 'experienceContainer' : 'coursesContainer';
    const items = document.getElementById(container).children;
    
    // Remove todos os itens além do primeiro
    while (items.length > 1) {
        items[items.length - 1].remove();
    }
    
    // Resetar contador
    if (type === 'experience') {
        experienceCounter = 1;
    } else {
        courseCounter = 1;
    }
    
    updateRemoveButtons(type);
}

// Função para gerar PDF e enviar para WhatsApp
function generatePDFAndSendWhatsApp(formData) {
    try {
        // Criar novo documento PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurações
        const margin = 20;
        const lineHeight = 7;
        let currentY = margin;
        
        // Função para adicionar texto com quebra de linha
        function addText(text, fontSize = 12, isBold = false) {
            if (isBold) {
                doc.setFont('helvetica', 'bold');
            } else {
                doc.setFont('helvetica', 'normal');
            }
            doc.setFontSize(fontSize);
            
            const lines = doc.splitTextToSize(text, 170);
            doc.text(lines, margin, currentY);
            currentY += lines.length * lineHeight;
            
            return currentY;
        }
        
        // Cabeçalho
        addText('PASTIFÍCIO SELMI', 16, true);
        addText('Formulário de Candidato', 14, true);
        currentY += 10;
        
        // Dados pessoais
        addText('DADOS PESSOAIS', 14, true);
        addText(`Nome: ${formData.nome_completo || 'Não informado'}`);
        addText(`CPF: ${formData.cpf || 'Não informado'}`);
        addText(`RG: ${formData.rg || 'Não informado'} - ${formData.cidade_rg || 'Não informado'}`);
        addText(`Data de Nascimento: ${formData.data_nascimento || 'Não informado'}`);
        addText(`Estado Civil: ${formData.estado_civil || 'Não informado'}`);
        addText(`Endereço: ${formData.endereco || 'Não informado'}`);
        addText(`Cidade/Estado de Nascimento: ${formData.cidade_nascimento || 'Não informado'}`);
        addText(`WhatsApp: ${formData.whatsapp || 'Não informado'}`);
        addText(`PIS: ${formData.pis || 'Não informado'}`);
        currentY += 5;
        
        // Filiação
        addText('FILIAÇÃO', 14, true);
        addText(`Pai: ${formData.nome_pai || 'Não informado'}`);
        addText(`Mãe: ${formData.nome_mae || 'Não informado'}`);
        currentY += 5;
        
        // Escolaridade
        addText('ESCOLARIDADE', 14, true);
        addText(`Nível: ${formData.escolaridade || 'Não informado'}`);
        currentY += 5;
        
        // Vaga
        if (formData.vaga_especifica === 'sim') {
            addText('VAGA DE INTERESSE', 14, true);
            addText(`Vaga: ${formData.qual_vaga || 'Não especificada'}`);
            currentY += 5;
        }
        
        // Experiências
        if (formData.experiencias && formData.experiencias.length > 0) {
            addText('EXPERIÊNCIA PROFISSIONAL', 14, true);
            formData.experiencias.forEach((exp, index) => {
                if (exp.empresa || exp.funcoes) {
                    addText(`${index + 1}. ${exp.empresa || 'Empresa não informada'}`, 12, true);
                    addText(`   Período: ${exp.entrada || 'Não informado'} até ${exp.saida || 'Atual'}`);
                    addText(`   Funções: ${exp.funcoes || 'Não informado'}`);
                    currentY += 3;
                }
            });
        }
        
        // Nova página se necessário
        if (currentY > 250) {
            doc.addPage();
            currentY = margin;
        }
        
        // Cursos
        if (formData.cursos && formData.cursos.length > 0) {
            addText('CURSOS ADICIONAIS', 14, true);
            formData.cursos.forEach((curso, index) => {
                if (curso.nome || curso.instituicao) {
                    addText(`${index + 1}. ${curso.nome || 'Curso não informado'}`, 12, true);
                    addText(`   Instituição: ${curso.instituicao || 'Não informada'}`);
                    addText(`   Ano/Carga: ${curso.anoCarga || 'Não informado'}`);
                    currentY += 3;
                }
            });
        }
        
        // Disponibilidade
        if (formData.disponibilidade && formData.disponibilidade.length > 0) {
            addText('DISPONIBILIDADE DE HORÁRIO', 14, true);
            const turnos = {
                'turno_a': 'Turno A (06h às 14:20h)',
                'turno_b': 'Turno B (14:20h às 22:35h)',
                'turno_c': 'Turno C (22:35h às 06:00h)',
                'turno_comercial': 'Turno Comercial (segunda à sábado)'
            };
            formData.disponibilidade.forEach(turno => {
                addText(`• ${turnos[turno] || turno}`);
            });
        }
        
        // Parente na empresa
        if (formData.parente_empresa === 'sim') {
            currentY += 5;
            addText('PARENTE/CONHECIDO NA EMPRESA', 14, true);
            addText(`Nome: ${formData.nome_parente || 'Não informado'}`);
        }
        
        // Rodapé
        currentY += 10;
        addText(`Data de envio: ${new Date().toLocaleDateString('pt-BR')}`, 10);
        
        // Gerar o PDF como string base64
        const pdfData = doc.output('datauristring');
        
        // Criar mensagem para WhatsApp
        const nomeCandidate = formData.nome_completo || 'Candidato';
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const contatoCandidate = formData.whatsapp || 'Nao informado';
        
        const whatsappMessage = `PASTIFICIO SELMI - Novo Curriculo

Nome: ${nomeCandidate}
Data: ${dataAtual}
Contato: ${contatoCandidate}

Curriculo em PDF anexo.

Enviado pelo formulario online.`;
        
        // Gerar nome do arquivo
        const fileName = `Curriculo_${nomeCandidate.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Detectar se é dispositivo móvel
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Fazer download do PDF primeiro
        doc.save(fileName);
        
        // Aguardar um pouco para garantir que o download começou
        setTimeout(() => {
            // Criar link do WhatsApp
            const phoneNumber = '5519971238643'; // Número do WhatsApp (Brasil + Área + Número)
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            
            // Mostrar instruções ANTES de abrir o WhatsApp
            showWhatsAppInstructions(fileName, whatsappURL, isMobile, doc);
        }, 2000);
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        showErrorMessage();
    }
}

// Função para gerar conteúdo mobile reorganizado
function generateMobileContent(fileName, whatsappURL) {
    const candidateName = fileName.replace('Curriculo_', '').replace(/_.*/, '').replace(/_/g, ' ');
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    return `
        <div class="instruction-header">
            <span class="whatsapp-logo">📱</span>
            <strong>Currículo Pronto! Envie pelo WhatsApp</strong>
        </div>
        
        <div class="instruction-content">
            <p><strong>✅ PDF gerado com sucesso:</strong> <code>${fileName}</code></p>
            
            <!-- Mensagem principal do WhatsApp primeiro -->
            <div class="whatsapp-main-section">
                <div class="whatsapp-message-preview">
                    <h3>📱 Mensagem que será enviada:</h3>
                    <div class="message-box">
                        <strong>PASTIFICIO SELMI - Novo Curriculo</strong><br><br>
                        Nome: <em>${candidateName}</em><br>
                        Data: <em>${currentDate}</em><br>
                        Contato: <em>Seu WhatsApp</em><br><br>
                        📎 Curriculo em PDF anexo.<br><br>
                        <small>Enviado pelo formulario online.</small>
                    </div>
                </div>
                
                <div class="whatsapp-actions">
                    <button onclick="openWhatsAppNow('${whatsappURL}')" class="btn-whatsapp-main">
                        📱 Enviar pelo WhatsApp Agora
                    </button>
                    
                    <div class="save-section">
                        <p><strong>💾 Precisa salvar o currículo antes?</strong></p>
                        <button onclick="downloadPDFAgain('${fileName}')" class="btn-save-curriculum">
                            📂 Salvar Currículo no Celular
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Opção alternativa (WhatsApp Web) -->
            <div class="alternative-option">
                <details>
                    <summary><strong>🌐 Alternativa: Usar WhatsApp Web no Computador</strong></summary>
                    <div class="web-option-content">
                        <p>Se preferir usar o WhatsApp Web:</p>
                        <ol>
                            <li>Clique no botão abaixo para abrir WhatsApp Web</li>
                            <li>Anexe o PDF da pasta Downloads</li>
                            <li>Envie para o Pastifício Selmi</li>
                        </ol>
                        <button onclick="openWhatsAppWeb('${whatsappURL}')" class="btn-web">
                            🌐 Abrir WhatsApp Web
                        </button>
                    </div>
                </details>
            </div>
            
            <div class="instruction-footer">
                <button onclick="closeInstructions()" class="btn-close">
                    ❌ Fechar
                </button>
            </div>
        </div>
    `;
}

// Função para mostrar instruções detalhadas do WhatsApp
function showWhatsAppInstructions(fileName, whatsappURL, isMobile, pdfDoc) {
    // Remover mensagem anterior se existir
    const existingMsg = document.querySelector('.whatsapp-instructions');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Criar nova mensagem de instruções
    const instructionsMsg = document.createElement('div');
    instructionsMsg.className = 'whatsapp-instructions';
    
    // Conteúdo diferente para mobile e desktop
    const mobileContent = `
        <div class="instruction-header">
            <span class="whatsapp-logo">📱</span>
            <strong>Currículo Pronto! Envie pelo WhatsApp</strong>
        </div>
        
        <div class="instruction-content">
            <p><strong>✅ PDF gerado com sucesso:</strong> <code>${fileName}</code></p>
            
            <!-- Mensagem principal do WhatsApp primeiro -->
            <div class="whatsapp-main-section">
                <div class="mobile-option">
                    <div class="option-header">
                        <span class="option-icon">📱</span>
                        <strong>Opção 1: Enviar pelo Celular</strong>
                    </div>
                    <div class="option-steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <span class="step-text">Baixe o PDF novamente no celular</span>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <span class="step-text">Abra o WhatsApp</span>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <span class="step-text">Anexe o PDF e envie</span>
                        </div>
                    </div>
                    <div class="mobile-buttons">
                        <button onclick="downloadPDFAgain('${fileName}')" class="btn-download">
                            � Salvar PDF Onde Quiser
                        </button>
                        <button onclick="openWhatsAppNow('${whatsappURL}')" class="btn-whatsapp">
                            📱 Abrir WhatsApp
                        </button>
                    </div>
                </div>
                
                <div class="mobile-option">
                    <div class="option-header">
                        <span class="option-icon">💻</span>
                        <strong>Opção 2: Enviar pelo Computador</strong>
                    </div>
                    <div class="option-steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <span class="step-text">Abra o WhatsApp Web no computador</span>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <span class="step-text">Anexe o PDF da pasta Downloads</span>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <span class="step-text">Envie para o Pastifício Selmi</span>
                        </div>
                    </div>
                    <div class="mobile-buttons">
                        <button onclick="openWhatsAppWeb('${whatsappURL}')" class="btn-web">
                            🌐 Abrir WhatsApp Web
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="instruction-footer">
                <button onclick="closeInstructions()" class="btn-close">
                    ❌ Fechar
                </button>
            </div>
        </div>
    `;
    
    const desktopContent = `
        <div class="instruction-header">
            <span class="whatsapp-logo">📱</span>
            <strong>PDF Pronto! Leia as Instruções Antes de Enviar</strong>
        </div>
        
        <div class="instruction-content">
            <p><strong>✅ PDF baixado com sucesso:</strong> <code>${fileName}</code></p>
            <p><strong>📍 Localização:</strong> Pasta Downloads do seu computador</p>
            
            <div class="steps">
                <div class="step">
                    <span class="step-number">1</span>
                    <span class="step-text">Clique no botão <strong>"📱 Abrir WhatsApp"</strong> abaixo</span>
                </div>
                <div class="step">
                    <span class="step-number">2</span>
                    <span class="step-text">A mensagem já estará pronta no WhatsApp</span>
                </div>
                <div class="step">
                    <span class="step-number">3</span>
                    <span class="step-text">Clique no botão <strong>"📎 Anexar"</strong> no WhatsApp</span>
                </div>
                <div class="step">
                    <span class="step-number">4</span>
                    <span class="step-text">Selecione <strong>"Documento"</strong> ou <strong>"Arquivo"</strong></span>
                </div>
                <div class="step">
                    <span class="step-number">5</span>
                    <span class="step-text">Encontre e selecione <strong>"${fileName}"</strong></span>
                </div>
                <div class="step">
                    <span class="step-number">6</span>
                    <span class="step-text">Anexe o PDF e clique em <strong>"Enviar"</strong></span>
                </div>
            </div>
            
            <div class="instruction-footer">
                <p>💡 <strong>Importante:</strong> Não esqueça de anexar o PDF antes de enviar!</p>
                
                <div class="instruction-buttons">
                    <button onclick="openWhatsAppNow('${whatsappURL}')" class="btn-whatsapp">
                        📱 Abrir WhatsApp Agora
                    </button>
                    <button onclick="closeInstructions()" class="btn-close">
                        ❌ Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Usar conteúdo apropriado baseado no dispositivo
    if (isMobile) {
        instructionsMsg.innerHTML = generateMobileContent(fileName, whatsappURL);
    } else {
        instructionsMsg.innerHTML = desktopContent;
    }
    
    // Armazenar o documento PDF para re-download
    window.currentPDF = pdfDoc;
    window.currentFileName = fileName;
    
    // Inserir no topo da página
    document.querySelector('.container').insertBefore(instructionsMsg, document.querySelector('header'));
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para abrir WhatsApp quando usuário clicar
function openWhatsAppNow(whatsappURL) {
    window.open(whatsappURL, '_blank');
    
    // Atualizar instruções para mostrar que WhatsApp foi aberto
    const instructions = document.querySelector('.whatsapp-instructions');
    if (instructions) {
        const header = instructions.querySelector('.instruction-header strong');
        header.textContent = 'WhatsApp Aberto! Complete o Envio';
        
        const firstStep = instructions.querySelector('.step-text');
        firstStep.innerHTML = '<strong>✅ WhatsApp aberto!</strong> Continue com os próximos passos';
        
        // Mudar botão
        const button = instructions.querySelector('.btn-whatsapp');
        button.textContent = '📱 Abrir Novamente';
        button.onclick = () => window.open(whatsappURL, '_blank');
    }
}

// Função para fechar instruções
function closeInstructions() {
    const instructions = document.querySelector('.whatsapp-instructions');
    if (instructions) {
        instructions.remove();
    }
    
    // Mostrar mensagem de sucesso simples
    showSuccessMessage();
}

// Atualizar mensagem de sucesso
function showSuccessMessage() {
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        document.querySelector('.container').insertBefore(successMsg, document.querySelector('.curriculum-form'));
    }
    
    successMsg.innerHTML = `
        <strong>✅ Sucesso!</strong> 
        Currículo processado com sucesso! 
        <br>PDF baixado e WhatsApp aberto para envio.
    `;
    successMsg.style.display = 'block';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 8000);
}

// Função para baixar PDF com opção de escolher local (mobile)
async function downloadPDFAgain(fileName) {
    if (!window.currentPDF || !window.currentFileName) {
        alert('Erro: PDF não encontrado. Tente gerar novamente.');
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;
    
    try {
        // Tentar usar File System Access API (navegadores modernos)
        if ('showSaveFilePicker' in window) {
            button.innerHTML = '📂 Escolhendo Local...';
            button.style.background = '#007bff';
            
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: window.currentFileName,
                types: [{
                    description: 'Arquivo PDF',
                    accept: { 'application/pdf': ['.pdf'] }
                }]
            });
            
            const writable = await fileHandle.createWritable();
            const pdfBlob = new Blob([window.currentPDF.output('blob')], { type: 'application/pdf' });
            await writable.write(pdfBlob);
            await writable.close();
            
            // Sucesso
            button.innerHTML = '✅ PDF Salvo!';
            button.style.background = '#28a745';
            
            // Mostrar notificação de sucesso
            showSaveSuccessNotification(fileHandle.name);
            
        } else {
            // Fallback: download tradicional para navegadores antigos
            button.innerHTML = '📥 Baixando PDF...';
            button.style.background = '#28a745';
            
            window.currentPDF.save(window.currentFileName);
            
            button.innerHTML = '✅ PDF Baixado!';
            showFallbackNotification();
        }
        
    } catch (error) {
        if (error.name === 'AbortError') {
            // Usuário cancelou
            button.innerHTML = '❌ Cancelado';
            button.style.background = '#dc3545';
        } else {
            // Erro real
            console.error('Erro ao salvar PDF:', error);
            button.innerHTML = '❌ Erro ao Salvar';
            button.style.background = '#dc3545';
            
            // Fallback em caso de erro
            setTimeout(() => {
                window.currentPDF.save(window.currentFileName);
                button.innerHTML = '✅ Baixado (Downloads)';
                button.style.background = '#28a745';
            }, 1000);
        }
    }
    
    // Restaurar botão após 4 segundos
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 4000);
}

// Função para mostrar notificação de sucesso ao salvar
function showSaveSuccessNotification(fileName) {
    const notification = document.createElement('div');
    notification.className = 'save-notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <div class="notification-text">
                <strong>PDF Salvo com Sucesso!</strong>
                <br>Arquivo: <code>${fileName}</code>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
}

// Função para notificação de fallback
function showFallbackNotification() {
    const notification = document.createElement('div');
    notification.className = 'save-notification info';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">📥</span>
            <div class="notification-text">
                <strong>PDF Baixado!</strong>
                <br>Verifique na pasta Downloads
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
}

// Função para abrir WhatsApp Web
function openWhatsAppWeb(whatsappURL) {
    // Modificar URL para WhatsApp Web com formato correto
    const phoneNumber = '5519971238643';
    const message = whatsappURL.split('text=')[1]; // Extrair mensagem da URL
    const webURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    window.open(webURL, '_blank');
    
    // Mostrar feedback
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '✅ WhatsApp Web Aberto!';
    button.style.background = '#25d366';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 3000);
}

// Salvar progresso a cada mudança
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    
    const form = document.getElementById('curriculumForm');
    form.addEventListener('input', saveProgress);
    form.addEventListener('change', saveProgress);
});
