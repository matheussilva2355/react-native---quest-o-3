import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ScrollView, 
  Alert,
  Platform 
} from 'react-native';

export default function App() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidadeInicial, setQuantidadeInicial] = useState('');
  const [movimentacao, setMovimentacao] = useState('');
  
  const [estoqueAtual, setEstoqueAtual] = useState(null);
  const [produtoCadastrado, setProdutoCadastrado] = useState('');

  const adicionarEstoque = () => {
    if (!nomeProduto || !quantidadeInicial) {
      Alert.alert('Erro', 'Por favor, informe o nome do produto e a quantidade inicial.');
      return;
    }

    const qtdIni = parseInt(quantidadeInicial, 10);
    const mov = parseInt(movimentacao, 10);

    if (isNaN(qtdIni) || qtdIni < 0 || (movimentacao && (isNaN(mov) || mov < 0))) {
      Alert.alert('Valor inválido', 'Insira apenas números inteiros válidos.');
      return;
    }

    // Se ainda não foi gerado o estoque, define com a quantidade inicial. Se já existe, soma.
    const base = estoqueAtual !== null ? estoqueAtual : qtdIni;
    const qtdParaAdicionar = isNaN(mov) ? 0 : mov;
    const novoTotal = base + qtdParaAdicionar;

    setEstoqueAtual(novoTotal);
    setProdutoCadastrado(nomeProduto);
    setMovimentacao(''); // Limpa o campo de movimentação

    if (novoTotal < 5) {
      Alert.alert('Atenção!', 'Estoque baixo! Restam menos de 5 unidades.');
    }
  };

  const retirarEstoque = () => {
    if (estoqueAtual === null) {
      Alert.alert('Erro', 'Cadastre/Adicione o estoque inicial primeiro.');
      return;
    }

    const mov = parseInt(movimentacao, 10);

    if (isNaN(mov) || mov <= 0) {
      Alert.alert('Valor inválido', 'Digite uma quantidade válida para retirar.');
      return;
    }

    // Impede retirada superior ao disponível
    if (mov > estoqueAtual) {
      Alert.alert('Estoque Insuficiente', `Você não pode retirar ${mov} unidades. Há apenas ${estoqueAtual} disponíveis.`);
      return;
    }

    const novoTotal = estoqueAtual - mov;
    setEstoqueAtual(novoTotal);
    setMovimentacao('');

    // Alerta se restarem menos de 5 unidades
    if (novoTotal < 5) {
      Alert.alert('Atenção!', 'Estoque baixo! Restam menos de 5 unidades.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Controle de Estoque</Text>
      <Text style={styles.subtitulo}>Gerenciamento de Entradas e Saídas</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nome do Produto:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Teclado Mecânico"
          placeholderTextColor="#888"
          value={nomeProduto}
          onChangeText={setNomeProduto}
        />

        <Text style={styles.label}>Quantidade Inicial:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 20"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={quantidadeInicial}
          onChangeText={setQuantidadeInicial}
        />

        <Text style={styles.label}>Quantidade para Movimentação (Adicionar / Retirar):</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 7"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={movimentacao}
          onChangeText={setMovimentacao}
        />

        <View style={styles.botoesContainer}>
          <TouchableOpacity style={[styles.botao, styles.botaoAdicionar]} onPress={adicionarEstoque}>
            <Text style={styles.textoBotao}>Adicionar estoque</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.botao, styles.botaoRetirar]} onPress={retirarEstoque}>
            <Text style={styles.textoBotao}>Retirar estoque</Text>
          </TouchableOpacity>
        </View>
      </View>

      {estoqueAtual !== null && (
        <View style={styles.cardResultado}>
          <Text style={styles.resultadoTitulo}>Status Atual do Estoque</Text>
          <Text style={styles.resultadoTexto}>Produto: <Text style={styles.negrito}>{produtoCadastrado}</Text></Text>
          <Text style={styles.resultadoTexto}>
            Disponível:{' '}
            <Text style={[styles.negrito, estoqueAtual < 5 ? styles.alertaVermelho : styles.alertaVerde]}>
              {estoqueAtual} unidades
            </Text>
          </Text>

          {estoqueAtual < 5 && (
            <View style={styles.avisoBox}>
              <Text style={styles.textoAviso}>⚠️ Alerta: Restam menos de 5 unidades em estoque!</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f6f8',
    padding: 20,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 25,
  },
  formGroup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 15,
    color: '#333',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botao: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  botaoAdicionar: {
    backgroundColor: '#28a745',
  },
  botaoRetirar: {
    backgroundColor: '#dc3545',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardResultado: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  resultadoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultadoTexto: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  negrito: {
    fontWeight: 'bold',
  },
  alertaVerde: {
    color: '#28a745',
  },
  alertaVermelho: {
    color: '#dc3545',
  },
  avisoBox: {
    marginTop: 12,
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  textoAviso: {
    color: '#856404',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});