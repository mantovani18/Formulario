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

// Função para mostrar/ocultar campo da CNH
function toggleCnhField() {
    const possuiCnh = document.querySelector('input[name="possui_cnh"]:checked');
    const cnhField = document.getElementById('cnhField');
    
    if (possuiCnh && possuiCnh.value === 'sim') {
        cnhField.style.display = 'block';
        document.querySelector('select[name="categoria_cnh"]').required = true;
    } else {
        cnhField.style.display = 'none';
        document.querySelector('select[name="categoria_cnh"]').required = false;
        document.querySelector('select[name="categoria_cnh"]').value = '';
    }
}

// Função para mostrar/ocultar campo do veículo
function toggleVeiculoField() {
    const veiculoProprio = document.querySelector('input[name="veiculo_proprio"]:checked');
    const veiculoField = document.getElementById('veiculoField');
    
    if (veiculoProprio && veiculoProprio.value === 'sim') {
        veiculoField.style.display = 'block';
        document.querySelector('select[name="tipo_veiculo"]').required = true;
    } else {
        veiculoField.style.display = 'none';
        document.querySelector('select[name="tipo_veiculo"]').required = false;
        document.querySelector('select[name="tipo_veiculo"]').value = '';
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
        document.getElementById('cnhField').style.display = 'none';
        document.getElementById('veiculoField').style.display = 'none';
        
        // Remover required dos campos condicionais
        document.getElementById('qual_vaga').required = false;
        document.getElementById('nome_parente').required = false;
        document.querySelector('select[name="categoria_cnh"]').required = false;
        document.querySelector('select[name="tipo_veiculo"]').required = false;
        
        // Remover experiências e cursos adicionais (manter apenas os 3 primeiros)
        removeExtraItems('experience');
        removeExtraItems('course');
    }
}

// Função para coletar dados do formulário
function collectFormData() {
    const form = document.getElementById('curriculumForm');
    const data = {};
    
    // Coletar campo nome_completo diretamente
    const nomeField = document.getElementById('nome_completo');
    if (nomeField) {
        data.nome_completo = nomeField.value.trim();
    }
    
    // Coletar outros campos importantes diretamente
    const fieldsToCollect = [
        'endereco', 'cpf', 'rg', 'cidade_rg', 'data_nascimento', 'pis', 
        'cidade_nascimento', 'estado_civil', 'nome_pai', 'nome_mae', 
        'whatsapp', 'escolaridade', 'vaga_especifica', 'qual_vaga',
        'parente_empresa', 'nome_parente', 'possui_cnh', 'categoria_cnh',
        'veiculo_proprio', 'tipo_veiculo'
    ];
    
    fieldsToCollect.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            if (field.type === 'radio') {
                const checkedRadio = document.querySelector(`[name="${fieldName}"]:checked`);
                if (checkedRadio) {
                    data[fieldName] = checkedRadio.value;
                }
            } else {
                data[fieldName] = field.value;
            }
        }
    });
    
    // Coletar disponibilidade (checkboxes)
    const disponibilidadeChecked = document.querySelectorAll('input[name="disponibilidade[]"]:checked');
    data.disponibilidade = Array.from(disponibilidadeChecked).map(cb => cb.value);
    
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

// Função para criar mensagem formatada do WhatsApp
function createFormattedMessage(formData) {
    try {
        console.log('Criando mensagem formatada...');
        
        // Verificar se formData existe
        if (!formData) {
            throw new Error('formData não fornecido');
        }
        
        // Verificar campo obrigatório - usar nome_completo que é o campo correto
        console.log('=== DEBUG createFormattedMessage ===');
        console.log('formData recebido:', formData);
        console.log('formData.nome_completo:', formData.nome_completo);
        
        // Pegar nome de forma mais robusta
        let nome = formData.nome_completo;
        
        // Se não encontrou, tentar pegar diretamente do campo
        if (!nome || nome.trim() === '') {
            const nomeField = document.getElementById('nome_completo');
            nome = nomeField ? nomeField.value.trim() : '';
            console.log('Nome pego diretamente do campo:', nome);
        }
        
        console.log('Nome final para usar:', nome);
        
        // Validação final
        if (!nome || nome.trim() === '') {
            console.error('ERRO na createFormattedMessage - nome inválido:', nome);
            throw new Error('Nome é obrigatório para criar a mensagem');
        }
        
        console.log('Nome validado:', nome);
        
        // Criar mensagem completa com todas as informações formatadas
        let message = `👋 *Olá! Sou ${nome} e gostaria de me candidatar para uma vaga no Pastifício Selmi*\n\n`;
        
        // DADOS PESSOAIS
        message += `👤 *DADOS PESSOAIS*\n`;
        message += `• Nome Completo: ${formData.nome_completo || 'Não informado'}\n`;
        if (formData.email && formData.email.trim()) message += `• Email: ${formData.email}\n`;
        if (formData.telefone && formData.telefone.trim()) message += `• Telefone: ${formData.telefone}\n`;
        if (formData.endereco && formData.endereco.trim()) message += `• Endereço: ${formData.endereco}\n`;
        if (formData.cpf && formData.cpf.trim()) message += `• CPF: ${formData.cpf}\n`;
        if (formData.data_nascimento && formData.data_nascimento.trim()) message += `• Data de Nascimento: ${formData.data_nascimento}\n`;
        if (formData.estado_civil && formData.estado_civil.trim()) message += `• Estado Civil: ${formData.estado_civil}\n`;
        message += `\n`;
        
        // VAGA DE INTERESSE
        message += `🎯 *VAGA DE INTERESSE*\n`;
        if (formData.vaga_especifica === 'sim' && formData.qual_vaga && formData.qual_vaga.trim()) {
            message += `• Vaga específica: ${formData.qual_vaga}\n`;
        } else {
            message += `• Qualquer vaga disponível\n`;
        }
        message += `\n`;
        
        // ESCOLARIDADE
        if (formData.escolaridade && formData.escolaridade.trim()) {
            message += `🎓 *ESCOLARIDADE*\n`;
            message += `• ${formData.escolaridade}\n\n`;
        }
        
        // EXPERIÊNCIAS PROFISSIONAIS
        if (formData.experiencias && formData.experiencias.length > 0) {
            message += `� *EXPERIÊNCIAS PROFISSIONAIS*\n`;
            formData.experiencias.forEach((exp, index) => {
                if (exp.empresa || exp.funcoes) {
                    message += `${index + 1}. ${exp.empresa || 'Empresa não informada'}\n`;
                    if (exp.entrada || exp.saida) {
                        message += `   📅 Período: ${exp.entrada || '...'} até ${exp.saida || 'atual'}\n`;
                    }
                    if (exp.funcoes) {
                        message += `   📝 Funções: ${exp.funcoes}\n`;
                    }
                    message += `\n`;
                }
            });
        }
        
        // CURSOS E QUALIFICAÇÕES
        if (formData.cursos && formData.cursos.length > 0) {
            message += `📚 *CURSOS E QUALIFICAÇÕES*\n`;
            formData.cursos.forEach((curso, index) => {
                if (curso.nome || curso.instituicao) {
                    message += `${index + 1}. ${curso.nome || 'Curso não informado'}\n`;
                    if (curso.instituicao) message += `   🏫 Instituição: ${curso.instituicao}\n`;
                    if (curso.anoCarga) message += `   � Ano/Carga: ${curso.anoCarga}\n`;
                    message += `\n`;
                }
            });
        }
        
        // DISPONIBILIDADE
        if (formData.disponibilidade && formData.disponibilidade.length > 0) {
            message += `⏰ *DISPONIBILIDADE*\n`;
            message += `• ${formData.disponibilidade.join(', ')}\n\n`;
        }
        
        // CNH E VEÍCULO
        message += `🚗 *TRANSPORTE*\n`;
        if (formData.possui_cnh === 'sim') {
            message += `• CNH: ${formData.categoria_cnh || 'Sim'}\n`;
        } else {
            message += `• CNH: Não possuo\n`;
        }
        
        if (formData.veiculo_proprio === 'sim') {
            message += `• Veículo próprio: ${formData.tipo_veiculo || 'Sim'}\n`;
        } else {
            message += `• Veículo próprio: Não possuo\n`;
        }
        message += `\n`;
        
        // PARENTE NA EMPRESA
        if (formData.parente_empresa === 'sim' && formData.nome_parente) {
            message += `👨‍👩‍👧‍� *PARENTE NA EMPRESA*\n`;
            message += `• ${formData.nome_parente}\n\n`;
        }
        
        // OUTRAS INFORMAÇÕES
        if (formData.outras_informacoes && formData.outras_informacoes.trim()) {
            message += `ℹ️ *OUTRAS INFORMAÇÕES*\n`;
            message += `${formData.outras_informacoes}\n\n`;
        }
        
        // FINALIZAÇÃO
        message += `📋 Todas as informações do meu currículo estão descritas acima.\n\n`;
        message += `🤝 Fico à disposição para uma entrevista e esclarecimentos adicionais.\n\n`;
        message += `✉️ Atenciosamente,\n${nome}`;

        console.log('Mensagem formatada criada com sucesso');
        return message;
        
    } catch (error) {
        console.error('Erro ao criar mensagem formatada:', error);
        throw new Error(`Erro ao formatar mensagem: ${error.message}`);
    }
}

