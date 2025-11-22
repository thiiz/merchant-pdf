'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload } from 'lucide-react';
import { useState } from 'react';

const Button = ({ className, variant = 'primary', size = 'md', ...props }: any) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-black text-white hover:bg-black/90 shadow",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900"
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 py-2 text-sm",
    icon: "h-8 w-8",
  };
  return <button className={cn(base, variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className)} {...props} />;
};

export const CSVImport = () => {
  const store = useCatalogStore();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const parseCSVLine = (line: string) => {
    const values = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ';' && !inQuotes) {
        let val = currentValue.trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        values.push(val.replace(/""/g, '"'));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    let val = currentValue.trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    values.push(val.replace(/""/g, '"'));
    return values;
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(null);
    setFile(file);
    setIsLoading(true);

    try {
      // Função auxiliar para encontrar coluna
      const findCol = (headers: string[], terms: string[]) => {
        return headers.findIndex(h => {
          const headerClean = h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          return terms.some(term => headerClean.includes(term));
        });
      };

      // 1. Tenta ler como Windows-1252/ISO-8859-1 (Padrão do Excel no Windows)
      let text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file, 'Windows-1252');
      });

      let lines = text.split('\n').filter(line => line.trim() !== '');
      let headers = parseCSVLine(lines[0]);

      // Helper to find price column with priority
      const findPriceCol = (headers: string[]) => {
        // 1. Tenta achar preço de custo (Prioridade solicitada)
        const costIndex = findCol(headers, ['preco de custo', 'custo', 'preco custo']);
        if (costIndex !== -1) return costIndex;
        
        // 2. Se não achar, tenta preço de venda/comum
        return findCol(headers, ['preco venda', 'venda', 'preco', 'valor']);
      };

      let mapIndex = {
        name: findCol(headers, ['nome produto', 'nome', 'descricao']),
        price: findCol(headers, ['preco venda', 'venda', 'preco', 'valor']),
        priceCost: findPriceCol(headers),
        image: findCol(headers, ['imagem principal', 'imagem', 'foto', 'url']),
        brand: findCol(headers, ['marca', 'fabricante']),
        model: findCol(headers, ['modelo', 'referencia']),
        stock: findCol(headers, ['estoque atual', 'estoque', 'quantidade']),
        category: findCol(headers, ['nome categoria', 'categoria', 'departamento']),
      };

      // 2. Se não encontrou colunas essenciais, tenta UTF-8 (Fallback para arquivos modernos)
      if (mapIndex.name === -1 || mapIndex.price === -1) {
        text = await file.text(); // UTF-8 é o padrão do .text()

        lines = text.split('\n').filter(line => line.trim() !== '');
        headers = parseCSVLine(lines[0]);

        mapIndex = {
          name: findCol(headers, ['nome produto', 'nome', 'descricao']),
          price: findCol(headers, ['preco venda', 'venda', 'preco', 'valor']),
          priceCost: findPriceCol(headers),
          image: findCol(headers, ['imagem principal', 'imagem', 'foto', 'url']),
          brand: findCol(headers, ['marca', 'fabricante']),
          model: findCol(headers, ['modelo', 'referencia']),
          stock: findCol(headers, ['estoque atual', 'estoque', 'quantidade']),
          category: findCol(headers, ['nome categoria', 'categoria', 'departamento']),
        };
      }

      if (mapIndex.name === -1 || mapIndex.price === -1) {
        console.error('Headers:', headers);
        throw new Error(`Não foi possível identificar as colunas. O arquivo precisa ter colunas como "Nome" e "Preço" ou "Venda". Colunas encontradas: ${headers.slice(0, 5).join(', ')}...`);
      }

      const products = lines.slice(1).map((line, index) => {
        const values = parseCSVLine(line);
        if (values.length < headers.length) return null;

        // Helper para limpar e parsear preços (R$ 1.200,50 -> 1200.50)
        const parsePriceString = (str: string) => {
          if (!str) return 0;
          let clean = str.replace(/[^\d.,]/g, '');
          if (clean.includes(',') && clean.includes('.')) {
            clean = clean.replace('.', '').replace(',', '.');
          } else if (clean.includes(',')) {
            clean = clean.replace(',', '.');
          }
          const val = parseFloat(clean);
          return isNaN(val) ? 0 : val;
        };

        const price = parsePriceString(values[mapIndex.price]);
        const priceCost = parsePriceString(values[mapIndex.priceCost]);

        return {
          id: `prod-csv-${Date.now()}-${index}`,
          name: values[mapIndex.name] || 'Sem nome',
          retailPrice: price,
          wholesalePrice: priceCost + 5, // 5 reais mais caro que o custo
          dropPrice: priceCost * 1.4, // 40% mais caro que o custo
          image: values[mapIndex.image] || '',
          soldOut: (parseInt(values[mapIndex.stock] || '0') <= 0),
          piecesPerBox: 1,
          category: values[mapIndex.category] || '',
        };
      }).filter(Boolean).sort((a: any, b: any) => a.category.localeCompare(b.category));

      setPreview(products);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar arquivo');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (preview.length === 0) return;

    const ITEMS_PER_PAGE = 9; // 3x3 grid
    const chunks = [];

    // Divide os produtos em grupos de 9
    for (let i = 0; i < preview.length; i += ITEMS_PER_PAGE) {
      chunks.push(preview.slice(i, i + ITEMS_PER_PAGE));
    }

    // Cria uma página para cada grupo
    chunks.forEach((chunk, index) => {
      // Gera um ID único para a página
      const pageId = `page-import-${Date.now()}-${index}`;

      // Cria a página com esse ID
      store.addPage(pageId);

      // Adiciona a seção de produtos nessa página específica
      const sectionId = `section-csv-${Date.now()}-${index}`;
      store.addSection(pageId, {
        id: sectionId,
        type: 'product-grid',
        columns: 3,
        title: index === 0 ? 'Produtos Importados' : `Produtos Importados (Pág. ${index + 1})`,
        products: chunk
      });
    });

    setSuccess(`${preview.length} produtos importados em ${chunks.length} página${chunks.length > 1 ? 's' : ''}!`);
    setPreview([]);
    setFile(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Importar Produtos (CSV)</h3>
        <p className="text-xs text-gray-500">
          Carregue seu arquivo .csv exportado da Tray ou similar. Os produtos serão automaticamente paginados (9 por página).
        </p>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile && droppedFile.name.endsWith('.csv')) {
              handleFile(droppedFile);
            } else {
              setError('Por favor, envie um arquivo .csv válido');
            }
          }}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          <input
            type="file"
            accept=".csv"
            className="hidden"
            id="csv-upload"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFile(selectedFile);
            }}
          />
          <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="w-6 h-6 text-gray-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">Clique para upload ou arraste</p>
              <p className="text-xs text-gray-500">Suporta arquivos .csv</p>
            </div>
          </label>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setFile(null); setPreview([]); setError(null); }}>
            Trocar
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-8 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Processando arquivo...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Pré-visualização ({preview.length} produtos)</h4>
            <p className="text-xs text-gray-500">{Math.ceil(preview.length / 9)} página{Math.ceil(preview.length / 9) > 1 ? 's' : ''}</p>
          </div>

          <div className="border border-gray-200 rounded-md overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2">Produto</th>
                  <th className="px-3 py-2">Categoria</th>
                  <th className="px-3 py-2">Preço (Varejo)</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {preview.slice(0, 10).map((prod) => (
                  <tr key={prod.id} className="bg-white hover:bg-gray-50">
                    <td className="px-3 py-2 truncate max-w-[150px]" title={prod.name}>{prod.name}</td>
                    <td className="px-3 py-2 truncate max-w-[100px]" title={prod.category}>{prod.category}</td>
                    <td className="px-3 py-2">R$ {prod.retailPrice.toFixed(2)}</td>
                    <td className="px-3 py-2">
                      {prod.soldOut ? (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Esgotado</span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">Disp.</span>
                      )}
                    </td>
                  </tr>
                ))}
                {preview.length > 10 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-center text-xs text-gray-400 italic">
                      ...e mais {preview.length - 10} produtos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Button onClick={handleImport} className="w-full">
            Confirmar Importação
          </Button>
        </div>
      )}
    </div>
  );
};
