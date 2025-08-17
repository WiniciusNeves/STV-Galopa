import { StyleSheet, Dimensions } from 'react-native';
import colors from './Colors';

const { width } = Dimensions.get('window');
const buttonWidth = (width - 40) / 2;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#122e1e',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingTop: 8,         // opcional para afastar de cima
        zIndex: 2,
    },
    logoImage: {
        width: "100%",
        marginBottom: 15,
    },
    // Adicionei este container para o Logout
    logoutContainer: {
        flexDirection: "row", // inverte a ordem: primeiro o vermelho, depois o verde
        alignItems: "center",
        gap: 8,
        position: 'absolute',
        right: 30,
    },
    formContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        flex: 1,
        backgroundColor: '#0a1f11',
        color: colors.white,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: '#2a4a3a',
    },
    addButton: {
        backgroundColor: '#1f7a4d',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 15,
    },
    addButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    segmentedControlContainer: {
        flexDirection: 'row',
        backgroundColor: '#0a1f11',
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#2a4a3a',
        position: 'relative', // << MUDANÇA: Necessário para o posicionamento absoluto do highlight
    },
    // << MUDANÇA: Novo estilo para o fundo animado
    highlight: {
        position: 'absolute',
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 7, // Um a menos que o container para um bom visual
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        width: buttonWidth, // Garante que ambos os botões tenham a mesma largura
    },
    // << MUDANÇA: Removido o backgroundColor daqui, pois a view animada o controla agora
    segmentButtonActive: {
        // Este estilo pode ficar vazio ou ser usado para outros efeitos se necessário
    },
    segmentText: {
        color: '#aaa',
        fontSize: 14,
        fontWeight: '600',
    },
    segmentTextActive: {
        color: colors.white, // O texto ativo continua mudando de cor
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20, // Espaço no final da lista
    },
    listItem: {
        backgroundColor: '#0a1f11',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#2a4a3a',
    },
    listItemText: {
        color: colors.white,
        fontSize: 16,
        flex: 1, // Permite que o texto quebre a linha se for muito grande
    },
    listItemActions: {
        flexDirection: 'row',
    },
    iconButton: {
        marginLeft: 15,
        padding: 5,
    },
    deleteButton: {
        backgroundColor: '#c83c3c',
        borderRadius: 8,
    },
    emptyListText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#555',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    inputDisabled: {
        backgroundColor: '#333',
        color: '#888',
    },
});