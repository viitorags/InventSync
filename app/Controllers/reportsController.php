<?php

require_once __DIR__ . '../../../vendor/autoload.php';
require_once __DIR__ . '/../Models/ordersModel.php';
require_once __DIR__ . '/../Models/productModel.php';
require_once __DIR__ . '/../Models/clientModel.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ReportsController
{
    private $ordersModel;
    private $productModel;
    private $clientModel;

    public function __construct()
    {
        $this->ordersModel = new OrdersModel();
        $this->productModel = new ProductModel();
        $this->clientModel = new ClientModel();
    }

    public function generateExcelReport($reportType = 'sales')
    {
        try {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Não autorizado']);
                exit;
            }

            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            switch ($reportType) {
                case 'sales':
                    $this->generateSalesExcelReport($sheet);
                    break;
                case 'products':
                    $this->generateProductsExcelReport($sheet);
                    break;
                case 'clients':
                    $this->generateClientsExcelReport($sheet);
                    break;
                default:
                    $this->generateSalesExcelReport($sheet);
            }

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="Relatorio_' . ucfirst($reportType) . '_' . date('Y-m-d') . '.xlsx"');
            header('Cache-Control: max-age=0');

            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
            exit;
        } catch (Exception $e) {
            error_log("Erro ao gerar Excel: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Erro ao gerar relatório: ' . $e->getMessage()
            ]);
            exit;
        }
    }

    private function generateSalesExcelReport($sheet)
    {
        $user_id = $_SESSION['user_id'];
        $orders = $this->ordersModel->getOrdersByUser($user_id);

        $sheet->setTitle('Relatório de Vendas');
        $sheet->setCellValue('A1', 'RELATÓRIO DE VENDAS');
        $sheet->mergeCells('A1:E1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->setCellValue('A2', 'Data de Geração: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A2:E2');
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $headers = ['ID', 'Cliente', 'Data', 'Detalhes', 'Valor'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '4', $header);
            $sheet->getStyle($col . '4')->getFont()->setBold(true);
            $sheet->getStyle($col . '4')->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FF4B2B');
            $sheet->getStyle($col . '4')->getFont()->getColor()->setARGB('FFFFFFFF');
            $col++;
        }

        $row = 5;
        $totalVendas = 0;
        if (is_array($orders) && count($orders) > 0) {
            foreach ($orders as $order) {
                $orderId = isset($order['order_id']) ? $order['order_id'] : '';
                $clientName = isset($order['client_name']) ? $order['client_name'] : '';
                $orderDate = isset($order['order_date']) ? date('d/m/Y', strtotime($order['order_date'])) : '';
                $orderDetails = isset($order['order_details']) ? $order['order_details'] : '';
                $orderPrice = isset($order['order_price']) ? floatval($order['order_price']) : 0;

                $sheet->setCellValue('A' . $row, $orderId);
                $sheet->setCellValue('B' . $row, $clientName);
                $sheet->setCellValue('C' . $row, $orderDate);
                $sheet->setCellValue('D' . $row, $orderDetails);
                $sheet->setCellValue('E' . $row, 'R$ ' . number_format($orderPrice, 2, ',', '.'));
                $totalVendas += $orderPrice;
                $row++;
            }
        } else {
            $sheet->setCellValue('A' . $row, 'Nenhum pedido encontrado');
            $sheet->mergeCells('A' . $row . ':E' . $row);
            $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $row++;
        }

        $sheet->setCellValue('D' . $row, 'TOTAL:');

        $sheet->getStyle('D' . $row)->getFont()->setBold(true);
        $sheet->setCellValue('E' . $row, 'R$ ' . number_format($totalVendas, 2, ',', '.'));
        $sheet->getStyle('E' . $row)->getFont()->setBold(true);

        $sheet->getColumnDimension('A')->setWidth(10);
        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('C')->setWidth(15);
        $sheet->getColumnDimension('D')->setWidth(40);
        $sheet->getColumnDimension('E')->setWidth(15);

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ];
        $sheet->getStyle('A4:E' . ($row))->applyFromArray($styleArray);
    }

    private function generateProductsExcelReport($sheet)
    {
        $user_id = $_SESSION['user_id'];

        $products = $this->productModel->getAllProducts($user_id);

        $sheet->setTitle('Relatório de Produtos');
        $sheet->setCellValue('A1', 'RELATÓRIO DE PRODUTOS');
        $sheet->mergeCells('A1:F1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->setCellValue('A2', 'Data de Geração: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A2:F2');
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $headers = ['ID', 'Nome', 'Descrição', 'Quantidade', 'Preço', 'Categoria'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '4', $header);
            $sheet->getStyle($col . '4')->getFont()->setBold(true);
            $sheet->getStyle($col . '4')->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FF4B2B');
            $sheet->getStyle($col . '4')->getFont()->getColor()->setARGB('FFFFFFFF');
            $col++;
        }

        $row = 5;
        if (is_array($products) && count($products) > 0) {
            foreach ($products as $product) {
                $productId = isset($product['product_id']) ? $product['product_id'] : '';
                $productName = isset($product['product_name']) ? $product['product_name'] : '';
                $productDesc = isset($product['product_description']) ? $product['product_description'] : '';
                $productAmount = isset($product['product_amount']) ? $product['product_amount'] : 0;
                $productPrice = isset($product['product_price']) ? floatval($product['product_price']) : 0;
                $productCategory = isset($product['product_category']) ? $product['product_category'] : '';

                $sheet->setCellValue('A' . $row, $productId);
                $sheet->setCellValue('B' . $row, $productName);
                $sheet->setCellValue('C' . $row, $productDesc);
                $sheet->setCellValue('D' . $row, $productAmount);
                $sheet->setCellValue('E' . $row, 'R$ ' . number_format($productPrice, 2, ',', '.'));
                $sheet->setCellValue('F' . $row, $productCategory);
                $row++;
            }
        } else {
            $sheet->setCellValue('A' . $row, 'Nenhum produto encontrado');
            $sheet->mergeCells('A' . $row . ':F' . $row);
            $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $row++;
        }

        $sheet->getColumnDimension('A')->setWidth(10);

        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('C')->setWidth(40);
        $sheet->getColumnDimension('D')->setWidth(12);
        $sheet->getColumnDimension('E')->setWidth(15);
        $sheet->getColumnDimension('F')->setWidth(20);

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ];
        $sheet->getStyle('A4:F' . ($row - 1))->applyFromArray($styleArray);
    }

    private function generateClientsExcelReport($sheet)
    {
        $user_id = $_SESSION['user_id'];

        $clients = $this->clientModel->getClient($user_id);

        $sheet->setTitle('Relatório de Clientes');
        $sheet->setCellValue('A1', 'RELATÓRIO DE CLIENTES');
        $sheet->mergeCells('A1:E1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->setCellValue('A2', 'Data de Geração: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A2:E2');
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $headers = ['ID', 'Nome', 'Email', 'Telefone', 'Endereço'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '4', $header);
            $sheet->getStyle($col . '4')->getFont()->setBold(true);
            $sheet->getStyle($col . '4')->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FF4B2B');
            $sheet->getStyle($col . '4')->getFont()->getColor()->setARGB('FFFFFFFF');
            $col++;
        }

        $row = 5;
        if (is_array($clients) && count($clients) > 0) {
            foreach ($clients as $client) {
                $clientId = isset($client['client_id']) ? $client['client_id'] : '';
                $clientName = isset($client['client_name']) ? $client['client_name'] : '';
                $clientEmail = isset($client['client_email']) ? $client['client_email'] : '';
                $clientPhone = isset($client['client_phone']) ? $client['client_phone'] : '';
                $clientAddress = isset($client['client_address']) ? $client['client_address'] : '';

                $sheet->setCellValue('A' . $row, $clientId);
                $sheet->setCellValue('B' . $row, $clientName);
                $sheet->setCellValue('C' . $row, $clientEmail);
                $sheet->setCellValue('D' . $row, $clientPhone);
                $sheet->setCellValue('E' . $row, $clientAddress);
                $row++;
            }
        } else {
            $sheet->setCellValue('A' . $row, 'Nenhum cliente encontrado');
            $sheet->mergeCells('A' . $row . ':E' . $row);
            $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $row++;
        }

        $sheet->getColumnDimension('A')->setWidth(10);
        $sheet->getColumnDimension('B')->setWidth(25);
        $sheet->getColumnDimension('C')->setWidth(30);
        $sheet->getColumnDimension('D')->setWidth(18);
        $sheet->getColumnDimension('E')->setWidth(40);

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                ],
            ],
        ];
        $sheet->getStyle('A4:E' . ($row - 1))->applyFromArray($styleArray);
    }

    public function generatePDFReport($reportType = 'sales')
    {
        try {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            if (!isset($_SESSION['user_id'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Não autorizado']);
                exit;
            }

            if (ob_get_level()) {
                ob_end_clean();
            }

            if (!defined('K_PATH_FONTS')) {
                define('K_PATH_FONTS', __DIR__ . '/../../vendor/tecnickcom/tcpdf/fonts/');
            }
            if (!defined('K_PATH_IMAGES')) {
                define('K_PATH_IMAGES', __DIR__ . '/../../public/assets/images/');
            }

            $pdf = new \TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

            $pdf->SetCreator('InventSync');
            $pdf->SetAuthor('InventSync System');
            $pdf->SetTitle('Relatório ' . ucfirst($reportType));

            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);

            $pdf->SetMargins(15, 15, 15);
            $pdf->SetAutoPageBreak(TRUE, 15);

            $pdf->AddPage();

            switch ($reportType) {
                case 'sales':
                    $this->generateSalesPDFReport($pdf);
                    break;
                case 'products':
                    $this->generateProductsPDFReport($pdf);
                    break;
                case 'clients':
                    $this->generateClientsPDFReport($pdf);
                    break;
                default:
                    $this->generateSalesPDFReport($pdf);
            }

            $pdf->Output('Relatorio_' . ucfirst($reportType) . '_' . date('Y-m-d') . '.pdf', 'D');
            exit;
        } catch (Exception $e) {
            error_log("Erro ao gerar PDF: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Erro ao gerar relatório: ' . $e->getMessage()]);
            exit;
        }
    }

    private function generateSalesPDFReport($pdf)
    {
        $user_id = $_SESSION['user_id'];
        $orders = $this->ordersModel->getOrdersByUser($user_id);

        $pdf->SetFont('helvetica', 'B', 20);
        $pdf->Cell(0, 15, 'RELATÓRIO DE VENDAS', 0, 1, 'C');

        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 5, 'Data de Geração: ' . date('d/m/Y H:i'), 0, 1, 'C');
        $pdf->Ln(5);

        $html = '<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr style="background-color: #ff4b2b; color: white;">
                    <th width="8%"><strong>ID</strong></th>
                    <th width="25%"><strong>Cliente</strong></th>
                    <th width="15%"><strong>Data</strong></th>
                    <th width="32%"><strong>Detalhes</strong></th>
                    <th width="20%"><strong>Valor</strong></th>
                </tr>
            </thead>
            <tbody>';

        $totalVendas = 0;
        if (is_array($orders) && count($orders) > 0) {
            foreach ($orders as $order) {
                $orderId = isset($order['order_id']) ? $order['order_id'] : 'N/A';
                $clientName = isset($order['client_name']) ? htmlspecialchars($order['client_name']) : 'N/A';
                $orderDate = isset($order['order_date']) ? date('d/m/Y', strtotime($order['order_date'])) : 'N/A';
                $orderDetails = isset($order['order_details']) ? htmlspecialchars(substr($order['order_details'], 0, 100)) : 'N/A';
                $orderPrice = isset($order['order_price']) ? floatval($order['order_price']) : 0;

                $html .= '<tr>
                    <td>' . $orderId . '</td>
                    <td>' . $clientName . '</td>
                    <td>' . $orderDate . '</td>
                    <td>' . $orderDetails . '</td>
                    <td>R$ ' . number_format($orderPrice, 2, ',', '.') . '</td>
                </tr>';
                $totalVendas += $orderPrice;
            }
        } else {
            $html .= '<tr>
                <td colspan="5" style="text-align: center;">Nenhum pedido encontrado</td>
            </tr>';
        }

        $html .= '<tr style="background-color: #f0f0f0;">
                <td colspan="4" align="right"><strong>TOTAL:</strong></td>
                <td><strong>R$ ' . number_format($totalVendas, 2, ',', '.') . '</strong></td>
            </tr>';

        $html .= '</tbody></table>';

        $pdf->writeHTML($html, true, false, true, false, '');
    }

    private function generateProductsPDFReport($pdf)
    {
        $user_id = $_SESSION['user_id'];
        $products = $this->productModel->getAllProducts($user_id);

        $pdf->SetFont('helvetica', 'B', 20);
        $pdf->Cell(0, 15, 'RELATÓRIO DE PRODUTOS', 0, 1, 'C');

        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 5, 'Data de Geração: ' . date('d/m/Y H:i'), 0, 1, 'C');
        $pdf->Ln(5);

        $html = '<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr style="background-color: #ff4b2b; color: white;">
                    <th width="8%"><strong>ID</strong></th>
                    <th width="22%"><strong>Nome</strong></th>
                    <th width="30%"><strong>Descrição</strong></th>
                    <th width="12%"><strong>Qtd</strong></th>
                    <th width="15%"><strong>Preço</strong></th>
                    <th width="13%"><strong>Categoria</strong></th>
                </tr>
            </thead>
            <tbody>';

        if (is_array($products) && count($products) > 0) {
            foreach ($products as $product) {
                $productId = isset($product['product_id']) ? $product['product_id'] : 'N/A';
                $productName = isset($product['product_name']) ? htmlspecialchars($product['product_name']) : 'N/A';
                $productDesc = isset($product['product_description']) ? htmlspecialchars(substr($product['product_description'], 0, 100)) : 'N/A';
                $productAmount = isset($product['product_amount']) ? $product['product_amount'] : 0;
                $productPrice = isset($product['product_price']) ? floatval($product['product_price']) : 0;
                $productCategory = isset($product['product_category']) ? htmlspecialchars($product['product_category']) : 'N/A';

                $html .= '<tr>
                    <td>' . $productId . '</td>
                    <td>' . $productName . '</td>
                    <td>' . $productDesc . '</td>
                    <td>' . $productAmount . '</td>
                    <td>R$ ' . number_format($productPrice, 2, ',', '.') . '</td>
                    <td>' . $productCategory . '</td>
                </tr>';
            }
        } else {
            $html .= '<tr>
                <td colspan="6" style="text-align: center;">Nenhum produto encontrado</td>
            </tr>';
        }

        $html .= '</tbody></table>';

        $pdf->writeHTML($html, true, false, true, false, '');
    }

    private function generateClientsPDFReport($pdf)
    {
        $user_id = $_SESSION['user_id'];
        $clients = $this->clientModel->getClient($user_id);

        $pdf->SetFont('helvetica', 'B', 20);
        $pdf->Cell(0, 15, 'RELATÓRIO DE CLIENTES', 0, 1, 'C');

        $pdf->SetFont('helvetica', '', 10);
        $pdf->Cell(0, 5, 'Data de Geração: ' . date('d/m/Y H:i'), 0, 1, 'C');
        $pdf->Ln(5);

        $html = '<table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr style="background-color: #ff4b2b; color: white;">
                    <th width="8%"><strong>ID</strong></th>
                    <th width="22%"><strong>Nome</strong></th>
                    <th width="25%"><strong>Email</strong></th>
                    <th width="15%"><strong>Telefone</strong></th>
                    <th width="30%"><strong>Endereço</strong></th>
                </tr>
            </thead>
            <tbody>';

        if (is_array($clients) && count($clients) > 0) {
            foreach ($clients as $client) {
                $clientId = isset($client['client_id']) ? $client['client_id'] : 'N/A';
                $clientName = isset($client['client_name']) ? htmlspecialchars($client['client_name']) : 'N/A';
                $clientEmail = isset($client['client_email']) ? htmlspecialchars($client['client_email']) : 'N/A';
                $clientPhone = isset($client['client_phone']) ? htmlspecialchars($client['client_phone']) : 'N/A';
                $clientAddress = isset($client['client_address']) ? htmlspecialchars($client['client_address']) : 'N/A';

                $html .= '<tr>
                    <td>' . $clientId . '</td>
                    <td>' . $clientName . '</td>
                    <td>' . $clientEmail . '</td>
                    <td>' . $clientPhone . '</td>
                    <td>' . $clientAddress . '</td>
                </tr>';
            }
        } else {
            $html .= '<tr>
                <td colspan="5" style="text-align: center;">Nenhum cliente encontrado</td>
            </tr>';
        }

        $html .= '</tbody></table>';

        $pdf->writeHTML($html, true, false, true, false, '');
    }
}