// Função para criar botão manual caso o redirecionamento automático falhe
function createManualWhatsAppButton(whatsappURL) {
    // Verificar se já existe um botão manual
    const existingButton = document.getElementById('manualWhatsAppButton');
    if (existingButton) {
        existingButton.remove();
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'manualWhatsAppButton';
    buttonDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        background: white;
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        border: 3px solid #25d366;
        text-align: center;
        max-width: 90%;
        width: 400px;
    `;
    
    buttonDiv.innerHTML = `
        <h3 style="color: #25d366; margin: 0 0 15px 0;">📱 Abrir WhatsApp</h3>
        <p style="margin: 0 0 20px 0; color: #666;">
            ${isMobile ? 'Clique no botão abaixo para abrir o WhatsApp:' : 'Clique para abrir o WhatsApp Web:'}
        </p>
        
        <button onclick="window.open('${whatsappURL}', '${isMobile ? '_self' : '_blank'}')" 
                style="background: #25d366; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; margin: 10px;">
            📱 Abrir WhatsApp
        </button>
        
        <button onclick="navigator.clipboard.writeText('${whatsappURL}').then(() => alert('Link copiado! Cole no seu WhatsApp')).catch(() => alert('Link: ${whatsappURL}'))" 
                style="background: #007bff; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; margin: 10px;">
            📋 Copiar Link
        </button>
        
        <br><br>
        
        <button onclick="this.parentElement.remove()" 
                style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-size: 14px; cursor: pointer;">
            ❌ Fechar
        </button>
    `;
    
    document.body.appendChild(buttonDiv);
    
    // Remover automaticamente após 30 segundos
    setTimeout(() => {
        if (buttonDiv.parentElement) {
            buttonDiv.remove();
        }
    }, 30000);
}

// Função para enviar o formulário
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('curriculumForm');
    const fields = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    // Validar todos os campos
    console.log('=== DEBUG VALIDAÇÃO ===');
    fields.forEach(field => {
        const fieldValid = validateField(field);
        if (field.name === 'nome_completo') {
            console.log('Campo nome_completo:', {
                name: field.name,
                value: field.value,
                required: field.required,
                valid: fieldValid
            });
        }
        if (!fieldValid) {
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
    
    // Verificação adicional específica para o nome antes de coletar dados
    const nomeField = document.getElementById('nome_completo');
    if (!nomeField || !nomeField.value.trim()) {
        alert('Por favor, preencha o campo "Nome completo" antes de enviar.');
        if (nomeField) nomeField.focus();
        return false;
    }
    
    // Coletar dados
    const formData = collectFormData();
    
    // Debug: verificar dados coletados
    console.log('=== DEBUG FORMULÁRIO ===');
    console.log('Dados coletados:', formData);
    console.log('Nome completo:', formData.nome_completo);
    console.log('Tipo do nome_completo:', typeof formData.nome_completo);
    
    // Mostrar loading
    showLoadingState(true);
    
    // Enviar diretamente para WhatsApp com mensagem formatada
    setTimeout(() => {
        sendToWhatsAppDirectly(formData);
        showLoadingState(false);
    }, 1000);
    
    return false;
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
    // Ocultar formulário
    const form = document.getElementById('curriculumForm');
    if (form) {
        form.style.display = 'none';
    }
    
    // Criar mensagem de sucesso
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        text-align: center;
        padding: 40px 20px;
        background: linear-gradient(135deg, #e8f5e8, #c8e6c8);
        border: 2px solid #25d366;
        border-radius: 15px;
        margin: 20px 0;
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.2);
    `;
    
    successDiv.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
        <h2 style="color: #128c7e; margin: 0 0 15px 0;">Currículo Enviado!</h2>
        <p style="color: #1a5f1a; font-size: 18px; margin: 0 0 20px 0;">
            Você foi redirecionado para o WhatsApp com suas informações.
        </p>
        <p style="color: #666; font-size: 14px; margin: 0 0 30px 0;">
            Se o WhatsApp não abriu automaticamente, você pode tentar novamente ou entrar em contato conosco diretamente.
        </p>
        <button onclick="location.reload()" 
                style="background: #25d366; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer; margin-right: 10px;">
            📝 Enviar Outro Currículo
        </button>
        <button onclick="window.open('https://wa.me/5519971238643', '_blank')" 
                style="background: #128c7e; color: white; border: none; padding: 12px 30px; border-radius: 25px; font-size: 16px; cursor: pointer;">
            📱 Abrir WhatsApp Novamente
        </button>
    `;
    
    // Adicionar depois do header
    const container = document.querySelector('.container');
    const header = document.querySelector('.header');
    container.insertBefore(successDiv, header.nextSibling);
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para mostrar estado de carregamento
function showLoadingState(isLoading) {
    const form = document.getElementById('curriculumForm');
    const submitBtn = form.querySelector('.btn-primary');
    
    if (isLoading) {
        form.classList.add('form-loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';
    } else {
        form.classList.remove('form-loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="whatsapp-icon">📱</span> Enviar Currículo';
    }
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

// Função para enviar diretamente para WhatsApp (sem PDF)
function sendToWhatsAppDirectly(formData) {
    console.log('=== INICIANDO ENVIO WHATSAPP ===');
    console.log('Dados recebidos:', formData);
    
    try {
        // Verificar se formData é válido
        if (!formData || typeof formData !== 'object') {
            throw new Error('Dados do formulário inválidos');
        }
        
        // Verificar se campos essenciais existem - validação mais robusta
        console.log('=== DEBUG VERIFICAÇÃO NOME ===');
        console.log('formData.nome_completo:', formData.nome_completo);
        console.log('Tipo:', typeof formData.nome_completo);
        
        // Verificação mais robusta do nome
        const nomeCompleto = formData.nome_completo;
        const nomeValido = nomeCompleto && 
                          typeof nomeCompleto === 'string' && 
                          nomeCompleto.trim().length > 0;
        
        console.log('Nome válido?', nomeValido);
        
        if (!nomeValido) {
            console.error('ERRO: Nome é obrigatório - valor recebido:', nomeCompleto);
            
            // Tentar pegar diretamente do campo se falhou na coleta
            const nomeField = document.getElementById('nome_completo');
            const nomeDirecto = nomeField ? nomeField.value.trim() : '';
            
            console.log('Tentativa direta do campo:', nomeDirecto);
            
            if (nomeDirecto && nomeDirecto.length > 0) {
                formData.nome_completo = nomeDirecto;
                console.log('Nome corrigido com valor direto:', nomeDirecto);
            } else {
                throw new Error('Nome é obrigatório');
            }
        }
        
        console.log('Preparando mensagem para WhatsApp...');
        
        // Criar mensagem formatada com todos os dados
        const whatsappMessage = createFormattedMessage(formData);
        
        // Verificar se a mensagem foi criada corretamente
        if (!whatsappMessage || whatsappMessage.trim() === '') {
            throw new Error('Erro ao criar mensagem formatada');
        }
        
        // Número do WhatsApp
        const phoneNumber = '5519971238643';
        
        // Criar URL do WhatsApp
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('=== DEBUG WHATSAPP ===');
        console.log('Nome do candidato:', formData.nome_completo);
        console.log('Número:', phoneNumber);
        console.log('Mensagem criada com sucesso - tamanho:', whatsappMessage.length, 'caracteres');
        console.log('URL criada com sucesso - tamanho:', whatsappURL.length, 'caracteres');
        
        // Verificar se URL não está muito longa (limite de segurança)
        if (whatsappURL.length > 8000) {
            console.warn('URL muito longa, pode causar problemas em alguns dispositivos');
        }
        
        // Detectar dispositivo com detecção aprimorada
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) ||
                         window.innerWidth <= 768;
        
        console.log('Dispositivo detectado:', isMobile ? 'Mobile' : 'Desktop');
        console.log('User Agent:', navigator.userAgent);
        
        // Redirecionar para WhatsApp com tratamento específico por dispositivo
        console.log('Tentando abrir WhatsApp...');
        
        if (isMobile) {
            // Para mobile: tentar múltiplas abordagens
            try {
                console.log('Método 1: Tentando window.location.href');
                window.location.href = whatsappURL;
            } catch (error) {
                console.log('Método 1 falhou, tentando window.open');
                try {
                    window.open(whatsappURL, '_self');
                } catch (error2) {
                    console.log('Método 2 falhou, tentando window.open _blank');
                    window.open(whatsappURL, '_blank');
                }
            }
        } else {
            // Para desktop: abrir em nova aba
            console.log('Desktop: usando window.open _blank');
            window.open(whatsappURL, '_blank');
        }
        
        // Mostrar mensagem de sucesso após um pequeno delay
        setTimeout(() => {
            showSuccessMessage();
        }, 1000);
        
        // Adicionar fallback manual
        setTimeout(() => {
            console.log('Criando botão de fallback manual...');
            createManualWhatsAppButton(whatsappURL);
        }, 3000);
        
    } catch (error) {
        console.error('=== ERRO NO ENVIO WHATSAPP ===');
        console.error('Tipo do erro:', error.name);
        console.error('Mensagem:', error.message);
        console.error('Stack:', error.stack);
        console.error('Dados do formulário:', formData);
        
        // Remover estado de loading
        showLoadingState(false);
        
        // Criar mensagem de erro mais amigável
        let errorMessage = 'Ocorreu um problema ao preparar o envio.';
        
        if (error.message.includes('Nome é obrigatório')) {
            errorMessage = 'Por favor, preencha o campo Nome.';
        } else if (error.message.includes('Dados do formulário inválidos')) {
            errorMessage = 'Erro nos dados do formulário. Tente preencher novamente.';
        } else if (error.message.includes('criar mensagem formatada')) {
            errorMessage = 'Erro ao formatar a mensagem. Verifique os dados preenchidos.';
        } else {
            errorMessage = `Erro técnico: ${error.message}`;
        }
        
        // Mostrar erro para o usuário
        alert(`❌ Erro ao Enviar Currículo

${errorMessage}

🔧 Você pode:
1. Verificar se todos os campos obrigatórios estão preenchidos
2. Tentar novamente
3. Recarregar a página se o problema persistir

Se o erro continuar, entre em contato diretamente pelo WhatsApp: (19) 99712-3864`);
        
        // Não criar botão manual se não temos URL válida
        if (typeof whatsappURL !== 'undefined' && whatsappURL.length > 0) {
            createManualWhatsAppButton(whatsappURL);
        }
    }
}

// Função para gerar PDF e enviar para WhatsApp (ANTIGA - REMOVIDA)
function generatePDFAndSendWhatsApp_OLD(formData) {
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
        
        const whatsappMessage = `Ola! Me chamo ${nomeCandidate} e gostaria de me candidatar para uma vaga no Pastificio Selmi.

Segue meu curriculo em anexo com minhas qualificacoes e experiencias.

Fico a disposicao para uma entrevista.

Atenciosamente,
${nomeCandidate}`;
        
        // Gerar nome do arquivo
        const fileName = `Curriculo_${nomeCandidate.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        
        // Detectar se é dispositivo móvel
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Criar link do WhatsApp
        const phoneNumber = '5519971238643';
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('Dispositivo móvel detectado:', isMobile);
        console.log('URL WhatsApp:', whatsappURL);
        
        // DEBUG: Mostrar URL gerada
        console.log('=== DEBUG WHATSAPP ===');
        console.log('Número telefone:', phoneNumber);
        console.log('Mensagem original:', whatsappMessage);
        console.log('Mensagem codificada:', encodedMessage);
        console.log('URL final gerada:', whatsappURL);
        
        // Armazenar PDF globalmente para reutilização
        window.currentPDFDoc = doc;
        window.currentFileName = fileName;
        window.currentWhatsAppURL = whatsappURL;
        
        // NOVA ABORDAGEM: Redirecionar para o topo e mostrar opções
        console.log('Mostrando opções de download...');
        showDownloadOptionsFixed(fileName, whatsappURL, isMobile, doc);
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        showErrorMessage();
    }
}

// Função para gerar conteúdo mobile reorganizado
function generateMobileContent(fileName, whatsappURL, doc) {
    const candidateName = fileName.replace('Curriculo_', '').replace(/_.*/, '').replace(/_/g, ' ');
    
    return `
        <div class="instruction-header">
            <span class="whatsapp-logo">📱</span>
            <strong>📱 Currículo Pronto! (Mobile)</strong>
        </div>
        
        <div class="instruction-content">
            <div style="background: #e7f9e7; border: 2px solid #4caf50; border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: center;">
                <h3 style="margin: 0 0 10px 0; color: #2e7d32;">✅ PDF Gerado com Sucesso!</h3>
                <p style="margin: 0; color: #388e3c;"><strong>Arquivo:</strong> ${fileName}</p>
            </div>
            
            <!-- Seção principal - WhatsApp primeiro -->
            <div class="whatsapp-main-section">
                <div class="whatsapp-message-preview">
                    <h3>� Sua mensagem está pronta:</h3>
                    <div class="message-box" style="font-size: 14px; line-height: 1.4;">
                        Olá! Me chamo <strong>${candidateName}</strong> e gostaria de me candidatar para uma vaga no Pastifício Selmi.<br><br>
                        Segue meu currículo em anexo com minhas qualificações e experiências.<br><br>
                        Fico à disposição para uma entrevista.<br><br>
                        Atenciosamente,<br>
                        ${candidateName}
                    </div>
                </div>
                
                <!-- Botão principal do WhatsApp -->
                <div style="text-align: center; margin: 20px 0;">
                    <button onclick="openWhatsAppNowMobile('${whatsappURL}', '${fileName}')" class="btn-whatsapp-main" style="font-size: 18px; padding: 15px 30px;">
                        📱 Abrir WhatsApp e Enviarz
                    </button>
                </div>
                
                <!-- Seção para salvar PDF -->
                <div class="save-section" style="margin-top: 25px;">
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; text-align: center;">
                        <p style="margin: 0 0 15px 0;"><strong>💾 Quer salvar o currículo no celular?</strong></p>
                        <button onclick="savePDFOnMobileManually('${fileName}')" class="btn-save-curriculum">
                            📂 Baixar PDF para o Celular
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
    
    // Usar conteúdo específico para mobile ou desktop
    if (isMobile) {
        instructionsMsg.innerHTML = generateMobileContent(fileName, whatsappURL, pdfDoc);
    } else {
        instructionsMsg.innerHTML = `
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
    // Debug: mostrar URL no console
    console.log('URL do WhatsApp:', whatsappURL);
    
    // Validar se URL está correta
    if (!whatsappURL || !whatsappURL.startsWith('https://wa.me/')) {
        alert('Erro: URL do WhatsApp inválida. Tente novamente.');
        return;
    }
    
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
    console.log('=== ABRINDO WHATSAPP WEB ===');
    console.log('whatsappURL original:', whatsappURL);
    
    // Para WhatsApp Web, converter URL wa.me para web.whatsapp.com
    let webURL = whatsappURL;
    
    if (whatsappURL.includes('wa.me/')) {
        const phoneNumber = '5519971238643';
        const message = whatsappURL.split('text=')[1]; // Extrair mensagem da URL
        webURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
    }
    
    console.log('WhatsApp Web - URL Final:', webURL);
    
    // Feedback visual
    const btn = document.getElementById('openWhatsAppWebBtn');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '🌐 Abrindo...';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '✅ WhatsApp Web Aberto!';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }, 1000);
    }
    
    // Abrir WhatsApp Web com delay
    setTimeout(() => {
        try {
            console.log('Abrindo WhatsApp Web...');
            window.open(webURL, '_blank');
        } catch (error) {
            console.error('Erro ao abrir WhatsApp Web:', error);
            alert('Erro ao abrir WhatsApp Web. Tente copiar o link manualmente.');
        }
    }, 1500);
}

