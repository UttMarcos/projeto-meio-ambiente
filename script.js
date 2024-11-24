// Seleciona o formulário de envio de relatos e a lista onde os relatos serão exibidos
const addressForm = document.getElementById('addressForm');
const reportsList = document.getElementById('reportsList');
const cepField = document.getElementById('cep');

// Carrega relatos salvos do localStorage ao iniciar
document.addEventListener('DOMContentLoaded', loadReports);

// Adiciona o evento de envio do formulário
addressForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o envio do formulário tradicional

    // Pega os valores dos campos do formulário
    const cep = document.getElementById('cep').value;
    const logradouro = document.getElementById('logradouro').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const descricao = document.getElementById('descricao').value;

    // Cria um objeto para o relato
    const report = {
        cep,
        logradouro,
        bairro,
        cidade,
        estado,
        numero,
        complemento,
        descricao,
        date: new Date().toLocaleString(),
    };

    // Salva o relato no localStorage
    saveReport(report);

    // Limpa o formulário
    addressForm.reset();

    // Atualiza a lista de relatos na interface
    addReportToUI(report);
});

// Função para salvar relato no localStorage
function saveReport(report) {
    let reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.push(report);
    localStorage.setItem('reports', JSON.stringify(reports));
}

// Função para carregar relatos do localStorage e exibir
function loadReports() {
    const reports = JSON.parse(localStorage.getItem('reports')) || [];
    reports.forEach(addReportToUI);
}

// Função para adicionar um relato à interface
function addReportToUI(report) {
    const li = document.createElement('li');
    li.innerHTML = `
        <strong>CEP:</strong> ${report.cep} <br>
        <strong>Logradouro:</strong> ${report.logradouro}, <strong>Bairro:</strong> ${report.bairro}, <strong>Cidade:</strong> ${report.cidade} - ${report.estado} <br>
        <strong>Número:</strong> ${report.numero} <strong>Complemento:</strong> ${report.complemento} <br>
        <strong>Descrição:</strong> ${report.descricao} <br>
        <small>Enviado em: ${report.date}</small>
    `;
    reportsList.appendChild(li);
}

// Função para buscar o endereço baseado no CEP
cepField.addEventListener('blur', function() {
    const cep = cepField.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado');
                } else {
                    // Preenche os campos de endereço com os dados recebidos
                    document.getElementById('logradouro').value = data.logradouro || '';
                    document.getElementById('bairro').value = data.bairro || '';
                    document.getElementById('cidade').value = data.localidade || '';
                    document.getElementById('estado').value = data.uf || '';
                }
            })
            .catch(error => {
                alert('Erro ao buscar o CEP');
                console.error(error);
            });
    } else {
        alert('CEP inválido');
    }
});
