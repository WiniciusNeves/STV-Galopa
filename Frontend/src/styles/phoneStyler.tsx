import { StyleSheet } from 'react-native';
import colors from './Colors';

const styles = StyleSheet.create({
    photoSection: {
        width: '100%',
        marginTop: 20,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 15,
        textAlign: 'center',
    },
    photoContainer: {
        flex: 1,
        flexBasis: '48%', // Garante 2 colunas com espaçamento
        maxWidth: '48%',
        margin: 5,
        backgroundColor: colors.darkGray,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    halfWidthPhotoContainer: {
        flex: 1,
        margin: 5,
        maxWidth: '48%',
    },
    fullWidthPhotoContainer: {
        width: '100%',
        margin: 5,
    },
    photoLabel: {
        color: colors.white,
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600',
    },
    photoBox: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: colors.inputBackground,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    placeholderIconImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        tintColor: colors.textSecondary,
    },
    removeButtonFullWidth: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: colors.danger,
        alignItems: 'center',
        marginTop: 10,
    },
    removeButtonText: {
        color: colors.white,
        fontWeight: 'bold',
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 5,
        paddingVertical: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    photoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
});

export default styles;