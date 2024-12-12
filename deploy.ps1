# Caminhos das pastas
$servidorPath = "servidor"
$clientePath = "cliente"
$jsonPath = "contractAddress.json"  # Caminho para o arquivo JSON

# Navega para a pasta "servidor" e executa "truffle migrate"
Write-Output "Navegando para a pasta '$servidorPath' e executando 'truffle migrate'..."
Set-Location $servidorPath
$truffleOutput = truffle migrate

if ($LASTEXITCODE -ne 0) {
    Write-Error "Erro ao executar 'truffle migrate'."
    exit 1
}

Write-Output "Truffle migrate executado com sucesso!"

# Extrai o Contract Address
$contractLine = $truffleOutput -split "`n" | Where-Object { $_ -match "contract address" }
$contractAddress = $contractLine -replace ".*: ", ""

if (-not $contractAddress) {
    Write-Error "Endereco do contrato nao encontrado!"
    exit 1
}

Write-Output "Endereco do contrato obtido: $contractAddress"

# Remove espaços extras antes e depois do contract address
$contractAddress = $contractAddress.Trim()

# Retorna para a raiz do projeto
Set-Location ..

# Cria o arquivo JSON com o Contract Address
Write-Output "Criando o arquivo JSON com o contractAddress..."

$contractData = @{
    contractAddress = $contractAddress
}

# Converte o objeto para JSON e escreve no arquivo
$jsonContent = $contractData | ConvertTo-Json -Depth 3
$jsonContent | Out-File -FilePath $jsonPath -Encoding UTF8

Write-Output "Arquivo JSON '$jsonPath' criado com sucesso!"

# Navega para a pasta "cliente" e executa "npm run dev"
Write-Output "Navegando para a pasta '$clientePath' e iniciando 'npm run dev'..."
Set-Location $clientePath
npm run dev