// Salvar progresso a cada mudança
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    
    const form = document.getElementById('curriculumForm');
    form.addEventListener('input', saveProgress);
    form.addEventListener('change', saveProgress);
});

// Função específica para salvar PDF no celular
async function savePDFOnMobile(doc, fileName) {
    try {
        console.log('Tentando salvar PDF no celular...');
        
        // Verificar se o navegador suporta File System Access API
        if ('showSaveFilePicker' in window) {
            console.log('File System Access API disponível');
            
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [
                    {
                        description: 'PDF files',
                        accept: {
                            'application/pdf': ['.pdf'],
                        },
                    },
                ],
            });
            
            const writable = await fileHandle.createWritable();
            const pdfBlob = new Blob([doc.output('blob')], { type: 'application/pdf' });
            await writable.write(pdfBlob);
            await writable.close();
            
            console.log('PDF salvo com sucesso no celular!');
            showMobileSuccessMessage('PDF salvo com sucesso no seu celular!');
            
        } else {
            console.log('File System Access API não disponível, usando download tradicional');
            // Fallback: download tradicional
            doc.save(fileName);
            showMobileSuccessMessage('PDF baixado! Verifique sua pasta Downloads.');
        }
        
    } catch (error) {
        console.log('Usuário cancelou ou erro ao salvar:', error);
        // Não mostrar erro se usuário cancelou, apenas fazer download normal
        doc.save(fileName);
        showMobileSuccessMessage('PDF baixado! Verifique sua pasta Downloads.');
    }
}

