

function showReportModal(format) {
    const modalHTML = `
        <div class="report-modal-overlay" id="reportModal">
            <div class="report-modal-content">
                <div class="report-modal-header">
                    <h3><i class="bi bi-file-earmark-${format === 'excel' ? 'excel' : 'pdf'}"></i> Selecionar Tipo de Relatório</h3>
                    <button class="report-modal-close" onclick="closeReportModal()">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="report-modal-body">
                    <p>Escolha o tipo de relatório que deseja gerar:</p>
                    <div class="report-options">
                        <button class="report-option-btn" onclick="downloadReport('${format}', 'sales')">
                            <i class="bi bi-cart-check"></i>
                            <span>Relatório de Vendas</span>
                            <small>Lista completa de todas as vendas realizadas</small>
                        </button>
                        <button class="report-option-btn" onclick="downloadReport('${format}', 'products')">
                            <i class="bi bi-box-seam"></i>
                            <span>Relatório de Produtos</span>
                            <small>Inventário completo de produtos</small>
                        </button>
                        <button class="report-option-btn" onclick="downloadReport('${format}', 'clients')">
                            <i class="bi bi-people"></i>
                            <span>Relatório de Clientes</span>
                            <small>Lista completa de clientes cadastrados</small>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('reportModal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('reportModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeReportModal();
        }
    });
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) {
        modal.remove();
    }
}

function downloadReport(format, type) {
    closeReportModal();

    showReportFeedback('info', `Gerando relatório de ${getReportTypeName(type)}...`);

    const url = `/api/reports/${format}?type=${type}`;

    fetch(url)
        .then(async response => {
            if (!response.ok) {
                
                let errorMessage = 'Erro ao gerar relatório';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    
                    try {
                        const errorText = await response.text();
                        if (errorText) {
                            console.error('Erro do servidor:', errorText);
                        }
                    } catch (textError) {
                        
                    }
                }
                throw new Error(errorMessage);
            }
            return response.blob();
        })
        .then(blob => {
            
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `Relatorio_${type}_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);

            showReportFeedback('success', `Relatório de ${getReportTypeName(type)} gerado com sucesso!`);
        })
        .catch(error => {
            console.error('Erro ao baixar relatório:', error);
            showReportFeedback('error', error.message || 'Erro ao gerar relatório. Tente novamente.');
        });
}

function getReportTypeName(type) {
    const types = {
        'sales': 'vendas',
        'products': 'produtos',
        'clients': 'clientes'
    };
    return types[type] || type;
}

function showReportFeedback(type, message) {
    
    if (window.feedback && typeof window.feedback.show === 'function') {
        window.feedback.show(message, type, 3000);
    } else {
        
        const notification = document.createElement('div');
        notification.className = `feedback-notification feedback-${type}`;
        notification.innerHTML = `
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#34c759' : type === 'error' ? '#ff3b30' : '#007aff'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnExcel = document.getElementById('downloadReportExcel');
    const btnPDF = document.getElementById('downloadReportPDF');

    if (btnExcel) {
        btnExcel.addEventListener('click', () => {
            showReportModal('excel');
        });
    }

    if (btnPDF) {
        btnPDF.addEventListener('click', () => {
            showReportModal('pdf');
        });
    }
});
