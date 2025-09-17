// js/uiManager.js

export const UIManager = {
    setLoadingState(buttonId, isLoading) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;

        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.spinner-border');

        btn.disabled = isLoading;
        if (isLoading) {
            if (btnText) btnText.textContent = 'Gerando...';
            if (spinner) spinner.style.display = 'inline-block';
        } else {
            if (btnText) btnText.textContent = btn.dataset.originalText || 'Submit';
            if (spinner) spinner.style.display = 'none';
        }
    },

    updateResultadoIA(content) {
        const resultadoDiv = document.getElementById('resultadoIA');
        if (!resultadoDiv) return;
        
        if (content.startsWith('<span')) {
            resultadoDiv.innerHTML = content;
        } else {
            resultadoDiv.textContent = content;
        }
    },

    copiarTexto(buttonId, text) {
        if (!text || text.includes('Aguardando geração...')) return;

        navigator.clipboard.writeText(text).then(() => {
            const btn = document.getElementById(buttonId);
            if (!btn) return;
            const originalText = btn.textContent;
            btn.textContent = 'Copiado!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Falha ao copiar texto: ', err);
            alert('Não foi possível copiar o texto.');
        });
    },

    switchSection(sectionName) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        const sectionToShow = document.getElementById(sectionName);
        if (sectionToShow) {
            sectionToShow.classList.add('active');
        }

        document.querySelectorAll('.nav-links li').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`.nav-links li[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
    }
};
