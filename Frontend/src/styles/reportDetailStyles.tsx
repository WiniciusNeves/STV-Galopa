import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002d1f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  logoImage: {
    width: "100%",
    marginBottom: 10,
  },
  logoutContainer: {
    padding: 5,
  },
  logout: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 5,
    backgroundColor: '#C94A44',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateTime: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 100,
  },
  label: {
    color: '#fff',
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelInline: {
    width: '40%',
    color: '#fff',
  },
  inlineInput: {
    backgroundColor: '#003f2d',
    borderRadius: 10,
    padding: 10,
    flex: 1,
    justifyContent: 'center',
  },
  fieldBox: {
    backgroundColor: '#003f2d',
    borderRadius: 10,
    padding: 10,
    minHeight: 40,
    justifyContent: 'center',
  },
  fieldText: {
    color: '#fff',
  },
  descricaoBox: {
    backgroundColor: '#003f2d',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    minHeight: 60,
  },
  descricaoText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'left',
  },

  photoContainer: {
    flexDirection: 'row',
    margin: 10,

  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  noPhotosText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalImage: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
    resizeMode: 'contain',
  },

  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#003f2d',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    alignItems: 'center',
  },
  registerButton: {
    marginTop: -30,
    backgroundColor: '#00cc66',
    borderRadius: 30,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  menuText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 12,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
  },
  backButton: {	
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
  },
  backButtonText: {
    color: '#fff',
    marginLeft: 8,
  },

});

export default styles;
