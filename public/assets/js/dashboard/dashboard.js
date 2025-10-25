document.addEventListener("DOMContentLoaded", () => {
    if (typeof dashboardData === 'undefined') {
        console.error('Dashboard data not available');
        return;
    }

    const ctxLine = document.getElementById("line_chart");
    if (ctxLine && typeof dadosVendas !== 'undefined') {
        new Chart(ctxLine, {
            type: "line",
            data: {
                labels: dadosVendas.labels,
                datasets: [{
                    label: "Vendas (R$)",
                    data: dadosVendas.valores,
                    borderColor: "#ff4b2b",
                    backgroundColor: "rgba(255, 75, 43, 0.1)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#ff4b2b",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'R$ ' + context.parsed.y.toFixed(2).replace('.', ',');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    const ctxPie = document.getElementById("pie_chart");
    if (ctxPie && dashboardData.produtos && dashboardData.pedidos) {
        
        const produtosVendas = {};

        dashboardData.produtos.forEach(produto => {
            produtosVendas[produto.product_name] = 0;
        });

        dashboardData.pedidos.forEach(pedido => {
            const detalhes = pedido.order_details || '';
            
            dashboardData.produtos.forEach(produto => {
                if (detalhes.toLowerCase().includes(produto.product_name.toLowerCase())) {
                    produtosVendas[produto.product_name]++;
                }
            });
        });

        const topProdutos = Object.entries(produtosVendas)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .filter(([_, vendas]) => vendas > 0);

        const labels = topProdutos.length > 0
            ? topProdutos.map(([nome, _]) => nome)
            : dashboardData.produtos.slice(0, 5).map(p => p.product_name);

        const data = topProdutos.length > 0
            ? topProdutos.map(([_, vendas]) => vendas)
            : dashboardData.produtos.slice(0, 5).map(p => parseInt(p.product_amount || 0));

        new Chart(ctxPie, {
            type: "doughnut",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#8BC34A",
                        "#FF9800"
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const unidade = topProdutos.length > 0 ? 'vendas' : 'unidades em estoque';
                                return label + ': ' + value + ' ' + unidade;
                            }
                        }
                    }
                }
            }
        });
    }
});
