document.getElementById('useReference').addEventListener('change', function() {
    const referenceWrapper = document.getElementById('referenceWrapper');
    const referenceField = document.getElementById('reference');

    // Se a checkbox estiver marcada, mostrar o campo
    if (this.checked) {
        referenceWrapper.style.display = 'block';  // Exibe a div de referência
        referenceField.disabled = false;          // Habilita o campo de referência
    } else {
        referenceWrapper.style.display = 'none';   // Esconde a div de referência
        referenceField.disabled = true;            // Desabilita o campo de referência
    }
});

function generatePassword() {
    const length = document.getElementById('length').value;

    // Verificar se o número de caracteres é maior que 25
    if (length > 25) {
        alert('A senha só pode ter até 25 caracteres.');
        return; // Não prosseguir com a geração da senha
    }

    const uppercase = document.getElementById('uppercase').checked;
    const special = document.getElementById('special').checked;
    const noRepeat = document.getElementById('no-repeat').checked;
    const referenceText = document.getElementById('reference').value; // Captura o texto da referência

    if (!length || length <= 0) {
        alert('Por favor, insira um tamanho válido para a senha.');
        return;
    }

    let password = '';

    // Se a opção de referência estiver ativada e o campo não estiver vazio
    if (document.getElementById('useReference').checked && referenceText) {
        password = generatePasswordFromReference(referenceText, uppercase, special);
    } else {
        // Caso contrário, gere a senha de forma aleatória
        let characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        if (noRepeat && length > characters.length) {
            alert('A quantidade de caracteres não pode ser maior que o número possível de caracteres únicos.');
            return;
        }

        const usedChars = new Set();
        for (let i = 0; i < length; i++) {
            let randomChar;
            do {
                randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
            } while (noRepeat && usedChars.has(randomChar));

            if (noRepeat) usedChars.add(randomChar);
            password += randomChar;
        }
    }

    // Ajuste da senha caso tenha a opção de caracteres especiais ou maiúsculas
    if (special) {
        password = password.slice(0, -1) + '!'; // Adicionar caractere especial no final
    }
    if (uppercase && !document.getElementById('useReference').checked) {
        password = password.charAt(0).toUpperCase() + password.slice(1).toLowerCase(); // Apenas a primeira letra maiúscula
    }

    document.getElementById('passwordOutput').textContent = password;
    document.getElementById('passwordOutput').style.display = 'block'; // Exibe a senha
    document.getElementById('actions').style.display = 'inline-block'; // Exibe os botões de ação (copiar e limpar)
}

// Função para gerar a senha a partir da referência
function generatePasswordFromReference(reference, uppercase, special) {
    const referenceMap = {
        'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'p': '9'
    };

    let password = '';

    // Substituindo caracteres da referência conforme o mapa
    for (let i = 0; i < reference.length; i++) {
        const char = reference.charAt(i).toLowerCase();
        password += referenceMap[char] || reference.charAt(i);
    }

    // Se a opção de maiúsculas estiver marcada, aleatoriamente transforma alguns caracteres em maiúsculos
    if (uppercase) {
        password = password.split('').map((char, index) => {
            return Math.random() > 0.5 ? char.toUpperCase() : char;
        }).join('');
    }

    // Se a opção de incluir caractere especial estiver marcada, adiciona um caractere especial no final
    if (special) {
        password += '!'; // Adicionar caractere especial no final
    }

    return password;
}

function copyPassword() {
    const password = document.getElementById('passwordOutput').textContent;
    if (!password) return;

    navigator.clipboard.writeText(password)
        .then(() => alert('Senha copiada para a área de transferência!'))
        .catch(() => alert('Erro ao copiar a senha.'));
}

function clearPassword() {
    document.getElementById('passwordOutput').textContent = '';
    document.getElementById('passwordOutput').style.display = 'none'; // Esconde a senha
    document.getElementById('actions').style.display = 'none'; // Esconde os botões de ação (copiar e limpar)
}