// Função específica para abrir WhatsApp no mobile
function openWhatsAppNowMobile(whatsappURL, fileName) {
    console.log('Abrindo WhatsApp no mobile...');
    
    // Mostrar feedback visual
    showMobileSuccessMessage('Abrindo WhatsApp... Não esqueça de anexar o PDF!');
    
    // Abrir WhatsApp
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1000);
    
    // Atualizar interface para mostrar próximos passos
    setTimeout(() => {
        updateMobileInstructions(fileName);
    }, 2000);
}

// Função para baixar PDF manualmente no mobile
function savePDFOnMobileManually(fileName) {
    // Recuperar o PDF da variável global ou gerar novamente
    if (window.currentPDFDoc) {
        savePDFOnMobile(window.currentPDFDoc, fileName);
    } else {
        showMobileSuccessMessage('Gerando PDF novamente...');
        // Se não tiver o PDF, gerar novamente
        const form = document.getElementById('curriculumForm');
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData);
        generatePDFAndSendWhatsApp(formDataObj);
    }
}

// Função para atualizar instruções após abrir WhatsApp
function updateMobileInstructions(fileName) {
    const instructions = document.querySelector('.whatsapp-instructions');
    if (instructions) {
        instructions.innerHTML = `
            <div class="instruction-header">
                <span class="whatsapp-logo">📱</span>
                <strong>WhatsApp Aberto! Complete o Envio</strong>
            </div>
            
            <div class="instruction-content">
                <div style="background: #e3f2fd; border: 2px solid #2196f3; border-radius: 8px; padding: 15px; text-align: center;">
                    <h3 style="color: #1976d2; margin: 0 0 15px 0;">📲 Próximos Passos no WhatsApp:</h3>
                    
                    <div style="text-align: left; margin: 15px 0;">
                        <p><strong>1.</strong> 📎 Clique no ícone de anexo (+)</p>
                        <p><strong>2.</strong> 📄 Escolha "Documento" ou "Arquivo"</p>
                        <p><strong>3.</strong> 📂 Selecione o arquivo: <code>${fileName}</code></p>
                        <p><strong>4.</strong> ✅ Envie a mensagem com o PDF</p>
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <button onclick="savePDFOnMobileManually('${fileName}')" class="btn-save-curriculum">
                            📂 Baixar PDF Novamente
                        </button>
                    </div>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <button onclick="location.reload()" class="btn-secondary">
                        🔄 Fazer Novo Currículo
                    </button>
                </div>
            </div>
        `;
        
        // Scroll para o topo para ver as instruções
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Função para mostrar mensagem de sucesso no mobile
function showMobileSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'mobile-success-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: bold;
            text-align: center;
            max-width: 90%;
        ">
            ✅ ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover notificação após 4 segundos
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

// Função para mostrar opções ANTES de baixar o PDF
// Nova função para mostrar opções fixas (não popup)
function showDownloadOptionsFixed(fileName, whatsappURL, isMobile, pdfDoc) {
    // Armazenar dados globalmente
    window.currentPDFDoc = pdfDoc;
    window.currentFileName = fileName;
    window.currentWhatsAppURL = whatsappURL;
    window.currentIsMobile = isMobile;
    
    // Ocultar o formulário
    const form = document.getElementById('curriculumForm');
    if (form) {
        form.style.display = 'none';
    }
    
    // Mostrar a seção de opções
    const optionsSection = document.getElementById('downloadOptionsSection');
    if (optionsSection) {
        optionsSection.style.display = 'block';
        
        // Mostrar opções apropriadas (mobile ou desktop)
        const mobileOptions = document.getElementById('mobileOptions');
        const desktopOptions = document.getElementById('desktopOptions');
        
        if (isMobile) {
            mobileOptions.style.display = 'flex';
            desktopOptions.style.display = 'none';
            
            // Configurar botões mobile
            console.log('Configurando botões mobile...');
            const downloadBtn = document.getElementById('downloadPDFBtn');
            const whatsappBtn = document.getElementById('openWhatsAppBtn');
            
            console.log('Botão download encontrado:', downloadBtn);
            console.log('Botão whatsapp encontrado:', whatsappBtn);
            
            if (downloadBtn) {
                downloadBtn.onclick = () => {
                    console.log('Clicou no botão de download');
                    downloadPDFMobile(fileName);
                };
            }
            
            if (whatsappBtn) {
                whatsappBtn.onclick = () => {
                    console.log('Clicou no botão do WhatsApp');
                    console.log('Chamando openWhatsAppMobile com:', fileName, whatsappURL);
                    openWhatsAppMobile(fileName, whatsappURL);
                };
            }
        } else {
            mobileOptions.style.display = 'none';
            desktopOptions.style.display = 'flex';
            
            // Configurar botões desktop
            console.log('Configurando botões desktop...');
            const downloadDesktopBtn = document.getElementById('downloadPDFDesktopBtn');
            const whatsappWebBtn = document.getElementById('openWhatsAppWebBtn');
            
            console.log('Botão download desktop encontrado:', downloadDesktopBtn);
            console.log('Botão whatsapp web encontrado:', whatsappWebBtn);
            
            if (downloadDesktopBtn) {
                downloadDesktopBtn.onclick = () => {
                    console.log('Clicou no botão de download desktop');
                    downloadToDownloadsFolder(fileName, whatsappURL, false);
                };
            }
            
            if (whatsappWebBtn) {
                whatsappWebBtn.onclick = () => {
                    console.log('Clicou no botão do WhatsApp Web');
                    console.log('Chamando openWhatsAppWeb com:', whatsappURL);
                    openWhatsAppWeb(whatsappURL);
                };
            }
        }
    }
    
    // Redirecionar suavemente para o topo
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Função para ocultar opções e voltar ao formulário
function hideDownloadOptions() {
    // Mostrar o formulário novamente
    const form = document.getElementById('curriculumForm');
    if (form) {
        form.style.display = 'block';
    }
    
    // Ocultar a seção de opções
    const optionsSection = document.getElementById('downloadOptionsSection');
    if (optionsSection) {
        optionsSection.style.display = 'none';
    }
    
    // Rolar para o topo suavemente
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showDownloadOptionsBeforePDF(fileName, whatsappURL, isMobile, pdfDoc) {
    // Remover mensagem anterior se existir
    const existingMsg = document.querySelector('.download-options');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Criar mensagem de opções
    const optionsMsg = document.createElement('div');
    optionsMsg.className = 'download-options';
    
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    const deviceIcon = isMobile ? '📱' : '🖥️';
    
    optionsMsg.innerHTML = `
        <div class="instruction-header">
            <span class="whatsapp-logo">${deviceIcon}</span>
            <strong>✅ Currículo Pronto! Escolha como prosseguir (${deviceType})</strong>
        </div>
        
        <div class="instruction-content">
            <div style="background: #e7f3ff; border: 2px solid #2196f3; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #1976d2; margin: 0 0 15px 0; text-align: center;">
                    📄 Arquivo Pronto: <code>${fileName}</code>
                </h3>
                
                ${isMobile ? `
                <!-- OPÇÕES PARA MOBILE - SEM ABRIR PDF AUTOMATICAMENTE -->
                <div style="text-align: center; margin: 20px 0;">
                    <h4 style="color: #1976d2; margin: 15px 0;">📱 Escolha como prosseguir:</h4>
                    <p style="color: #666; font-size: 14px; margin-bottom: 25px;">
                        <strong>📌 O PDF não será aberto automaticamente</strong> - você controla o processo
                    </p>
                </div>
                
                <!-- Opção 1: PRINCIPAL - Instruções completas -->
                <div style="background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 10px;">📥</div>
                        <h4 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 18px;">
                            Baixar PDF do Currículo
                        </h4>
                        <p style="margin: 0 0 20px 0; font-size: 14px; color: #388e3c; line-height: 1.4;">
                            Salva o arquivo <strong>${fileName}</strong><br>
                            no seu celular para anexar no WhatsApp
                        </p>
                        <button onclick="showMobileInstructionsOnly('${fileName}', '${whatsappURL}')" 
                                style="background: #4caf50; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; margin: 5px;">
                            � Ver Instruções de Envio
                        </button>
                    </div>
                </div>
                
                <!-- Opção 2: Abrir WhatsApp -->
                <div style="background: #e8f5e8; border: 2px solid #25d366; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <div style="text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 10px;">📱</div>
                        <h4 style="margin: 0 0 10px 0; color: #128c7e; font-size: 18px;">
                            Abrir WhatsApp para Enviar
                        </h4>
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: #1a5f1a;">
                            Abre o WhatsApp com a mensagem pronta<br><strong>Você anexa o PDF manualmente</strong>
                        </p>
                        <button onclick="openWhatsAppMobile('${fileName}', '${whatsappURL}')" 
                                style="background: #25d366; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; margin: 5px;">
                            � Abrir WhatsApp
                        </button>
                    </div>
                </div>
                


                        <p style="margin: 0 0 15px 0; font-size: 14px; color: #8e24aa;">
                            Você escolhe a pasta + instruções de envio
                        </p>
                        <button onclick="chooseDownloadLocationMobile('${fileName}', '${whatsappURL}')" 
                                style="background: #9c27b0; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; margin: 5px;">
                            � Escolher Pasta + Instruções
                        </button>
                    </div>
                </div>
                ` : `
                <!-- OPÇÕES PARA DESKTOP -->
                <div style="text-align: center; margin: 20px 0;">
                    <h4 style="color: #1976d2; margin: 15px 0;">🖥️ Como você quer prosseguir no computador?</h4>
                </div>
                
                <!-- Opção 1: Download para Downloads -->
                <div style="background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <div style="text-align: center;">
                        <h4 style="margin: 0 0 10px 0; color: #2e7d32;">
                            🎯 RECOMENDADO: Baixar PDF
                        </h4>
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: #388e3c;">
                            PDF salvo na pasta <strong>Downloads</strong>, depois abre WhatsApp Web
                        </p>
                        <button onclick="downloadToDownloadsFolder('${fileName}', '${whatsappURL}', ${isMobile})" 
                                style="background: #4caf50; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; margin: 5px;">
                            📥 Baixar PDF + Instruções
                        </button>
                    </div>
                </div>
                
                <!-- Opção 2: Direto para WhatsApp Web -->
                <div style="background: #e3f2fd; border: 2px solid #2196f3; border-radius: 8px; padding: 15px; margin: 10px 0;">
                    <div style="text-align: center;">
                        <h4 style="margin: 0 0 10px 0; color: #1976d2;">
                            🌐 WhatsApp Web Direto
                        </h4>
                        <p style="margin: 0 0 15px 0; font-size: 14px; color: #1565c0;">
                            Baixa o PDF e abre WhatsApp Web automaticamente
                        </p>
                        <button onclick="downloadAndGoToWhatsApp('${fileName}', '${whatsappURL}', ${isMobile})" 
                                style="background: #2196f3; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; margin: 5px;">
                            🌐 Baixar + WhatsApp Web
                        </button>
                    </div>
                </div>
                `}
                
                <!-- Botão Cancelar -->
                <div style="text-align: center; margin: 20px 0; padding-top: 15px; border-top: 1px solid #ddd;">
                    <button onclick="closeDownloadOptions()" 
                            style="background: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                        ❌ Cancelar
                    </button>
                </div>
            </div>
            
            <!-- Instruções de ajuda -->
            <div style="background: #fffde7; border: 1px solid #ffcc02; border-radius: 8px; padding: 15px; margin-top: 15px;">
                <h4 style="color: #f57f17; margin: 0 0 10px 0;">💡 Dicas:</h4>
                <ul style="color: #f9a825; margin: 0; padding-left: 20px; font-size: 14px;">
                    ${isMobile ? `
                    <li><strong>Escolher Pasta:</strong> Você decide onde salvar (recomendado)</li>
                    <li><strong>Downloads:</strong> Salva automaticamente na pasta Downloads</li>
                    <li><strong>WhatsApp Direto:</strong> Baixa e já abre o WhatsApp para enviar</li>
                    ` : `
                    <li><strong>Baixar PDF:</strong> Salva na pasta Downloads + instruções completas</li>
                    <li><strong>WhatsApp Web:</strong> Baixa e abre WhatsApp Web automaticamente</li>
                    <li>💾 Arquivo será salvo como: <code>${fileName}</code></li>
                    `}
                </ul>
            </div>
        </div>
    `;
    
    // Inserir no topo da página
    document.querySelector('.container').insertBefore(optionsMsg, document.querySelector('header'));
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// NOVAS FUNÇÕES MOBILE SIMPLIFICADAS - APENAS 2 OPÇÕES

// Função 1: Baixar PDF no mobile
function downloadPDFMobile(fileName) {
    const pdfDoc = window.currentPDFDoc;
    
    if (!pdfDoc) {
        alert('Erro: PDF não encontrado. Tente gerar novamente.');
        return;
    }
    
    // Alterar texto do botão para mostrar progresso
    const btn = document.getElementById('downloadPDFBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '📥 Baixando...';
    btn.disabled = true;
    
    // Fazer download do PDF
    pdfDoc.save(fileName);
    
    // Restaurar botão após download
    setTimeout(() => {
        btn.innerHTML = '✅ PDF Baixado!';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }, 1000);
}

// Função 2: Abrir WhatsApp no mobile
function openWhatsAppMobile(fileName, whatsappURL) {
    console.log('=== ABRINDO WHATSAPP MOBILE ===');
    console.log('fileName:', fileName);
    console.log('whatsappURL:', whatsappURL);
    
    // Verificar se é mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('É mobile?', isMobile);
    console.log('User Agent:', navigator.userAgent);
    
    // Feedback visual imediato
    const btn = document.getElementById('openWhatsAppBtn');
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '📱 Abrindo...';
        btn.disabled = true;
        
        // Restaurar botão após 3 segundos
        setTimeout(() => {
            btn.innerHTML = '✅ WhatsApp Aberto!';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 2000);
        }, 1000);
    }
    
    // Abrir WhatsApp com delay para feedback visual
    setTimeout(() => {
        try {
            console.log('Tentando abrir URL:', whatsappURL);
            
            if (isMobile) {
                // Para mobile: usar window.location.href para abrir o app nativo
                console.log('Abrindo no mobile com window.location.href');
                window.location.href = whatsappURL;
            } else {
                // Para desktop: abrir em nova aba
                console.log('Abrindo no desktop com window.open');
                window.open(whatsappURL, '_blank');
            }
        } catch (error) {
            console.error('Erro ao abrir WhatsApp:', error);
            alert('Erro ao abrir WhatsApp. Tente copiar o link manualmente.');
        }
    }, 1500);
}

// Função para mostrar mensagem após abrir WhatsApp
function showMobilePostWhatsAppMessage(fileName) {
    // Criar mensagem informativa
    const instructionsMsg = document.createElement('div');
    instructionsMsg.className = 'whatsapp-instructions';
    
    instructionsMsg.innerHTML = `
        <div class="instruction-header">
            <span class="whatsapp-logo">📱</span>
            <strong>WhatsApp Aberto! Como Anexar o PDF</strong>
        </div>
        
        <div class="instruction-content">
            <div style="background: #e7f3ff; border: 2px solid #2196f3; border-radius: 12px; padding: 20px; text-align: center;">
                <h3 style="color: #1976d2; margin: 0 0 20px 0;">📋 Passos para Anexar o PDF:</h3>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
                    <ol style="color: #333; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li><strong>No WhatsApp:</strong> Clique no ícone de anexo (📎 ou +)</li>
                        <li><strong>Escolha:</strong> "Documento" ou "Arquivo"</li>
                        <li><strong>Procure:</strong> O arquivo <code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">${fileName}</code></li>
                        <li><strong>Anexe:</strong> Selecione o PDF e clique em "Anexar"</li>
                        <li><strong>Envie:</strong> Clique no botão "Enviar"</li>
                    </ol>
                </div>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 12px; margin: 15px 0;">
                    <p style="color: #856404; margin: 0; font-size: 13px;">
                        <strong>💡 Dica:</strong> Se ainda não baixou o PDF, use o botão abaixo para baixar
                    </p>
                </div>
                
                <div style="margin: 20px 0;">
                    <button onclick="downloadPDFNow('${fileName}')" 
                            style="background: #4caf50; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px; font-weight: bold;">
                        📥 Baixar PDF Agora
                    </button>
                    <button onclick="location.reload()" 
                            style="background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        🔄 Novo Currículo
                    </button>
                    <button onclick="closeInstructions()" 
                            style="background: #6c757d; color: white; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; margin: 5px;">
                        ❌ Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Inserir no topo da página
    document.querySelector('.container').insertBefore(instructionsMsg, document.querySelector('header'));
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// MANTER FUNÇÕES ANTIGAS PARA COMPATIBILIDADE

// Função 1: Mostrar apenas instruções (sem baixar automaticamente)
function showMobileInstructionsOnly(fileName, whatsappURL) {
    closeDownloadOptions();
    showMobileInstructionsComplete(fileName, whatsappURL, false); // false = não baixou ainda
}

// Função 2: Baixar para Downloads e mostrar instruções mobile
function downloadToDownloadsFolderMobile(fileName, whatsappURL) {
    const pdfDoc = window.currentPDFDoc;
    
    // Mostrar feedback
    showMobileSuccessMessage('📥 Baixando PDF para Downloads...');
    
    // Fazer download tradicional (SEM abrir)
    pdfDoc.save(fileName);
    
    // Após download, fechar opções e mostrar instruções
    setTimeout(() => {
        closeDownloadOptions();
        showMobileInstructionsComplete(fileName, whatsappURL, true); // true = já baixou
    }, 2000);
}

// Função 3: Escolher onde salvar no mobile
async function chooseDownloadLocationMobile(fileName, whatsappURL) {
    try {
        const pdfDoc = window.currentPDFDoc;
        
        // Tentar usar File System Access API
        if ('showSaveFilePicker' in window) {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [
                    {
                        description: 'PDF files',
                        accept: {
                            'application/pdf': ['.pdf'],
                        },
                    },
                ],
            });
            
            const writable = await fileHandle.createWritable();
            const pdfBlob = new Blob([pdfDoc.output('blob')], { type: 'application/pdf' });
            await writable.write(pdfBlob);
            await writable.close();
            
            showMobileSuccessMessage('✅ PDF salvo com sucesso na pasta escolhida!');
            
            // Após salvar, mostrar instruções
            setTimeout(() => {
                closeDownloadOptions();
                showMobileInstructionsComplete(fileName, whatsappURL, true);
            }, 1500);
            
        } else {
            // Fallback: download tradicional
            showMobileSuccessMessage('⚠️ Usando download tradicional para Downloads...');
            downloadToDownloadsFolderMobile(fileName, whatsappURL);
        }
        
    } catch (error) {
        console.log('Usuário cancelou ou erro:', error);
        // Se cancelar, apenas mostrar instruções sem baixar
        showMobileInstructionsOnly(fileName, whatsappURL);
    }
}

// FUNÇÃO PRINCIPAL: Instruções completas para mobile
function showMobileInstructionsComplete(fileName, whatsappURL, pdfDownloaded) {
    // Remover mensagem anterior se existir
    const existingMsg = document.querySelector('.whatsapp-instructions');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Criar nova mensagem de instruções
    const instructionsMsg = document.createElement('div');
    instructionsMsg.className = 'whatsapp-instructions';
    
    instructionsMsg.innerHTML = `
        <div class="instruction-header">
            <span class="whatsapp-logo">📱</span>
            <strong>📋 Instruções para Enviar pelo WhatsApp (Mobile)</strong>
        </div>
        
        <div class="instruction-content">
            <div style="background: #e7f3ff; border: 2px solid #2196f3; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <h3 style="color: #1976d2; margin: 0 0 15px 0;">
                    📄 Arquivo: <code>${fileName}</code>
                </h3>
                <div style="background: ${pdfDownloaded ? '#d4edda' : '#fff3cd'}; padding: 12px; border-radius: 8px; margin: 10px 0;">
                    <strong style="color: ${pdfDownloaded ? '#155724' : '#856404'};">
                        ${pdfDownloaded ? '✅ PDF já baixado!' : '📋 PDF ainda não foi baixado'}
                    </strong>
                </div>
            </div>
            
            <!-- Seção 1: Baixar o PDF (se necessário) -->
            ${!pdfDownloaded ? `
            <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h4 style="color: #856404; margin: 0 0 15px 0;">📥 PASSO 1: Baixar o PDF</h4>
                <div style="text-align: center;">
                    <button onclick="downloadPDFNow('${fileName}')" 
                            style="background: #ffc107; color: #212529; border: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold; margin: 10px;">
                        📥 Baixar PDF Agora
                    </button>
                    <button onclick="choosePDFLocation('${fileName}')" 
                            style="background: #6f42c1; color: white; border: none; padding: 12px 20px; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold; margin: 10px;">
                        📂 Escolher Onde Salvar
                    </button>
                </div>
                <p style="font-size: 13px; color: #856404; text-align: center; margin: 10px 0 0 0;">
                    <strong>💡 Dica:</strong> Lembre-se onde salvou o arquivo!
                </p>
            </div>
            ` : `
            <div style="background: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center;">
                <h4 style="color: #155724; margin: 0 0 10px 0;">✅ PDF já baixado com sucesso!</h4>
                <p style="color: #155724; margin: 0; font-size: 14px;">
                    Se precisar baixar novamente, use os botões abaixo.
                </p>
                <div style="margin-top: 15px;">
                    <button onclick="downloadPDFNow('${fileName}')" 
                            style="background: #28a745; color: white; border: none; padding: 10px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; margin: 5px;">
                        📥 Baixar Novamente
                    </button>
                    <button onclick="choosePDFLocation('${fileName}')" 
                            style="background: #6f42c1; color: white; border: none; padding: 10px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; margin: 5px;">
                        📂 Escolher Local
                    </button>
                </div>
            </div>
            `}
            
            <!-- Seção 2: Abrir WhatsApp e Anexar -->
            <div style="background: #e7f9e7; border: 2px solid #25d366; border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h4 style="color: #1a5f1a; margin: 0 0 15px 0;">📱 PASSO 2: Enviar pelo WhatsApp</h4>
                
                <!-- Botão para abrir WhatsApp -->
                <div style="text-align: center; margin: 15px 0;">
                    <button onclick="openWhatsAppForMobile('${whatsappURL}')" 
                            style="background: #25d366; color: white; border: none; padding: 15px 25px; border-radius: 12px; font-size: 18px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                        📱 Abrir WhatsApp Agora
                    </button>
                </div>
                
                <!-- Instruções detalhadas -->
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <h5 style="color: #1a5f1a; margin: 0 0 10px 0;">📋 Como anexar o PDF no WhatsApp:</h5>
                    <ol style="color: #2d5a2d; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                        <li><strong>Clique no botão acima</strong> para abrir o WhatsApp</li>
                        <li>No WhatsApp, <strong>clique no ícone de anexo</strong> (📎 ou +)</li>
                        <li>Escolha <strong>"Documento"</strong> ou <strong>"Arquivo"</strong></li>
                        <li>Procure e selecione: <code style="background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">${fileName}</code></li>
                        <li><strong>Anexe o PDF</strong> e clique em <strong>"Enviar"</strong></li>
                    </ol>
                </div>
                
                <!-- Preview da mensagem -->
                <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 12px; margin: 15px 0;">
                    <h6 style="color: #495057; margin: 0 0 8px 0; font-size: 13px;">📝 Mensagem que será enviada:</h6>
                    <div style="font-style: italic; color: #6c757d; font-size: 13px; line-height: 1.4;">
                        "Olá! Me chamo [Seu Nome] e gostaria de me candidatar para uma vaga no Pastifício Selmi. Segue meu currículo em anexo..."
                    </div>
                </div>
            </div>
            
            <!-- Botões de ação -->
            <div style="text-align: center; margin: 20px 0; padding-top: 15px; border-top: 1px solid #ddd;">
                <button onclick="location.reload()" 
                        style="background: #007bff; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin: 5px; font-weight: bold;">
                    🔄 Fazer Novo Currículo
                </button>
                <button onclick="closeInstructions()" 
                        style="background: #6c757d; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin: 5px;">
                    ❌ Fechar Instruções
                </button>
            </div>
        </div>
    `;
    
    // Inserir no topo da página
    document.querySelector('.container').insertBefore(instructionsMsg, document.querySelector('header'));
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Funções auxiliares para as instruções mobile
function downloadPDFNow(fileName) {
    const pdfDoc = window.currentPDFDoc;
    pdfDoc.save(fileName);
    showMobileSuccessMessage('📥 PDF baixado para Downloads!');
}

async function choosePDFLocation(fileName) {
    try {
        const pdfDoc = window.currentPDFDoc;
        
        if ('showSaveFilePicker' in window) {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{ description: 'PDF files', accept: { 'application/pdf': ['.pdf'] }}]
            });
            
            const writable = await fileHandle.createWritable();
            const pdfBlob = new Blob([pdfDoc.output('blob')], { type: 'application/pdf' });
            await writable.write(pdfBlob);
            await writable.close();
            
            showMobileSuccessMessage('✅ PDF salvo na pasta escolhida!');
        } else {
            // Fallback
            downloadPDFNow(fileName);
        }
    } catch (error) {
        console.log('Cancelado pelo usuário:', error);
    }
}

function openWhatsAppForMobile(whatsappURL) {
    showMobileSuccessMessage('📱 Abrindo WhatsApp... Não esqueça de anexar o PDF!');
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1000);
}

// MANTER FUNÇÕES ANTIGAS PARA COMPATIBILIDADE (Desktop)
async function chooseDownloadLocation(fileName, whatsappURL, isMobile) {
    try {
        const pdfDoc = window.currentPDFDoc;
        await savePDFOnMobile(pdfDoc, fileName);
        
        // Após salvar, mostrar instruções WhatsApp
        setTimeout(() => {
            closeDownloadOptions();
            showWhatsAppInstructions(fileName, whatsappURL, isMobile, pdfDoc);
        }, 1000);
        
    } catch (error) {
        console.log('Erro ou cancelado:', error);
        // Se der erro, fazer download normal
        downloadToDownloadsFolder(fileName, whatsappURL, isMobile);
    }
}

// Função 2: Baixar para pasta Downloads
function downloadToDownloadsFolder(fileName, whatsappURL, isMobile) {
    const pdfDoc = window.currentPDFDoc;
    
    // Mostrar feedback
    showMobileSuccessMessage('📥 Baixando PDF para Downloads...');
    
    // Fazer download tradicional
    pdfDoc.save(fileName);
    
    // Após download, mostrar instruções
    setTimeout(() => {
        closeDownloadOptions();
        showWhatsAppInstructions(fileName, whatsappURL, isMobile, pdfDoc);
    }, 2000);
}

// Função 3: Baixar e ir direto para WhatsApp
function downloadAndGoToWhatsApp(fileName, whatsappURL, isMobile) {
    const pdfDoc = window.currentPDFDoc;
    
    // Mostrar feedback
    showMobileSuccessMessage('🚀 Baixando PDF e abrindo WhatsApp...');
    
    // Fazer download
    pdfDoc.save(fileName);
    
    // Aguardar um pouco e abrir WhatsApp
    setTimeout(() => {
        closeDownloadOptions();
        
        if (isMobile) {
            // Mobile: abrir app WhatsApp
            window.open(whatsappURL, '_blank');
            showMobilePostWhatsAppInstructions(fileName);
        } else {
            // Desktop: abrir WhatsApp Web
            openWhatsAppWeb(whatsappURL);
            showDesktopPostWhatsAppInstructions(fileName);
        }
    }, 2000);
}

// Função para fechar opções de download
function closeDownloadOptions() {
    const optionsMsg = document.querySelector('.download-options');
    if (optionsMsg) {
        optionsMsg.remove();
    }
}

// Instruções pós-WhatsApp para mobile
function showMobilePostWhatsAppInstructions(fileName) {
    const instructionsMsg = document.createElement('div');
    instructionsMsg.className = 'whatsapp-instructions';
    
    instructionsMsg.innerHTML = `
        <div class="instruction-header">
            <span class="whatsapp-logo">📱</span>
            <strong>WhatsApp Aberto! Complete o Envio</strong>
        </div>
        
        <div class="instruction-content">
            <div style="background: #e8f5e8; border: 2px solid #4caf50; border-radius: 8px; padding: 20px; text-align: center;">
                <h3 style="color: #2e7d32; margin: 0 0 15px 0;">📲 Próximos Passos no WhatsApp:</h3>
                
                <div style="text-align: left; margin: 15px 0; background: white; padding: 15px; border-radius: 6px;">
                    <p><strong>1.</strong> 📎 No WhatsApp, clique no ícone de <strong>anexo</strong> (+)</p>
                    <p><strong>2.</strong> 📄 Escolha <strong>"Documento"</strong> ou <strong>"Arquivo"</strong></p>
                    <p><strong>3.</strong> 📂 Encontre e selecione: <code>${fileName}</code></p>
                    <p><strong>4.</strong> ✅ Anexe o PDF e clique em <strong>"Enviar"</strong></p>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="location.reload()" style="background: #4caf50; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin: 5px;">
                        🔄 Fazer Novo Currículo
                    </button>
                    <button onclick="closeInstructions()" style="background: #f44336; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin: 5px;">
                        ❌ Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.container').insertBefore(instructionsMsg, document.querySelector('header'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Instruções pós-WhatsApp para desktop
function showDesktopPostWhatsAppInstructions(fileName) {
    const instructionsMsg = document.createElement('div');
    instructionsMsg.className = 'whatsapp-instructions';
    
    instructionsMsg.innerHTML = `
        <div class="instruction-header">
            <span class="whatsapp-logo">🌐</span>
            <strong>WhatsApp Web Aberto! Complete o Envio</strong>
        </div>
        
        <div class="instruction-content">
            <div style="background: #e3f2fd; border: 2px solid #2196f3; border-radius: 8px; padding: 20px; text-align: center;">
                <h3 style="color: #1976d2; margin: 0 0 15px 0;">💻 Próximos Passos no WhatsApp Web:</h3>
                
                <div style="text-align: left; margin: 15px 0; background: white; padding: 15px; border-radius: 6px;">
                    <p><strong>1.</strong> 📎 No WhatsApp Web, clique no ícone de <strong>anexo</strong> (📎)</p>
                    <p><strong>2.</strong> 📄 Escolha <strong>"Documento"</strong></p>
                    <p><strong>3.</strong> 📂 Na pasta Downloads, selecione: <code>${fileName}</code></p>
                    <p><strong>4.</strong> ✅ Anexe o PDF e clique em <strong>"Enviar"</strong></p>
                </div>
                
                <div style="margin-top: 20px;">
                    <button onclick="location.reload()" style="background: #2196f3; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin: 5px;">
                        🔄 Fazer Novo Currículo
                    </button>
                    <button onclick="closeInstructions()" style="background: #f44336; color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; margin: 5px;">
                        ❌ Fechar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.container').insertBefore(instructionsMsg, document.querySelector('header'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Funções de teste para WhatsApp
function testWhatsAppLink() {
    console.log('=== INICIANDO TESTE DO WHATSAPP ===');
    
    const phoneNumber = '5519971238643';
    const testMessage = `Olá! Este é um teste do formulário do Pastifício Selmi.
    
📋 TESTE DE FUNCIONAMENTO:
- Formulário: ✅ Funcionando
- PDF: ✅ Funcionando  
- WhatsApp: 🔄 Testando agora
- Data/Hora: ${new Date().toLocaleString('pt-BR')}

Se você recebeu esta mensagem, o sistema está funcionando perfeitamente! 🎉`;

    const encodedMessage = encodeURIComponent(testMessage);
    const testURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    console.log('Número:', phoneNumber);
    console.log('URL final:', testURL);
    
    // Detectar dispositivo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const resultDiv = document.getElementById('testResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0; border: 2px solid #25d366;">
                <h4 style="margin: 0 0 10px 0; color: #25d366;">📱 Teste WhatsApp</h4>
                <p><strong>Dispositivo:</strong> ${isMobile ? 'Mobile' : 'Desktop'}<br>
                <strong>Número:</strong> ${phoneNumber}<br>
                <strong>URL:</strong> <code style="font-size: 12px; word-break: break-all;">${testURL}</code></p>
                
                <button onclick="window.open('${testURL}', '_blank')" 
                        style="background: #25d366; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin: 5px;">
                    � Testar WhatsApp App
                </button>
                
                <button onclick="window.location.href='${testURL}'" 
                        style="background: #128c7e; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin: 5px;">
                    📱 Abrir com location.href
                </button>
            </div>
        `;
    }
    
    // Abrir automaticamente também
    setTimeout(() => {
        console.log('Abrindo WhatsApp automaticamente...');
        if (isMobile) {
            window.location.href = testURL;
        } else {
            window.open(testURL, '_blank');
        }
    }, 2000);
}

function testWhatsAppWeb() {
    const phoneNumber = '5519971238643';
    const testMessage = 'Teste de WhatsApp Web - Pastificio Selmi';
    const encodedMessage = encodeURIComponent(testMessage);
    const testURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    const resultDiv = document.getElementById('testResult');
    resultDiv.innerHTML = `
        <div style="background: #fff3cd; padding: 10px; border-radius: 4px; margin: 10px 0;">
            <strong>🌐 Teste WhatsApp Web:</strong><br>
            <strong>Número:</strong> ${phoneNumber}<br>
            <strong>URL:</strong> <code>${testURL}</code><br>
            <a href="${testURL}" target="_blank" style="color: #007bff; text-decoration: underline;">👆 Clique aqui para testar</a>
        </div>
    `;
    
    console.log('Teste WhatsApp Web - URL:', testURL);
}
